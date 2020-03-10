import React, { Component } from 'react';
import tt from 'counterpart';
import { connect } from 'react-redux';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import swapinfo from './config';
import SwapQueue from './SwapQueue';
import { getSwapQueue } from 'app/utils/steemApi';
var swap_node = 'sct.swap';

const SelectToken = props => {
    return (
        <div>
            <div className="able-coin">
                {props.showTokenListCallback == null
                    ? ''
                    : `Balance: ${
                          props.balance == undefined ? '0' : props.balance
                      }`}
            </div>
            <input
                type="text"
                className="coin-input"
                placeholder={tt('g.amount')}
                value={props.amount}
                autoComplete="off"
                onChange={props.amountChange}
                disabled={props.inputDisabled}
            />
            {props.showTokenListCallback == null ? (
                ''
            ) : (
                <button
                    type="button"
                    className="coin-select"
                    value={props.token_name == '' ? '0' : '1'}
                    onClick={props.showTokenListCallback}
                >
                    {props.token_name == '' ? (
                        ''
                    ) : (
                        <img src={props.token_symbol_img} />
                    )}
                    <span>
                        {props.token_name == ''
                            ? 'Select a token'
                            : `${props.token_name}`}
                    </span>
                    <i className="arrow">
                        <svg
                            width="12"
                            height="7"
                            viewBox="0 0 12 7"
                            fill="none"
                        >
                            <path d="M0.97168 1L6.20532 6L11.439 1" />
                        </svg>
                    </i>
                </button>
            )}
        </div>
    );
};

class PoolComponent extends Component {
    constructor(props) {
        // console.log(props);
        super(props);
        this.state = {
            loadToken: true,
            selected_pool_show: false,
            selectedPoolText: 'Remove Liquidity',
            input_token: '',
            input_token_symbol: '',
            output_token: 'KRWP',
            output_token_symbol: '/images/tokens/noimage.png',
            exchange_rate: 0,
            node_token_balance: 0,
            node_krwp_balance: 0,
            user_input_balance: 0,
            user_output_balance: 0,
            user_get_liquidity: 0,
            liquidity_token: 0,
            liquidity_token_rate: 0,
            liquidity_token_all: 0,
            liquidity_token_symbol: '',
            queue_size: 0,
        };
        this.info = new swapinfo();
        this.selected = '';
        this.input_amount = 0;
        this.output_amount = 0;
    }

    async getSwapQueueInfoFromApi() {
        console.log('getSwapQueueInfo!!!!');
        var that = this;
        getSwapQueue().then(result => {
            console.log(result.length);
            that.setState({ queue_size: result.length });
        });
    }

    selectInputToken = () => {
        this.props.showSelectToken(
            this,
            this.info.tokens,
            this.tokenClickCallback
        );
        this.selected = 'input';
    };

    selectOutputToken = () => {
        this.props.showSelectToken(
            this,
            this.info.tokens,
            this.tokenClickCallback
        );
        this.selected = 'output';
    };

    showPoolMode = () => {
        this.props.showSelectDialog(1);
    };

    tokenClickCallback(parent, token) {
        console.log('tokenClickCallback', token);
        if (parent.selected == 'input')
            parent.setState(
                {
                    input_token: token.name,
                    input_token_symbol: token.ico,
                },
                () => {
                    parent.calculateRemove();
                }
            );
    }

    componentDidMount() {
        document.body.classList.add('theme-swap');
        this.getSwapQueueInfoFromApi();
    }

    inputAmountChange = async e => {
        this.setState({ input_amount: undefined });
        const amount = e.target.value;
        console.log('inputAmountChange', amount);

        this.input_amount = amount;

        var tokenWithdraw = this.state.rate_input_token * this.input_amount;
        tokenWithdraw = this.info.floorNumber(tokenWithdraw);

        var krwpWithdraw = this.state.rate_output_token * this.input_amount;
        krwpWithdraw = this.info.floorNumber(krwpWithdraw);

        if (this.state.rate_input_token > 0 && this.state.rate_output_token > 0)
            this.setState({
                output_amount: `${krwpWithdraw} ${this.state.output_token} + ${
                    tokenWithdraw
                } ${this.state.input_token}`,
            });
    };

    outputAmountChange = e => {};

    errorCallback = estr => {
        console.log('errorCallback');
    };

    onClose = () => {
        console.log('onClose');
    };

