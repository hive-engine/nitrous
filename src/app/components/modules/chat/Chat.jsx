import React from 'react';
import { connect } from 'react-redux';
import { ThemeProvider, FixedWrapper, darkTheme } from '@livechat/ui-kit';
import MinimizedIcon from 'app/components/modules/chat/MinimizedIcon';
import ChatMain from 'app/components/modules/chat/ChatMain';
import { CHAT_CONVERSATION_ID } from 'app/client_config';

class Chat extends React.Component {
    render() {
        const { nightmodeEnabled } = this.props;
        const theme = nightmodeEnabled ? darkTheme : { vars: { 'primary-color': 'grey' }};
        if (!CHAT_CONVERSATION_ID || !this.props.currentUsername) {
            return null;
        }
        return (
            <ThemeProvider theme={theme} >
                <FixedWrapper.Root>
                    <FixedWrapper.Maximized>
                        <ChatMain minimize={this.props.minimize} />
                    </FixedWrapper.Maximized>
                    <FixedWrapper.Minimized>
                        <MinimizedIcon maximize={this.props.maximize} />
                    </FixedWrapper.Minimized>
                </FixedWrapper.Root>
            </ThemeProvider>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const currentUsername = state.user.getIn(['current', 'username']);
        return {
            ...ownProps,
            currentUsername,
            nightmodeEnabled: state.app.getIn(['user_preferences', 'nightmode']),
        }
    },
)(Chat);

