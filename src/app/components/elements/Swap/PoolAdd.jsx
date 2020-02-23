import React, { Component } from 'react';
import tt from 'counterpart';
import { connect } from 'react-redux';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import swapinfo from './config';

import Reveal from 'app/components/elements/Reveal';
import CloseButton from 'app/components/elements/CloseButton';
import TokenList from 'app/components/elements/Swap/TokenList';
import SelectedPool from 'app/components/elements/Swap/SelectedPool';
var swap_node = 'sct.jcob';

const SelectToken = props => {
    return (
        <div>
            <div className="able-coin">{`Balance: ${
                props.balance == undefined ? '0' : props.balance
            }`}</div>
            <input
                type="text"
                className="coin-input"
                placeholder={tt('g.amount')}
                value={props.amount}
                autoComplete="off"
                onChange={props.amountChange}
                disabled={props.inputDisabled}
            />
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
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                        <path d="M0.97168 1L6.20532 6L11.439 1" />
                    </svg>
                </i>
            </button>
        </div>
    );
};

class PoolComponent extends Component {
    constructor(props) {
        // console.log(props);
        super(props);
        this.state = {
            loadToken: true,
            show: false,
            selected_pool_show: false,
            poolMode: 0,
            selectedPoolText: 'Add Liquidity',
            input_token: 'KRWP',
            input_token_symbol: '/images/tokens/krwp.png',
            output_token: '',
            output_token_symbol: '',
            exchange_rate: 0,
            node_input_balance: 0,
            node_output_balance: 0,
            user_input_balance: 0,
            user_output_balance: 0,
            liquidity_token: 0,
            liquidity_token_rate: 0,
            liquidity_token_user: 0,
            liquidity_token_all: 0,
            liquidity_token_symbol: '',
        };
        this.info = new swapinfo();
        this.selected = '';
        this.input_amount = 0;
        this.output_amount = 0;
    }

    selectInputToken = () => {
        this.showTokenList();
        this.selected = 'input';
    };

    selectOutputToken = () => {
        this.showTokenList();
        this.selected = 'output';
    };

    showPoolMode = () => {
        this.setState({ selected_pool_show: true });
    };
    hidePoolMode = (mode, index) => {
        this.setState({ selected_pool_show: false });
    };

    showTokenList = () => {
        this.setState({ show: true });
    };

    hideTokenList = () => {
        this.setState({ show: false });
    };

    tokenClickCallback(parent, token) {
        parent.hideTokenList();
        console.log('tokenClickCallback', token);
        if (parent.selected == 'output') {
            parent.setState(
                {
                    output_token: token.name,
                    output_token_symbol: token.ico,
                },
                () => {
                    parent.calculateDeposit();
                }
            );
        }
    }

    componentDidMount() {
        document.body.classList.add('theme-swap');
    }
    inputAmountChange = async e => {
        this.setState({ input_amount: undefined });
        const amount = e.target.value;
        console.log('inputAmountChange', amount);

        this.input_amount = amount;
        this.output_amount = this.state.exchange_rate * this.input_amount;
        this.output_amount = this.output_amount.toFixed(3);
        if (this.state.exchange_rate == undefined) this.output_amount = 0;
        this.setState({
            output_amount: this.output_amount,
        });
    };
    outputAmountChange = e => {};

    errorCallback = estr => {
        console.log('errorCallback');
    };

    onClose = () => {
        console.log('onClose');
    };

    onSuccessFirst = () => {
        console.log('on Success');
        this.transferToken(
            this.state.output_token,
            this.output_amount,
            this.name,
            this.memo_2
        );
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
        if (
            this.input_amount > 0 &&
            this.output_amount > 0 &&
            input_token != '' &&
            output_token != ''
        ) {
            var node = this.info.findNode(input_token, output_token);
            var timestamp = new Date();
            var key = timestamp.getTime();
            var name = this.props.currentUser.get('username');
            var memo_1 = `@deposit:${input_token}:${output_token}:${
                node.name
            }:${name}:${key}`;
            var memo_2 = `@deposit:${output_token}:${input_token}:${
                node.name
            }:${name}:${key}`;

            this.name = name;
            this.memo_2 = memo_2;
            this.transferToken(
                input_token,
                this.input_amount,
                name,
                memo_1,
                this.onSuccessFirst
            );
        }
    };

