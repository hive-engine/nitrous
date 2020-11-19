import React from 'react';
import { connect } from 'react-redux';
import ChatConversation from 'app/components/modules/chat/ChatConversation';
import ChatListSelect from 'app/components/modules/chat/ChatListSelect';

class ChatMain extends React.Component {

    render() {
        const { conversation, minimize, setConversation } = this.props;

        let chatContent, title;
        if (conversation) {
            const showChatList = () => setConversation(null);
            return (<ChatConversation conversation={conversation} minimize={minimize} showChatList={showChatList} />);
        } else {
            const handleSelect = (conversation) => setConversation(conversation);
            return (<ChatListSelect minimize={minimize} onSelect={handleSelect} />);
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

