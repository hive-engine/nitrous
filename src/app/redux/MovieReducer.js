import { fromJS, List } from 'immutable';
import { LIST_MAX_SIZE } from 'shared/constants';
import * as CustomUtil from 'app/utils/CustomUtil';

export const REQUEST_MOVIES = 'movie/REQUEST_MOVIES';
const RECEIVE_MOVIES = 'movie/RECEIVE_MOVIES';
const REQUEST_MOVIES_END = 'movie/REQUEST_MOVIES_END';

export const REQUEST_MOVIES_FOR_NEW_LIST = 'movie/REQUEST_MOVIES_FOR_NEW_LIST';
const RECEIVE_MOVIES_FOR_NEW_LIST = 'movie/RECEIVE_MOVIES_FOR_NEW_LIST';

export const REQUEST_MOVIE = 'movie/REQUEST_MOVIE';
const RECEIVE_MOVIE = 'movie/RECEIVE_MOVIE';
const REQUEST_MOVIE_END = 'movie/REQUEST_MOVIE_END';

export const UPDATE_MOVIES = 'movie/UPDATE_MOVIES';
const RECEIVE_UPDATE_MOVIES = 'movie/RECEIVE_UPDATE_MOVIES';

export const REQUEST_REVIEWS = 'movie/REQUEST_REVIEWS';
const RECEIVE_REVIEWS = 'movie/RECEIVE_REVIEWS';
const REQUEST_REVIEWS_END = 'movie/REQUEST_REVIEWS_END';

export const REQUEST_REVIEWS_FOR_NEW_LIST =
    'movie/REQUEST_REVIEWS_FOR_NEW_LIST';
const RECEIVE_REVIEWS_FOR_NEW_LIST = 'movie/RECEIVE_REVIEWS_FOR_NEW_LIST';

export const UPDATE_REVIEWS = 'movie/UPDATE_REVIEWS';
const RECEIVE_UPDATE_REVIEWS = 'movie/RECEIVE_UPDATE_REVIEWS';

const UPDATE_OPTIONS = 'movie/UPDATE_OPTIONS';

const REQUEST_NEW_LIST = 'movie/REQUEST_NEW_LIST';

export const defaultState = {
    options: {
        movies: {
            movieType: 1,
            lastMovieId: 0,
            genreId: -1,
            sortBy: 'release_date',
        },
        tvs: {
            movieType: 2,
            lastMovieId: 0,
            genreId: -1,
            sortBy: 'release_date',
        },
        reviews: {
            movieType: 0,
            genreId: -1,
            languageCode: ' ',
            lastAuthor: '',
            lastPermlink: '',
            sortBy: 'created',
        },
    },
};

export default function reducer(state = defaultState, action = {}) {
    const payload = action.payload;

    switch (action.type) {
        case REQUEST_MOVIE:
        case REQUEST_MOVIES:
        case REQUEST_REVIEWS:
            return state.set('loading', true);
        case RECEIVE_MOVIE:
            return state.update(
                CustomUtil.getMovieListName(payload.movieType),
                list => getUpdatedMovieList(list, payload.data)
            );
        case RECEIVE_MOVIES:
            return state
                .update(
                    CustomUtil.getMovieListName(payload.movieType),
                    list =>
                        list &&
                        state.get(
                            CustomUtil.getListLoadedConditionName(
                                payload.movieType
                            )
                        )
                            ? list.concat(fromJS(payload.data))
                            : fromJS(payload.data)
                )
                .set(
                    CustomUtil.getNextListConditionName(payload.movieType),
                    payload.data.length == LIST_MAX_SIZE
                )
                .set(
                    CustomUtil.getListLoadedConditionName(payload.movieType),
                    true
                );
        case RECEIVE_MOVIES_FOR_NEW_LIST:
            return state.update(
                CustomUtil.getMovieListName(payload.movieType),
                list =>
                    list &&
                    state.get(
                        CustomUtil.getListLoadedConditionName(payload.movieType)
                    )
                        ? List([...payload.data, ...list])
                        : fromJS(payload.data)
            );
        case RECEIVE_UPDATE_MOVIES:
            return state
                .set(
                    CustomUtil.getMovieListName(payload.movieType),
                    fromJS(payload.data)
                )
                .set(
                    CustomUtil.getNextListConditionName(payload.movieType),
                    payload.data.length == LIST_MAX_SIZE
                )
                .set(
                    CustomUtil.getListLoadedConditionName(payload.movieType),
                    true
                );
        case RECEIVE_REVIEWS:
            return state
                .update(
                    'reviews',
                    list =>
                        list
                            ? list.concat(fromJS(payload.data))
                            : fromJS(payload.data)
                )
                .set('hasNextReviews', payload.data.length == LIST_MAX_SIZE);
        case RECEIVE_REVIEWS_FOR_NEW_LIST:
            return state.update(
                'reviews',
                list =>
                    list
                        ? List([...payload.data, ...list])
                        : fromJS(payload.data)
            );
        case RECEIVE_UPDATE_REVIEWS:
            return state
                .set('reviews', fromJS(payload.data))
                .set('hasNextReviews', payload.data.length == LIST_MAX_SIZE);
        case REQUEST_MOVIE_END:
        case REQUEST_MOVIES_END:
        case REQUEST_REVIEWS_END:
            return state.set('loading', false);
        case UPDATE_OPTIONS:
            return state.setIn(['options', payload.type], fromJS(payload.data));
        case REQUEST_NEW_LIST:
            return state.set('loadsNewList', true);
        case REQUEST_MOVIES_FOR_NEW_LIST:
        case REQUEST_REVIEWS_FOR_NEW_LIST:
            return state.set('loadsNewList', false);
        default:
            return state;
    }
}

export const actions = {
    requestMovie: payload => ({
        type: REQUEST_MOVIE,
        payload,
    }),

    receiveMovie: payload => ({
        type: RECEIVE_MOVIE,
        payload,
    }),

    requestMovieEnd: () => ({
        type: REQUEST_MOVIE_END,
    }),

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

    requestMoviesForNewList: payload => ({
        type: REQUEST_MOVIES_FOR_NEW_LIST,
        payload,
    }),

    receiveMoviesForNewList: payload => ({
        type: RECEIVE_MOVIES_FOR_NEW_LIST,
        payload,
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

    requestReviewsForNewList: payload => ({
        type: REQUEST_REVIEWS_FOR_NEW_LIST,
        payload,
    }),

    receiveReviewsForNewList: payload => ({
        type: RECEIVE_REVIEWS_FOR_NEW_LIST,
        payload,
    }),

    updateReviews: payload => ({
        type: UPDATE_REVIEWS,
        payload,
    }),

    receiveUpdateReviews: payload => ({
        type: RECEIVE_UPDATE_REVIEWS,
        payload,
    }),

    updateOptions: payload => ({
        type: UPDATE_OPTIONS,
        payload,
    }),

    requestNewList: payload => ({
        type: REQUEST_NEW_LIST,
        payload,
    }),
};

function getUpdatedMovieList(list, jsonToUpdate) {
    return list.map(
        o =>
            o.get('MovieId') !== jsonToUpdate.MovieId
                ? o
                : o.merge(jsonToUpdate)
    );
}