    transferToken(input_token, input_amount, username, memo, onSuccess = null) {
        if (input_token === 'SBD') {
            this.props.dispatchTransfer({
                amount: input_amount,
                asset: input_token,
                username,
                memo,
                onClose: this.onClose,
                currentUser: this.props.currentUser,
                errorCallback: this.errorCallback,
                onSuccess,
            });
        }
        if (input_token === 'STEEM') {
            this.props.dispatchTransfer({
                amount: input_amount,
                asset: input_token,
                username,
                memo,
                onClose: this.onClose,
                currentUser: this.props.currentUser,
                errorCallback: this.errorCallback,
                onSuccess,
            });
        } else {
            this.props.dispatchSubmit({
                amount: input_amount,
                asset: input_token,
                username,
                memo,
                onClose: this.onClose,
                currentUser: this.props.currentUser,
                errorCallback: this.errorCallback,
                onSuccess,
            });
        }
    }

    onClickDeposit = e => {
        console.log('transfer');
        const { input_token, output_token } = this.state;
        if (this.input_amount > 0 && input_token != '' && output_token != '') {
            var node = this.info.findNode(input_token, output_token);
            var name = this.props.currentUser.get('username');
            var memo_1 = `@burn:${node.liquidity_token}:${node.name}:${name}`;

            this.transferToken(
                node.liquidity_token,
                this.input_amount,
                name,
                memo_1
            );
        }
    };

    calculateRemove = async () => {
        const { input_token } = this.state;
        if (input_token != '') {
            this.getSwapQueueInfoFromApi();

            var results = await this.info.calculateRemoveAmount(
                input_token,
                this.props.currentUser.get('username')
            );
            console.log(results);
            var liquidity_token_rate =
                100 *
                results.liquidity_token_user *
                1 /
                (results.liquidity_token_all * 1);
            this.setState({
                rate_input_token: results.rate_input_token,
                rate_output_token: results.rate_output_token,
                exchange_rate: results.exchange_rate,
                node_token_balance: results.node_token_balance,
                node_krwp_balance: results.node_krwp_balance,
                liquidity_token_all: results.liquidity_token_all,
                liquidity_token_user: results.liquidity_token_user,
                liquidity_token_rate: this.info.floorNumber(
                    liquidity_token_rate
                ),
                liquidity_token_symbol: results.liquidity_token_symbol,
                user_input_balance: results.liquidity_token_user,
            });
        }
    };

    selectToken = token => {
        console.log('selectToken', token);
    };

