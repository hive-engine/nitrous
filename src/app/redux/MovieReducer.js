import { fromJS, List } from 'immutable';

export const REQUEST_MOVIES = 'movie/REQUEST_MOVIES';
const REQUESTING_MOVIES = 'movie/REQUESTING_MOVIES';
const RECEIVE_MOVIES = 'movie/RECEIVE_MOVIES';
const REQUEST_MOVIES_END = 'movie/REQUEST_MOVIES_END';

const defaultState = fromJS({ movie: { loading: false } });

export default function reducer(state = defaultState, action = {}) {
    const payload = action.payload;

    switch (action.type) {
        case REQUESTING_MOVIES:
            return state.set('loading', true);
        case RECEIVE_MOVIES: {
            return state.updateIn(['movies'], List(), list => {
                return list.concat(payload.data);
            });
        }
        case REQUEST_MOVIES_END:
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

    requestingMovies: () => ({
        type: REQUESTING_MOVIES,
    }),

    receiveMovies: payload => ({
        type: RECEIVE_MOVIES,
        payload,
    }),

    requestMoviesEnd: () => ({
        type: REQUEST_MOVIES_END,
    }),
};
