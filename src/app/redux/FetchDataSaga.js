import {
    all,
    call,
    cancel,
    put,
    fork,
    select,
    take,
    takeLatest,
    takeEvery,
} from 'redux-saga/effects';
import { api as hiveApi } from '@hiveio/hive-js';
import { api as steemApi } from '@steemit/steem-js';
import { loadFollows, fetchFollowCount } from 'app/redux/FollowSaga';
import { getContent } from 'app/redux/SagaShared';
import * as globalActions from './GlobalReducer';
import * as appActions from './AppReducer';
import * as transactionActions from './TransactionReducer';
import * as userProfileActions from './UserProfilesReducer';
import constants from './constants';
import { fromJS, List, Map, Set } from 'immutable';
import {
    fetchFeedDataAsync,
    getStateAsync,
    getScotDataAsync,
    callBridge,
} from 'app/utils/steemApi';
import {
    fetchCrossPosts,
    augmentContentWithCrossPost,
} from 'app/utils/CrossPosts';

const REQUEST_DATA = 'fetchDataSaga/REQUEST_DATA';
const FETCH_STATE = 'fetchDataSaga/FETCH_STATE';
const FETCH_SCOT_INFO = 'fetchDataSaga/FETCH_SCOT_INFO';
const FETCH_FOLLOWS = 'fetchDataSaga/FETCH_FOLLOWS';
const FETCH_AUTHOR_RECENT_POSTS = 'fetchDataSaga/FETCH_AUTHOR_RECENT_POSTS';
const GET_POST_HEADER = 'fetchDataSaga/GET_POST_HEADER';
const GET_COMMUNITY = 'fetchDataSaga/GET_COMMUNITY';
const LIST_COMMUNITIES = 'fetchDataSaga/LIST_COMMUNITIES';
const GET_SUBSCRIPTIONS = 'fetchDataSaga/GET_SUBSCRIPTIONS';
const GET_ACCOUNT_NOTIFICATIONS = 'fetchDataSaga/GET_ACCOUNT_NOTIFICATIONS';
const GET_UNREAD_ACCOUNT_NOTIFICATIONS =
    'fetchDataSaga/GET_UNREAD_ACCOUNT_NOTIFICATIONS';
const MARK_NOTIFICATIONS_AS_READ = 'fetchDataSaga/MARK_NOTIFICATIONS_AS_READ';
const GET_REWARDS_DATA = 'fetchDataSaga/GET_REWARDS_DATA';
const GET_STAKED_ACCOUNTS = 'fetchDataSaga/GET_STAKED_ACCOUNTS';
const GET_CATEGORIES = 'fetchDataSaga/GET_CATEGORIES';

export const fetchDataWatches = [
    fork(fetchDataSaga),
    takeLatest('@@router/LOCATION_CHANGE', fetchState),
    takeLatest(FETCH_STATE, fetchState),
    takeEvery('global/FETCH_JSON', fetchJson),
    takeLatest(FETCH_SCOT_INFO, fetchScotInfo),
    takeEvery(FETCH_FOLLOWS, fetchFollows),
    takeLatest(FETCH_AUTHOR_RECENT_POSTS, fetchAuthorRecentPosts),
    takeEvery(GET_POST_HEADER, getPostHeader),
    fork(getCommunitySaga),
    takeLatest(GET_SUBSCRIPTIONS, getSubscriptions),
    takeEvery(LIST_COMMUNITIES, listCommunities),
    takeEvery(GET_ACCOUNT_NOTIFICATIONS, getAccountNotifications),
    takeEvery(
        GET_UNREAD_ACCOUNT_NOTIFICATIONS,
        getUnreadAccountNotificationsSaga
    ),
    takeEvery(GET_REWARDS_DATA, getRewardsDataSaga),
    fork(getStakedAccountsSaga),
    takeEvery(GET_CATEGORIES, getCategories),
    takeEvery(MARK_NOTIFICATIONS_AS_READ, markNotificationsAsReadSaga),
];

export function* getPostHeader(action) {
    const header = yield call(callBridge, 'get_post_header', action.payload);
    const { author, permlink } = action.payload;
    const key = author + '/' + permlink;
    yield put(globalActions.receivePostHeader({ [key]: header }));
}

