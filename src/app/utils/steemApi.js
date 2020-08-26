import * as steem from '@steemit/steem-js';
import * as hive from '@hiveio/hive-js';
import o2j from 'shared/clash/object2json';
import { ifHivemind } from 'app/utils/Community';
import stateCleaner from 'app/redux/stateCleaner';
import {
    fetchCrossPosts,
    augmentContentWithCrossPost,
} from 'app/utils/CrossPosts';

import {
    LIQUID_TOKEN_UPPERCASE,
    PREFER_HIVE,
    DISABLE_HIVE,
    HIVE_ENGINE,
} from 'app/client_config';

import axios from 'axios';
import SSC from 'sscjs';

const ssc = new SSC('https://api.steem-engine.com/rpc');
const hiveSsc = new SSC('https://api.hive-engine.com/rpc');

export async function callBridge(method, params) {
    console.log(
        'call bridge',
        method,
        params && JSON.stringify(params).substring(0, 200)
    );

    return new Promise(function(resolve, reject) {
        hive.api.call('bridge.' + method, params, function(err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

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

async function getAccountFromNodeApi(account, useHive) {
    const accounts = await (useHive ? hive.api : steem.api).getAccountsAsync([
        account,
    ]);
    return accounts && accounts.length > 0 ? accounts[0] : {};
}

export async function getAccount(account, useHive) {
    if (useHive) {
        const profile = await callBridge('get_profile', { account });
        return profile ? profile : {};
    } else {
        return await getAccountFromNodeApi(account, useHive);
    }
}

export async function getWalletAccount(account, useHive) {
    const bridgeAccountObject = await getAccount(account, useHive);

    const hiveEngine = HIVE_ENGINE;
    const engineApi = hiveEngine ? hiveSsc : ssc;
    const [
        tokenBalances,
        tokenUnstakes,
        tokenStatuses,
        transferHistory,
        tokenDelegations,
        accountObject,
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
        await getAccountFromNodeApi(account, useHive),
    ]);

    Object.assign(bridgeAccountObject, accountObject);

    if (tokenBalances) {
        bridgeAccountObject.token_balances = tokenBalances;
    }
    if (tokenUnstakes) {
        bridgeAccountObject.token_unstakes = tokenUnstakes;
    }
    if (tokenStatuses) {
        const tokenStatusData = useHive
            ? tokenStatuses.hiveData
            : tokenStatuses.data;
        if (tokenStatusData[LIQUID_TOKEN_UPPERCASE]) {
            bridgeAccountObject.token_status =
                tokenStatusData[LIQUID_TOKEN_UPPERCASE];
            bridgeAccountObject.all_token_status = tokenStatusData;
        }
    }
    if (transferHistory) {
        bridgeAccountObject.transfer_history = transferHistory;
    }
    if (tokenDelegations) {
        bridgeAccountObject.token_delegations = tokenDelegations;
    }
    return bridgeAccountObject;
}

async function getGlobalProps(useHive) {
    const gprops = await (useHive
        ? hive.api
        : steem.api
    ).getDynamicGlobalPropertiesAsync();
    return gprops;
}

async function getAuthorRep(feedData, useHive) {
    // Disable for now.
    return {};
    /*const authors = Array.from(new Set(feedData.map(d => d.author)));
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
    */
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

    content.json_metadata = o2j.ifStringParseJSON(content.json_metadata);
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
    if (!state.discussion_idx[tag]) {
        state.discussion_idx[tag] = {};
    }
    state.discussion_idx[tag][feedType] = discussionIndex;
}

async function addAccountToState(state, account, useHive) {
    if (useHive) {
        const profile = await callBridge('get_profile', { account });
        if (profile && profile['name']) {
            state['profiles'][account] = profile;
        }
    } else {
        if (!state['profiles'][account]) {
            state['profiles'][account] = await getAccount(account, useHive);
        }
    }
}

export async function attachScotData(url, state, useHive, ssr = false) {
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
    if (urlParts) {
        const account = urlParts[1];
        if (ssr) {
            state['profiles'][account] = await getWalletAccount(
                account,
                useHive
            );
        }

        if (!state.props) {
            state.props = await getGlobalProps(useHive);
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
        await fetchMissingData(`@${account}`, 'feed', state, feedData, useHive);
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
        if (ssr) {
            await addAccountToState(state, account, useHive);
        }
        await fetchMissingData(`@${account}`, 'blog', state, feedData, useHive);
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)(\/posts)?[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        let feedData = await getScotDataAsync('get_discussions_by_blog', {
            token: LIQUID_TOKEN_UPPERCASE,
            tag: account,
            limit: 20,
        });
        if (ssr) {
            await addAccountToState(state, account, useHive);
        }
        await fetchMissingData(
            `@${account}`,
            'posts',
            state,
            feedData,
            useHive
        );
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
        if (ssr) {
            await addAccountToState(state, account, useHive);
        }
        await fetchMissingData(
            `@${account}`,
            'comments',
            state,
            feedData,
            useHive
        );
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)(\/replies)?[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        let feedData = await getScotDataAsync('get_discussions_by_replies', {
            token: LIQUID_TOKEN_UPPERCASE,
            tag: account,
            limit: 20,
        });
        if (ssr) {
            await addAccountToState(state, account, useHive);
        }
        await fetchMissingData(
            `@${account}`,
            'replies',
            state,
            feedData,
            useHive
        );
        return;
    }

    if (state.content) {
        Object.entries(state.content).forEach(entry => {
            if (useHive) {
                entry[1].hive = true;
            }
        });

        // Do not do this merging except on client side.
        if (!ssr) {
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
}

async function getContentFromBridge(author, permlink) {
    const content = await hive.api.getContentAsync(author, permlink);

    return await callBridge('normalize_post', { post: content });
}

export async function getContentAsync(author, permlink) {
    let content;
    let scotData;
    const [steemitContent, hiveContent] = await Promise.all([
        true
            ? Promise.resolve(null)
            : steem.api.getContentAsync(author, permlink),
        DISABLE_HIVE
            ? Promise.resolve(null)
            : getContentFromBridge(author, permlink),
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

export async function getCommunityStateAsync(url, observer, ssr = false) {
    console.log('getStateAsync');
    if (observer === undefined) observer = null;

    const { page, tag, sort, key } = parsePath(url);

    console.log('GSA', url, observer, ssr);
    let state = {
        accounts: {},
        community: {},
        content: {},
        discussion_idx: {},
        profiles: {},
    };

    // load `content` and `discussion_idx`
    if (page == 'posts' || page == 'account') {
        const posts = await loadPosts(sort, tag, observer);
        state['content'] = posts['content'];
        state['discussion_idx'] = posts['discussion_idx'];
    } else if (page == 'thread') {
        const posts = await loadThread(key[0], key[1]);
        state['content'] = posts['content'];
    } else {
        // no-op
    }

    // append `community` key
    if (tag && ifHivemind(tag)) {
        try {
            state['community'][tag] = await callBridge('get_community', {
                name: tag,
                observer: observer,
            });
        } catch (e) {}
    }

    // for SSR, load profile on any profile page or discussion thread author
    const account =
        tag && tag[0] == '@'
            ? tag.slice(1)
            : page == 'thread' ? key[0].slice(1) : null;
    if (ssr && account) {
        // TODO: move to global reducer?
        const profile = await callBridge('get_profile', { account });
        if (profile && profile['name']) {
            state['profiles'][account] = profile;
        }
    }

    if (ssr) {
        // append `topics` key
        state['topics'] = await callBridge('get_trending_topics', {
            limit: 12,
        });
    }

    const cleansed = stateCleaner(state);
    return cleansed;
}

async function loadThread(account, permlink) {
    const author = account.slice(1);
    const content = await callBridge('get_discussion', { author, permlink });

    if (content) {
        const {
            content: preppedContent,
            keys,
            crossPosts,
        } = await fetchCrossPosts([Object.values(content)[0]], author);
        if (crossPosts) {
            const crossPostKey = content[keys[0]].cross_post_key;
            content[keys[0]] = preppedContent[keys[0]];
            content[keys[0]] = augmentContentWithCrossPost(
                content[keys[0]],
                crossPosts[crossPostKey]
            );
        }
    }

    return { content };
}

async function loadPosts(sort, tag, observer) {
    console.log('loadPosts');
    const account = tag && tag[0] == '@' ? tag.slice(1) : null;

    let posts;
    if (account) {
        const params = { sort, account, observer };
        posts = await callBridge('get_account_posts', params);
    } else {
        const params = { sort, tag, observer };
        posts = await callBridge('get_ranked_posts', params);
    }

    const { content, keys, crossPosts } = await fetchCrossPosts(
        posts,
        observer
    );

    if (Object.keys(crossPosts).length > 0) {
        for (let ki = 0; ki < keys.length; ki += 1) {
            const contentKey = keys[ki];
            let post = content[contentKey];

            if (Object.prototype.hasOwnProperty.call(post, 'cross_post_key')) {
                post = augmentContentWithCrossPost(
                    post,
                    crossPosts[post.cross_post_key]
                );
            }
        }
    }

    const discussion_idx = {};
    discussion_idx[tag] = {};
    discussion_idx[tag][sort] = keys;

    return { content, discussion_idx };
}

function parsePath(url) {
    // strip off query string
    url = url.split('?')[0];

    // strip off leading and trailing slashes
    if (url.length > 0 && url[0] == '/') url = url.substring(1, url.length);
    if (url.length > 0 && url[url.length - 1] == '/')
        url = url.substring(0, url.length - 1);

    // blank URL defaults to `trending`
    if (url === '') url = 'trending';

    const part = url.split('/');
    const parts = part.length;
    const sorts = [
        'trending',
        'promoted',
        'hot',
        'created',
        'payout',
        'payout_comments',
        'muted',
    ];
    const acct_tabs = [
        'blog',
        'feed',
        'posts',
        'comments',
        'replies',
        'payout',
    ];

    let page = null;
    let tag = null;
    let sort = null;
    let key = null;

    if (parts == 1 && sorts.includes(part[0])) {
        page = 'posts';
        sort = part[0];
        tag = '';
    } else if (parts == 2 && sorts.includes(part[0])) {
        page = 'posts';
        sort = part[0];
        tag = part[1];
    } else if (parts == 3 && part[1][0] == '@') {
        page = 'thread';
        tag = part[0];
        key = [part[1], part[2]];
    } else if (parts == 1 && part[0][0] == '@') {
        page = 'account';
        sort = 'blog';
        tag = part[0];
    } else if (parts == 2 && part[0][0] == '@') {
        if (acct_tabs.includes(part[1])) {
            page = 'account';
            sort = part[1];
        } else {
            // settings, followers, notifications, etc (no-op)
        }
        tag = part[0];
    } else {
        // no-op URL
    }
    return { page, tag, sort, key };
}

export async function getStateAsync(url, observer, ssr = false) {
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
        !path.match(/^(login|submit)\.html$/) &&
        !path.match(
            /^(trending|hot|created|promoted|payout|payout_comments)($|\/([^\/]+)$)/
        ) &&
        !path.match(
            /^@[^\/]+(\/(feed|blog|comments|recent-replies|transfers|posts|replies|settings|followers|followed)?)?$/
        );

    let raw = {
        accounts: {},
        community: {},
        content: {},
        discussion_idx: {},
        profiles: {},
    };
    let useHive = false;
    if (steemitApiStateNeeded) {
        // First get Hive state
        const hiveState = await getCommunityStateAsync(url, observer, ssr);
        if (
            hiveState &&
            (Object.keys(hiveState.content).length > 0 ||
                path.match(/^login\/hivesigner/))
        ) {
            raw = hiveState;
            useHive = true;
        } else {
            console.log('Fetching state from Steem (should be rare).');
            raw = await steem.api.getStateAsync(path);
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
    await attachScotData(path, raw, useHive, ssr);

    const cleansed = stateCleaner(raw);
    return cleansed;
}

export async function fetchFeedDataAsync(useHive, call_name, args) {
    const fetchSize = args.limit;
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
    let discussionQuery = {
        ...args,
        token: LIQUID_TOKEN_UPPERCASE,
    };
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
    } else if (call_name === 'get_account_posts') {
        if (args.sort === 'blog') {
            order = 'blog';
            callName = 'get_discussions_by_blog';
            discussionQuery.include_reblogs = true;
        } else if (args.sort === 'posts') {
            order = 'blog';
            callName = 'get_discussions_by_blog';
        } else if (args.sort === 'replies') {
            order = 'replies';
            callName = 'get_discussions_by_replies';
        } else if (args.sort === 'comments') {
            order = 'comments';
            callName = 'get_discussions_by_comments';
        }
        discussionQuery.tag = discussionQuery.account;
        delete discussionQuery.account;
        delete discussionQuery.sort;
    }
    if (callName) {
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
        feedData = await (useHive ? hive.api : steem.api)[call_name](args);
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
