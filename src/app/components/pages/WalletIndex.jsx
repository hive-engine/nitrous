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
            <div
                className="LoginForm row"
                onSubmit={handleSubmit(({ data }) => {
                    dispatchSubmit(data);
                })}
            >
                <form method="post">
                    <div className="input-group">
                        <span className="input-group-label">@</span>
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
                    <div className="login-modal-buttons">
                        <br />
                        <button type="submit" disabled="" className="button">
                            Login
                        </button>
                    </div>
                </form>
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
