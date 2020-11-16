import { fromJS, List, Map } from 'immutable';

const LOGIN = 'chat/LOGIN';
const RECEIVE_ACCESS_TOKEN = 'chat/RECEIVE_ACCESS_TOKEN';
const FETCH_CHAT_MESSAGES = 'chat/FETCH_CHAT_MESSAGES';
const RECEIVE_CHAT_MESSAGES = 'chat/RECEIVE_CHAT_MESSAGES';
const CONNECT_WEBSOCKET = 'chat/CONNECT_WEBSOCKET';
const RECEIVE_SOCKET_STATE = 'chat/RECEIVE_SOCKET_STATE';
const SEND_CHAT_MESSAGE = 'chat/SEND_CHAT_MESSAGE';

const defaultChatState = Map();

export default function reducer(state = defaultChatState, action) {
    const payload = action.payload;

    switch (action.type) {
        // Has Saga watcher.
        case LOGIN: {
            return state;
        }

        case RECEIVE_ACCESS_TOKEN: {
            return state.setIn(['accessToken', payload.username], fromJS(payload));
        }

        // Has Saga watcher.
        case FETCH_CHAT_MESSAGES: {
            return state;
        }

        case RECEIVE_CHAT_MESSAGES : {
            const chatMessages = state.get('chatMessages') || List();
            return state.set('chatMessages', chatMessages.concat(payload).slice(-1000));
        }

        // Has Saga watcher.
        case CONNECT_WEBSOCKET : {
            return state;
        }

        case RECEIVE_SOCKET_STATE : {
            const newState = state.set('socketState', payload);
            if (payload === 'closed') {
                return newState.set('chatMessages', null);
            }
            return newState;
        }

        // Has Saga watcher.
        case SEND_CHAT_MESSAGE : {
            return state;
        }

        default:
            return state;
    }
}

export const login = payload => ({
    type: LOGIN,
    payload,
});

export const receiveAccessToken = payload => ({
    type: RECEIVE_ACCESS_TOKEN,
    payload,
});

export const fetchChatMessages = payload => ({
    type: FETCH_CHAT_MESSAGES,
    payload,
});

export const receiveChatMessages = payload => ({
    type: RECEIVE_CHAT_MESSAGES,
    payload,
});

export const connectWebsocket = payload => ({
    type: CONNECT_WEBSOCKET,
    payload,
});

export const receiveSocketState = payload => ({
    type: RECEIVE_SOCKET_STATE,
    payload,
});

export const sendChatMessage = payload => ({
    type: SEND_CHAT_MESSAGE,
    payload,
});
