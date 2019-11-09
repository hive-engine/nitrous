import { api } from '@steemit/steem-js';
import { LIQUID_TOKEN_UPPERCASE, CURATOR_ACCOUNT } from 'app/client_config';
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
    const transfers = await callApi(
        'https://api.steem-engine.com/accounts/history',
        {
            account,
            limit: 50,
            offset: 0,
            type: 'user',
            symbol: LIQUID_TOKEN_UPPERCASE,
            v: new Date().getTime(),
        }
    );
    const history = await getScotDataAsync('get_account_history', {
        account,
        token: LIQUID_TOKEN_UPPERCASE,
        limit: 50,
        startTime: new Date().getTime(),
    });
    return transfers
        .concat(history)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export async function getScotDataAsync(path, params) {
    return callApi(`https://scot-api.steem-engine.com/${path}`, params);
}

export async function getScotAccountDataAsync(account) {
    return getScotDataAsync(`@${account}`, { v: new Date().getTime() });
}

async function getAccount(account) {
    const accounts = await api.getAccountsAsync([account]);
    return accounts && accounts.length > 0 ? accounts[0] : {};
}

async function getGlobalProps() {
    const gprops = await api.getDynamicGlobalPropertiesAsync();
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

function getAccountRC(account) {
    return new Promise(resolve => {
        api.send(
            'rc_api',
            {
                method: 'find_rc_accounts',
                params: { accounts: [account] },
            },
            function(err, res) {
                if (err) {
                    console.log(err);
                    return;
                }
                const rc = res.rc_accounts[0];
                const rc_percentage = rc.rc_manabar.current_mana / rc.max_rc;
                resolve(rc_percentage);
            }
        );
    });
}

async function getAccountCuration(args) {
    let { account, start, limit, start_author, start_permlink } = args;
    start = start || -1;
    limit = limit || 20;
    const history = await api.getAccountHistoryAsync(
        account,
        start,
        limit * 10
    );
    let votes = history
        .filter(h => h[1].op[0] === 'vote' && h[1].op[1].voter === account)
        .map(h => h[1].op[1]);
    let first = 0,
        count = 0;
    votes.forEach(v => {
        v.authorperm = '@' + v.author + '/' + v.permlink;
        if (start_author && start_permlink) {
            if (start_author === v.author && start_permlink === v.permlink) {
                first = count + 1;
            }
        }
        count++;
    });
    return votes.slice(first, first + limit);
}

function mergeContent(content, scotData) {
    const parentAuthor = content.parent_author;
    const parentPermlink = content.parent_permlink;
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
    // Prefer parent author / permlink of content
    content.parent_author = parentAuthor;
    content.parent_permlink = parentPermlink;

    content.scotData = {};
    content.scotData[LIQUID_TOKEN_UPPERCASE] = scotData;
}

async function fetchMissingData(
    tag,
    feedType,
    state,
    feedData,
    overwrite = true
) {
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
            // console.log('Unexpected missing: ' + authorPermlink);
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
    if (overwrite) {
        state.content = filteredContent;
    } else {
        for (let key in filteredContent) {
            if (!state.content[key]) {
                state.content[key] = filteredContent[key];
            }
        }
    }
    if (feedType == 'blog' || feedType == 'feed' || feedType == 'vote') {
        // author feeds
        if (!state.accounts[tag]) {
            state.accounts[tag] = {};
        }
        state.accounts[tag][feedType] = discussionIndex;
    } else {
        if (!state.discussion_idx[tag]) {
            state.discussion_idx[tag] = {};
        }
        state.discussion_idx[tag][feedType] = discussionIndex;
    }
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
            state.accounts[account].transfer_history = transferHistory;
        }
        if (tokenDelegations) {
            state.accounts[account].token_delegations = tokenDelegations;
        }
        if (snaxBalance) {
            state.accounts[account].snax_balance = snaxBalance;
        }
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)\/feed[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        let feedData = await getScotDataAsync('get_feed', {
            token: LIQUID_TOKEN_UPPERCASE,
            tag: account,
            limit: 20,
        });
        await fetchMissingData(account, 'feed', state, feedData);
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)\/dashboard[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];

        console.log('fetch dashboard data');

        // fetch feed data

        let feedData = await getScotDataAsync('get_feed', {
            token: LIQUID_TOKEN_UPPERCASE,
            tag: account,
            limit: 20,
        });
        await fetchMissingData(account, 'feed', state, feedData);

        // fetch blog data
        let blogData = await getScotDataAsync('get_discussions_by_blog', {
            token: LIQUID_TOKEN_UPPERCASE,
            tag: account,
            limit: 20,
            include_reblogs: true,
        });
        await fetchMissingData(account, 'blog', state, blogData, false);

        // fetch curation data
        let curationData = await getAccountCuration({
            account: CURATOR_ACCOUNT,
            start: -1,
            limit: 20,
        });
        await fetchMissingData(account, 'vote', state, curationData, false);

        // fetch token info
        const [tokenStatuses] = await Promise.all([
            getScotAccountDataAsync(account),
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

        // fetch resource credits
        const rc = await getAccountRC(account);
        state.accounts[account].rc = rc;

        if (tokenStatuses && tokenStatuses[LIQUID_TOKEN_UPPERCASE]) {
            state.accounts[account].token_status =
                tokenStatuses[LIQUID_TOKEN_UPPERCASE];
            state.accounts[account].all_token_status = tokenStatuses;
        }

        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)(\/blog)?[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        let feedData = await getScotDataAsync('get_discussions_by_blog', {
            token: LIQUID_TOKEN_UPPERCASE,
            tag: account,
            limit: 20,
            include_reblogs: true,
        });
        await fetchMissingData(account, 'blog', state, feedData);
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
    let path = url.split('?')[0];

    console.log('path');
    console.log(path);

    // Steemit state not needed for main feeds.
    const steemitApiStateNeeded = !url.match(
        /^[\/]?(trending|hot|created|promoted|syndication)($|\/$|\/([^\/]+)\/?$)/
    );

    // add special handling for dashboard
    const match = path.match(/^\/(@[\w\.\d-]+)\/dashboard\/?$/);
    if (match) {
        path = '/' + match[1] + '/feed';
    }

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
        /getDiscussionsBy(Trending|Hot|Created|Promoted|Blog|Feed|Vote)Async/
    );
    if (callNameMatch) {
        const order = callNameMatch[1].toLowerCase();
        let callName = `get_discussions_by_${order}`;
        if (order == 'feed') {
            callName = 'get_feed';
        }
        let discussionQuery = {
            ...args[0],
            token: LIQUID_TOKEN_UPPERCASE,
        };
        if (order == 'blog') {
            discussionQuery.include_reblogs = true;
        }
        if (!discussionQuery.tag) {
            // If empty string, remove from query.
            delete discussionQuery.tag;
        }
        if (order == 'vote') {
            feedData = await getAccountCuration({
                account: CURATOR_ACCOUNT,
                start: -1,
                ...discussionQuery,
            });
        } else {
            feedData = await getScotDataAsync(callName, discussionQuery);
        }
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