let is_initial_state = true;
export function* fetchState(location_change_action) {
    // Cancel any outstanding fetch calls (e.g. next page feed). Existing state calls will
    // automatically be cancelled by takeLatest.
    if (activeFetchDataTask) {
        yield cancel(activeFetchDataTask);
    }
    const { pathname } = location_change_action.payload;
    const m = pathname.match(/^\/@([a-z0-9\.-]+)(\/notifications)?/);
    const hostConfig = yield select(state =>
        state.app.get('hostConfig', Map()).toJS()
    );
    if (m && m.length >= 2) {
        const username = m[1];
        yield fork(fetchFollowCount, username, hostConfig['PREFER_HIVE']);
        yield fork(
            loadFollows,
            'getFollowersAsync',
            username,
            'blog',
            hostConfig['PREFER_HIVE']
        );
        yield fork(
            loadFollows,
            'getFollowingAsync',
            username,
            'blog',
            hostConfig['PREFER_HIVE']
        );
    }

    if (
        pathname === '/' ||
        pathname === '' ||
        pathname.indexOf('trending') !== -1 ||
        pathname.indexOf('hot') !== -1
    ) {
        yield fork(getPromotedState, pathname, hostConfig);
    }

    // `ignore_fetch` case should only trigger on initial page load. No need to call
    // fetchState immediately after loading fresh state from the server. Details: #593
    const server_location = yield select(state =>
        state.offchain.get('server_location')
    );
    const ignore_fetch = pathname === server_location && is_initial_state;

    if (ignore_fetch) {
        // If a user's transfer page is being loaded, fetch related account data.
        yield call(getTransferUsers, pathname);
        return;
    }

    is_initial_state = false;
    if (
        process.env.BROWSER &&
        window &&
        window.optimize &&
        window.optimize.isInitialized
    ) {
        window.optimize.refreshAll({ refresh: false });
    }

    let url = `${pathname}`;
    if (url === '/') url = hostConfig['DEFAULT_URL'] ? hostConfig['DEFAULT_URL'] : `/trending`;
    // Replace /curation-rewards and /author-rewards with /transfers for UserProfile
    // to resolve data correctly
    if (url.indexOf('/curation-rewards') !== -1)
        url = url.replace('/curation-rewards', '/transfers');
    if (url.indexOf('/author-rewards') !== -1)
        url = url.replace('/author-rewards', '/transfers');

    yield put(appActions.fetchDataBegin());
    try {
        let username = null;
        if (process.env.BROWSER) {
            [username] = yield select(state => [
                state.user.getIn(['current', 'username']),
            ]);
        }
        const state = yield call(
            getStateAsync,
            url,
            hostConfig,
            username,
            false
        );
        yield put(globalActions.receiveState(state));
        yield call(fetchScotInfo);
        yield call(syncPinnedPosts);
        if (hostConfig['COMMUNITY_CATEGORY']) {
            yield put(actions.getCommunity(hostConfig['COMMUNITY_CATEGORY']));
        }
    } catch (error) {
        console.error('~~ Saga fetchState error ~~>', url, error);
        yield put(appActions.steemApiError(error.message));
    }

    yield put(appActions.fetchDataEnd());
}

/**
 * Get promoted state for given path.
 *
 * @param {String} pathname
 */
export function* getPromotedState(pathname, hostConfig) {
    const m = pathname.match(/^\/[a-z]*\/(.*)\/?/);
    const tag = m ? m[1] : '';

    const discussions = yield select(state =>
        state.global.getIn(['discussion_idx', tag, 'promoted'])
    );

    if (discussions && discussions.size > 0) {
        return;
    }

    let username = null;
    if (process.env.BROWSER) {
        [username] = yield select(state => [
            state.user.getIn(['current', 'username']),
        ]);
    }
    const state = yield call(getStateAsync, `/promoted/${tag}`, hostConfig, username, false);
    yield put(globalActions.receiveState(state));
}

function* syncPinnedPosts() {
    // Bail if we're rendering serverside since there is no localStorage
    if (!process.env.BROWSER) return null;

    const scotTokenSymbol = yield select(state =>
        state.app.getIn(['hostConfig', 'LIQUID_TOKEN_UPPERCASE'])
    );
    // Get pinned posts from the store.
    const pinnedPosts = yield select(state =>
        state.offchain.getIn(['pinned_posts', scotTokenSymbol])
    );

    // Mark seen posts.
    const seenPinnedPosts = pinnedPosts.get('pinned_posts').map(post => {
        const id = `${post.get('author')}/${post.get('permlink')}`;
        return post.set(
            'seen',
            localStorage.getItem(`pinned-post-seen:${id}`) === 'true'
        );
    });

    // Look up seen post URLs.
    yield put(globalActions.syncPinnedPosts({ pinnedPosts: seenPinnedPosts }));

    // Mark all pinned posts as seen.
    pinnedPosts.get('pinned_posts').forEach(post => {
        const id = `${post.get('author')}/${post.get('permlink')}`;
        localStorage.setItem(`pinned-post-seen:${id}`, 'true');
    });
}

