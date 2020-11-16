import React from 'react';
import { connect } from 'react-redux';
import { ThemeProvider, FixedWrapper, darkTheme } from '@livechat/ui-kit';
import MinimizedIcon from 'app/components/modules/chat/MinimizedIcon';
import ChatMain from 'app/components/modules/chat/ChatMain';

class Chat extends React.Component {
    render() {
        const { nightmodeEnabled } = this.props;
        const theme = nightmodeEnabled ? darkTheme : { vars: { 'primary-color': 'grey' }};
        if (!this.props.currentAccount) {
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
        const currentAccount = state.user.get('current');
        return {
            ...ownProps,
            currentAccount,
            nightmodeEnabled: state.app.getIn(['user_preferences', 'nightmode']),
        }
    },
)(Chat);

