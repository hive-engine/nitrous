import { api } from '@steemit/steem-js';
import { LIQUID_TOKEN_UPPERCASE, SCOT_TAG } from 'app/client_config';
import stateCleaner from 'app/redux/stateCleaner';
import axios from 'axios';
import SSC from 'sscjs';

const ssc = new SSC('https://api.steem-engine.com/rpc');

async function callApi(url, params) {
    return await axios({
        url,
        method: 'GET',
        params,
    })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.error(`Could not fetch data, url: ${url}`);
            return {};
        });
}

async function getSteemEngineAccountHistoryAsync(account) {
    return callApi('https://api.steem-engine.com/accounts/history', {
        account,
        limit: 100,
        offset: 0,
        type: 'user',
        symbol: LIQUID_TOKEN_UPPERCASE,
        v: new Date().getTime(),
    });
}

export async function getScotDataAsync(path, params) {
    return callApi(`https://scot-api.steem-engine.com/${path}`, params);
}

export async function attachScotData(url, state) {
    let urlParts = url.match(/^[\/]?(trending|hot)\/?([^\/]*)/);
    if (urlParts && (!urlParts[2] || urlParts[2] === SCOT_TAG) /*tag*/) {
        const feedType = urlParts[1];
        const tag = urlParts[2]; // Not suported for general tags yet.
        // first call feed.
        let feedData = await getScotDataAsync(
            `get_discussions_by_${feedType}`,
            {
                token: LIQUID_TOKEN_UPPERCASE,
                limit: 20,
            }
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
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)\/transfers[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        const [
            tokenBalances,
            tokenStatuses,
            transferHistory,
        ] = await Promise.all([
            ssc.findOne('tokens', 'balances', {
                account,
                symbol: LIQUID_TOKEN_UPPERCASE,
            }),
            getScotDataAsync(`@${account}`, { v: new Date().getTime() }),
            getSteemEngineAccountHistoryAsync(account),
        ]);
        if (tokenBalances) {
            state.accounts[account].token_balances = tokenBalances;
        }
        if (tokenStatuses && tokenStatuses[LIQUID_TOKEN_UPPERCASE]) {
            state.accounts[account].token_status =
                tokenStatuses[LIQUID_TOKEN_UPPERCASE];
        }
        if (transferHistory) {
            // Reverse to show recent activity first
            state.accounts[
                account
            ].transfer_history = transferHistory.reverse();
        }
        return;
    }

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
                    const scotData = await getScotDataAsync(`@${k}`);
                    Object.assign(
                        state.content[k],
                        scotData[LIQUID_TOKEN_UPPERCASE]
                    );
                    state.content[k].scotData = scotData;
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

export async function getContentAsync(author, permlink) {
    const content = await api.getContentAsync(author, permlink);
    const scotData = await getScotDataAsync(`@${author}/${permlink}`);
    // Do not assign scot data directly, or vote count will not show
    // due to delay in steemd vs scot bot.
    //Object.assign(content, scotData[LIQUID_TOKEN_UPPERCASE]);
    content.scotData = scotData;

    return content;
}

export async function getStateAsync(url) {
    // strip off query string
    const path = url.split('?')[0];

    const raw = await api.getStateAsync(path);
    await attachScotData(url, raw);

    const cleansed = stateCleaner(raw);

    return cleansed;
}