/**
 * Request all communities
 * @param {}
 */
export function* listCommunities(action) {
    const { observer, query, sort } = action.payload;
    try {
        const communities = yield call(callBridge, 'list_communities', {
            observer,
            query,
            sort,
        });
        if (communities.length > 0) {
            yield put(globalActions.receiveCommunities(communities));
        }
    } catch (error) {
        console.log('Error requesting communities:', error);
    }
}

/**
 * Request data for given community
 * @param {string} name of community
 */
function* getCommunitySaga() {
    // keep track of local fetches here
    const fetchStatus = {};
    while (true) {
        const action = yield take(GET_COMMUNITY);
        const tag = action.payload;
        if (!tag) {
            console.log('no community specified');
            continue;
        }

        if (fetchStatus[tag]) {
            continue;
        }
        fetchStatus[tag] = true;
        yield fork(fetchCommunity, tag);
    }
}

function* fetchCommunity(tag) {
    const currentUser = yield select(state => state.user.get('current'));
    const currentUsername = currentUser && currentUser.get('username');
    const useHive = yield select(state =>
        state.app.getIn(['hostConfig', 'PREFER_HIVE'], false)
    );

    try {
        // TODO: If no current user is logged in, skip the observer param.
        const community = yield call(
            callBridge,
            'get_community',
            {
                name: tag,
                observer: currentUsername,
            },
            useHive
        );

        // TODO: Handle error state
        if (community.name)
            yield put(
                globalActions.receiveCommunity({
                    [tag]: { ...community },
                })
            );
    } catch (e) {
        console.log(`Error fetching community ${tag}.`);
    }
}

export function* getCategories(action) {
    const hostConfig = yield select(state =>
        state.app.get('hostConfig', Map()).toJS()
    );
    const APPEND_TRENDING_TAGS_COUNT = hostConfig['APPEND_TRENDING_TAGS_COUNT'] || 0;
    const TRENDING_TAGS_TO_IGNORE = hostConfig['TRENDING_TAGS_TO_IGNORE'] || [];

    if (APPEND_TRENDING_TAGS_COUNT === 0) {
        yield put(globalActions.receiveCategories(hostConfig['TAG_LIST']));
        return;
    }
    const trendingCategories = yield call(
        getScotDataAsync,
        'get_trending_tags',
        {
            token: hostConfig['LIQUID_TOKEN_UPPERCASE'],
        }
    );
    const ignoreTags = new Set(hostConfig['TAG_LIST'].concat(TRENDING_TAGS_TO_IGNORE));
    const toAdd = trendingCategories.filter(c => !ignoreTags.has(c)).slice(0, APPEND_TRENDING_TAGS_COUNT);
    yield put(globalActions.receiveCategories(hostConfig['TAG_LIST'].concat(toAdd)));
}

/**
 * Request all user subscriptions
 * @param {string} name of account
 */
export function* getSubscriptions(action) {
    if (!action.payload) throw 'no account specified';
    yield put(globalActions.loadingSubscriptions(true));
    try {
        const subscriptions = yield call(callBridge, 'list_all_subscriptions', {
            account: action.payload,
        });
        yield put(
            globalActions.receiveSubscriptions({
                subscriptions,
                username: action.payload,
            })
        );
    } catch (error) {
        console.log('Error Fetching Account Subscriptions: ', error);
    }
    yield put(globalActions.loadingSubscriptions(false));
}

/**
 * Request notifications for given account
 * @param {object} payload containing:
 *   - account (string)
 *   - last_id (string), optional, for pagination
 *   - limit (int), optional, defualt is 100
 */
