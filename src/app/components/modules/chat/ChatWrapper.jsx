import React from 'react';
import { connect } from 'react-redux';
import { ThemeProvider, FixedWrapper, darkTheme } from '@livechat/ui-kit';
import MinimizedIcon from 'app/components/modules/chat/MinimizedIcon';
import ChatMain from 'app/components/modules/chat/ChatMain';
import * as chatActions from 'app/redux/ChatReducer';

class ChatWrapper extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = { selectedConversationId: null, newConversation: false };
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const {
            initiatedChat,
            currentUsername,
            accessToken,
            chatList,
            socketState,
            login,
            fetchChatList,
            connectWebsocket,
        } = this.props;
        if (initiatedChat || localStorage.getItem(`chat_${currentUsername}`)) {
            if (!accessToken) {
                login(currentUsername);
            } else {
                if (!chatList) {
                    fetchChatList();
                } else if (socketState !== 'ready') {
                    connectWebsocket();
                }
            }
        }
    }

    render() {
        const { preferHive, defaultChatConversations, chatList, nightmodeEnabled } = this.props;
        const { selectedConversationId, newConversation } = this.state;
        const setConversation = (selectedConversationId) => this.setState({ selectedConversationId });
        const setNewConversation = (newConversation) => this.setState({ newConversation });
        const theme = nightmodeEnabled ? darkTheme : { vars: { 'primary-color': 'grey' }};
        theme.FixedWrapperMaximized = {
            css: {
                height: '600px',
            },
        };
        if (!preferHive || !defaultChatConversations || !this.props.currentUsername) {
            return null;
        }
        const conversation = selectedConversationId ? chatList.find(c => c.get('id') === selectedConversationId) : null;
        return (
            <ThemeProvider theme={theme} >
                <FixedWrapper.Root>
                    <FixedWrapper.Maximized>
                        <ChatMain conversation={conversation} newConversation={newConversation} setConversation={setConversation} setNewConversation={setNewConversation} />
                    </FixedWrapper.Maximized>
                    <FixedWrapper.Minimized>
                        <MinimizedIcon />
                    </FixedWrapper.Minimized>
                </FixedWrapper.Root>
            </ThemeProvider>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const currentUsername = state.user.getIn(['current', 'username']);
        const defaultChatConversations = state.app.getIn(['hostConfig', 'CHAT_CONVERSATIONS']);
        const preferHive = state.app.getIn(['hostConfig', 'PREFER_HIVE']);
        const initiatedChat = state.chat.get('initiateChat');
        const accessToken = state.chat.getIn(['accessToken', currentUsername]);
        const chatList = state.chat.get('chatList');
        const socketState = state.chat.get('socketState');
        const loading = !accessToken || !chatList || socketState !== 'ready';
        return {
            ...ownProps,
            preferHive,
            currentUsername,
            defaultChatConversations,
            nightmodeEnabled: state.app.getIn(['user_preferences', 'nightmode']),
            accessToken,
            chatList,
            socketState,
            loading,
            initiatedChat,
        }
    },
    dispatch => ({
        login: (username) => {
            dispatch(chatActions.login({ username }));
        },
        fetchChatList: () => {
            dispatch(chatActions.fetchChatList());
        },
        connectWebsocket: () => {
            dispatch(chatActions.connectWebsocket());
        },
    })
)(ChatWrapper);

