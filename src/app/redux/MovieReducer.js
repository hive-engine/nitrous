import { List } from 'immutable';
import { LIST_MAX_SIZE } from 'shared/constants';

export const REQUEST_MOVIES = 'movie/REQUEST_MOVIES';
const RECEIVE_MOVIES = 'movie/RECEIVE_MOVIES';
const REQUEST_MOVIES_END = 'movie/REQUEST_MOVIES_END';

export const REQUEST_REVIEWS = 'movie/REQUEST_REVIEWS';
const RECEIVE_REVIEWS = 'movie/RECEIVE_REVIEWS';
const REQUEST_REVIEWS_END = 'movie/REQUEST_REVIEWS_END';

export const UPDATE_MOVIES = 'movie/UPDATE_MOVIES';
const RECEIVE_UPDATE_MOVIES = 'movie/RECEIVE_UPDATE_MOVIES';

export const defaultState = { loading: false, hasNextList: false };

export default function reducer(state = defaultState, action = {}) {
    const payload = action.payload;

    switch (action.type) {
        case REQUEST_MOVIES:
        case REQUEST_REVIEWS:
            return state.set('loading', true);
        case RECEIVE_MOVIES:
            return state
                .update('movies', list => list.concat(payload.data))
                .set('hasNextList', payload.data.length == LIST_MAX_SIZE);
        case RECEIVE_REVIEWS:
            return state
                .update('reviews', list => list.concat(payload.data))
                .set('hasNextList', payload.data.length == LIST_MAX_SIZE);
        case RECEIVE_UPDATE_MOVIES:
            return state
                .set('movies', List(payload.data))
                .set('hasNextList', payload.data.length == LIST_MAX_SIZE);
        case REQUEST_MOVIES_END:
        case REQUEST_REVIEWS_END:
            return state.set('loading', false);
        default:
            return state;
    }
}

export const actions = {
    requestMovies: payload => ({
        type: REQUEST_MOVIES,
        payload,
    }),

    receiveMovies: payload => ({
        type: RECEIVE_MOVIES,
        payload,
    }),

    requestMoviesEnd: () => ({
        type: REQUEST_MOVIES_END,
    }),

    updateMovies: payload => ({
        type: UPDATE_MOVIES,
        payload,
    }),

    receiveUpdateMovies: payload => ({
        type: RECEIVE_UPDATE_MOVIES,
        payload,
    }),

    requestReviews: payload => ({
        type: REQUEST_REVIEWS,
        payload,
    }),

    receiveReviews: payload => ({
        type: RECEIVE_REVIEWS,
        payload,
    }),

    requestReviewsEnd: () => ({
        type: REQUEST_REVIEWS_END,
    }),
};