export function* getAccountNotifications(action) {
    if (!action.payload) throw 'no account specified';
    yield put(globalActions.notificationsLoading(true));
    try {
        const notifications = yield call(
            callBridge,
            'account_notifications',
            action.payload
        );

        if (notifications && notifications.error) {
            console.error(
                '~~ Saga getAccountNotifications error ~~>',
                notifications.error
            );
            yield put(appActions.steemApiError(notifications.error.message));
        } else {
            const limit = action.payload.limit ? action.payload.limit : 100;
            const isLastPage = notifications.length < action.payload.limit;
            yield put(
                globalActions.receiveNotifications({
                    name: action.payload.account,
                    notifications,
                    isLastPage,
                })
            );
        }
    } catch (error) {
        console.error('~~ Saga getAccountNotifications error ~~>', error);
        yield put(appActions.steemApiError(error.message));
    }
    yield put(globalActions.notificationsLoading(false));
}

/**
 * Request unread notifications for given account
 * @param {object} payload containing:
 *   - account (string)
 */

export function* getUnreadAccountNotificationsSaga(action) {
    if (!action.payload) throw 'no account specified';
    yield put(globalActions.notificationsLoading(true));
    try {
        const unreadNotifications = yield call(
            callBridge,
            'unread_notifications',
            action.payload
        );
        if (unreadNotifications && unreadNotifications.error) {
            console.error(
                '~~ Saga getUnreadAccountNotifications error ~~>',
                unreadNotifications.error
            );
            yield put(
                appActions.steemApiError(unreadNotifications.error.message)
            );
        } else {
            yield put(
                globalActions.receiveUnreadNotifications({
                    name: action.payload.account,
                    unreadNotifications,
                })
            );
        }
    } catch (error) {
        console.error('~~ Saga getUnreadAccountNotifications error ~~>', error);
        yield put(appActions.steemApiError(error.message));
    }
    yield put(globalActions.notificationsLoading(false));
}

export function* markNotificationsAsReadSaga(action) {
    const { timeNow, username, successCallback } = action.payload;
    const ops = ['setLastRead', { date: timeNow }];
    yield put(globalActions.notificationsLoading(true));
    try {
        yield put(
            transactionActions.broadcastOperation({
                type: 'custom_json',
                operation: {
                    id: 'notify',
                    required_posting_auths: [username],
                    json: JSON.stringify(ops),
                },
                successCallback: () => {
                    successCallback(username, timeNow);
                },
                errorCallback: () => {
                    console.log(
                        'There was an error marking notifications as read!'
                    );
                    globalActions.notificationsLoading(false);
                },
            })
        );
    } catch (error) {
        yield put(globalActions.notificationsLoading(false));
    }
}

let activeFetchDataTask;
function* fetchDataSaga() {
    while (true) {
        const action = yield take(REQUEST_DATA);
        if (activeFetchDataTask) {
            yield cancel(activeFetchDataTask);
        }
        activeFetchDataTask = yield fork(fetchData, action);
    }
}

