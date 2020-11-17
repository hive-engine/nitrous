import React from 'react';
import ReactDOM from 'react-dom';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import * as chatActions from 'app/redux/ChatReducer';
import { imageProxy } from 'app/utils/ProxifyUrl';
import { getEmojiDataFromNative, Emoji, Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css'
import emojiData from 'emoji-mart/data/all.json';
import emojiRegex from 'emoji-regex';
import { connect } from 'react-redux';
import {
    Bubble,
    CloseIcon,
    Column,
    EmojiIcon,
    Fill,
    Fit,
    IconButton,
    Message,
    MessageGroup,
    MessageList,
    MessageText,
    Row,
    SendButton,
    TextComposer,
    TextInput,
    TitleBar,
} from '@livechat/ui-kit';
import { CHAT_CONVERSATION_TITLE } from 'app/client_config';

const unicodeEmojiRegex = emojiRegex();

function formatMessage(message) {
    return message.replace(unicodeEmojiRegex, (match, offset) => {
        return Emoji({
            html: true,
            emoji: getEmojiDataFromNative(match, 'twitter', emojiData),
            size: 24,
            fallback: (emoji, props) => {
                return emoji ? `:${emoji.short_names[0]}:` : props.emoji
            },
        });
    });
}

class ChatMain extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = { showEmojiPicker: false };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.componentDidUpdate();
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentDidUpdate() {
        const {
            username,
            accessToken,
            chatMessages,
            socketState,
            login,
            fetchChatMessages,
            connectWebsocket,
        } = this.props;
        if (!accessToken) {
            login(username);
        } else if (!chatMessages) {
            fetchChatMessages();
        } else if (socketState !== 'ready') {
            connectWebsocket();
        }
        const { newSelectionEnd } = this.state;
        if (newSelectionEnd) {
            this.inputTextarea.selectionEnd = newSelectionEnd;
            this.setState({ newSelectionEnd: null });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick(event) {
        try {
            if (this.emojiPicker) {
                let node = ReactDOM.findDOMNode(this.emojiPicker);
                if (!node.contains(event.target)) {
                    this.setState({ showEmojiPicker: false });
                }
            }
        } catch(error) {
        }
    }

    render() {
        const {
            chatState,
            username,
            chatMessages,
            sendChatMessage,
            users,
            ownId,
            currentAgent,
            minimize,
            maximizeChatWidget,
            loading,
        } = this.props;
        const { showEmojiPicker, inputText } = this.state;

        if (loading) {
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <TitleBar
                        rightIcons={[
                            <IconButton key="close" onClick={minimize}>
                                <CloseIcon />
                            </IconButton>,
                        ]}
                        title={CHAT_CONVERSATION_TITLE}
                    />

                    <div
                        style={{
                            flexGrow: 1,
                            minHeight: 0,
                            height: '100%',
                            background: '#fff',
                        }}
                    >

                        <center>
                            <LoadingIndicator
                                style={{ marginBottom: '2rem' }}
                                type="circle"
                            />
                        </center>
                    </div>
                </div>
            );
        }
        const onMessageSend = (message) => {
            sendChatMessage(message);
        };
        const addEmoji = (emoji) => {
            const cursorPosition = this.inputTextarea.selectionEnd;
            const text = this.inputTextarea.value;
            this.inputTextarea.focus();
            this.setState({
                showEmojiPicker: false,
                inputText: text.substring(0, this.inputTextarea.selectionStart) + emoji.native + text.substring(this.inputTextarea.selectionStart),
                newSelectionEnd: cursorPosition + emoji.native.length,
            });
        };
        const onEmojiClick = (emoji, event) => {
            console.log(emoji);
            console.log(event);
        };
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <TitleBar
                    rightIcons={[
                        <IconButton key="close" onClick={minimize}>
                            <CloseIcon />
                        </IconButton>,
                    ]}
                    title={CHAT_CONVERSATION_TITLE}
                />
                <div
                    style={{
                        flexGrow: 1,
                        minHeight: 0,
                        height: '100%',
                    }}
                >
                    <MessageList active containScrollInSubtree>
                        {!chatMessages ? [] : chatMessages.toJS().map((chatMessage, index) => (
                            <MessageGroup
                                key={index}
                                avatar={imageProxy() + `u/${chatMessage.from}/avatar/small`}
                                isOwn={chatMessage.from === username}
                                onlyFirstWithMeta
                            >
                                <Message
                                    authorName={chatMessage.from}
                                    isOwn={chatMessage.from === username}
                                    key={chatMessage.id}
                                >
                                    <Bubble isOwn={chatMessage.from === username}>
                                        <MessageText><div dangerouslySetInnerHTML={{ __html: formatMessage(chatMessage.content)}} /></MessageText>
                                        <TimeAgoWrapper date={chatMessage.timestamp} className="Chat__time"/>
                                    </Bubble>
                                </Message>
                            </MessageGroup>
                        ))}
                    </MessageList>
                </div>
                {showEmojiPicker && (
                    <Picker set="twitter" onSelect={addEmoji} onClick={onEmojiClick} title="" style={{ position: 'absolute', bottom: '20px', right: '20px' }} ref={element => this.emojiPicker = element} />
                )}
                <TextComposer onSend={onMessageSend} value={inputText} onChange={e => this.setState({ inputText: e.target.value })} >
                    <Row align="center">
                        <Fill>
                            <TextInput innerRef={element => this.inputTextarea = element} />
                        </Fill>
                        <Column>
                            <Row>
                                <Fit>
                                    <SendButton />
                                </Fit>
                            </Row>
                            {false && (<Row>
                                <Fit>
                                    <IconButton>
                                        <EmojiIcon onClick={() => this.setState({ showEmojiPicker: true })} />
                                    </IconButton>
                                </Fit>
                            </Row>)}
                        </Column>
                    </Row>
                </TextComposer>
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '.6em',
                        padding: '.4em',
                        background: '#fff',
                        color: '#888',
                    }}
                >
                    {'Powered by BeeChat'}
                </div>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const currentAccount = state.user.get('current');
        const username = currentAccount.get('username');
        const accessToken = state.chat.getIn(['accessToken', username]);
        const chatMessages = state.chat.get('chatMessages');
        const socketState = state.chat.get('socketState');
        const loading = !accessToken || !chatMessages || socketState !== 'ready';

        return {
            ...ownProps,
            accessToken,
            username,
            chatMessages,
            socketState,
            loading,
        };
    },
    dispatch => ({
        login: (username) => {
            dispatch(chatActions.login({ username }));
        },
        fetchChatMessages: () => {
            dispatch(chatActions.fetchChatMessages());
        },
        connectWebsocket: () => {
            dispatch(chatActions.connectWebsocket());
        },
        sendChatMessage: (message) => {
            dispatch(chatActions.sendChatMessage({ message }));
        },
    }),
)(ChatMain);

