import {
    all,
    call,
    put,
    select,
    fork,
    takeLatest,
    takeEvery,
} from 'redux-saga/effects';
import { api as hiveApi } from 'steem';
import { api as steemApi } from '@steemit/steem-js';
import { loadFollows, fetchFollowCount } from 'app/redux/FollowSaga';
import { getContent } from 'app/redux/SagaShared';
import * as globalActions from './GlobalReducer';
import * as appActions from './AppReducer';
import constants from './constants';
import { fromJS, Map, Set } from 'immutable';
import {
    fetchFeedDataAsync,
    getStateAsync,
    getScotDataAsync,
} from 'app/utils/steemApi';

const REQUEST_DATA = 'fetchDataSaga/REQUEST_DATA';
const GET_CONTENT = 'fetchDataSaga/GET_CONTENT';
const FETCH_STATE = 'fetchDataSaga/FETCH_STATE';
const FETCH_SCOT_INFO = 'fetchDataSaga/FETCH_SCOT_INFO';
const FETCH_FOLLOWS = 'fetchDataSaga/FETCH_FOLLOWS';
const FETCH_AUTHOR_RECENT_POSTS = 'fetchDataSaga/FETCH_AUTHOR_RECENT_POSTS';

export const fetchDataWatches = [
    takeLatest(REQUEST_DATA, fetchData),
    takeEvery(GET_CONTENT, getContentCaller),
    takeLatest('@@router/LOCATION_CHANGE', fetchState),
    takeLatest(FETCH_STATE, fetchState),
    takeEvery('global/FETCH_JSON', fetchJson),
    takeLatest(FETCH_SCOT_INFO, fetchScotInfo),
    takeEvery(FETCH_FOLLOWS, fetchFollows),
    takeLatest(FETCH_AUTHOR_RECENT_POSTS, fetchAuthorRecentPosts),
];

export function* getContentCaller(action) {
    yield getContent(action.payload);
}