export function* fetchData(action) {
    const {
        order,
        author,
        permlink,
        postFilter,
        observer,
        useHive,
    } = action.payload;
    let { category } = action.payload;
    if (!category) category = '';

    let useBridge = false;

    const hostConfig = yield select(state =>
        state.app.get('hostConfig', Map()).toJS()
    );
    yield put(globalActions.fetchingData({ order, category }));
    let call_name, args;
    if (order === 'trending') {
        call_name = 'getDiscussionsByTrendingAsync';
        args = {
            tag: category,
            limit: constants.FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink,
            observer,
        };
    } else if (order === 'hot') {
        call_name = 'getDiscussionsByHotAsync';
        args = {
            tag: category,
            limit: constants.FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink,
            observer,
        };
    } else if (order === 'promoted') {
        call_name = 'getDiscussionsByPromotedAsync';
        args = {
            tag: category,
            limit: constants.FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink,
            observer,
        };
    } else if (order === 'payout') {
        call_name = 'getPostDiscussionsByPayoutAsync';
        args = {
            tag: category,
            limit: constants.FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink,
            observer,
        };
    } else if (order === 'payout_comments') {
        call_name = 'getCommentDiscussionsByPayoutAsync';
        args = {
            tag: category,
            limit: constants.FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink,
            observer,
        };
    } else if (order === 'created') {
        call_name = 'getDiscussionsByCreatedAsync';
        args = {
            tag: category,
            limit: constants.FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink,
            observer,
        };
    } else if (order === 'by_replies') {
        call_name = 'getDiscussionsByRepliesAsync';
        args = {
            tag: author,
            limit: constants.FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink,
            observer,
        };
    } else if (order === 'by_feed') {
        // https://github.com/steemit/steem/issues/249
        call_name = 'getDiscussionsByFeedAsync';
        args = {
            tag: accountname,
            limit: constants.FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink,
            observer,
        };
    } else if (order === 'by_author') {
        call_name = 'getDiscussionsByBlogAsync';
        args = {
            tag: accountname,
            limit: constants.FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink,
            observer,
        };
    } else if (order === 'by_comments') {
        call_name = 'getDiscussionsByCommentsAsync';
        args = {
            tag: author,
            limit: constants.FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink,
            observer,
        };
    } else if (category[0] == '@') {
        call_name = 'get_account_posts';
        args = {
            sort: order,
            account: category.slice(1),
            limit: constants.FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink,
            observer,
        };
    } else {
        console.log('fetch saga ranked posts');
        call_name = 'get_ranked_posts';
        args = {
            sort: order,
            tag: category,
            limit: constants.FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink,
            observer,
        };
    }

    yield put(appActions.fetchDataBegin());
    try {
        let fetched = 0;
        let endOfData = false;
        let fetchLimitReached = false;
        let fetchDone = false;
        let batch = 0;
        while (!fetchDone) {
            let data = [];
            if (!useBridge) {
                let { feedData, endOfData, lastValue } = yield call(
                    fetchFeedDataAsync,
                    useHive,
                    call_name,
                    hostConfig,
                    args
                );
                data = feedData;

                if (lastValue) {
                    args.start_author = lastValue.author;
                    args.start_permlink = lastValue.permlink;
                }
            } else {
                const posts = yield call(callBridge, call_name, args);
                endOfData = posts.length < constants.FETCH_DATA_BATCH_SIZE;

                const response = yield call(fetchCrossPosts, posts, observer);

                if (response) {
                    const { content, keys, crossPosts } = response;

                    if (Object.keys(crossPosts).length > 0) {
                        for (let ki = 0; ki < keys.length; ki += 1) {
                            const contentKey = keys[ki];
                            let post = content[contentKey];

                            if (
                                Object.prototype.hasOwnProperty.call(
                                    post,
                                    'cross_post_key'
                                )
                            ) {
                                post = augmentContentWithCrossPost(
                                    post,
                                    crossPosts[post.cross_post_key]
                                );
                            }

                            data.push(post);
                        }
                    } else {
                        data = posts;
                    }
                } else {
                    data = posts;
                }

                batch++;
                fetchLimitReached = batch >= constants.MAX_BATCHES;

                if (data.length > 0) {
                    const lastValue = data[data.length - 1];
                    args.start_author = lastValue.author;
                    args.start_permlink = lastValue.permlink;
                }
            }

            batch++;
            fetchLimitReached = batch >= constants.MAX_BATCHES;

            // Still return all data but only count ones matching the filter.
            // Rely on UI to actually hide the posts.
            fetched += postFilter
                ? data.filter(postFilter).length
                : data.length;

            fetchDone =
                endOfData ||
                fetchLimitReached ||
                fetched >= constants.FETCH_DATA_BATCH_SIZE;

            yield put(
                globalActions.receiveData({
                    data,
                    order,
                    category,
                    author,
                    fetching: !fetchDone,
                    endOfData,
                })
            );
        }
    } catch (error) {
        console.error('~~ Saga fetchData error ~~>', call_name, args, error);
        yield put(appActions.steemApiError(error.message));
    }
    yield put(appActions.fetchDataEnd());
}

/**
    @arg {string} id unique key for result global['fetchJson_' + id]
    @arg {string} url
    @arg {object} body (for JSON.stringify)
*/
function* fetchJson({
    payload: { id, url, body, successCallback, skipLoading = false },
}) {
    try {
        const payload = {
            method: body ? 'POST' : 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        };
        let result = yield skipLoading
            ? fetch(url, payload)
            : call(fetch, url, payload);
        result = yield result.json();
        if (successCallback) result = successCallback(result);
        yield put(globalActions.fetchJsonResult({ id, result }));
    } catch (error) {
        console.error('fetchJson', error);
        yield put(globalActions.fetchJsonResult({ id, error }));
    }
}
export function* getRewardsDataSaga(action) {
    yield put(appActions.fetchDataBegin());
    try {
        const rewards = yield call(callBridge, 'get_payout_stats', {});
        if (rewards && rewards.error) {
            console.error(
                '~~ Saga getRewardsDataSaga error ~~>',
                rewards.error
            );
            yield put(appActions.steemApiError(rewards.error.message));
        } else {
            yield put(globalActions.receiveRewards({ rewards }));
        }
    } catch (error) {
        console.error('~~ Saga getRewardsDataSaga error ~~>', error);
        yield put(appActions.steemApiError(error.message));
    }
    yield put(appActions.fetchDataEnd());
}

