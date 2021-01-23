import { fromJS, List, Map, Set } from 'immutable';

const LOGIN = 'chat/LOGIN';
const RECEIVE_ACCESS_TOKEN = 'chat/RECEIVE_ACCESS_TOKEN';
const FETCH_CHAT_MESSAGES = 'chat/FETCH_CHAT_MESSAGES';
const RECEIVE_CHAT_MESSAGES = 'chat/RECEIVE_CHAT_MESSAGES';
const CONNECT_WEBSOCKET = 'chat/CONNECT_WEBSOCKET';
const RECEIVE_SOCKET_STATE = 'chat/RECEIVE_SOCKET_STATE';
const SEND_CHAT_MESSAGE = 'chat/SEND_CHAT_MESSAGE';
const MARK_READ = 'chat/MARK_READ';
const FETCH_CHAT_LIST = 'chat/FETCH_CHAT_LIST';
const RECEIVE_CHAT_LIST = 'chat/RECEIVE_CHAT_LIST';
const START_CHAT = 'chat/START_CHAT';
const INITIATE_CHAT = 'chat/INITIATE_CHAT';

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
            const { conversationId, chatMessages, currentUser } = payload;
            const oldChatMessages = state.getIn(['chatMessages', conversationId]) || List();
            const oldChatIds = Set(oldChatMessages.map(m => m.get('id')));
            const newChatMessages = fromJS(chatMessages)
                        .filter(m => !oldChatIds.has(m.get('id')));
            const unread = newChatMessages.filter(m => m.get('from') !== currentUser && !m.get('read')).size;
            const newState = state.set('chatList', state.get('chatList').map(c => {
                return c.get('id') === conversationId ? c.set('unread', unread) : c;
            }));
            return newState.setIn(['chatMessages', conversationId],
                oldChatMessages
                    .concat(newChatMessages)
                    .sort((x,y) => new Date(x.get('timestamp')) - new Date(y.get('timestamp')))
                    .slice(-1000));
        }

        // Has Saga watcher.
        case FETCH_CHAT_LIST: {
            return state;
        }

        case RECEIVE_CHAT_LIST : {
            return state.set('chatList', fromJS(payload));
        }

        // Has Saga watcher.
        case CONNECT_WEBSOCKET : {
            return state;
        }

        case RECEIVE_SOCKET_STATE : {
            const newState = state.set('socketState', payload);
            if (payload === 'closed') {
                return newState.delete('chatMessages');
            }
            return newState;
        }

        // Has Saga watcher.
        case SEND_CHAT_MESSAGE : {
            return state;
        }
        
        // Has Saga watcher.
        case MARK_READ : {
            return state.set('chatList', state.get('chatList').map(c => {
                return c.get('id') === payload.conversationId ? c.set('unread', 0) : c;
            }));
        }
        
        // Has Saga watcher.
        case START_CHAT: {
            return state;
        }

        case INITIATE_CHAT: {
            return state.set('initiateChat', true);
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

export const markRead = payload => ({
    type: MARK_READ,
    payload,
});

export const fetchChatList = payload => ({
    type: FETCH_CHAT_LIST,
    payload,
});

export const receiveChatList = payload => ({
    type: RECEIVE_CHAT_LIST,
    payload,
});

export const startChat = payload => ({
    type: START_CHAT,
    payload,
});

export const initiateChat = payload => ({
    type: INITIATE_CHAT ,
    payload,
});