let is_initial_state = true;
export function* fetchState(location_change_action) {
    const { pathname } = location_change_action.payload;
    const m = pathname.match(/^\/@([a-z0-9\.-]+)/);
    const hostConfig = yield select(state =>
        state.app.get('hostConfig', Map()).toJS()
    );
    if (m && m.length === 2) {
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
    if (url === '/') url = `/trending`;
    // Replace /curation-rewards and /author-rewards with /transfers for UserProfile
    // to resolve data correctly
    if (url.indexOf('/curation-rewards') !== -1)
        url = url.replace('/curation-rewards', '/transfers');
    if (url.indexOf('/author-rewards') !== -1)
        url = url.replace('/author-rewards', '/transfers');

    yield put(appActions.fetchDataBegin());
    try {
        // handle trending/hot/promoted feeds differently.
        const state = yield call(getStateAsync, url, hostConfig);

        yield put(globalActions.receiveState(state));
        yield call(fetchScotInfo);
        yield call(syncPinnedPosts);
        // If a user's transfer page is being loaded, fetch related account data.
        yield call(getTransferUsers, pathname);
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

    const state = yield call(getStateAsync, `/promoted/${tag}`, hostConfig);
    yield put(globalActions.receiveState(state));
}

/**
 * Get transfer-related usernames from history and fetch their account data.
 *
 * @param {String} pathname
 */

function* getTransferUsers(pathname) {
    if (pathname.match(/^\/@([a-z0-9\.-]+)\/transfers/)) {
        const username = pathname.match(/^\/@([a-z0-9\.-]+)/)[1];

        const transferHistory = yield select(state =>
            state.global.getIn(['accounts', username, 'transfer_history'])
        );

        // Find users in the transfer history to consider sending users' reputations.
        const transferUsers = transferHistory.reduce((acc, cur) => {
            if (cur.getIn([1, 'op', 0]) === 'transfer') {
                const { from, to } = cur.getIn([1, 'op', 1]).toJS();
                return acc.add(from);
            }
            return acc;
            // Ensure current user is included in this list, even if they don't have transfer history.
            // This ensures their reputation is updated - fixes #2306
        }, new Set([username]));

        yield call(getAccounts, transferUsers);
    }
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
 * Request account data for a set of usernames.
 *
 * @todo batch the put()s
 *
 * @param {Iterable} usernames
 */
function* getAccounts(usernames) {
    const useHive = yield select(state =>
        state.app.getIn(['hostConfig', 'HIVE_ENGINE'])
    );
    const api = useHive ? hiveApi : steemApi;
    const accounts = yield call([api, api.getAccountsAsync], usernames);
    yield put(globalActions.receiveAccounts({ accounts }));
}

export function* fetchData(action) {
    const {
        order,
        author,
        permlink,
        accountname,
        postFilter,
        useHive,
    } = action.payload;
    let { category } = action.payload;
    if (!category) category = '';
    category = category.toLowerCase();

    const hostConfig = yield select(state =>
        state.app.get('hostConfig', Map()).toJS()
    );
    yield put(globalActions.fetchingData({ order, category }));
    let call_name, args;
    if (order === 'trending') {
        call_name = 'getDiscussionsByTrendingAsync';
        args = [
            {
                tag: category,
                limit: constants.FETCH_DATA_BATCH_SIZE,
                start_author: author,
                start_permlink: permlink,
            },
        ];
    } else if (order === 'hot') {
        call_name = 'getDiscussionsByHotAsync';
        args = [
            {
                tag: category,
                limit: constants.FETCH_DATA_BATCH_SIZE,
                start_author: author,
                start_permlink: permlink,
            },
        ];
    } else if (order === 'promoted') {
        call_name = 'getDiscussionsByPromotedAsync';
        args = [
            {
                tag: category,
                limit: constants.FETCH_DATA_BATCH_SIZE,
                start_author: author,
                start_permlink: permlink,
            },
        ];
    } else if (order === 'payout') {
        call_name = 'getPostDiscussionsByPayoutAsync';
        args = [
            {
                tag: category,
                limit: constants.FETCH_DATA_BATCH_SIZE,
                start_author: author,
                start_permlink: permlink,
            },
        ];
    } else if (order === 'payout_comments') {
        call_name = 'getCommentDiscussionsByPayoutAsync';
        args = [
            {
                tag: category,
                limit: constants.FETCH_DATA_BATCH_SIZE,
                start_author: author,
                start_permlink: permlink,
            },
        ];
    } else if (order === 'created') {
        call_name = 'getDiscussionsByCreatedAsync';
        args = [
            {
                tag: category,
                limit: constants.FETCH_DATA_BATCH_SIZE,
                start_author: author,
                start_permlink: permlink,
            },
        ];
    } else if (order === 'by_replies') {
        call_name = 'getDiscussionsByRepliesAsync';
        args = [
            {
                tag: author,
                limit: constants.FETCH_DATA_BATCH_SIZE,
                start_author: author,
                start_permlink: permlink,
            },
        ];
    } else if (order === 'by_feed') {
        // https://github.com/steemit/steem/issues/249
        call_name = 'getDiscussionsByFeedAsync';
        args = [
            {
                tag: accountname,
                limit: constants.FETCH_DATA_BATCH_SIZE,
                start_author: author,
                start_permlink: permlink,
            },
        ];
    } else if (order === 'by_author') {
        call_name = 'getDiscussionsByBlogAsync';
        args = [
            {
                tag: accountname,
                limit: constants.FETCH_DATA_BATCH_SIZE,
                start_author: author,
                start_permlink: permlink,
            },
        ];
    } else if (order === 'by_comments') {
        call_name = 'getDiscussionsByCommentsAsync';
        args = [
            {
                tag: author,
                limit: constants.FETCH_DATA_BATCH_SIZE,
                start_author: author,
                start_permlink: permlink,
            },
        ];
    } else {
        // this should never happen. undefined behavior
        call_name = 'getDiscussionsByTrendingAsync';
        args = [{ limit: constants.FETCH_DATA_BATCH_SIZE }];
    }
    yield put(appActions.fetchDataBegin());
    try {
        const firstPermlink = permlink;
        let fetched = 0;
        let endOfData = false;
        let fetchLimitReached = false;
        let fetchDone = false;
        let batch = 0;
        while (!fetchDone) {
            let { feedData, endOfData, lastValue } = yield call(
                fetchFeedDataAsync,
                useHive,
                call_name,
                hostConfig,
                ...args
            );

            if (lastValue) {
                args[0].start_author = lastValue.author;
                args[0].start_permlink = lastValue.permlink;
            }

            batch++;
            fetchLimitReached = batch >= constants.MAX_BATCHES;

            // Still return all data but only count ones matching the filter.
            // Rely on UI to actually hide the posts.
            fetched += postFilter
                ? feedData.filter(postFilter).length
                : feedData.length;

            fetchDone =
                endOfData ||
                fetchLimitReached ||
                fetched >= constants.FETCH_DATA_BATCH_SIZE;

            yield put(
                globalActions.receiveData({
                    data: feedData,
                    order,
                    category,
                    author,
                    firstPermlink,
                    accountname,
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
        accountname,
        postFilter,
        limit,
    } = action.payload;

    const scotTokenSymbol = yield select(state =>
        state.app.getIn(['hostConfig', 'LIQUID_TOKEN_UPPERCASE'])
    );

    const call_name = 'get_discussions_by_blog';
    yield put(globalActions.fetchingData({ category, order }));
    const args = [
        {
            tag: accountname,
            token: scotTokenSymbol,
            limit: limit + 1,
        },
    ];
    yield put(appActions.fetchDataBegin());
    try {
        const firstPermlink = permlink;
        let fetched = 0;
        let fetchLimitReached = false;
        let fetchDone = false;
        let batch = 0;
        let lastValue;
        let endOfData;
        while (!fetchDone) {
            const feedData = yield call(getScotDataAsync, call_name, ...args);

            endOfData = feedData.length < limit;
            lastValue =
                feedData.length > 0 ? feedData[feedData.length - 1] : null;

            // Set next arg.
            args[0].start_author = lastValue.author;
            args[0].start_permlink = lastValue.permlink;

            batch += 1;
            fetchLimitReached = batch >= constants.MAX_BATCHES;

            // Still return all data but only count ones matching the filter.
            // Rely on UI to actually hide the posts.
            fetched += postFilter
                ? feedData.filter(postFilter).length
                : feedData.length;

            fetchDone = fetchLimitReached || fetched >= limit;

            let data = postFilter ? feedData.filter(postFilter) : feedData;
            if (fetchDone && fetched > limit) {
                data = data.slice(0, limit - (fetched - data.length));
            }
            data = data.map(item => ({
                ...item,
                body: item.desc,
                body_length: item.desc.length,
                category: item.tags.split(',')[0],
                replies: [], // intentional
            }));

            yield put(
                globalActions.receiveAuthorRecentPosts({
                    data,
                    order,
                    category,
                    author,
                    firstPermlink,
                    accountname,
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

// Action creators
export const actions = {
    requestData: payload => ({
        type: REQUEST_DATA,
        payload,
    }),

    getContent: payload => ({
        type: GET_CONTENT,
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
};
