import React, { Component } from 'react';
import tt from 'counterpart';
import { connect } from 'react-redux';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import swapinfo from './config';

import Reveal from 'app/components/elements/Reveal';
import CloseButton from 'app/components/elements/CloseButton';
import TokenList from 'app/components/elements/Swap/TokenList';
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
            {/* <select onChange={props.selectedChange} className="coin-select">{options}</select> */}
        </div>
    );
};

class SwapComponent extends Component {
    constructor(props) {
        // console.log(props);
        super(props);
        this.state = {
            loadToken: true,
            show: false,
            input_token: '',
            output_token: '',
            input_token_symbol: '',
            output_token_symbol: '',
            exchange_rate: 0,
            node_output_balance: 0,
            user_input_balance: 0,
            user_output_balance: 0,
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

    showTokenList = () => {
        this.setState({ show: true });
    };

    hideTokenList = () => {
        this.setState({ show: false });
    };

    tokenClickCallback(parent, token) {
        parent.hideTokenList();
        console.log('tokenClickCallback', token);
        if (parent.selected == 'input')
            parent.setState(
                {
                    input_token: token.name,
                    input_token_symbol: token.ico,
                },
                () => {
                    parent.calculateExchange();
                }
            );
        else if (parent.selected == 'output')
            parent.setState(
                {
                    output_token: token.name,
                    output_token_symbol: token.ico,
                },
                () => {
                    parent.calculateExchange();
                }
            );
    }

    inputSelected = e => {
        console.log('-- swap.inputSelected -->', e.target.value);
    };

    outputSelected = e => {
        console.log('-- swap.outputSelected -->', e.target.value);
    };

    componentDidMount() {
        document.body.classList.add('theme-swap');
    }

    inputAmountChange = async e => {
        this.setState({ input_amount: undefined });
        const amount = e.target.value;
        console.log('inputAmountChange', amount);

        this.input_amount = amount;
        this.calculateExchange();
    };

    outputAmountChange = e => {};

    errorCallback = estr => {
        console.log('errorCallback');
    };

    onClose = () => {
        console.log('onClose');
    };

    onClickSwap = e => {
        console.log('transfer');
        const { input_token, output_token } = this.state;
        if (
            this.input_amount > 0 &&
            this.output_amount > 0 &&
            input_token != '' &&
            output_token != ''
        ) {
            var node = this.info.findNode(input_token, output_token);
            if (input_token === 'SBD') {
                this.props.dispatchTransfer({
                    amount: this.input_amount,
                    asset: input_token,
                    outputasset: output_token,
                    nodeName: node.name,
                    onClose: this.onClose,
                    currentUser: this.props.currentUser,
                    errorCallback: this.errorCallback,
                });
            }
            if (input_token === 'STEEM') {
                this.props.dispatchTransfer({
                    amount: this.input_amount,
                    asset: input_token,
                    outputasset: output_token,
                    nodeName: node.name,
                    onClose: this.onClose,
                    currentUser: this.props.currentUser,
                    errorCallback: this.errorCallback,
                });
            } else {
                this.props.dispatchSubmit({
                    amount: this.input_amount,
                    asset: input_token,
                    outputasset: output_token,
                    nodeName: node.name,
                    onClose: this.onClose,
                    currentUser: this.props.currentUser,
                    errorCallback: this.errorCallback,
                });
            }
        }
    };

    calculateExchange = async () => {
        var exchange_rate = 0;
        const { input_token, output_token } = this.state;
        if (input_token != '' && output_token != '') {
            var results = await this.info.calculateExchangeAmount(
                input_token,
                output_token,
                this.input_amount
            );

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

            if (this.input_amount > 0) {
                this.output_amount = results.estimated_output_amount;
                exchange_rate = results.exchange_rate;
                this.setState({
                    output_amount: this.output_amount,
                    exchange_rate,
                    node_output_balance: results.node_output_balance,
                });
            } else {
                this.setState({
                    output_amount: 0,
                    exchange_rate: 0,
                    node_output_balance: results.node_output_balance,
                });
            }
        }
        return exchange_rate;
    };

    selectToken = token => {
        console.log('selectToken', token);
    };

    render() {
        const { input_amount, output_amount } = this.state;

        return (
            <div className="swap-wrap">
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
                        <li className="active">
                            <a href="/welcome">Swap</a>
                        </li>
                        <li>
                            <a href="/welcome#test">Send</a>
                        </li>
                        <li>
                            <a href="/faq.html">Pool</a>
                        </li>
                    </ul>
                </div>
                <div className="swap-form">
                    <div className="input-box">
                        <div className="text-label">{'Input'}</div>
                        <SelectToken
                            amount={input_amount}
                            amountChange={this.inputAmountChange}
                            selectedChange={this.inputSelected}
                            selectedValue={this.state.selectedValue1}
                            token_name={this.state.input_token}
                            token_symbol_img={this.state.input_token_symbol}
                            inputDisabled={!this.state.loadToken}
                            showTokenListCallback={this.selectInputToken}
                            balance={this.state.user_input_balance}
                        />
                    </div>
                    <div className="mid-space">
                        <button type="button" className="turn-upDown">
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="#222"
                                alt="arrow"
                            >
                                <path d="M5.298 0H4.24v7.911h-.075L1.256 4.932l-.717.735L4.769 10 9 5.667l-.718-.735-2.908 2.979h-.076V0z" />
                            </svg>
                        </button>
                    </div>
                    <div className="input-box">
                        <div className="text-label">{'Output (estimated)'}</div>
                        <SelectToken
                            amount={output_amount}
                            amountChange={this.outputAmountChange}
                            selectedChange={this.outputSelected}
                            selectedValue={this.state.selectedValue2}
                            token_name={this.state.output_token}
                            token_symbol_img={this.state.output_token_symbol}
                            inputDisabled={true}
                            showTokenListCallback={this.selectOutputToken}
                            balance={this.state.user_output_balance}
                        />
                    </div>
                    <dl className="exchange-rate">
                        <dt>Exchange Rate</dt>
                        <dd>
                            {this.state.exchange_rate > 0
                                ? `1 ${this.state.input_token} = ${
                                      this.state.exchange_rate
                                  } ${this.state.output_token}`
                                : '-'}
                        </dd>
                    </dl>

                    <button
                        type="button"
                        className="submit-coin"
                        onClick={this.onClickSwap}
                    >
                        {'Swap'}
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
            outputasset,
            nodeName,
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

            const operation = {
                from: username,
                to: swap_node,
                amount: parseFloat(amount).toFixed(3) + ' ' + asset,
                memo: `@swap:${asset}:${outputasset}:${nodeName}:${username}`,
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
            outputasset,
            nodeName,
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
                    symbol: asset,
                    to: swap_node,
                    quantity: amount,
                    memo: `@swap:${asset}:${outputasset}:${nodeName}:${
                        username
                    }`,
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
)(SwapComponent);
