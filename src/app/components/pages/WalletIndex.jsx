/* eslint react/prop-types: 0 */
import React from 'react';
import { connect } from 'react-redux';
import reactForm from 'app/utils/ReactForm';
import tt from 'counterpart';
import * as userActions from 'app/redux/UserReducer';
import { validate_account_name } from 'app/utils/ChainValidation';

class WalletIndex extends React.Component {
    constructor(props) {
        super();
        this.initForm(props);
    }

    initForm(props) {
        reactForm({
            name: 'login',
            instance: this,
            fields: ['username'],
            initialValues: props.initialValues,
            validation: values => ({
                username: !values.username
                    ? tt('g.required')
                    : validate_account_name(values.username.split('/')[0]),
            }),
        });
    }

    render() {
        const { dispatchSubmit } = this.props;
        const { username } = this.state;
        const { submitting, valid, handleSubmit } = this.state.login;
        return (
            <div className="WalletIndex">
                <div className="row">
                    <div className="column login">
                        <h3 style={{ fontWeight: 'bold' }}>
                            {tt('wallet_index.title')}
                        </h3>
                        <p>{tt('wallet_index.description')}</p>
                        <form
                            method="post"
                            onSubmit={handleSubmit(({ data }) => {
                                dispatchSubmit(data);
                            })}
                        >
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="input-group-field"
                                    required
                                    placeholder={tt(
                                        'loginform_jsx.enter_your_username'
                                    )}
                                    ref="username"
                                    name="username"
                                    autoComplete="on"
                                    {...username.props}
                                />
                            </div>
                            <div className="modal-buttons">
                                <button
                                    type="submit"
                                    disabled=""
                                    className="button"
                                >
                                    {tt('wallet_index.login')}
                                </button>
                            </div>
                        </form>
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
            const initialValues = {};
            return {
                initialValues,
            };
        },
        dispatch => {
            return {
                dispatchSubmit: data => {
                    dispatch(userActions.usernameLogin(data));
                },
            };
        }
    )(WalletIndex),
};
