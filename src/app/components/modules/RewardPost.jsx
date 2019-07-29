import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import {
    APP_NAME,
    SCOT_TAG,
    LIQUID_TOKEN_UPPERCASE,
    SEARCH_SELECTION_REWARD_AMOUNT,
    SEARCH_SELECTION_BURN_AMOUNT,
} from 'app/client_config';
import tt from 'counterpart';

class RewardPost extends Component {
    static propTypes = {
        author: PropTypes.string.isRequired,
        permlink: PropTypes.string.isRequired,
        onSuccess: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            trxError: '',
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.errorCallback = this.errorCallback.bind(this);
    }

    errorCallback(estr) {
        this.setState({ trxError: estr, loading: false });
    }

    onSubmit(e) {
        e.preventDefault();
        const { author, permlink, onSuccess, onClose } = this.props;
        this.setState({ loading: true });

        console.log('-- RewardPost.onSubmit -->');

        // reward author
        this.props.dispatchSubmit({
            asset: LIQUID_TOKEN_UPPERCASE,
            author,
            permlink,
            currentUser: this.props.currentUser,
            onSuccess,
            onClose,
            errorCallback: this.errorCallback,
        });
    }

    render() {
        const { loading, trxError } = this.state;
        const { currentUser, author } = this.props;

        let balance = currentUser.has('token_balances')
            ? parseFloat(currentUser.getIn(['token_balances', 'balance']))
            : 0;
        balance = isNaN(balance) ? 0 : balance;
        const DEBT_TOKEN = LIQUID_TOKEN_UPPERCASE;
        SEARCH_SELECTION_REWARD_AMOUNT + SEARCH_SELECTION_BURN_AMOUNT;
        const reward_amount = SEARCH_SELECTION_REWARD_AMOUNT;
        const burn_amount = SEARCH_SELECTION_BURN_AMOUNT;
        const amount = reward_amount + burn_amount;
        const notEnoughBalance =
            isNaN(balance) || isNaN(amount) || balance < amount;
        const submitDisabled = !author || !amount || notEnoughBalance;

        return (
            <div className="RewardPost row">
                <div className="column small-12">
                    <form onSubmit={this.onSubmit}>
                        <h4>{tt('reward_post_jsx.reward_post')}</h4>
                        <p>
                            {tt('reward_post_jsx.reward_post_and_get_vote', {
                                amount,
                                DEBT_TOKEN,
                            })}
                        </p>
                        <hr />
                        <p>
                            {' '}
                            {tt('reward_post_jsx.confirm_reward_post', {
                                amount,
                                DEBT_TOKEN,
                                author,
                                reward_amount,
                                burn_amount,
                            })}
                        </p>
                        {notEnoughBalance && (
                            <div className="error">
                                <hr />
                                <p>
                                    {tt('g.balance', {
                                        balanceValue: `${balance} ${
                                            LIQUID_TOKEN_UPPERCASE
                                        }`,
                                    })}
                                </p>
                                <br />
                            </div>
                        )}
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
                                    {tt('g.confirm')}
                                </button>
                            </span>
                        )}
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const currentUser = state.user.getIn(['current']);
        return { ...ownProps, currentUser };
    },

    // mapDispatchToProps
    dispatch => ({
        dispatchSubmit: ({
            asset,
            author,
            permlink,
            currentUser,
            onSuccess,
            onClose,
            errorCallback,
        }) => {
            if (!currentUser) {
                return;
            }

            const username = currentUser.get('username');

            const successCallback = () => {
                dispatch(
                    globalActions.getState({ url: `@${username}/transfers` })
                ); // refresh transfer history
                onSuccess();
                onClose();
            };

            const buildTransferOperation = (receiver, amount) => {
                return {
                    contractName: 'tokens',
                    contractAction: 'transfer',
                    contractPayload: {
                        symbol: LIQUID_TOKEN_UPPERCASE,
                        to: receiver,
                        quantity: amount.toString(),
                        memo: `search and click: @${author}/${permlink}`,
                    },
                };
            };

            const transferOperations = [
                buildTransferOperation(author, SEARCH_SELECTION_REWARD_AMOUNT),
                buildTransferOperation('null', SEARCH_SELECTION_BURN_AMOUNT),
            ];

            const operation = {
                id: 'ssc-mainnet1',
                required_auths: [username],
                json: JSON.stringify(transferOperations),
                __config: {
                    successMessage:
                        tt('search_jsx.successfully_rewarded_the_author') + '.',
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
)(RewardPost);
