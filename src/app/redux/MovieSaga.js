import { call, put, takeLatest } from 'redux-saga/effects';
import * as movieReducer from './MovieReducer';
import * as movieApi from 'app/utils/MovieApi';

export const movieWatches = [
    takeLatest(movieReducer.REQUEST_MOVIES, requestMovies),
];

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

        yield put(movieReducer.actions.receiveMovies({ data }));
    } catch (error) {
        console.error(action.payload, error);
    }

    yield put(movieReducer.actions.requestMoviesEnd());
}
