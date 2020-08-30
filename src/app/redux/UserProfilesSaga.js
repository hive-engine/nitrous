import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as userProfileActions from './UserProfilesReducer';
import { getAccount, getWalletAccount } from 'app/utils/steemApi';

const FETCH_PROFILE = 'userProfilesSaga/FETCH_PROFILE';
const FETCH_WALLET_PROFILE = 'userProfilesSaga/FETCH_WALLET_PROFILE';

export const userProfilesWatches = [
    takeLatest(FETCH_PROFILE, fetchUserProfile),
    takeLatest(FETCH_WALLET_PROFILE, fetchWalletUserProfile),
];

export function* fetchUserProfile(action) {
    const { account, observer } = action.payload;
    const ret = yield call(getAccount, account, true);
    if (!ret) throw new Error('Account not found');
    yield put(
        userProfileActions.addProfile({ username: account, account: ret })
    );
}

export function* fetchWalletUserProfile(action) {
    const { account } = action.payload;
    const scotTokenSymbol = yield select(state =>
        state.app.getIn(['hostConfig', 'LIQUID_TOKEN_UPPERCASE'])
    );
    const useHive = yield select(state =>
        state.app.getIn(['hostConfig', 'HIVE_ENGINE'])
    );
    const ret = yield call(getWalletAccount, account, useHive, scotTokenSymbol);
    if (!ret) throw new Error('Account not found');
    yield put(
        userProfileActions.addProfile({ username: account, account: ret })
    );
}

// Action creators
export const actions = {
    fetchProfile: payload => ({
        type: FETCH_PROFILE,
        payload,
    }),
    fetchWalletProfile: payload => ({
        type: FETCH_WALLET_PROFILE,
        payload,
    }),
};
