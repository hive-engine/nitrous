import * as steem from '@steemit/steem-js';
import * as hive from 'steem';
import {
    LIQUID_TOKEN_UPPERCASE,
    PREFER_HIVE,
    DISABLE_HIVE,
    HIVE_ENGINE,
} from 'app/client_config';
import stateCleaner from 'app/redux/stateCleaner';
import axios from 'axios';
import SSC from 'sscjs';

const ssc = new SSC('https://api.steem-engine.com/rpc');
const hiveSsc = new SSC('https://api.hive-engine.com/rpc');

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
            return [];
        });
}

async function getSteemEngineAccountHistoryAsync(account, hive) {
    const transfers = await callApi(
        hive
            ? 'https://accounts.hive-engine.com/accountHistory'
            : 'https://history.steem-engine.com/accountHistory',
        {
            account,
            limit: 50,
            offset: 0,
            type: 'user',
            symbol: LIQUID_TOKEN_UPPERCASE,
        }
    );
    const history = await getScotDataAsync('get_account_history', {
        account,
        token: LIQUID_TOKEN_UPPERCASE,
        limit: 50,
    });
    transfers.forEach(x => (x.timestamp = x.timestamp * 1000));
    return transfers
        .concat(history)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export async function getScotDataAsync(path, params) {
    return await callApi(`https://scot-api.steem-engine.com/${path}`, params);
}

export async function getScotAccountDataAsync(account) {
    const data = await getScotDataAsync(`@${account}`, {});
    const hiveData = DISABLE_HIVE
        ? null
        : await getScotDataAsync(`@${account}`, { hive: 1 });
    return { data, hiveData };
}

async function getAccount(account, useHive) {
    const accounts = await (useHive ? hive.api : steem.api).getAccountsAsync([
        account,
    ]);
    return accounts && accounts.length > 0 ? accounts[0] : {};
}

async function getGlobalProps(useHive) {
    const gprops = await (useHive
        ? hive.api
        : steem.api
    ).getDynamicGlobalPropertiesAsync();
    return gprops;
}

async function getAuthorRep(feedData, useHive) {
    const authors = Array.from(new Set(feedData.map(d => d.author)));
    const authorRep = {};
    if (authors.length === 0) {
        return authorRep;
    }
    (await (useHive ? hive.api : steem.api).getAccountsAsync(authors)).forEach(
        a => {
            authorRep[a.name] = a.reputation;
        }
    );
    return authorRep;
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

async function fetchMissingData(tag, feedType, state, feedData, useHive) {
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
            return (useHive ? hive.api : steem.api).getContentAsync(
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
    const discussionIndex = [];
    const filteredContent = {};
    const authorRep = await getAuthorRep(feedData, useHive);
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
    if (
        feedType == 'blog' ||
        feedType == 'feed' ||
        feedType == 'comments' ||
        feedType == 'recent_replies'
    ) {
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

async function addAccountToState(state, account, useHive) {
    if (!state.accounts) {
        state.accounts = {};
    }
    if (!state.accounts[account]) {
        state.accounts[account] = await getAccount(account, useHive);
    }
}

export async function attachScotData(url, state, useHive) {
    let urlParts = url.match(
        /^(trending|hot|created|promoted|payout|payout_comments)($|\/([^\/]+)$)/
    );
    const scotTokenSymbol = LIQUID_TOKEN_UPPERCASE;
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
        let callName = `get_discussions_by_${feedType}`;
        if (feedType === 'payout_comments') {
            callName = 'get_comment_discussions_by_payout';
        }
        // first call feed.
        let feedData = await getScotDataAsync(callName, discussionQuery);
        await fetchMissingData(tag, feedType, state, feedData, useHive);
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)\/transfers[\/]?$/);
    const hiveEngine = HIVE_ENGINE;
    const engineApi = hiveEngine ? hiveSsc : ssc;
    if (urlParts) {
        const account = urlParts[1];
        const [
            tokenBalances,
            tokenUnstakes,
            tokenStatuses,
            transferHistory,
            tokenDelegations,
        ] = await Promise.all([
            // modified to get all tokens. - by anpigon
            engineApi.find('tokens', 'balances', {
                account,
            }),
            engineApi.findOne('tokens', 'pendingUnstakes', {
                account,
                symbol: LIQUID_TOKEN_UPPERCASE,
            }),
            getScotAccountDataAsync(account),
            getSteemEngineAccountHistoryAsync(account, hiveEngine),
            engineApi.find('tokens', 'delegations', {
                $or: [{ from: account }, { to: account }],
                symbol: LIQUID_TOKEN_UPPERCASE,
            }),
        ]);

        await addAccountToState(state, account, useHive);
        if (!state.props) {
            state.props = await getGlobalProps(useHive);
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
        await fetchMissingData(account, 'feed', state, feedData, useHive);
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
        await addAccountToState(state, account, useHive);
        await fetchMissingData(account, 'blog', state, feedData, useHive);
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)(\/comments)?[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        let feedData = await getScotDataAsync('get_discussions_by_comments', {
            token: LIQUID_TOKEN_UPPERCASE,
            tag: account,
            limit: 20,
        });
        await addAccountToState(state, account, useHive);
        await fetchMissingData(account, 'comments', state, feedData, useHive);
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)(\/recent-replies)?[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        let feedData = await getScotDataAsync('get_discussions_by_replies', {
            token: LIQUID_TOKEN_UPPERCASE,
            tag: account,
            limit: 20,
        });
        await addAccountToState(state, account, useHive);
        await fetchMissingData(
            account,
            'recent_replies',
            state,
            feedData,
            useHive
        );
        return;
    }

    // Do not do this merging except on client side.
    if (state.content && process.env.BROWSER) {
        await Promise.all(
            Object.entries(state.content)
                .filter(entry => {
                    return entry[0].match(/[a-z0-9\.-]+\/.*?/);
                })
                .map(async entry => {
                    const k = entry[0];
                    const v = entry[1];
                    // Fetch SCOT data
                    const scotData = await getScotDataAsync(`@${k}`, {
                        hive: useHive ? '1' : '',
                    });
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
    let content;
    let scotData;
    const [steemitContent, hiveContent] = await Promise.all([
        steem.api.getContentAsync(author, permlink),
        DISABLE_HIVE
            ? Promise.resolve(null)
            : hive.api.getContentAsync(author, permlink),
    ]);
    let useHive = false;
    if (
        steemitContent &&
        steemitContent.author === author &&
        steemitContent.permlink === permlink
    ) {
        content = steemitContent;
    }
    if (
        (PREFER_HIVE ||
            !(
                steemitContent &&
                steemitContent.author === author &&
                steemitContent.permlink === permlink
            )) &&
        (hiveContent &&
            hiveContent.author === author &&
            hiveContent.permlink === permlink)
    ) {
        content = hiveContent;
        useHive = true;
    }
    if (useHive) {
        scotData = await getScotDataAsync(`@${author}/${permlink}?hive=1`);
    } else {
        scotData = await getScotDataAsync(`@${author}/${permlink}`);
    }
    if (!content) {
        return content;
    }
    mergeContent(content, scotData[LIQUID_TOKEN_UPPERCASE]);
    return content;
}

export async function getStateAsync(url) {
    // strip off query string
    let path = url.split('?')[0];

    // strip off leading and trailing slashes
    if (path.length > 0 && path[0] == '/')
        path = path.substring(1, path.length);
    if (path.length > 0 && path[path.length - 1] == '/')
        path = path.substring(0, path.length - 1);

    // Steemit state not needed for main feeds.
    const steemitApiStateNeeded =
        path !== '' &&
        !path.match(
            /^(trending|hot|created|promoted|payout|payout_comments)($|\/([^\/]+)$)/
        ) &&
        !path.match(
            /^@[^\/]+(\/(feed|blog|comments|recent-replies|transfers)?)?$/
        );

    let raw = {
        accounts: {},
        content: {},
    };
    let useHive = false;
    if (steemitApiStateNeeded) {
        const [steemitState, hiveState] = await Promise.all([
            steem.api.getStateAsync(path),
            DISABLE_HIVE ? Promise.resolve(null) : hive.api.getStateAsync(path),
        ]);
        if (steemitState && Object.keys(steemitState.content).length > 0) {
            raw = steemitState;
        }
        if (
            (PREFER_HIVE ||
                !(
                    steemitState && Object.keys(steemitState.content).length > 0
                )) &&
            hiveState &&
            Object.keys(hiveState.content).length > 0
        ) {
            raw = hiveState;
            useHive = true;
        }
    } else {
        // Use Prefer HIVE setting
        useHive = PREFER_HIVE;
    }
    if (!raw.accounts) {
        raw.accounts = {};
    }
    if (!raw.content) {
        raw.content = {};
    }
    await attachScotData(path, raw, useHive);

    const cleansed = stateCleaner(raw);
    return cleansed;
}

export async function fetchFeedDataAsync(useHive, call_name, ...args) {
    const fetchSize = args[0].limit;
    let feedData;
    // To indicate if there are no further pages in feed.
    let endOfData;
    // To indicate last fetched value from API.
    let lastValue;

    const callNameMatch = call_name.match(
        /getDiscussionsBy(Trending|Hot|Created|Promoted|Blog|Feed|Comments|Replies)Async/
    );
    let order;
    let callName;
    if (callNameMatch) {
        order = callNameMatch[1].toLowerCase();
        if (order == 'feed') {
            callName = 'get_feed';
        } else {
            callName = `get_discussions_by_${order}`;
        }
    } else if (call_name === 'getPostDiscussionsByPayoutAsync') {
        callName = 'get_discussions_by_payout';
    } else if (call_name === 'getCommentDiscussionsByPayoutAsync') {
        callName = 'get_comment_discussions_by_payout';
    }
    if (callName) {
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
        feedData = await getScotDataAsync(callName, discussionQuery);
        feedData = await Promise.all(
            feedData.map(async scotData => {
                const authorPermlink = scotData.authorperm.substr(1).split('/');
                let content;
                if (scotData.desc == null || scotData.children == null) {
                    content = await (useHive
                        ? hive.api
                        : steem.api
                    ).getContentAsync(authorPermlink[0], authorPermlink[1]);
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
        const authorRep = await getAuthorRep(feedData, useHive);
        feedData.forEach(d => {
            d.author_reputation = authorRep[d.author];
        });

        // this indicates no further pages in feed.
        endOfData = feedData.length < fetchSize;
        lastValue = feedData.length > 0 ? feedData[feedData.length - 1] : null;
    } else {
        feedData = await (useHive ? hive.api : steem.api)[call_name](...args);
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
