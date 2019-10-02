import { call, fork, put } from 'redux-saga/effects';
import { getStateAsync } from 'app/utils/steemApi';
import { api } from '@steemit/steem-js';
import { List, Map } from 'immutable';
import * as appActions from './AppReducer';
import * as globalActions from './GlobalReducer';
import constants from './constants';

import { fetchData, fetchState, getPromotedState } from './FetchDataSaga';

describe('FetchDataSaga', () => {
    xdescribe('should fetch multiple and filter', () => {
        let payload = {
            order: 'by_author',
            author: 'alice',
            permlink: 'hair',
            accountname: 'bob',
            postFilter: value => value.author === 'bob',
        };
        let action = {
            category: '',
            payload,
        };
        constants.FETCH_DATA_BATCH_SIZE = 2;
        const gen = fetchData(action);
        it('should signal data fetch', () => {
            const actual = gen.next().value;
            expect(actual).toEqual(
                put(
                    globalActions.fetchingData({
                        order: 'by_author',
                        category: '',
                    })
                )
            );
        });
        it('should call discussions by blog', () => {
            let actual = gen.next().value;
            expect(actual).toEqual(put(appActions.fetchDataBegin()));

            actual = gen.next().value;
            expect(actual).toEqual(
                call([api, api.getDiscussionsByBlogAsync], {
                    tag: payload.accountname,
                    limit: constants.FETCH_DATA_BATCH_SIZE,
                    start_author: payload.author,
                    start_permlink: payload.permlink,
                })
            );
        });
        it('should continue fetching data filtering 1 out', () => {
            let actual = gen.next([
                {
                    author: 'alice',
                },
                {
                    author: 'bob',
                    permlink: 'post1',
                },
            ]).value;
            expect(actual).toEqual(
                put(
                    globalActions.receiveData({
                        data: [
                            { author: 'alice' },
                            { author: 'bob', permlink: 'post1' },
                        ],
                        order: 'by_author',
                        category: '',
                        author: 'alice',
                        firstPermlink: payload.permlink,
                        accountname: 'bob',
                        fetching: true,
                        endOfData: false,
                    })
                )
            );
        });
        it('should finish fetching data filtering 1 out', () => {
            let actual = gen.next().value;
            expect(actual).toEqual(
                call([api, api.getDiscussionsByBlogAsync], {
                    tag: payload.accountname,
                    limit: constants.FETCH_DATA_BATCH_SIZE,
                    start_author: 'bob',
                    start_permlink: 'post1',
                })
            );

            actual = gen.next([
                {
                    author: 'bob',
                    permlink: 'post2',
                },
            ]).value;
            expect(actual).toEqual(
                put(
                    globalActions.receiveData({
                        data: [{ author: 'bob', permlink: 'post2' }],
                        order: 'by_author',
                        category: '',
                        author: 'alice',
                        firstPermlink: payload.permlink,
                        accountname: 'bob',
                        fetching: false,
                        endOfData: true,
                    })
                )
            );

            actual = gen.next().value;
            expect(actual).toEqual(put(appActions.fetchDataEnd()));
        });
    });
    xdescribe('should not fetch more batches than max batch size', () => {
        let payload = {
            order: 'by_author',
            author: 'alice',
            permlink: 'hair',
            accountname: 'bob',
            postFilter: value => value.author === 'bob',
        };
        let action = {
            category: '',
            payload,
        };
        constants.FETCH_DATA_BATCH_SIZE = 2;
        constants.MAX_BATCHES = 2;
        const gen = fetchData(action);

        let actual = gen.next().value;
        expect(actual).toEqual(
            put(
                globalActions.fetchingData({
                    order: 'by_author',
                    category: '',
                })
            )
        );

        actual = gen.next().value;
        expect(actual).toEqual(put(appActions.fetchDataBegin()));

        actual = gen.next().value;
        expect(actual).toEqual(
            call([api, api.getDiscussionsByBlogAsync], {
                tag: payload.accountname,
                limit: constants.FETCH_DATA_BATCH_SIZE,
                start_author: payload.author,
                start_permlink: payload.permlink,
            })
        );

        // these all will not satisfy the filter
        actual = gen.next([
            {
                author: 'alice',
            },
            {
                author: 'alice',
            },
        ]).value;
        expect(actual).toEqual(
            put(
                globalActions.receiveData({
                    data: [{ author: 'alice' }, { author: 'alice' }],
                    order: 'by_author',
                    category: '',
                    author: 'alice',
                    firstPermlink: payload.permlink,
                    accountname: 'bob',
                    fetching: true,
                    endOfData: false,
                })
            )
        );

        actual = gen.next().value;
        expect(actual).toEqual(
            call([api, api.getDiscussionsByBlogAsync], {
                tag: payload.accountname,
                limit: constants.FETCH_DATA_BATCH_SIZE,
                start_author: 'alice',
            })
        );

        actual = gen.next([
            {
                author: 'alice',
            },
            {
                author: 'alice',
            },
        ]).value;
        expect(actual).toEqual(
            put(
                globalActions.receiveData({
                    data: [{ author: 'alice' }, { author: 'alice' }],
                    order: 'by_author',
                    category: '',
                    author: 'alice',
                    firstPermlink: payload.permlink,
                    accountname: 'bob',
                    fetching: false,
                    endOfData: false,
                })
            )
        );

        actual = gen.next().value;
        expect(actual).toEqual(put(appActions.fetchDataEnd()));
    });
});

