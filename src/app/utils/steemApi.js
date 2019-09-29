import { api } from '@steemit/steem-js';
import { LIQUID_TOKEN_UPPERCASE } from 'app/client_config';
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

export async function getScotAccountDataAsync(account) {
    return getScotDataAsync(`@${account}`, { v: new Date().getTime() });
}

async function getAccount(account) {
    const accounts = await api.getAccountsAsync([account]);
    console.log(accounts);
    return accounts && accounts.length > 0 ? accounts[0] : {};
}

async function getGlobalProps() {
    const gprops = await api.getDynamicGlobalPropertiesAsync();
    console.log(gprops);
    return gprops;
}

async function getAuthorRep(feedData) {
    const authors = feedData.map(d => d.author);
    const authorRep = {};
    (await api.getAccountsAsync(authors)).forEach(a => {
        authorRep[a.name] = a.reputation;
    });
    return authorRep;
}

function mergeContent(content, scotData) {
    const voted = content.active_votes;
    const lastUpdate = content.last_update;
    const title = content.title;
    Object.assign(content, scotData);
    if (voted) {
        const scotVoted = new Set(content.active_votes.map(v => v.voter));
        voted.forEach(v => {
            if (!scotVoted.has(v.voter)) {
                content.active_votes.push({
                    voter: v.voter,
                    percent: v.percent,
                    rshares: 0,
                });
            }
        });
    }
    // Restore currently buggy fields
    if (lastUpdate) {
        content.last_update = lastUpdate;
    }
    if (title) {
        content.title = title;
    }
    content.scotData = {};
    content.scotData[LIQUID_TOKEN_UPPERCASE] = scotData;
}

async function fetchMissingData(tag, feedType, state, feedData) {
    if (!state.content) {
        state.content = {};
    }
    const missingKeys = feedData
        .filter(d => d.desc == null || d.children == null)
        .map(d => d.authorperm.substr(1))
        .filter(k => !state.content[k]);
    const missingContent = await Promise.all(
        missingKeys.map(k => {
            const authorPermlink = k.split('/');
            console.log('Unexpected missing: ' + authorPermlink);
            return api.getContentAsync(authorPermlink[0], authorPermlink[1]);
        })
    );
    missingContent.forEach(c => {
        state.content[`${c.author}/${c.permlink}`] = c;
    });

    if (!state.discussion_idx) {
        state.discussion_idx = {};
    }
    const discussionIndex = [];
    const filteredContent = {};
    const authorRep = await getAuthorRep(feedData);
    feedData.forEach(d => {
        const key = d.authorperm.substr(1);
        if (!state.content[key]) {
            filteredContent[key] = {
                author_reputation: authorRep[d.author],
                body: d.desc,
                body_length: d.desc.length,
                permlink: d.authorperm.split('/')[1],
                category: d.tags.split(',')[0],
                children: d.children,
                replies: [], // intentional
            };
        } else {
            filteredContent[key] = state.content[key];
        }
        mergeContent(filteredContent[key], d);
        discussionIndex.push(key);
    });
    state.content = filteredContent;
    if (!state.discussion_idx[tag]) {
        state.discussion_idx[tag] = {};
    }
    state.discussion_idx[tag][feedType] = discussionIndex;
}

export async function attachScotData(url, state) {
    let urlParts = url.match(
        /^[\/]?(trending|hot|created|promoted)($|\/$|\/([^\/]+)\/?$)/
    );
    if (urlParts) {
        const feedType = urlParts[1];
        const tag = urlParts[3] || '';
        const discussionQuery = {
            token: LIQUID_TOKEN_UPPERCASE,
            limit: 20,
        };
        if (tag) {
            discussionQuery.tag = tag;
        }
        // first call feed.
        let feedData = await getScotDataAsync(
            `get_discussions_by_${feedType}`,
            discussionQuery
        );
        await fetchMissingData(tag, feedType, state, feedData);
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)\/transfers[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        const [
            tokenBalances,
            tokenUnstakes,
            tokenStatuses,
            transferHistory,
            tokenDelegations,
            snaxBalance,
        ] = await Promise.all([
            // modified to get all tokens. - by anpigon
            ssc.find('tokens', 'balances', {
                account,
            }),
            ssc.findOne('tokens', 'pendingUnstakes', {
                account,
                symbol: LIQUID_TOKEN_UPPERCASE,
            }),
            getScotAccountDataAsync(account),
            getSteemEngineAccountHistoryAsync(account),
            ssc.find('tokens', 'delegations', {
                $or: [{ from: account }, { to: account }],
                symbol: LIQUID_TOKEN_UPPERCASE,
            }),
            fetchSnaxBalanceAsync(account),
        ]);

        if (!state.accounts) {
            state.accounts = {};
        }
        if (!state.accounts[account]) {
            state.accounts[account] = await getAccount(account);
        }
        if (!state.props) {
            state.props = await getGlobalProps();
        }
        if (tokenBalances) {
            state.accounts[account].token_balances = tokenBalances;
        }
        if (tokenUnstakes) {
            state.accounts[account].token_unstakes = tokenUnstakes;
        }
        if (tokenStatuses && tokenStatuses[LIQUID_TOKEN_UPPERCASE]) {
            state.accounts[account].token_status =
                tokenStatuses[LIQUID_TOKEN_UPPERCASE];
            state.accounts[account].all_token_status = tokenStatuses;
        }
        if (transferHistory) {
            // Reverse to show recent activity first
            state.accounts[
                account
            ].transfer_history = transferHistory.reverse();
        }
        if (tokenDelegations) {
            state.accounts[account].token_delegations = tokenDelegations;
        }
        if (snaxBalance) {
            state.accounts[account].snax_balance = snaxBalance;
        }
        return;
    }

    /* Not yet robust (no resteems here, will yield inconsistent behavior?). also need to add to authors[..]/feed.
    urlParts = url.match(/^[\/]?@([^\/]+)\/feed[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        let feedData = await getScotDataAsync(
            'get_feed',
            {
                token: LIQUID_TOKEN_UPPERCASE,
                account,
                limit: 20,
            }
        );
        await fetchMissingData(account, '', state, feedData);
        return;
    }
    */

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
                    mergeContent(
                        state.content[k],
                        scotData[LIQUID_TOKEN_UPPERCASE]
                    );
                })
        );
        const filteredContent = {};
        Object.entries(state.content)
            .filter(
                entry =>
                    (entry[1].scotData &&
                        entry[1].scotData[LIQUID_TOKEN_UPPERCASE]) ||
                    (entry[1].parent_author && entry[1].parent_permlink)
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
    mergeContent(content, scotData[LIQUID_TOKEN_UPPERCASE]);
    return content;
}

