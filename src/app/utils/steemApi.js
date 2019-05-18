import { api } from '@steemit/steem-js';
import { LIQUID_TOKEN_UPPERCASE, SCOT_TAG } from 'app/client_config';
import stateCleaner from 'app/redux/stateCleaner';
import axios from 'axios';

export async function getScotDataAsync(path) {
    return await axios({
        url: `https://scot-api.steem-engine.com/${path}`,
        method: 'GET',
    })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.error(`Could not fetch scot data, path: ${path}`);
            return {};
        });
}

export async function attachScotData(url, state) {
    const urlParts = url.match(/^[\/]?(trending|hot)\/?([^\/]*)/);
    if (urlParts && (!urlParts[2] || urlParts[2] === SCOT_TAG) /*tag*/) {
        const feedType = urlParts[1];
        const tag = urlParts[2]; // Not suported for general tags yet.
        // first call feed.
        let feedData = await getScotDataAsync(
            `get_discussions_by_${feedType}?token=${
                LIQUID_TOKEN_UPPERCASE
            }&limit=20`
        );
        // First fetch missing data.
        if (!state.content) {
            state.content = {};
        }
        const missingKeys = feedData
            .map(d => d.authorperm.substr(1))
            .filter(k => !state.content[k]);
        const missingContent = await Promise.all(
            missingKeys.map(k => {
                const authorPermlink = k.split('/');
                return api.getContentAsync(
                    authorPermlink[0],
                    authorPermlink[1]
                );
            })
        );
        missingContent.forEach(c => {
            state.content[`${c.author}/${c.permlink}`] = c;
        });

        if (!state.discussion_idx) {
            state.discussion_idx = {};
        }
        state.discussion_idx[tag][feedType] = [];
        feedData.forEach(d => {
            const key = d.authorperm.substr(1);
            if (!state.content[key]) {
                state.content[key] = {
                    body: '',
                    body_length: 0,
                    permlink: d.authorperm.split('/')[1],
                    category: d.tags.split(',')[0],
                    children: 0, // this is supposed to return reply count
                    replies: [], // intentional
                };
            }
            Object.assign(state.content[key], d);
            state.content[key].scotData = {};
            state.content[key].scotData[LIQUID_TOKEN_UPPERCASE] = d;

            state.discussion_idx[tag][feedType].push(key);
        });
    } else {
        if (state.content) {
            await Promise.all(
                Object.entries(state.content)
                    .filter(entry => {
                        return entry[0].match(/[a-z0-9\.-]+\/.*?/);
                    })
                    .map(async entry => {
                        const k = entry[0];
                        const v = entry[1];
                        // Fetch SCOT data
                        state.content[k].scotData = await getScotDataAsync(
                            `@${k}`
                        );
                    })
            );
            const filteredContent = {};
            Object.entries(state.content)
                .filter(
                    entry =>
                        entry[1].scotData &&
                        entry[1].scotData[LIQUID_TOKEN_UPPERCASE]
                )
                .forEach(entry => {
                    filteredContent[entry[0]] = entry[1];
                });
            state.content = filteredContent;
        }
    }
}

export async function getStateAsync(url) {
    // strip off query string
    const path = url.split('?')[0];

    const raw = await api.getStateAsync(path);
    await attachScotData(url, raw);

    const cleansed = stateCleaner(raw);

    return cleansed;
}
