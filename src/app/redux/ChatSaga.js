import { List, fromJS } from 'immutable';
import { Signature, hash } from '@hiveio/hive-js/lib/auth/ecc';
import { call, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { findSigningKey } from 'app/redux/AuthSaga';
import * as reducer from 'app/redux/ChatReducer';
import * as userActions from 'app/redux/UserReducer';
import { isLoggedInWithKeychain } from 'app/utils/SteemKeychain';
import axios from 'axios';

export const chatWatches = [
    takeEvery('chat/LOGIN', login),
    takeEvery('chat/FETCH_CHAT_MESSAGES', fetchChatMessages),
    takeEvery('chat/SEND_CHAT_MESSAGE', sendChatMessage),
    takeEvery('chat/MARK_READ', markRead),
    takeEvery('chat/FETCH_CHAT_LIST', fetchChatList),
    takeEvery('chat/START_CHAT', startChat),
    fork(websocketSaga),
];

const BEECHAT_API_URL = 'https://beechat.hive-engine.com/api';
const BEECHAT_WS_URL = 'wss://ws.beechat.hive-engine.com';

let socket;

function* refreshToken(accessToken) {
    const refreshResponse = yield call(callChatApi, 'users/refresh-token', {}, { 'Authorization': `Bearer ${accessToken.refreshToken}`});
    accessToken.accessToken = refreshResponse.token;
    yield put(
        reducer.receiveAccessToken(accessToken)
    );
}

function createChannel(socket) {
    return eventChannel(emitter => {
        socket.addEventListener('open', event => {
            emitter({ type: "open" });
        });
        socket.addEventListener('message', event => {
            emitter(JSON.parse(event.data));
        });
        socket.addEventListener('close', event => {
            emitter({ type: "close" });
        });
        return () => {
            socket.close();
        }
    });
}

function* websocketSaga() {
    while (true) {
        const action = yield take('chat/CONNECT_WEBSOCKET');
        socket = new WebSocket(BEECHAT_WS_URL);
        const channel = createChannel(socket);
        const username = yield select(state => state.user.getIn(['current', 'username']));
        while (socket) {
            const response = yield take(channel);
            switch (response.type) {
                case 'open': {
                    const accessToken = yield select(state => state.chat.getIn(['accessToken', username, 'accessToken']));
                    socket.send(JSON.stringify({ type: 'authenticate', payload: { token: accessToken } }));
                    break;
                }

                case 'close': {
                    yield logout();
                    break;
                }

                case 'status': {
                    if (response.payload.authenticated) {
                        yield put(reducer.receiveSocketState('ready'));
                    } else {
                        console.error('Failed to authenticate');
                    }
                    break;
                }

                case 'chat-message': {
                    yield put(reducer.receiveChatMessages({ conversationId: response.payload.conversation_id, chatMessages: [ response.payload ], currentUser: username}));
                    break;
                }

                case 'reauthentication-required': {
                    const accessToken = yield select(state => state.chat.getIn(['accessToken', username]).toJS());
                    yield refreshToken(accessToken);
                    socket.send(JSON.stringify({ type: 'authenticate', payload: { token: accessToken.accessToken } }));
                }

                default:
            }
        }
    }
}

function* sendChatMessage(action) {
    const { conversationId, to, message } = action.payload;
    if (socket) {
        socket.send(JSON.stringify({
            type: 'chat-message',
            payload: {
                conversation_id: conversationId,
                to,
                message,
            },
        }));
    } else {
      console.error("Socket does not exist");
    }
}

function* markRead(action) {
    const { conversationId } = action.payload;
    if (socket) {
        socket.send(JSON.stringify({
            type: 'acknowledgment',
            payload: {
                conversation_id: conversationId,
            },
        }));
    } else {
      console.error("Socket does not exist");
    }
}

async function callChatApi(endpoint, params, headers) {
    return await axios({
        url: `${BEECHAT_API_URL}/${endpoint}`,
        method: 'GET',
        params,
        headers,
    })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.error(`Could not fetch data, url: ${url}`);
            return [];
        });
}

