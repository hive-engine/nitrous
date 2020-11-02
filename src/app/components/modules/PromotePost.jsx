import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import { HIVE_ENGINE, LIQUID_TOKEN_UPPERCASE } from 'app/client_config';
import tt from 'counterpart';

class PromotePost extends Component {
    static propTypes = {
        author: PropTypes.string.isRequired,
        permlink: PropTypes.string.isRequired,
    };

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
        // this.assetChange = this.assetChange.bind(this);
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
        const {
            author,
            permlink,
            hive,
            currentUser,
            promotedPostAccount,
            onClose,
            hiveEngine,
        } = this.props;
        const { amount } = this.state;
        this.setState({ loading: true });
        console.log('-- PromotePost.onSubmit -->');
        this.props.dispatchSubmit({
            amount,
            asset: LIQUID_TOKEN_UPPERCASE,
            author,
            permlink,
            hive,
            currentUser,
            promotedPostAccount,
            onClose,
            errorCallback: this.errorCallback,
            hiveEngine,
        });
    }

    amountChange(e) {
        const amount = e.target.value;
        // console.log('-- PromotePost.amountChange -->', amount);
        this.setState({ amount });
    }

    // assetChange(e) {
    //     const asset = e.target.value;
    //     console.log('-- PromotePost.assetChange -->', e.target.value);
    //     this.setState({asset});
    // }

    render() {
        const { amount, loading, amountError, trxError } = this.state;
        const { currentUser } = this.props;
        const balance = currentUser.has('token_balances')
            ? parseFloat(currentUser.getIn(['token_balances', 'balance']))
            : 0;

        const submitDisabled = !amount;

        return (
            <div className="PromotePost row">
                <div className="column small-12">
                    <form
                        onSubmit={this.onSubmit}
                        onChange={() => this.setState({ trxError: '' })}
                    >
                        <h4>{tt('promote_post_jsx.promote_post')}</h4>
                        <p>
                            {tt(
                                'promote_post_jsx.spend_your_DEBT_TOKEN_to_advertise_this_post',
                                { DEBT_TOKEN: LIQUID_TOKEN_UPPERCASE }
                            )}.
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
                                        {LIQUID_TOKEN_UPPERCASE}
                                    </span>
                                    <div className="error">{amountError}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            {tt('g.balance', {
                                balanceValue: `${balance} ${
                                    LIQUID_TOKEN_UPPERCASE
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
                                    {tt('g.promote')}
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
        const hiveEngine = HIVE_ENGINE;
        const promotedPostAccount = state.app.getIn(
            ['scotConfig', 'config', 'promoted_post_account'],
            'null'
        );
        return {
            ...ownProps,
            currentUser,
            promotedPostAccount,
            hiveEngine,
        };
    },

    // mapDispatchToProps
    dispatch => ({
        dispatchSubmit: ({
            amount,
            asset,
            author,
            permlink,
            hive,
            currentUser,
            promotedPostAccount,
            onClose,
            errorCallback,
            hiveEngine,
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
                    symbol: LIQUID_TOKEN_UPPERCASE,
                    to: promotedPostAccount,
                    quantity: amount,
                    memo: `${hive && !hiveEngine ? 'h' : ''}@${author}/${
                        permlink
                    }`,
                },
            };
            const operation = {
                id: hiveEngine ? 'ssc-mainnet-hive' : 'ssc-mainnet1',
                required_auths: [username],
                json: JSON.stringify(transferOperation),
                __config: {
                    successMessage:
                        tt(
                            'promote_post_jsx.you_successfully_promoted_this_post'
                        ) + '.',
                },
            };
            dispatch(
                transactionActions.broadcastOperation({
                    type: 'custom_json',
                    operation,
                    successCallback,
                    errorCallback,
                    useHive: hiveEngine,
                })
            );
        },
    })
)(PromotePost);