    calculateDeposit = async () => {
        const { input_token, output_token } = this.state;
        if (input_token != '' && output_token != '') {
            var that = this;
            this.info
                .getTokenBalance(
                    this.props.currentUser.get('username'),
                    input_token
                )
                .then(balance => {
                    that.setState({ user_input_balance: balance });
                });

            this.info
                .getTokenBalance(
                    this.props.currentUser.get('username'),
                    output_token
                )
                .then(balance => {
                    that.setState({ user_output_balance: balance });
                });

            var results = await this.info.calculateDepositAmount(
                input_token,
                output_token,
                this.props.currentUser.get('username')
            );
            console.log(results);
            var liquidity_token_rate =
                100 *
                results.liquidity_token_user *
                1 /
                (results.liquidity_token_all * 1);
            this.setState({
                exchange_rate: results.exchange_rate,
                node_input_balance: results.node_input_balance,
                node_output_balance: results.node_output_balance,
                liquidity_token_all: results.liquidity_token_all,
                liquidity_token_user: results.liquidity_token_user,
                liquidity_token_rate: liquidity_token_rate.toFixed(3),
                liquidity_token: results.liquidity_token,
                liquidity_token_symbol: results.liquidity_token_symbol,
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
                <SelectedPool
                    show={this.state.selected_pool_show}
                    onHideSelcected={this.hidePoolMode}
                    selected={0}
                />
                <Reveal
                    show={this.state.show}
                    onHide={this.hideTokenList}
                    isSwapModal={true}
                >
                    <CloseButton onClick={this.hideTokenList} />
                    <h2 className="token-title">Select Token</h2>
                    <div className="token-search">
                        <form>
                            <p className="srh-icon">
                                <span className="table-cell">
                                    <img
                                        src="/images/magnifying-glass.svg"
                                        alt="search"
                                    />
                                </span>
                            </p>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search Token Name"
                            />
                        </form>
                    </div>
                    <TokenList
                        parent={this}
                        tokens={this.info.tokens}
                        onTokenClick={this.tokenClickCallback}
                    />
                </Reveal>

                <div className="tab-title">
                    <ul>
                        <li>
                            <a href="/welcome">Swap</a>
                        </li>
                        <li>
                            <a href="/welcome#test">Send</a>
                        </li>
                        <li className="active">
                            <a href="/faq.html">Pool</a>
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
                        <div className="text-label">{'Deposit'}</div>
                        <SelectToken
                            amount={input_amount}
                            amountChange={this.inputAmountChange}
                            selectedValue={this.state.selectedValue1}
                            token_name={this.state.input_token}
                            token_symbol_img={this.state.input_token_symbol}
                            inputDisabled={!this.state.loadToken}
                            // showTokenListCallback={this.selectInputToken}
                            balance={this.state.user_input_balance}
                        />
                    </div>
                    <div className="mid-space">
                        <span className="icon">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                alt="plus"
                            >
                                <path
                                    d="M1 6H6M11 6L6 6M6 1V6M6 6L6 11"
                                    stroke="#aeaeae"
                                />
                            </svg>
                        </span>
                    </div>
                    <div className="input-box">
                        <div className="text-label">
                            {'Deposit (estimated)'}
                        </div>
                        <SelectToken
                            amount={output_amount}
                            amountChange={this.outputAmountChange}
                            selectedValue={this.state.selectedValue2}
                            token_name={this.state.output_token}
                            token_symbol_img={this.state.output_token_symbol}
                            inputDisabled={true}
                            showTokenListCallback={this.selectOutputToken}
                            balance={this.state.user_output_balance}
                        />
                    </div>
                    <dl className="exchange-rate">
                        <div className="row-box">
                            <dt>Exchange Rate</dt>
                            <dd>
                                {this.state.exchange_rate > 0
                                    ? `1 ${this.state.input_token} = ${
                                          this.state.exchange_rate
                                      } ${this.state.output_token}`
                                    : '-'}
                            </dd>
                        </div>
                        <div className="row-box">
                            <dt>Current Pool Size</dt>
                            <dd>
                                {this.state.exchange_rate > 0
                                    ? `${this.state.node_input_balance} ${
                                          this.state.input_token
                                      } + ${this.state.node_output_balance} ${
                                          this.state.output_token
                                      }`
                                    : '-'}
                            </dd>
                        </div>
                        <div className="row-box">
                            <dt>Your Pool Share (%)</dt>
                            <dd>
                                {this.state.exchange_rate > 0
                                    ? `${(
                                          this.state.node_input_balance *
                                          this.state.liquidity_token_rate /
                                          100
                                      ).toFixed(3)} ${
                                          this.state.input_token
                                      } + ${(
                                          this.state.node_output_balance *
                                          this.state.liquidity_token_rate /
                                          100
                                      ).toFixed(3)} ${
                                          this.state.output_token
                                      } (${this.state.liquidity_token_rate}%)`
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
