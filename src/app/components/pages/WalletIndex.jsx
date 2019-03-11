/* eslint react/prop-types: 0 */
import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import tt from 'counterpart';
import * as userActions from 'app/redux/UserReducer';
import { validate_account_name } from 'app/utils/ChainValidation';

class WalletIndex extends React.Component {
    constructor(props) {
        super();
    }

    componentWillMount() {
        const { username, loggedIn } = this.props;
        if (loggedIn) {
            if (process.env.BROWSER) {
                browserHistory.push(`/@${username}/transfers`);
            }
        }
    }

    componentDidUpdate(prevProps) {
        const { username, loggedIn } = this.props;
        if (!prevProps.loggedIn && loggedIn) {
            if (process.env.BROWSER) {
                browserHistory.push(`/@${username}/transfers`);
            }
        }
    }

    render() {
        const { showLogin, loggedIn } = this.props;
        if (loggedIn) {
            return null;
        }
        return (
            <div className="WalletIndex">
                <div className="row">
                    <div className="column login">
                        <h3 style={{ fontWeight: 'bold' }}>
                            {tt('wallet_index.title')}
                        </h3>
                        <p>{tt('wallet_index.description')}</p>
                        {loggedIn ? null : (
                            <div className="modal-buttons">
                                <button
                                    type="submit"
                                    className="button"
                                    onClick={showLogin}
                                >
                                    {tt('wallet_index.login')}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="column tokens">
                        <div className="sheet-container">
                            <div className="sheet">
                                <div className="sheet">
                                    <div className="sheet">
                                        <h3>
                                            {tt('wallet_index.steem_tokens')}
                                        </h3>
                                        <div className="token-container">
                                            <div className="token token-steem" />
                                            <span>
                                                <h4>
                                                    {tt(
                                                        'wallet_index.steem_symbol'
                                                    )}
                                                </h4>
                                                <span className="text">
                                                    {tt(
                                                        'wallet_index.steem_description'
                                                    )}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="token-container">
                                            <div className="token token-steem-power" />
                                            <span>
                                                <h4>
                                                    {tt(
                                                        'wallet_index.steem_power_symbol'
                                                    )}
                                                </h4>
                                                <span className="text">
                                                    {tt(
                                                        'wallet_index.steem_power_description'
                                                    )}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="token-container">
                                            <div className="token token-sbd" />
                                            <span>
                                                <h4>
                                                    {tt(
                                                        'wallet_index.sbd_symbol'
                                                    )}
                                                </h4>
                                                <span className="text">
                                                    {tt(
                                                        'wallet_index.sbd_description'
                                                    )}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: ':order(/:category)',
    component: connect(
        (state, ownProps) => {
            const username = state.user.getIn(['current', 'username']);
            const loggedIn = !!username;
            const initialValues = {};
            return {
                username,
                initialValues,
                loggedIn,
            };
        },
        dispatch => {
            return {
                showLogin: e => {
                    if (e) e.preventDefault();
                    dispatch(userActions.showLogin({ type: 'basic' }));
                },
            };
        }
    )(WalletIndex),
};
