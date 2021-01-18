import React from 'react';
import { connect } from 'react-redux';
import { IconButton, ChatIcon } from '@livechat/ui-kit';

class MinimizedIcon extends React.PureComponent {
    render() {
        const { maximize, unread } = this.props;
        const chatIconColor = unread ? "#e8785f" : null;
        return (
            <div
              className="MinimizedIcon"
              onClick={maximize}
            >
              <IconButton color="#fff">
                <ChatIcon color={chatIconColor}/>
              </IconButton>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const chatList = state.chat.get('chatList');
        const unread = chatList ? chatList.toJS().map(chat => chat.unread).reduce((x,y) => x+y, 0) : 0;
        return {
            ...ownProps,
            unread,
        };
    })(MinimizedIcon);

