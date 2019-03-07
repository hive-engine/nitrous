import {
    call,
    put,
    select,
    fork,
    takeLatest,
    takeEvery,
} from 'redux-saga/effects';
import { api } from '@steemit/steem-js';
import { loadFollows } from 'app/redux/FollowSaga';
import * as globalActions from './GlobalReducer';
import * as appActions from './AppReducer';
import constants from './constants';
import { fromJS, Map, Set } from 'immutable';
import { getStateAsync } from 'app/utils/steemApi';

const REQUEST_DATA = 'fetchDataSaga/REQUEST_DATA';
const GET_CONTENT = 'fetchDataSaga/GET_CONTENT';
const FETCH_STATE = 'fetchDataSaga/FETCH_STATE';

export const fetchDataWatches = [
    takeLatest('@@router/LOCATION_CHANGE', fetchState),
    takeLatest(FETCH_STATE, fetchState),
    takeEvery('global/FETCH_JSON', fetchJson),
];

let is_initial_state = true;
export function* fetchState(location_change_action) {
    const { pathname } = location_change_action.payload;
    const m = pathname.match(/^\/@([a-z0-9\.-]+)/);
    if (m && m.length === 2) {
        const username = m[1];
        yield fork(loadFollows, username, 'blog');
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
    if (url === '/') {
        return;
    }

    // Replace /curation-rewards and /author-rewards with /transfers for UserProfile
    // to resolve data correctly
    if (url.indexOf('/curation-rewards') !== -1)
        url = url.replace(/\/curation-rewards$/, '/transfers');
    if (url.indexOf('/author-rewards') !== -1)
        url = url.replace(/\/author-rewards$/, '/transfers');
    if (url.indexOf('/permissions') !== -1)
        url = url.replace(/\/permissions$/, '/transfers');
    if (url.indexOf('/password') !== -1)
        url = url.replace(/\/password$/, '/transfers');

    yield put(appActions.fetchDataBegin());
    try {
        const state = yield call(getStateAsync, url);
        yield put(globalActions.receiveState(state));
        // If a user's transfer page is being loaded, fetch related account data.
        yield call(getTransferUsers, pathname);
    } catch (error) {
        console.error('~~ Saga fetchState error ~~>', url, error);
        yield put(appActions.steemApiError(error.message));
    }

    yield put(appActions.fetchDataEnd());
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

// Action creators
export const actions = {
    requestData: payload => ({
        type: REQUEST_DATA,
        payload,
    }),

    fetchState: payload => ({
        type: FETCH_STATE,
        payload,
    }),
};