export async function getStateAsync(url) {
    // strip off query string
    const path = url.split('?')[0];

    console.log('path');
    console.log(path);
            
    // Steemit state not needed for main feeds.
    const steemitApiStateNeeded = !url.match(
        /^[\/]?(trending|hot|created|promoted)($|\/$|\/([^\/]+)\/?$)/
    );
    let raw = steemitApiStateNeeded
        ? await api.getStateAsync(path)
        : {
              accounts: {},
              content: {},
          };
    if (!raw) {
        raw = {};
    }
    if (!raw.accounts) {
        raw.accounts = {};
    }
    if (!raw.content) {
        raw.content = {};
    }
    await attachScotData(url, raw);

    console.log('raw');
    console.log(raw);

    const cleansed = stateCleaner(raw);

    return cleansed;
}

export async function fetchFeedDataAsync(call_name, ...args) {
    const fetchSize = args[0].limit;
    let feedData;
    // To indicate if there are no further pages in feed.
    let endOfData;
    // To indicate last fetched value from API.
    let lastValue;

    const callNameMatch = call_name.match(
        /getDiscussionsBy(Trending|Hot|Created|Promoted)Async/
    );
    if (callNameMatch) {
        let order = callNameMatch[1].toLowerCase();
        let discussionQuery = {
            ...args[0],
            token: LIQUID_TOKEN_UPPERCASE,
        };
        if (!discussionQuery.tag) {
            // If empty string, remove from query.
            delete discussionQuery.tag;
        }
        feedData = await getScotDataAsync(
            `get_discussions_by_${order}`,
            discussionQuery
        );
        feedData = await Promise.all(
            feedData.map(async scotData => {
                const authorPermlink = scotData.authorperm.substr(1).split('/');
                let content;
                if (scotData.desc == null || scotData.children == null) {
                    content = await api.getContentAsync(
                        authorPermlink[0],
                        authorPermlink[1]
                    );
                } else {
                    content = {
                        body: scotData.desc,
                        body_length: scotData.desc.length,
                        permlink: scotData.authorperm.split('/')[1],
                        category: scotData.tags.split(',')[0],
                        children: scotData.children,
                        replies: [], // intentional
                    };
                }
                mergeContent(content, scotData);
                return content;
            })
        );
        // fill in author rep
        const authorRep = await getAuthorRep(feedData);
        feedData.forEach(d => {
            d.author_reputation = authorRep[d.author];
        });

        // this indicates no further pages in feed.
        endOfData = feedData.length < fetchSize;
        lastValue = feedData.length > 0 ? feedData[feedData.length - 1] : null;
    } else {
        feedData = await api[call_name](...args);
        feedData = await Promise.all(
            feedData.map(async post => {
                const k = `${post.author}/${post.permlink}`;
                const scotData = await getScotDataAsync(`@${k}`);
                mergeContent(post, scotData[LIQUID_TOKEN_UPPERCASE]);
                return post;
            })
        );
        // endOfData check and lastValue setting should go before any filtering,
        endOfData = feedData.length < fetchSize;
        lastValue = feedData.length > 0 ? feedData[feedData.length - 1] : null;
        feedData = feedData.filter(
            post => post.scotData && post.scotData[LIQUID_TOKEN_UPPERCASE]
        );
    }
    return { feedData, endOfData, lastValue };
}

export async function fetchSnaxBalanceAsync(account) {
    const url = 'https://cdn.snax.one/v1/chain/get_currency_balance';
    const data = {
        code: 'snax.token',
        symbol: 'SNAX',
        account,
    };
    return await axios
        .post(url, data, {
            headers: { 'content-type': 'text/plain' },
        })
        .then(response => response.data)
        .catch(err => {
            console.error(`Could not fetch data, url: ${url}`);
            return [];
        });
}
