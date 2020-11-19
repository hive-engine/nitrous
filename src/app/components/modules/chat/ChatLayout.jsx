import React from 'react';
import Icon from 'app/components/elements/Icon';
import {
    CloseIcon,
    IconButton,
    TitleBar,
} from '@livechat/ui-kit';

export default function ChatLayout(props) {
    const { children, minimize, title, showChatList } = props;
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <TitleBar
                leftIcons={showChatList ? [
                    <IconButton key="menu" onClick={showChatList}>
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
            {children}
        </div>
    );
}