function* getStakedAccountsSaga() {
    while (true) {
        const action = yield take(GET_STAKED_ACCOUNTS);
        const scotTokenSymbol = yield select(state =>
            state.app.getIn(['hostConfig', 'LIQUID_TOKEN_UPPERCASE'])
        );
        const loadedStakedAccounts = yield select(state =>
            state.global.has('stakedAccounts')
        );
        const precision = yield select(state =>
            state.app.getIn(['scotConfig', 'info', 'precision'], 0)
        );
        if (!loadedStakedAccounts) {
            const params = { token: scotTokenSymbol };
            try {
                const stakedAccounts = yield call(
                    getScotDataAsync,
                    'get_staked_accounts',
                    params
                );
                yield put(
                    globalActions.receiveStakedAccounts({
                        stakedAccounts,
                        precision,
                    })
                );
            } catch (error) {
                console.error('~~ Saga getStakedAccountsSaga error ~~>', error);
            }
        }
    }
}

function* fetchScotInfo() {
    const hostConfig = yield select(state =>
        state.app.get('hostConfig', Map()).toJS()
    );
    const scotTokenSymbol = hostConfig['LIQUID_TOKEN_UPPERCASE'];
    const scotInfo = yield call(getScotDataAsync, 'info', {
        token: scotTokenSymbol,
    });
    yield put(appActions.receiveScotInfo(fromJS(scotInfo)));
}

function* fetchFollows(action) {
    yield loadFollows(
        action.payload.method,
        action.payload.account,
        action.payload.type,
        action.payload.useHive
    );
}

function* fetchAuthorRecentPosts(action) {
    const {
        order,
        category,
        author,
        permlink,
        limit,
    } = action.payload;

    const scotTokenSymbol = yield select(state =>
        state.app.getIn(['hostConfig', 'LIQUID_TOKEN_UPPERCASE'])
    );

    const call_name = 'get_discussions_by_blog';
    const args = {
        tag: author,
        token: scotTokenSymbol,
        limit: limit + 1,
    };
    try {
        const feedData = yield call(getScotDataAsync, call_name, args);
        const data = feedData
            .filter(item => item.permlink !== permlink)
            .map(item => ({
                ...item,
                body: item.desc,
                body_length: item.desc.length + 1,
                category: item.tags.split(',')[0],
                replies: [], // intentional
            }));

        yield put(
            globalActions.receiveAuthorRecentPosts({
                data,
                order,
                category,
            })
        );
    } catch (error) {
        console.error('~~ Saga fetchData error ~~>', call_name, args, error);
    }
}

// Action creators
export const actions = {
    listCommunities: payload => ({
        type: LIST_COMMUNITIES,
        payload,
    }),

    getCommunity: payload => {
        return {
            type: GET_COMMUNITY,
            payload,
        };
    },

    getSubscriptions: payload => ({
        type: GET_SUBSCRIPTIONS,
        payload,
    }),

    getAccountNotifications: payload => ({
        type: GET_ACCOUNT_NOTIFICATIONS,
        payload,
    }),

    getUnreadAccountNotifications: payload => ({
        type: GET_UNREAD_ACCOUNT_NOTIFICATIONS,
        payload,
    }),

    markNotificationsAsRead: payload => ({
        type: MARK_NOTIFICATIONS_AS_READ,
        payload,
    }),

    requestData: payload => ({
        type: REQUEST_DATA,
        payload,
    }),

    getPostHeader: payload => ({
        type: GET_POST_HEADER,
        payload,
    }),

    fetchState: payload => ({
        type: FETCH_STATE,
        payload,
    }),

    fetchScotInfo: payload => ({
        type: FETCH_SCOT_INFO,
        payload,
    }),

    fetchFollows: payload => ({
        type: FETCH_FOLLOWS,
        payload,
    }),

    fetchAuthorRecentPosts: payload => ({
        type: FETCH_AUTHOR_RECENT_POSTS,
        payload,
    }),

    getRewardsData: payload => ({
        type: GET_REWARDS_DATA,
        payload,
    }),

    getStakedAccounts: payload => ({
        type: GET_STAKED_ACCOUNTS,
        payload,
    }),
    
    getCategories: payload => ({
        type: GET_CATEGORIES,
        payload,
    }),
};
