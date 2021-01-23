import React from 'react';
import ReactDOM from 'react-dom';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import ChatLayout from 'app/components/modules/chat/ChatLayout';
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
} from '@livechat/ui-kit';

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
        if (!this.props.initiatedChat) {
            this.props.initiateChat();
        }
        this.componentDidUpdate();
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentDidUpdate() {
        const {
            username,
            accessToken,
            conversation,
            chatMessages,
            socketState,
            markRead,
        } = this.props;
        if (accessToken && chatMessages && socketState === 'ready' && conversation.unread) {
            markRead(conversation.id);
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
            username,
            conversation,
            chatMessages,
            sendChatMessage,
            loading,
            minimize,
            showChatList,
        } = this.props;
        const { showEmojiPicker, inputText } = this.state;

        if (loading) {
            return (
               <ChatLayout title={title} minimize={minimize} showChatList={showChatList}>
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
               </ChatLayout>
            );
        }
        const onMessageSend = (message) => {
            const to = !conversation.name && conversation.members.length === 2 ?
                conversation.members.find(m => m !== username) : null;
            sendChatMessage(conversation.id, to, message);
            this.setState({ inputText: "" });
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
        const title = conversation.name || (conversation.members.slice(0,3).join(', '));
        return (
           <ChatLayout title={title} minimize={minimize} showChatList={showChatList}>
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
                               avatar={imageProxy(true) + `u/${chatMessage.from}/avatar/small`}
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
                   <Picker set="twitter" onSelect={addEmoji} title="" style={{ position: 'absolute', bottom: '20px', right: '20px' }} ref={element => this.emojiPicker = element} />
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
                           <Row>
                               <Fit>
                                   <IconButton>
                                       <EmojiIcon onClick={() => this.setState({ showEmojiPicker: true })} />
                                   </IconButton>
                               </Fit>
                           </Row>
                       </Column>
                   </Row>
               </TextComposer>
            </ChatLayout>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const conversation = ownProps.conversation.toJS();
        const currentAccount = state.user.get('current');
        const username = currentAccount.get('username');
        const initiatedChat = state.chat.get('initiateChat');
        const accessToken = state.chat.getIn(['accessToken', username]);
        const chatMessages = state.chat.getIn(['chatMessages', conversation.id]);
        const socketState = state.chat.get('socketState');
        const loading = !accessToken || !chatMessages || socketState !== 'ready';

        return {
            conversation,
            minimize: ownProps.minimize,
            showChatList: ownProps.showChatList,
            initiatedChat,
            accessToken,
            username,
            chatMessages,
            socketState,
            loading,
        };
    },
    dispatch => ({
        initiateChat: () => {
            dispatch(chatActions.initiateChat());
        },
        sendChatMessage: (conversationId, to, message) => {
            dispatch(chatActions.sendChatMessage({ conversationId, to, message }));
        },
        markRead: (conversationId) => {
            dispatch(chatActions.markRead({ conversationId }));
        },
    }),
)(ChatMain);

