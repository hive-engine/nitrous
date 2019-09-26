import {
    all,
    call,
    put,
    select,
    fork,
    takeLatest,
    takeEvery,
} from 'redux-saga/effects';
import { api } from '@steemit/steem-js';
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
import { LIQUID_TOKEN_UPPERCASE } from 'app/client_config';

const REQUEST_DATA = 'fetchDataSaga/REQUEST_DATA';
const GET_CONTENT = 'fetchDataSaga/GET_CONTENT';
const FETCH_STATE = 'fetchDataSaga/FETCH_STATE';
const FETCH_SCOT_INFO = 'fetchDataSaga/FETCH_SCOT_INFO';
const FETCH_AUTHOR_RECENT_POSTS = 'fetchDataSaga/FETCH_AUTHOR_RECENT_POSTS';
const FETCH_FOLLOWS = 'fetchDataSaga/FETCH_FOLLOWS';

export const fetchDataWatches = [
    takeLatest(REQUEST_DATA, fetchData),
    takeEvery(GET_CONTENT, getContentCaller),
    takeLatest('@@router/LOCATION_CHANGE', fetchState),
    takeLatest(FETCH_STATE, fetchState),
    takeEvery('global/FETCH_JSON', fetchJson),
    takeLatest(FETCH_SCOT_INFO, fetchScotInfo),
    takeLatest(FETCH_AUTHOR_RECENT_POSTS, fetchAuthorRecentPosts),
    takeEvery(FETCH_FOLLOWS, fetchFollows),
];

export function* getContentCaller(action) {
    yield getContent(action.payload);
}

let is_initial_state = true;
export function* fetchState(location_change_action) {
    const { pathname } = location_change_action.payload;
    const m = pathname.match(/^\/@([a-z0-9\.-]+)/);
    if (m && m.length === 2) {
        const username = m[1];
        yield fork(fetchFollowCount, username);
        yield fork(loadFollows, 'getFollowersAsync', username, 'blog');
        yield fork(loadFollows, 'getFollowingAsync', username, 'blog');
    }

    if (
        pathname === '/' ||
        pathname === '' ||
        pathname.indexOf('trending') !== -1 ||
        pathname.indexOf('hot') !== -1
    ) {
        yield fork(getPromotedState, pathname);
    }

    // `ignore_fetch` case should only trigger on initial page load. No need to call
    // fetchState immediately after loading fresh state from the server. Details: #593
    const server_location = yield select(state =>
        state.offchain.get('server_location')
    );
    const ignore_fetch = pathname === server_location && is_initial_state;
    is_initial_state = false;
    if (ignore_fetch) {
        // If a user's transfer page is being loaded, fetch related account data.
        yield call(getTransferUsers, pathname);
        return;
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
        const state = yield call(getStateAsync, url);

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
export function* getPromotedState(pathname) {
    const m = pathname.match(/^\/[a-z]*\/(.*)\/?/);
    const tag = m ? m[1] : '';

    const discussions = yield select(state =>
        state.global.getIn(['discussion_idx', tag, 'promoted'])
    );

    if (discussions && discussions.size > 0) {
        return;
    }

    const state = yield call(getStateAsync, `/promoted/${tag}`);
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

    // Get pinned posts from the store.
    const pinnedPosts = yield select(state =>
        state.offchain.get('pinned_posts')
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
    const accounts = yield call([api, api.getAccountsAsync], usernames);
    yield put(globalActions.receiveAccounts({ accounts }));
}

export function* fetchData(action) {
    const { order, author, permlink, accountname, postFilter } = action.payload;
    let { category } = action.payload;
    if (!category) category = '';
    category = category.toLowerCase();

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
        call_name = 'getRepliesByLastUpdateAsync';
        args = [author, permlink, constants.FETCH_DATA_BATCH_SIZE];
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
                call_name,
                ...args
            );

            // Set next arg. Note 'by_replies' does not use same structure.
            if (lastValue && order !== 'by_replies') {
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

// export function* watchMetaRequests() {
//     yield* takeLatest('global/REQUEST_META', fetchMeta);
// }
export function* fetchMeta({ payload: { id, link } }) {
    try {
        const metaArray = yield call(
            () =>
                new Promise((resolve, reject) => {
                    function reqListener() {
                        const resp = JSON.parse(this.responseText);
                        if (resp.error) {
                            reject(resp.error);
                            return;
                        }
                        resolve(resp);
                    }
                    const oReq = new XMLHttpRequest();
                    oReq.addEventListener('load', reqListener);
                    oReq.open('GET', '/http_metadata/' + link);
                    oReq.send();
                })
        );
        const { title, metaTags } = metaArray;
        let meta = { title };
        for (let i = 0; i < metaTags.length; i++) {
            const [name, content] = metaTags[i];
            meta[name] = content;
        }
        // http://postimg.org/image/kbefrpbe9/
        meta = {
            link,
            card: meta['twitter:card'],
            site: meta['twitter:site'], // @username tribbute
            title: meta['twitter:title'],
            description: meta['twitter:description'],
            image: meta['twitter:image'],
            alt: meta['twitter:alt'],
        };
        if (!meta.image) {
            meta.image = meta['twitter:image:src'];
        }
        yield put(globalActions.receiveMeta({ id, meta }));
    } catch (error) {
        yield put(globalActions.receiveMeta({ id, meta: { error } }));
    }
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
    const scotInfo = yield call(getScotDataAsync, 'info', {
        token: LIQUID_TOKEN_UPPERCASE,
    });
    yield put(appActions.receiveScotInfo(fromJS(scotInfo)));
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

    const call_name = 'get_discussions_by_blog';
    yield put(globalActions.fetchingData({ category, order }));
    const args = [
        {
            tag: accountname,
            token: LIQUID_TOKEN_UPPERCASE,
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

function* fetchFollows(action) {
    yield loadFollows(
        action.payload.method,
        action.payload.account,
        action.payload.type
    );
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

    fetchAuthorRecentPosts: payload => ({
        type: FETCH_AUTHOR_RECENT_POSTS,
        payload,
    }),

    fetchFollows: payload => ({
        type: FETCH_FOLLOWS,
        payload,
    }),
};
