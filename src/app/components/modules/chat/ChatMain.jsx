import React from 'react';
import { connect } from 'react-redux';
import Icon from 'app/components/elements/Icon';
import ChatConversation from 'app/components/modules/chat/ChatConversation';
import ChatListSelect from 'app/components/modules/chat/ChatListSelect';
import {
    CloseIcon,
    IconButton,
    TitleBar,
} from '@livechat/ui-kit';

class ChatMain extends React.Component {

    render() {
        const { conversation, minimize, setConversation } = this.props;

        let chatContent, title;
        if (conversation) {
            chatContent = (<ChatConversation conversation={conversation} />);
            title = conversation.name || (conversation.members.slice(0,3).join(', '));
        } else {
            const handleSelect = (conversation) => setConversation(conversation);
            chatContent = (<ChatListSelect onSelect={handleSelect} />);
            title = "BeeChat";
        }
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <TitleBar
                    leftIcons={conversation ? [
                        <IconButton key="menu" onClick={() => setConversation(null)}>
                          <Icon name='menu' className="chatMenuIcon" /> 
                        </IconButton>,
                    ] : []}
                    rightIcons={[
                        <IconButton key="close" onClick={minimize}>
                            <CloseIcon />
                        </IconButton>,
                    ]}
                    title={title}
                />
                {chatContent}
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        return {
            ...ownProps,
        }
    },
)(ChatMain);

