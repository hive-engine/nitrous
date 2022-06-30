import { fromJS, Map, Set, OrderedSet } from 'immutable';
import { call, put, select } from 'redux-saga/effects';
import { getScotDataAsync } from 'app/utils/steemApi';

import * as globalActions from 'app/redux/GlobalReducer';

/**
    This loadFollows both 'blog' and 'ignore'
*/

//fetch for follow/following count
export function* fetchFollowCount(account, useHive) {
    const counts = yield call(getScotDataAsync, 'get_follow_count', {
        account,
        hive: useHive,
    });
    yield put(
        globalActions.update({
            key: ['follow_count', account],
            updater: m =>
                m.mergeDeep({
                    follower_count: counts.follower_count,
                    following_count: counts.following_count,
                }),
        })
    );
}

// Test limit with 2 (not 1, infinate looping)
export function* loadFollows(method, account, type, useHive, force = false) {
    if (
        yield select(state =>
            state.global.getIn(['follow', method, account, type + '_loading'])
        )
    ) {
        return; //already loading
    }

    if (!force) {
        const hasResult = yield select(state =>
            state.global.hasIn(['follow', method, account, type + '_result'])
        );
        if (hasResult) {
            return; //already loaded
        }
    }

    yield put(
        globalActions.update({
            key: ['follow', method, account],
            notSet: Map(),
            updater: m => m.set(type + '_loading', true),
        })
    );

    yield loadFollowsLoop(method, account, type, useHive);
}

function* loadFollowsLoop(
    method,
    account,
    type,
    useHive,
    start = '',
    limit = 1000
) {
    const params = { account, start, status: type, limit };
    if (method === 'getFollowingAsync') {
        params['follower'] = account;
    } else {
        params['following'] = account;
    }
    if (useHive) {
        //params['hive'] = '1';
    }
    const res = fromJS(yield call(getScotDataAsync, 'get_following', params));
    // console.log('res.toJS()', res.toJS())

    let cnt = 0;
    let lastAccountName = null;

    yield put(
        globalActions.update({
            key: ['follow_inprogress', method, account],
            notSet: Map(),
            updater: m => {
                m = m.asMutable();
                res.forEach(value => {
                    cnt += 1;

                    const accountNameKey =
                        method === 'getFollowingAsync'
                            ? 'following'
                            : 'follower';
                    const accountName = (lastAccountName = value.get(
                        accountNameKey
                    ));
                    m.update(type, OrderedSet(), s => s.add(accountName));
                });
                return m.asImmutable();
            },
        })
    );

    if (cnt === limit) {
        // This is paging each block of up to limit results
        yield call(
            loadFollowsLoop,
            method,
            account,
            type,
            useHive,
            lastAccountName
        );
    } else {
        // This condition happens only once at the very end of the list.
        // Every account has a different followers and following list for: blog, ignore
        yield put(
            globalActions.update({
                key: [],
                updater: m => {
                    m = m.asMutable();

                    const result = m.getIn(
                        ['follow_inprogress', method, account, type],
                        OrderedSet()
                    );
                    m.deleteIn(['follow_inprogress', method, account, type]);
                    m.updateIn(['follow', method, account], Map(), mm =>
                        mm.merge({
                            // Count may be set separately without loading the full xxx_result set
                            [type + '_count']: result.size,
                            [type + '_result']: result.reverse(),
                            [type + '_loading']: false,
                        })
                    );
                    return m.asImmutable();
                },
            })
        );
    }
}
