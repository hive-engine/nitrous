import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import {
    LIQUID_TOKEN_SCTM_UPPERCASE,
    SCTM_BURN_ACCOUNT,
} from 'app/client_config';
import tt from 'counterpart';

class SCTMBurn extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);
        this.state = {
            amount: '1.0',
            asset: '',
            loading: false,
            amountError: '',
            trxError: '',
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.errorCallback = this.errorCallback.bind(this);
        this.amountChange = this.amountChange.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            ReactDOM.findDOMNode(this.refs.amount).focus();
        }, 300);
    }

    errorCallback(estr) {
        this.setState({ trxError: estr, loading: false });
    }

    onSubmit(e) {
        e.preventDefault();
        const { author, permlink, onClose } = this.props;
        const { amount } = this.state;
        this.setState({ loading: true });
        console.log('-- PromotePost.onSubmit -->');
        this.props.dispatchSubmit({
            amount,
            asset: LIQUID_TOKEN_SCTM_UPPERCASE,
            author,
            permlink,
            onClose,
            currentUser: this.props.currentUser,
            errorCallback: this.errorCallback,
        });
    }

    amountChange(e) {
        const amount = e.target.value;
        this.setState({ amount });
    }

    render() {
        const { amount, loading, amountError, trxError } = this.state;
        const { currentUser } = this.props;
        const sctm_price = this.props.scotInfo.getIn(['sctm_price']);
        const balance = currentUser.has('sctm_token_balances')
            ? parseFloat(currentUser.getIn(['sctm_token_balances', 'balance']))
            : 0;

        const submitDisabled = !amount;

        return (
            <div className="PromotePost row">
                <div className="column small-12">
                    <form
                        onSubmit={this.onSubmit}
                        onChange={() => this.setState({ trxError: '' })}
                    >
                        <h4>{tt('sctmburn.title')}</h4>
                        <p>
                            {/* {tt('sctmburn.content')} */}
                            {tt('sctmburn.content', { SCTM_PRICE: sctm_price })}
                        </p>
                        <hr />
                        <div className="row">
                            <div className="column small-7 medium-5 large-4">
                                <label>{tt('g.amount')}</label>
                                <div className="input-group">
                                    <input
                                        className="input-group-field"
                                        type="text"
                                        placeholder={tt('g.amount')}
                                        value={amount}
                                        ref="amount"
                                        autoComplete="off"
                                        disabled={loading}
                                        onChange={this.amountChange}
                                    />
                                    <span className="input-group-label">
                                        {LIQUID_TOKEN_SCTM_UPPERCASE}
                                    </span>
                                    <div className="error">{amountError}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            {tt('g.balance', {
                                balanceValue: `${balance} ${
                                    LIQUID_TOKEN_SCTM_UPPERCASE
                                }`,
                            })}
                        </div>
                        <br />
                        {loading && (
                            <span>
                                <LoadingIndicator type="circle" />
                                <br />
                            </span>
                        )}
                        {!loading && (
                            <span>
                                {trxError && (
                                    <div className="error">{trxError}</div>
                                )}
                                <button
                                    type="submit"
                                    className="button"
                                    disabled={submitDisabled}
                                >
                                    {tt('sctmburn.request')}
                                </button>
                            </span>
                        )}
                    </form>
                </div>
            </div>
        );
    }
}

// const AssetBalance = ({onClick, balanceValue}) =>
//     <a onClick={onClick} style={{borderBottom: '#A09F9F 1px dotted', cursor: 'pointer'}}>Balance: {balanceValue}</a>

export default connect(
    (state, ownProps) => {
        const currentUser = state.user.getIn(['current']);
        const scotConfig = state.app.get('scotConfig');

        return {
            ...ownProps,
            currentUser,
            scotBurn: scotConfig.getIn(['config', 'burn']),
            scotInfo: scotConfig.getIn(['config', 'info']),
        };
    },

    // mapDispatchToProps
    dispatch => ({
        dispatchSubmit: ({
            amount,
            asset,
            author,
            permlink,
            currentUser,
            onClose,
            errorCallback,
        }) => {
            const username = currentUser.get('username');

            const successCallback = () => {
                dispatch(
                    globalActions.getState({ url: `@${username}/transfers` })
                ); // refresh transfer history
                onClose();
            };
            const transferOperation = {
                contractName: 'tokens',
                contractAction: 'transfer',
                contractPayload: {
                    symbol: LIQUID_TOKEN_SCTM_UPPERCASE,
                    to: SCTM_BURN_ACCOUNT,
                    quantity: amount,
                    memo: `SCTM Burn`,
                },
            };
            const operation = {
                id: 'ssc-mainnet1',
                required_auths: [username],
                json: JSON.stringify(transferOperation),
                __config: {
                    successMessage: tt('sctmburn.successfully_msg') + '.',
                },
            };
            dispatch(
                transactionActions.broadcastOperation({
                    type: 'custom_json',
                    operation,
                    successCallback,
                    errorCallback,
                })
            );
        },
    })
)(SCTMBurn);