describe('fetchState', () => {
    it('trending should get promoted state', () => {
        const pathname = '/trending';
        const generator = fetchState({ payload: { pathname } });

        const mockStore = {
            app: Map({}),
        };
        mockStore.app = mockStore.app.setIn(
            ['hostConfig', 'LIQUID_TOKEN_UPPERCASE'],
            'TEST'
        );
        const selectSymbol = generator.next().value;
        expect(selectSymbol.SELECT.selector(mockStore)).toEqual('TEST');
        let next = generator.next('TEST');
        expect(next.value).toEqual(fork(getPromotedState, pathname, 'TEST'));
    });

    it('hot should get promoted state', () => {
        const pathname = '/hot';
        const generator = fetchState({ payload: { pathname } });
        const mockStore = {
            app: Map({}),
        };
        mockStore.app = mockStore.app.setIn(
            ['hostConfig', 'LIQUID_TOKEN_UPPERCASE'],
            'TEST'
        );
        const selectSymbol = generator.next().value;
        expect(selectSymbol.SELECT.selector(mockStore)).toEqual('TEST');
        let next = generator.next('TEST');
        expect(next.value).toEqual(fork(getPromotedState, pathname, 'TEST'));
    });
});

describe('getPromotedState', () => {
    it('should do nothing if already fetched', () => {
        const pathname = '/trending';
        const generator = getPromotedState(pathname);

        const mockStore = {
            global: Map({}),
        };
        mockStore.global = mockStore.global.setIn(
            ['discussion_idx', '', 'promoted'],
            List(['post1'])
        );
        const selectAction = generator.next().value;
        expect(selectAction.SELECT.selector(mockStore)).toEqual(
            List(['post1'])
        );

        // continue saga with fetched data
        expect(generator.next(List(['post1'])).done).toBe(true);
    });
    it('should call api if not fetched', () => {
        const pathname = '/trending';
        const generator = getPromotedState(pathname, 'TEST');

        generator.next(); // SELECT
        // continue with empty data
        const callAction = generator.next();
        expect(callAction.value).toEqual(
            call(getStateAsync, '/promoted/', 'TEST')
        );
        const mockState = {};
        const putAction = generator.next(mockState);
        expect(putAction.value.PUT.action).toEqual(
            globalActions.receiveState(mockState)
        );
    });
    it('should call api with tag', () => {
        const pathname = '/hot/food';
        const generator = getPromotedState(pathname, 'TEST');

        const mockStore = {
            global: Map({}),
        };
        mockStore.global = mockStore.global.setIn(
            ['discussion_idx', 'food', 'promoted'],
            List(['food2'])
        );
        const selectAction = generator.next().value;
        expect(selectAction.SELECT.selector(mockStore)).toEqual(
            List(['food2'])
        );

        // continue saga with empty data instead of mocked value
        const callAction = generator.next();
        expect(callAction.value).toEqual(
            call(getStateAsync, '/promoted/food', 'TEST')
        );
        const mockState = {};
        const putAction = generator.next(mockState);
        expect(putAction.value.PUT.action).toEqual(
            globalActions.receiveState(mockState)
        );
    });
});