function* authorizedCallChatApi(endpoint, params) {
    const current = yield select(state => state.user.get('current'));
    const accessToken = yield select(state => state.chat.getIn(['accessToken', current.get('username')]).toJS());
    try {
        return yield call(callChatApi, endpoint, params,
            { 'Authorization': `Bearer ${accessToken.accessToken}`});
    } catch (error) {
        // try to refresh token and retry
        yield refreshToken(accessToken);
        return yield call(callChatApi, endpoint, params,
            { 'Authorization': `Bearer ${accessToken.accessToken}`});
    }
}

export function* login(action) {
    const {
        username,
    } = action.payload;

    let storedToken = localStorage.getItem(`chat_${username}`);
    if (storedToken) {
        storedToken = JSON.parse(storedToken);
        // check if still valid
        const { accessToken, refreshToken } = storedToken;
        try {
            const refreshResponse = yield call(callChatApi, 'users/refresh-token', {}, { 'Authorization': `Bearer ${refreshToken}`});

            storedToken.accessToken = refreshResponse.token;
            yield put(
                reducer.receiveAccessToken(storedToken)
            );
            return;
        } catch (error) {
            // ignore, continue login
            console.error(error);
        }
    }

    const ts = Date.now();
    const message = `${username}${ts}`;
    let sig;

    if (isLoggedInWithKeychain()) {
        const response = yield new Promise(resolve => {
            window.hive_keychain.requestSignBuffer(username, message, 'Posting', response => {
                resolve(response);
            });
        });
        if (response.success) {
            sig = response.result;
        } else {
            yield put(
                userActions.loginError({ error: response.message })
            );
            return;
        }
    } else {
        const signingKey = yield call(findSigningKey, {
            opType: 'custom_json',
            needsActiveAuth: false,
            username,
            useHive: true,
        });
        if (signingKey) {
            const bufSha = hash.sha256(message);
            sig = Signature.signBufferSha256(bufSha, signingKey).toHex();
        } else {
            console.error('No Signing Key for Chat Login');
            return;
        }
    }

    const loginResponse = yield call(callChatApi, 'users/login', { username, ts, sig }, {});

    if (loginResponse.token) {
        const tokenData = {
            username,
            accessToken: loginResponse.token,
            refreshToken: loginResponse.refresh_token,
        }
        localStorage.setItem(`chat_${username}`, JSON.stringify(tokenData));
        yield put(
            reducer.receiveAccessToken(tokenData)
        );
    }
}


export function* fetchChatMessages(action) {
  const { conversationId } = action.payload;
  const chatMessages = yield authorizedCallChatApi('messages/chats', { conversation_id: conversationId });
  yield put(
      reducer.receiveChatMessages({ conversationId, chatMessages })
  );
}

export function* logout() {
  if (socket) {
      yield put(reducer.receiveSocketState('closed'));
      socket.close();
      socket = null;
  }
}

export function* fetchChatList(action) {
  const chatList = yield authorizedCallChatApi('messages/conversations');
  const conversations = yield select(state => state.app.getIn(['hostConfig', 'CHAT_CONVERSATIONS']));
  const finalChatList = conversations ? conversations.toJS().concat(chatList) : chatList;
  yield put(
      reducer.receiveChatList(finalChatList)
  );
  for (let i = 0; i < finalChatList.length; i += 1) {
      const chat = finalChatList[i];
      yield fetchChatMessages({ payload: { conversationId: chat.id }});
  }
}

export function* startChat(action) {
  const { to, message } = action.payload;
  if (socket) {
        socket.send(JSON.stringify({
            type: 'create-conversation',
            payload: {
                to,
                message,
            },
        }));
    } else {
      console.error("Socket does not exist");
    }
}
