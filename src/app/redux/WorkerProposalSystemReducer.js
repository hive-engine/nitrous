import { fromJS } from 'immutable';

export const REMOVE_OPERATION = 'workerProposalSystem/REMOVE_OPERATION';
export const UPDATE_OPERATION = 'workerProposalSystem/UPDATE_OPERATION';

const defaultState = fromJS({
    operations: [],
    status: { key: '', error: false, busy: false },
    errors: {
        bandwidthError: false,
    },
});

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case UPDATE_OPERATION:
            return state;

        case REMOVE_OPERATION:
            return state;

        default:
            return state;
    }
}

// Actions worker proposal system
export const updateOperation = payload => ({
    type: UPDATE_OPERATION,
    payload,
});

export const removeOperation = payload => ({
    type: REMOVE_OPERATION,
    payload,
});
