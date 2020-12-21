import React from 'react';
import { connect } from 'react-redux';
import ChatConversation from 'app/components/modules/chat/ChatConversation';
import ChatListSelect from 'app/components/modules/chat/ChatListSelect';
import NewConversation from 'app/components/modules/chat/NewConversation';

class ChatMain extends React.Component {

    render() {
        const { conversation, newConversation, minimize, setConversation, setNewConversation } = this.props;

        let chatContent, title;
        const showChatList = () => setConversation(null);
        if (conversation) {
            return (<ChatConversation conversation={conversation} minimize={minimize} showChatList={showChatList} />);
        } else if (newConversation) {
            return (<NewConversation setNewConversation={setNewConversation} setConversation={setConversation} minimize={minimize} />);
        } else {
            return (<ChatListSelect minimize={minimize} onSelect={setConversation} setNewConversation={setNewConversation} />);
        }
    }
}

export default connect(
    (state, ownProps) => {
        return {
            ...ownProps,
        }
    },
)(ChatMain);

