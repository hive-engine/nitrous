import { fromJS, Map } from 'immutable';

// Action constants
const ADD_USER_PROFILE = 'user_profile/ADD';

const defaultState = fromJS({
    profiles: {},
});

export default function reducer(state = defaultState, action) {
    const payload = action.payload;

    switch (action.type) {
        case ADD_USER_PROFILE: {
            if (payload) {
                return state.updateIn(
                    ['profiles', payload.username],
                    Map(),
                    a => {
                        const mergedAccount = a.mergeDeep(
                            fromJS(payload.account)
                        );
                        if (mergedAccount.has('transfer_history')) {
                            return mergedAccount.set(
                                'transfer_history',
                                fromJS(payload.account.transfer_history)
                            );
                        }
                        return mergedAccount;
                    }
                );
            }
            return state;
        }

        default:
            return state;
    }
}

// Action creators
export const addProfile = payload => ({
    type: ADD_USER_PROFILE,
    payload,
});
