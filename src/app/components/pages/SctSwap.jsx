import React from 'react';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SwapComponent from 'app/components/elements/Swap/Swap';

class Swap extends React.Component {
    static propTypes = {
        accounts: PropTypes.object,
        status: PropTypes.object,
        requestData: PropTypes.func,
        loading: PropTypes.bool,
        username: PropTypes.string,
    };
    render() {
        return <SwapComponent />;
    }
}

module.exports = {
    path: 'welcome',

    component: connect(
        (state, ownProps) => {
            const scotConfig = state.app.get('scotConfig');

            return {
                status: state.global.get('status'),
                loading: state.app.get('loading'),
                accounts: state.global.get('accounts'),
                username:
                    state.user.getIn(['current', 'username']) ||
                    state.offchain.get('account'),
                scotInfo: scotConfig.getIn(['config', 'info']),
            };
        },
        dispatch => {
            return {
                requestData: args =>
                    dispatch(fetchDataSagaActions.requestData(args)),
            };
        }
    )(Swap),
};
