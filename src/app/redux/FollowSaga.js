import { fromJS, Map, Set, OrderedSet } from 'immutable';
import { call, put, select } from 'redux-saga/effects';
import { api } from '@steemit/steem-js';

import * as globalActions from 'app/redux/GlobalReducer';

/**
    This loadFollows both 'blog' and 'ignore'
*/

// Test limit with 2 (not 1, infinate looping)
export function* loadFollows(account, type, force = false) {
    if (
        yield select(state =>
            state.global.getIn([
                'follow',
                'getFollowingAsync',
                account,
                type + '_loading',
            ])
        )
    ) {
        return;
    }

    if (!force) {
        const hasResult = yield select(state =>
            state.global.hasIn([
                'follow',
                'getFollowingAsync',
                account,
                type + '_result',
            ])
        );
        if (hasResult) {
            return;
        }
    }

    yield put(
        globalActions.update({
            key: ['follow', 'getFollowingAsync', account],
            notSet: Map(),
            updater: m => m.set(type + '_loading', true),
        })
    );

    yield loadFollowsLoop(account, type);
}

function* loadFollowsLoop(account, type, start = '', limit = 1000) {
    const res = fromJS(
        yield api.getFollowingAsync(account, start, type, limit)
    );
    let cnt = 0;
    let lastAccountName = null;

    yield put(
        globalActions.update({
            key: ['follow_inprogress', 'getFollowingAsync', account],
            notSet: Map(),
            updater: m => {
                m = m.asMutable();
                res.forEach(value => {
                    cnt += 1;

                    const whatList = value.get('what');
                    const accountNameKey = 'following';
                    const accountName = (lastAccountName = value.get(
                        'following'
                    ));
                    whatList.forEach(what => {
                        //currently this is always true: what === type
                        m.update(what, OrderedSet(), s => s.add(accountName));
                    });
                });
                return m.asImmutable();
            },
        })
    );

    if (cnt === limit) {
        // This is paging each block of up to limit results
        yield call(loadFollowsLoop, account, type, lastAccountName);
    } else {
        // This condition happens only once at the very end of the list.
        // Every account has a different followers and following list for: blog, ignore
        yield put(
            globalActions.update({
                key: [],
                updater: m => {
                    m = m.asMutable();

                    const result = m.getIn(
                        [
                            'follow_inprogress',
                            'getFollowingAsync',
                            account,
                            type,
                        ],
                        OrderedSet()
                    );
                    m.deleteIn([
                        'follow_inprogress',
                        'getFollowingAsync',
                        account,
                        type,
                    ]);
                    m.updateIn(
                        ['follow', 'getFollowingAsync', account],
                        Map(),
                        mm =>
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