    render() {
        const { input_amount, output_amount } = this.state;

        return (
            <div className="swap-wrap">
                <div className="tab-title">
                    <ul>
                        <li>
                            <a href="/market#swap">Swap</a>
                        </li>
                        <li>
                            <a href="/market#test">Send</a>
                        </li>
                        <li className="active">
                            <a href="/market#add">Pool</a>
                        </li>
                    </ul>
                </div>
                <div className="top-space">
                    <button
                        type="button"
                        className="turn-liquidity"
                        onClick={this.showPoolMode}
                    >
                        {this.state.selectedPoolText}
                        <span className="down-arrow">
                            <svg
                                width="12"
                                height="7"
                                viewBox="0 0 12 7"
                                fill="none"
                                alt="arrow down"
                            >
                                <path
                                    d="M0.97168 1L6.20532 6L11.439 1"
                                    stroke="#2F80ED"
                                />
                            </svg>
                        </span>
                    </button>
                </div>
                <div className="swap-form">
                    <div className="input-box">
                        <div className="text-label">{'Pool Tokens'}</div>
                        <SelectToken
                            amount={input_amount}
                            amountChange={this.inputAmountChange}
                            selectedValue={this.state.selectedValue1}
                            token_name={this.state.input_token}
                            token_symbol_img={this.state.input_token_symbol}
                            inputDisabled={!this.state.loadToken}
                            showTokenListCallback={this.selectInputToken}
                            balance={this.state.user_input_balance}
                        />
                    </div>
                    <div className="mid-space">
                        <span className="icon">
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="#aeaeae"
                                alt="arrow"
                            >
                                <path d="M5.298 0H4.24v7.911h-.075L1.256 4.932l-.717.735L4.769 10 9 5.667l-.718-.735-2.908 2.979h-.076V0z" />
                            </svg>
                        </span>
                    </div>
                    <div className="input-box">
                        <div className="text-label">{'Output'}</div>
                        <SelectToken
                            amount={output_amount}
                            amountChange={this.outputAmountChange}
                            selectedValue={this.state.selectedValue2}
                            token_name={this.state.output_token}
                            token_symbol_img={this.state.output_token_symbol}
                            inputDisabled={true}
                            // showTokenListCallback={this.selectOutputToken}
                            balance={this.state.user_output_balance}
                        />
                    </div>
                    <dl className="exchange-rate">
                        <div className="row-box">
                            <dt>Exchange Rate</dt>
                            <dd>
                                {this.state.exchange_rate > 0
                                    ? `1 ${this.state.output_token} = ${
                                          this.state.exchange_rate
                                      } ${this.state.input_token}`
                                    : '-'}
                            </dd>
                        </div>
                        <div className="row-box">
                            <dt>Current Pool Size</dt>
                            <dd>
                                {this.state.exchange_rate > 0
                                    ? `${this.state.node_krwp_balance} ${
                                          this.state.output_token
                                      } + ${this.state.node_token_balance} ${
                                          this.state.input_token
                                      }`
                                    : '-'}
                            </dd>
                        </div>
                        <div className="row-box">
                            <dt>Your Pool Share (%)</dt>
                            <dd>
                                {this.state.exchange_rate > 0
                                    ? `${this.info.floorNumber(
                                          this.state.rate_output_token *
                                              this.state.user_input_balance
                                      )} ${
                                          this.state.output_token
                                      } + ${this.info.floorNumber(
                                          this.state.rate_input_token *
                                              this.state.user_input_balance
                                      )} ${this.state.input_token}
                                    ${this.state.output_token} (${
                                          this.state.liquidity_token_rate
                                      }%)`
                                    : '-'}
                            </dd>
                        </div>
                    </dl>
                    <button
                        type="button"
                        className="submit-coin"
                        onClick={this.onClickDeposit}
                    >
                        {this.state.selectedPoolText}
                    </button>
                    <SwapQueue item={this.state.queue_size} />
                </div>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        // console.log('connect',state,ownProps)
        try {
            const currentUser = state.user.getIn(['current']);
            return { ...ownProps, currentUser };
        } catch (error) {
            console.log('connect', error);
            return { ...ownProps, undefined };
        }
    },

    // mapDispatchToProps
    dispatch => ({
        showSelectToken: (parent, tokens, onTokenClick) => {
            dispatch(
                globalActions.showDialog({
                    name: 'selectedToken',
                    params: { parent, tokens, onTokenClick },
                })
            );
        },
        showSelectDialog: selected => {
            dispatch(
                globalActions.showDialog({
                    name: 'selectedMode',
                    params: { selected },
                })
            );
        },
        dispatchTransfer: ({
            amount,
            asset,
            username,
            memo,
            onClose,
            errorCallback,
            onSuccess,
        }) => {
            const successCallback = () => {
                dispatch(
                    globalActions.getState({ url: `@${username}/transfers` })
                ); // refresh transfer history
                if (onSuccess != null) onSuccess();
                onClose();
            };

            const operation = {
                from: username,
                to: swap_node,
                amount: parseFloat(amount).toFixed(3) + ' ' + asset,
                memo,
                __config: {
                    successMessage: 'Token transfer was successful.' + '.',
                },
            };
            dispatch(
                transactionActions.broadcastOperation({
                    type: 'transfer',
                    operation,
                    successCallback,
                    errorCallback,
                })
            );
        },
        dispatchSubmit: ({
            amount,
            asset,
            username,
            memo,
            onClose,
            errorCallback,
            onSuccess,
        }) => {
            const successCallback = () => {
                dispatch(
                    globalActions.getState({ url: `@${username}/transfers` })
                ); // refresh transfer history
                if (onSuccess != null) onSuccess();
                onClose();
            };
            const transferOperation = {
                contractName: 'tokens',
                contractAction: 'transfer',
                contractPayload: {
                    symbol: asset,
                    to: swap_node,
                    quantity: amount,
                    memo,
                },
            };
            const operation = {
                id: 'ssc-mainnet1',
                required_auths: [username],
                json: JSON.stringify(transferOperation),
                __config: {
                    successMessage: 'Token transfer was successful.' + '.',
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
)(PoolComponent);
