import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as movieReducer from './MovieReducer';
import * as movieApi from 'app/utils/MovieApi';
import * as CustomUtil from 'app/utils/CustomUtil';

export const movieWatches = [
    takeLatest(movieReducer.REQUEST_SUMMARY, requestSummary),
    takeLatest(movieReducer.REQUEST_MOVIE, requestMovie),
    takeLatest(movieReducer.REQUEST_MOVIES, requestMovies),
    takeLatest(
        movieReducer.REQUEST_MOVIES_FOR_NEW_LIST,
        requestMoviesForNewList
    ),
    takeLatest(movieReducer.UPDATE_MOVIES, requestMovies),
    takeLatest(movieReducer.REQUEST_REVIEWS, requestReviews),
    takeLatest(
        movieReducer.REQUEST_REVIEWS_FOR_NEW_LIST,
        requestReviewsForNewList
    ),
    takeLatest(movieReducer.UPDATE_REVIEWS, requestReviews),
    takeLatest(movieReducer.REQUEST_REVIEW_LIKE, requestReviewLike),
];

function* requestSummary(action) {
    const { languageCode } = action.payload;

    try {
        yield call(delay, 100);

        let data = yield call(movieApi.getSummary, languageCode);

        yield put(movieReducer.actions.receiveSummary({ data }));
    } catch (error) {
        console.error(action.payload, error);
    }

    yield put(movieReducer.actions.requestSummaryEnd());
}

function* requestMovie(action) {
    const { languageCode, movieType, movieId } = action.payload;

    try {
        yield call(delay, 100);

        let data = yield call(
            movieApi.getMovie,
            languageCode,
            movieType,
            movieId
        );

        yield put(movieReducer.actions.receiveMovie({ movieType, data }));
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
        yield call(delay, 100);

        let data = yield call(
            movieApi.getMovies,
            languageCode,
            movieType,
            genreId,
            lastMovieId,
            sortBy
        );

        if (action.type === movieReducer.REQUEST_MOVIES) {
            yield put(movieReducer.actions.receiveMovies({ movieType, data }));
        } else {
            yield put(
                movieReducer.actions.receiveUpdateMovies({ movieType, data })
            );
        }
    } catch (error) {
        console.error(action.payload, error);
    }

    if (action.type === movieReducer.REQUEST_MOVIES) {
        yield put(movieReducer.actions.requestMoviesEnd());
    }
}

function* requestMoviesForNewList(action) {
    const {
        languageCode,
        movieType,
        genreId,
        firstMovieId,
        sortBy,
    } = action.payload;

    try {
        yield call(delay, 1000);

        let data = yield call(
            movieApi.getMoviesForNewList,
            languageCode,
            movieType,
            genreId,
            firstMovieId,
            sortBy
        );

        yield put(
            movieReducer.actions.receiveMoviesForNewList({ movieType, data })
        );
    } catch (error) {
        console.error(action.payload, error);
    }
}

function* requestReviews(action) {
    const {
        movieType,
        genreId,
        languageCode,
        lastAuthor,
        lastPermlink,
        sortBy,
    } = action.payload;

    try {
        yield call(delay, 100);

        let data = yield call(
            movieApi.getReviews,
            movieType,
            genreId,
            languageCode,
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

function* requestReviewsForNewList(action) {
    const {
        movieType,
        genreId,
        languageCode,
        firstAuthor,
        firstPermlink,
        sortBy,
    } = action.payload;

    try {
        yield call(delay, 1000);

        let data = yield call(
            movieApi.getReviewsForNewList,
            movieType,
            genreId,
            languageCode,
            firstAuthor,
            firstPermlink,
            sortBy
        );

        yield put(movieReducer.actions.receiveReviewsForNewList({ data }));
    } catch (error) {
        console.error(action.payload, error);
    }
}

function* requestReviewLike(action) {
    const { author, permlink } = action.payload;

    try {
        const stateMovie = yield select(state => state.movie);

        const token = yield call(CustomUtil.getToken, stateMovie);

        const data = yield call(
            movieApi.addTopPostLike,
            author,
            permlink,
            token
        );

        yield put(movieReducer.actions.receiveReviewLike(data));
    } catch (error) {
        console.error(action.payload, error);
    }

    yield put(movieReducer.actions.requestReviewLikeEnd());
}
