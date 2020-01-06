import React from 'react';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SidebarSwap from 'app/components/elements/SidebarSwap';

class Swap extends React.Component {
    static propTypes = {
        accounts: PropTypes.object,
        status: PropTypes.object,
        requestData: PropTypes.func,
        loading: PropTypes.bool,
        username: PropTypes.string,
    };
    render() {
        return (
            <div className="row">
                <div>
                    <SidebarSwap
                        sct_to_steemp={this.props.scotInfo.getIn([
                            'sct_to_steemp',
                        ])}
                        dec_to_steemp={this.props.scotInfo.getIn([
                            'dec_to_steemp',
                        ])}
                        steem_to_dollor={this.props.scotInfo.getIn([
                            'steem_to_dollor',
                        ])}
                        sctm_to_steem={this.props.scotInfo.getIn([
                            'sctm_to_steem',
                        ])}
                        krwp_to_steem={this.props.scotInfo.getIn([
                            'krwp_to_steem',
                        ])}
                        steem_to_krw_current={this.props.scotInfo.getIn([
                            'steem_to_krw_current',
                        ])}
                        sbd_to_krw_current={this.props.scotInfo.getIn([
                            'sbd_to_krw_current',
                        ])}
                    />
                </div>
            </div>
        );
    }
}

module.exports = {
    component: Swap,
};

module.exports = {
    path: 'swap',
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
