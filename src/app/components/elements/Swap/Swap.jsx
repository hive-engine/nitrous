import React, { Component } from 'react';
import tt from 'counterpart';
import { connect } from 'react-redux';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import swapinfo from './config';
import SwapQueue from './SwapQueue';
import { getSwapQueue } from 'app/utils/steemApi';

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
            input_token: '',
            output_token: '',
            input_token_symbol: '',
            output_token_symbol: '',
            exchange_rate: 0,
            node_output_balance: 0,
            user_input_balance: 0,
            user_output_balance: 0,
            queue_size: 0,
            click_exchnage: 0,
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

    tokenClickCallback(parent, token) {
        console.log('tokenClickCallback', token);
        parent.setState({ click_exchnage: 0 });
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
        this.getSwapQueueInfoFromApi();
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

    transferToken(input_token, input_amount, username, memo) {
        if (input_token === 'SBD') {
            this.props.dispatchTransfer({
                amount: input_amount,
                asset: input_token,
                username,
                memo,
                onClose: this.onClose,
                currentUser: this.props.currentUser,
                errorCallback: this.errorCallback,
                onSuccess: null,
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
                onSuccess: null,
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
                onSuccess: null,
            });
        }
    }

    onClickSwap = e => {
        console.log('transfer');
        const { input_token, output_token } = this.state;
        if (
            this.input_amount > 0 &&
            this.output_amount > 0 &&
            input_token != '' &&
            output_token != ''
        ) {
            if (input_token != 'KRWP' && output_token != 'KRWP') {
                console.log('1');
                console.log(input_token, output_token);

                var node1 = this.info.findNode(input_token, 'KRWP');
                var node2 = this.info.findNode('KRWP', output_token);
                var name = this.props.currentUser.get('username');
                var memo_1 = `@swap2:${input_token}:${'KRWP'}:${output_token}:${
                    node1.name
                }:${node2.name}:${name}`;
                this.transferToken(
                    input_token,
                    this.input_amount,
                    name,
                    memo_1
                );
            } else {
                console.log('2');
                console.log(input_token, output_token);
                var node1 = this.info.findNode(input_token, output_token);
                var name = this.props.currentUser.get('username');
                var memo_1 = `@swap:${input_token}:${output_token}:${
                    node1.name
                }:${name}`;

                this.transferToken(
                    input_token,
                    this.input_amount,
                    name,
                    memo_1
                );
            }
        }
    };

    calculateExchange = async () => {
        var exchange_rate = 0;
        const { input_token, output_token } = this.state;

        var that = this;
        this.info
            .getTokenBalance(
                this.props.currentUser.get('username'),
                input_token
            )
            .then(balance => {
                that.setState({ user_input_balance: balance });
            });

        if (input_token != '' && output_token != '') {
            var results = null;

            if (input_token == output_token) {
                results = 0;
            } else if (input_token != 'KRWP' && output_token != 'KRWP') {
                results = await this.info.calculateExchangeAmount2(
                    input_token,
                    output_token,
                    this.input_amount
                );
            } else {
                results = await this.info.calculateExchangeAmount(
                    input_token,
                    output_token,
                    this.input_amount
                );
            }

            this.getSwapQueueInfoFromApi();

            if (this.input_amount > 0) {
                console.log(results.estimated_output_amount);
                this.output_amount = results.estimated_output_amount;
                if (results.estimated_output_amount == undefined)
                    this.output_amount = 0;

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
                    click_exchnage: 0,
                    node_output_balance: results.node_output_balance,
                });
            }
        }
        return exchange_rate;
    };

    chnageRate = () => {
        var click_exchnage = 0;
        if (this.state.click_exchnage == 0) click_exchnage = 1;
        else click_exchnage = 0;
        this.setState({ click_exchnage });
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
                        <li className="active">
                            <a href="/market#swap">Swap</a>
                        </li>
                        <li>
                            <a href="/market#test">Send</a>
                        </li>
                        <li>
                            <a href="/market#add">Pool</a>
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
                            balance={this.state.node_output_balance}
                        />
                    </div>
                    <dl className="exchange-rate">
                        <div className="row-box" onClick={this.chnageRate}>
                            <dt>Exchange Rate</dt>
                            <dd>
                                {this.state.exchange_rate > 0
                                    ? `1 ${
                                          this.state.click_exchnage > 0
                                              ? this.state.output_token
                                              : this.state.input_token
                                      } = ${this.info.floorNumberWithNumber(
                                          this.state.click_exchnage > 0
                                              ? 1 / this.state.exchange_rate
                                              : this.state.exchange_rate,
                                          5
                                      )} 
                                        ${
                                            this.state.click_exchnage > 0
                                                ? this.state.input_token
                                                : this.state.output_token
                                        }`
                                    : '-'}
                            </dd>
                        </div>
                    </dl>
                    <button
                        type="button"
                        className="submit-coin"
                        onClick={this.onClickSwap}
                    >
                        {'Swap'}
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
)(SwapComponent);
