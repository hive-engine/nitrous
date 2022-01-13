import * as steem from '@steemit/steem-js';
import * as hive from '@hiveio/hive-js';
import o2j from 'shared/clash/object2json';
import { ifHivemind } from 'app/utils/Community';
import stateCleaner from 'app/redux/stateCleaner';
import {
    fetchCrossPosts,
    augmentContentWithCrossPost,
} from 'app/utils/CrossPosts';

import axios from 'axios';
import SSC from '@hive-engine/sscjs';

const ssc = new SSC('https://ha.herpc.dtools.dev');
const hiveSsc = new SSC('https://ha.herpc.dtools.dev');

export async function callBridge(method, params, useHive = true) {
    console.log(
        'call bridge',
        'hive=' + useHive,
        method,
        params && JSON.stringify(params).substring(0, 200)
    );

    return new Promise(function(resolve, reject) {
        (useHive ? hive : steem).api.call('bridge.' + method, params, function(
            err,
            data
        ) {
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

async function getSteemEngineAccountHistoryAsync(account, scotTokenSymbol, hive) {
    const transfers = await callApi('https://accounts.hive-engine.com/accountHistory',
        {
            account,
            limit: 50,
            offset: 0,
            type: 'user',
            symbol: scotTokenSymbol,
        }
    );
    const history = await getScotDataAsync('get_account_history', {
        account,
        token: scotTokenSymbol,
        limit: 50,
    });
    transfers.forEach(x => (x.timestamp = x.timestamp * 1000));
    return transfers
        .concat(history)
        .filter(a => Date.now() - new Date(a.timestamp) < 14 * 24 * 3600 * 1000)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export async function getScotDataAsync(path, params) {
    return await callApi(`https://ha.smt-api.dtools.dev/${path}`, params);
}

export async function getScotAccountDataAsync(account) {
    const sscVpData = await hiveSsc.find('comments', 'votingPower', { account });
    const sscTokenData = await hiveSsc.find('tokens', 'balances', { account });
    const data = {};
    sscVpData.forEach(vpData => {
        data[vpData.rewardPoolId] = {
            last_vote_time: new Date(vpData.lastVoteTimestamp),
            last_downvote_time: new Date(vpData.lastVoteTimestamp),
            voting_power: vpData.votingPower,
            downvoting_power: vpData.downvotingPower,
        };
    });
    const tokenData = {};
    sscTokenData.forEach(d => {
        tokenData[d.symbol] = parseFloat(d.stake) + parseFloat(d.delegationsIn);
    });
    return { data, tokenData };
}

async function getAccountFromNodeApi(account, useHive) {
    const accounts = await (useHive ? hive.api : steem.api).getAccountsAsync([
        account,
    ]);
    return accounts && accounts.length > 0 ? accounts[0] : {};
}

export async function getAccount(account, useHive) {
    const profile = await callBridge('get_profile', { account }, useHive);
    return profile ? profile : {};
}

export async function getWalletAccount(account, useHive, scotTokenSymbol) {
    const bridgeAccountObject = await getAccount(account, useHive);

    const hiveEngine = useHive;
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
        engineApi.find('tokens', 'pendingUnstakes', {
            account,
            symbol: scotTokenSymbol,
        }),
        getScotAccountDataAsync(account),
        getSteemEngineAccountHistoryAsync(account, scotTokenSymbol, hiveEngine),
        engineApi.find('tokens', 'delegations', {
            $or: [{ from: account }, { to: account }],
            symbol: scotTokenSymbol,
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
        const tokenStatusData = tokenStatuses.data;
        if (tokenStatusData[scotTokenSymbol]) {
            bridgeAccountObject.token_status = tokenStatusData[scotTokenSymbol];
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

function mergeContent(content, scotData, scotTokenSymbol) {
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
                    percent: Math.sign(v.rshares),
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
    // Remove hide/gray stats
    if (content.stats) {
        content.stats.hide = false;
        content.stats.gray = false;
    }
    if (typeof content.json_metadata === "string") {
        content.json_metadata = JSON.parse(content.json_metadata);
    }

    content.scotData = {};
    content.scotData[scotTokenSymbol] = scotData;
}

function getCategory(d) {
    let category = d.tags.split(',')[0];
    if (d.url) {
        const parts = d.url.split("/");
        if (parts.length > 1) {
            category = parts[1];
        }
    }
    return category;
}

async function fetchMissingData(
    tag,
    feedType,
    state,
    feedData,
    scotTokenSymbol,
    useHive
) {
    if (!state.content) {
        state.content = {};
    }
    //const missingKeys = feedData
    //    .filter(d => d.desc == null || d.children == null)
    //    .map(d => d.authorperm.substr(1))
    //    .filter(k => !state.content[k]);
    //const missingContent = await Promise.all(
    //    missingKeys.map(k => {
    //        const authorPermlink = k.split('/');
    //        console.log('Unexpected missing: ' + authorPermlink);
    //        return (useHive ? hive.api : steem.api).getContentAsync(
    //            authorPermlink[0],
    //            authorPermlink[1]
    //        );
    //    })
    //);
    //missingContent.forEach(c => {
    //    state.content[`${c.author}/${c.permlink}`] = c;
    //});

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
                body: d.body ? d.body : d.desc,
                body_length: d.body ? d.body.length : d.desc.length + 1,
                permlink: d.authorperm.split('/')[1],
                category: getCategory(d),
                children: d.children,
                replies: [],
            };
        } else {
            filteredContent[key] = state.content[key];
        }
        mergeContent(filteredContent[key], d, scotTokenSymbol);
        discussionIndex.push(key);
    });
    // second pass for replies
    if (feedType === 'thread') {
        feedData.forEach(d => {
            const key = d.authorperm.substr(1);
            if (d.parent_author && d.parent_permlink) {
                const pkey = `${d.parent_author}/${d.parent_permlink}`;
                if (filteredContent[pkey]) {
                    filteredContent[pkey].replies.push(key);
                }
            }
        });
    }
    state.content = filteredContent;
    if (!state.discussion_idx[tag]) {
        state.discussion_idx[tag] = {};
    }
    state.discussion_idx[tag][feedType] = discussionIndex;
}

async function addAccountToState(state, account, useHive) {
    const profile = await callBridge('get_profile', { account }, useHive);
    if (profile && profile['name']) {
        state['profiles'][account] = profile;
    }
}

export async function attachScotData(
    url,
    state,
    hostConfig,
    useHive,
    observer,
    ssr = false
) {
    if (url === '') {
        url = 'trending';
    }
    let urlParts = url.match(
        /^(trending|hot|created|promoted|payout|payout_comments)($|\/([^\/]+)$)/
    );
    const scotTokenSymbol = hostConfig['LIQUID_TOKEN_UPPERCASE'];
    if (urlParts) {
        const feedType = urlParts[1];
        const tag = urlParts[3] || '';
        const discussionQuery = {
            token: scotTokenSymbol,
            limit: 20,
            no_votes: 1,
        };
        if (observer) {
            discussionQuery.voter = observer;
        }
        if (tag) {
            discussionQuery.tag = tag;
        }
        let callName = `get_discussions_by_${feedType}`;
        if (feedType === 'payout_comments') {
            callName = 'get_comment_discussions_by_payout';
        }
        // first call feed.
        let feedData = await getScotDataAsync(callName, discussionQuery);
        await fetchMissingData(
            tag,
            feedType,
            state,
            feedData,
            scotTokenSymbol,
            useHive
        );
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)\/transfers[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        if (ssr) {
            state['profiles'][account] = await getWalletAccount(
                account,
                useHive,
                scotTokenSymbol
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
        const feedParams = {
            token: scotTokenSymbol,
            tag: account,
            limit: 20,
        };
        let feedData = await getScotDataAsync('get_feed', feedParams);
        await fetchMissingData(
            `@${account}`,
            'feed',
            state,
            feedData,
            scotTokenSymbol,
            useHive
        );
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)(\/blog)?[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        const feedParams = {
            token: scotTokenSymbol,
            tag: account,
            limit: 20,
            include_reblogs: true,
        };
        let feedData = await getScotDataAsync(
            'get_discussions_by_blog',
            feedParams
        );
        if (ssr) {
            await addAccountToState(state, account, useHive);
        }
        await fetchMissingData(
            `@${account}`,
            'blog',
            state,
            feedData,
            scotTokenSymbol,
            useHive
        );
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)(\/posts)?[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        const feedParams = {
            token: scotTokenSymbol,
            tag: account,
            limit: 20,
        };
        let feedData = await getScotDataAsync(
            'get_discussions_by_blog',
            feedParams
        );
        if (ssr) {
            await addAccountToState(state, account, useHive);
        }
        await fetchMissingData(
            `@${account}`,
            'posts',
            state,
            feedData,
            scotTokenSymbol,
            useHive
        );
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)(\/comments)?[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        const feedParams = {
            token: scotTokenSymbol,
            tag: account,
            limit: 20,
        };
        let feedData = await getScotDataAsync(
            'get_discussions_by_comments',
            feedParams
        );
        if (ssr) {
            await addAccountToState(state, account, useHive);
        }
        await fetchMissingData(
            `@${account}`,
            'comments',
            state,
            feedData,
            scotTokenSymbol,
            useHive
        );
        return;
    }

    urlParts = url.match(/^[\/]?@([^\/]+)(\/replies)?[\/]?$/);
    if (urlParts) {
        const account = urlParts[1];
        const feedParams = {
            token: scotTokenSymbol,
            tag: account,
            limit: 20,
        };
        let feedData = await getScotDataAsync(
            'get_discussions_by_replies',
            feedParams
        );
        if (ssr) {
            await addAccountToState(state, account, useHive);
        }
        await fetchMissingData(
            `@${account}`,
            'replies',
            state,
            feedData,
            scotTokenSymbol,
            useHive
        );
        return;
    }

    urlParts = url.match(/^[\/]?([^\/]+)\/@([^\/]+)\/([^\/]+)$/);
    if (urlParts) {
        const author = urlParts[2];
        const permlink = urlParts[3];
        const threadParams = {
            token: scotTokenSymbol,
            author,
            permlink,
        };
        let threadData = await getScotDataAsync('get_thread', threadParams);
        await fetchMissingData(
            `@${author}/${permlink}`,
            'thread',
            state,
            threadData,
            scotTokenSymbol,
            useHive
        );
        return;
    }

    if (state.content) {
        Object.entries(state.content).forEach(entry => {
            if (useHive && entry[1]) {
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
                            token: scotTokenSymbol,
                            //hive: useHive ? '1' : '',
                        });
                        if (useHive && state.content[k]) {
                            state.content[k].hive = true;
                        }
                        mergeContent(
                            state.content[k],
                            scotData[scotTokenSymbol],
                            scotTokenSymbol
                        );
                    })
            );
            const filteredContent = {};
            Object.entries(state.content)
                .filter(
                    entry =>
                        (entry[1].scotData &&
                            entry[1].scotData[scotTokenSymbol]) ||
                        (entry[1].parent_author && entry[1].parent_permlink)
                )
                .forEach(entry => {
                    filteredContent[entry[0]] = entry[1];
                });
            state.content = filteredContent;
        }
    }
}

async function getContentFromBridge(author, permlink, useHive = true) {
    try {
        const content = await (useHive ? hive : steem).api.getContentAsync(
            author,
            permlink
        );

        return await callBridge('normalize_post', { post: content }, useHive);
    } catch (e) {
        console.log(e);
    }
}

export async function getContentAsync(
    author,
    permlink,
    scotTokenSymbol,
    preferHive
) {
    let content;
    let scotData;
    if (preferHive) {
        content = await getContentFromBridge(author, permlink, true);
        if (content) {
            content.hive = true;
        }
        scotData = await getScotDataAsync(`@${author}/${permlink}`, {token: scotTokenSymbol});
    } else {
        content = await getContentFromBridge(author, permlink, false);
        scotData = await getScotDataAsync(`@${author}/${permlink}`, {token: scotTokenSymbol});
    }
    if (!content) {
        return content;
    }
    mergeContent(content, scotData[scotTokenSymbol], scotTokenSymbol.split('-')[0]);
    return content;
}

export async function getCommunityStateAsync(
    url,
    observer,
    ssr = false,
    useHive = true
) {
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
        const posts = await loadPosts(sort, tag, observer, useHive);
        state['content'] = posts['content'];
        state['discussion_idx'] = posts['discussion_idx'];
    } else if (page == 'thread') {
        const posts = await loadThread(key[0], key[1], useHive);
        state['content'] = posts['content'];
    } else {
        // no-op
    }

    // append `community` key
    if (tag && ifHivemind(tag)) {
        try {
            state['community'][tag] = await callBridge(
                'get_community',
                {
                    name: tag,
                    observer: observer,
                },
                useHive
            );
        } catch (e) {}
    }

    // for SSR, load profile on any profile page or discussion thread author
    const account =
        tag && tag[0] == '@'
            ? tag.slice(1)
            : page == 'thread' ? key[0].slice(1) : null;
    if (ssr && account) {
        // TODO: move to global reducer?
        const profile = await callBridge('get_profile', { account }, useHive);
        if (profile && profile['name']) {
            state['profiles'][account] = profile;
        }
    }

    if (ssr) {
        // append `topics` key
        state['topics'] = await callBridge(
            'get_trending_topics',
            {
                limit: 12,
            },
            useHive
        );
    }

    const cleansed = stateCleaner(state);
    return cleansed;
}

async function loadThread(account, permlink, useHive) {
    const author = account.slice(1);
    let content = await callBridge(
        'get_discussion',
        { author, permlink },
        useHive
    );
    if (!content || !content[`${author}/${permlink}`]) {
        content = {};
        content[`${author}/${permlink}`] = await callBridge(
            'get_post',
            { author, permlink },
            useHive
        );
    } else {
        const {
            content: preppedContent,
            keys,
            crossPosts,
        } = await fetchCrossPosts([Object.values(content)[0]], author, useHive);
        if (crossPosts) {
            const crossPostKey = content[keys[0]].cross_post_key;
            content[keys[0]] = preppedContent[keys[0]];
            content[keys[0]] = augmentContentWithCrossPost(
                content[keys[0]],
                crossPosts[crossPostKey]
            );
        }
    }
    if (content) {
        // Detect fetch with scot vs fetch with getState. We use body length vs body to tell
        // if it was a partial fetch. To clean up later.
        const k = `${author}/${permlink}`;
        content[k].body_length = content[k].body.length;
    }

    return { content };
}

async function loadPosts(sort, tag, observer, useHive) {
    console.log('loadPosts');
    const account = tag && tag[0] == '@' ? tag.slice(1) : null;

    let posts;
    if (account) {
        const params = { sort, account, observer };
        posts = await callBridge('get_account_posts', params, useHive);
    } else {
        const params = { sort, tag, observer };
        posts = await callBridge('get_ranked_posts', params, useHive);
    }

    const { content, keys, crossPosts } = await fetchCrossPosts(
        posts,
        observer,
        useHive
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

export async function getStateAsync(url, hostConfig, observer, ssr = false) {
    // strip off query string
    let path = url.split('?')[0];

    // strip off leading and trailing slashes
    if (path.length > 0 && path[0] == '/')
        path = path.substring(1, path.length);
    if (path.length > 0 && path[path.length - 1] == '/')
        path = path.substring(0, path.length - 1);

    // Steemit state not needed for main feeds.
    const steemitApiStateNeeded = false;/*
        path !== '' &&
        !path.match(/^(login|submit)\.html$/) &&
        !path.match(
            /^(trending|hot|created|promoted|payout|payout_comments)($|\/([^\/]+)$)/
        ) &&
        !path.match(
            /^@[^\/]+(\/(feed|blog|comments|recent-replies|transfers|posts|replies|followers|followed)?)?$/
        );*/

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
        if (hostConfig['DISABLE_HIVE']) {
            console.log('Fetching state from Steem.');
            raw = await getCommunityStateAsync(url, observer, ssr, false);
        } else {
            try {
                const hiveState = await getCommunityStateAsync(
                    url,
                    observer,
                    ssr,
                    true
                );
                if (
                    hiveState &&
                    (Object.keys(hiveState.content).length > 0 ||
                        path.match(/^login\/hivesigner/))
                ) {
                    raw = hiveState;
                    useHive = true;
                }
            } catch (e) {
                console.log(e);
            }
            if (!useHive) {
                console.log('Fetching state from Steem.');
                raw = await getCommunityStateAsync(url, observer, ssr, false);
            }
        }
    } else {
        // Use Prefer HIVE setting
        useHive = hostConfig['PREFER_HIVE'];
    }
    if (!raw.accounts) {
        raw.accounts = {};
    }
    if (!raw.content) {
        raw.content = {};
    }
    await attachScotData(path, raw, hostConfig, useHive, observer, ssr);

    const cleansed = stateCleaner(raw);
    return cleansed;
}

export async function fetchFeedDataAsync(useHive, call_name, hostConfig, args) {
    const scotTokenSymbol = hostConfig['LIQUID_TOKEN_UPPERCASE'];
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
        token: scotTokenSymbol,
        no_votes: 1,
    };
    if (args.observer) {
        discussionQuery.voter = args.observer;
    }
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
        } else if (args.sort === 'feed') {
            order = 'feed';
            callName = 'get_feed';
            discussionQuery.include_reblogs = true;
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
                        body_length: scotData.desc.length + 1,
                        permlink: scotData.authorperm.split('/')[1],
                        category: getCategory(scotData),
                        children: scotData.children,
                        replies: [], // intentional
                    };
                }
                mergeContent(content, scotData, scotTokenSymbol);
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
