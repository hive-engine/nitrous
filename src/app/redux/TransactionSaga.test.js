/* global describe, it, before, beforeEach, after, afterEach */

import { call, select, all, takeEvery } from 'redux-saga/effects';
import steem, { api, broadcast } from '@steemit/steem-js';
import { cloneableGenerator } from 'redux-saga/utils';
import * as transactionActions from 'app/redux/TransactionReducer';
import {
    preBroadcast_comment,
    createPatch,
    recoverAccount,
    preBroadcast_transfer,
    transactionWatches,
    broadcastOperation,
    updateAuthorities,
} from './TransactionSaga';
import { DEBT_TICKER } from 'app/client_config';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

const operation = {
    type: 'comment',
    author: 'Alice',
    body:
        "The Body is a pretty long chunck of text that represents the user's voice, it seems they have much to say, and this is one place where they can do that.",
    category: 'hi',
    json_metadata: {
        tags: ['hi'],
        app: 'steemit/0.1',
        format: 'markdown',
    },
    parent_author: 'candide',
    parent_permlink: 'cool',
    title: 'test',
    __config: {},
    errorCallback: () => '',
    successCallback: () => '',
    memo: '#testing',
};

const username = 'Beatrice';

describe('TransactionSaga', () => {
    describe('watch user actions and trigger appropriate saga', () => {
        const gen = transactionWatches;
        it('should call the broadcastOperation saga with every transactionActions.BROADCAST_OPERATION action', () => {
            expect(gen).toEqual([
                takeEvery(
                    transactionActions.BROADCAST_OPERATION,
                    broadcastOperation
                ),
                takeEvery(
                    transactionActions.UPDATE_AUTHORITIES,
                    updateAuthorities
                ),
                takeEvery(transactionActions.RECOVER_ACCOUNT, recoverAccount),
            ]);
        });
    });

    describe('recoverAccount', () => {
        const gen = cloneableGenerator(recoverAccount)({
            payload: {
                account_to_recover: 'one',
                old_password: 'two34567',
                new_password: 'two34567',
                onError: () => 'error!',
                onSuccess: () => 'success!',
            },
        });
        it('should call getAccountsAsync with account_to_recover username as argument', () => {
            const actual = gen.next([{ id: 123, name: 'one' }]).value;
            const mockCall = call([api, api.getAccountsAsync], ['one']);
            expect(actual).toEqual(mockCall);
        });
        it('should call sendAsync with recover_account operation', () => {
            const actual = gen.next([{ id: 123, name: 'one' }]).value;
            const mockCall = broadcast.sendAsync(
                {
                    extensions: [],
                    operations: [
                        [
                            'recover_account',
                            {
                                account_to_recover: 'one',
                                new_owner_authority: 'idk',
                                recent_owner_authority: 'something',
                            },
                        ],
                    ],
                },
                ['123', '345']
            );
            expect(actual).toEqual(mockCall);
        });
        it('should call sendAsync with account_update operation', () => {
            const actual = gen.next().value;
            const mockCall = broadcast.sendAsync(
                {
                    extensions: [],
                    operations: [
                        [
                            'account_update',
                            {
                                account_to_recover: 'one',
                                new_owner_authority: 'idk',
                                recent_owner_authority: 'something',

                                account: 'one',
                                active: {
                                    weight_threshold: 1,
                                    account_auths: [],
                                    key_auths: [['newactive', 1]],
                                },
                                posting: {
                                    weight_threshold: 1,
                                    account_auths: [],
                                    key_auths: [['newposting', 1]],
                                },
                                memo_key: 'newmemo',
                            },
                        ],
                    ],
                },
                ['newownerprivate']
            );
            expect(actual).toEqual(mockCall);
        });
        it('should call getWithdrawRoutes with account name and outgoing as parameters', () => {
            const noAutoVests = gen.clone();
            const actual = noAutoVests.next().value;
            const mockCall = call(
                [api, api.getWithdrawRoutes],
                ['one', 'outgoing']
            );
            expect(actual).toEqual(mockCall);
            const done = noAutoVests.next().done;
            expect(done).toBe(true);
        });
        it('should call getWithdrawRoutes with account name and outgoing as parameters, and be done if none are found', () => {
            const noAutoVests = gen.clone();
            const actual = noAutoVests.next().value;
            const mockCall = call(
                [api, api.getWithdrawRoutes],
                ['one', 'outgoing']
            );
            expect(actual).toEqual(mockCall);
            const done = noAutoVests.next().done;
            expect(done).toBe(true);
        });
        it('should call getWithdrawRoutes with account name and outgoing as parameters, and reset all outgoing auto vesting routes to 0.', () => {
            const withAutoVests = gen.clone();
            withAutoVests.next([{ from_account: 'one', to_account: 'two' }])
                .value;
            const actual = withAutoVests.next([
                { from_account: 'one', to_account: 'two' },
            ]).value;
            const mockCall = all([
                call(
                    [broadcast, broadcast.setWithdrawVestingRoute],
                    [
                        'STM7UbRctdfcdBU6rMBEX5yPjWaR68xmq6buCkotR7RVEJHYWt1Jb',
                        'one',
                        'two',
                        0,
                        true,
                    ]
                ),
            ]);
            expect(actual).toEqual(mockCall);
        });
    });

    describe('createPatch', () => {
        it('should return undefined if empty arguments are passed', () => {
            const actual = createPatch('', '');
            expect(actual).toEqual(undefined);
        });
        it('should return the patch that reconciles two different strings', () => {
            const testString =
                'there is something interesting going on here that I do not fully understand it is seemingly complex but it is actually quite simple';
            const actual = createPatch(testString, testString + 'ILU');
            expect(actual).toEqual(
                '@@ -120,12 +120,15 @@\n quite simple\n+ILU\n'
            );
        });
    });

    describe('preBroadcast_transfer', () => {
        const operationSansMemo = {
            ...operation,
            memo: undefined,
        };
        const arg = { operation: operationSansMemo };
        it('should return select object if it has a memo attribute with string value starting with #', () => {
            const genR = preBroadcast_transfer({ operation });
            const actual = genR.next().value;
            const expected = select(state =>
                state.user.getIn(['current', 'private_keys', 'memo_private'])
            );
            expect(Object.keys(actual)).toEqual(['@@redux-saga/IO', 'SELECT']);
        });
        it('should return the operation unchanged if it has no memo attribute', () => {
            let gen = preBroadcast_transfer(arg);
            const actual = gen.next().value;
            expect(actual).toEqual(operationSansMemo);
        });
    });
});
