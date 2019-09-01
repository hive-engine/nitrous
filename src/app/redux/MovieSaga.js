import { call, put, takeLatest } from 'redux-saga/effects';
import * as movieReducer from './MovieReducer';
import * as movieApi from 'app/utils/MovieApi';

export const movieWatches = [
    takeLatest(movieReducer.REQUEST_MOVIE, requestMovie),
    takeLatest(movieReducer.REQUEST_MOVIES, requestMovies),
    takeLatest(movieReducer.UPDATE_MOVIES, requestMovies),
    takeLatest(movieReducer.REQUEST_REVIEWS, requestReviews),
    takeLatest(movieReducer.UPDATE_REVIEWS, requestReviews),
];

function* requestMovie(action) {
    const { languageCode, movieType, movieId } = action.payload;

    try {
        let data = yield call(
            movieApi.getMovie,
            languageCode,
            movieType,
            movieId
        );

        yield put(movieReducer.actions.receiveMovie({ data }));
    } catch (error) {
        console.error(action.payload, error);
    }

    yield put(movieReducer.actions.requestMovieEnd());
}

function* requestMovies(action) {
    const {
        languageCode,
        movieType,
        genreId,
        lastMovieId,
        sortBy,
    } = action.payload;

    try {
        let data = yield call(
            movieApi.getMovies,
            languageCode,
            movieType,
            genreId,
            lastMovieId,
            sortBy
        );

        if (action.type === movieReducer.REQUEST_MOVIES) {
            yield put(movieReducer.actions.receiveMovies({ data }));
        } else {
            yield put(movieReducer.actions.receiveUpdateMovies({ data }));
        }
    } catch (error) {
        console.error(action.payload, error);
    }

    if (action.type === movieReducer.REQUEST_MOVIES) {
        yield put(movieReducer.actions.requestMoviesEnd());
    }
}

function* requestReviews(action) {
    const {
        movieType,
        genreId,
        lastAuthor,
        lastPermlink,
        sortBy,
    } = action.payload;

    try {
        let data = yield call(
            movieApi.getReviews,
            movieType,
            genreId,
            lastAuthor,
            lastPermlink,
            sortBy
        );

        if (action.type === movieReducer.REQUEST_REVIEWS) {
            yield put(movieReducer.actions.receiveReviews({ data }));
        } else {
            yield put(movieReducer.actions.receiveUpdateReviews({ data }));
        }
    } catch (error) {
        console.error(action.payload, error);
    }

    if (action.type === movieReducer.REQUEST_REVIEWS) {
        yield put(movieReducer.actions.requestReviewsEnd());
    }
}
