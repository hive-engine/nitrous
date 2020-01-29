import React, { Component } from 'react';
import tt from 'counterpart';
import { connect } from 'react-redux';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import swapinfo from './Swap/config';

import Reveal from 'app/components/elements/Reveal';
import CloseButton from 'app/components/elements/CloseButton';
import TokenList from 'app/components/elements/Swap/TokenList';

var swap_node = 'sct.jcob';

const SelectToken = props => {
    return (
        <div>
            <div className="able-coin">{`Balnace: ${0}`}</div>
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
                    <img width={'24px'} src={props.token_symbol_img} />
                )}
                <span>
                    {props.token_name == ''
                        ? 'Select a token'
                        : ` ${props.token_name}`}
                </span>
            </button>
            {/* <select onChange={props.selectedChange} className="coin-select">{options}</select> */}
        </div>
    );
};

class SidebarSwap extends Component {
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
                    parent.calculateExchangeRate();
                }
            );
        else if (parent.selected == 'output')
            parent.setState(
                {
                    output_token: token.name,
                    output_token_symbol: token.ico,
                },
                () => {
                    parent.calculateExchangeRate();
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

    inputAmountChange = e => {
        this.setState({ input_amount: undefined });
        const amount = e.target.value;
        console.log('inputAmountChange', amount);

        this.input_amount = amount;
        var rate = this.state.exchange_rate;
        this.output_amount = rate * this.input_amount;
        this.setState({ output_amount: this.output_amount });
    };

    outputAmountChange = e => {
        this.setState({ output_amount: undefined });
        const amount = e.target.value;
        console.log('outputAmountChange', amount);

        this.output_amount = amount;
        var rate = this.state.exchange_rate;
        if (rate > 0) this.input_amount = 1 / rate * this.output_amount;
        else this.input_amount = 0;
        this.setState({ input_amount: this.input_amount });
    };

    errorCallback = estr => {
        console.log('errorCallback');
    };

    onClose = () => {
        console.log('onClose');
    };

    onClickSwap = e => {
        console.log('transfer');
        const { input_token, output_token } = this.state;

        if (this.input_amount > 0 && input_token != '' && output_token != '') {
            if (input_token === 'SBD') {
                this.props.dispatchTransfer({
                    amount: this.input_amount,
                    asset: input_token,
                    outputasset: output_token,
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
                    onClose: this.onClose,
                    currentUser: this.props.currentUser,
                    errorCallback: this.errorCallback,
                });
            } else {
                this.props.dispatchSubmit({
                    amount: this.input_amount,
                    asset: input_token,
                    outputasset: output_token,
                    onClose: this.onClose,
                    currentUser: this.props.currentUser,
                    errorCallback: this.errorCallback,
                });
            }
        }
    };

    calculateExchangeRate = () => {
        var exchange_rate = 0;
        const { input_token, output_token } = this.state;
        if (input_token != '' && output_token != '') {
            exchange_rate = this.info.calculateExchangeRate(
                input_token,
                output_token
            );
            exchange_rate = 1;
            if (this.input_amount > 0) {
                this.output_amount = exchange_rate * this.input_amount;
                this.setState({ output_amount: this.output_amount });
            } else if (this.output_amount > 0) {
                this.input_amount = 1 / rate * this.output_amount;
                this.setState({ input_amount: this.input_amount });
            }
        }
        this.setState({ exchange_rate });
        return exchange_rate;
    };

    selectToken = token => {
        console.log('selectToken', token);
    };

    render() {
        const { input_amount, output_amount } = this.state;

        return (
            <div className="swap-wrap">
                <Reveal show={this.state.show} onHide={this.hideTokenList}>
                    <CloseButton onClick={this.hideTokenList} />
                    <TokenList
                        parent={this}
                        onTokenClick={this.tokenClickCallback}
                    />
                </Reveal>

                <div className="tab-title">
                    <ul>
                        <li className="active">
                            <a href="/swap">Swap</a>
                        </li>
                        <li>
                            <a href="/swap#send">Send</a>
                        </li>
                        <li>
                            <a href="/swap#add-liquidity">Pool</a>
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
                        />
                    </div>
                    <div className="arrow-sec" />
                    <div className="input-box">
                        <div className="text-label">{'Output'}</div>
                        <SelectToken
                            amount={output_amount}
                            amountChange={this.outputAmountChange}
                            selectedChange={this.outputSelected}
                            selectedValue={this.state.selectedValue2}
                            token_name={this.state.output_token}
                            token_symbol_img={this.state.output_token_symbol}
                            inputDisabled={!this.state.loadToken}
                            showTokenListCallback={this.selectOutputToken}
                        />
                    </div>
                    <dl className="exchange-rate">
                        <dt>Exchange Rate</dt>
                        <dd>
                            {this.state.exchange_rate == 0
                                ? '-'
                                : `1 ${this.state.output_token} = ${
                                      this.state.exchange_rate
                                  } ${this.state.input_token}`}
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
                amount: parseFloat(amount, 10).toFixed(3) + ' ' + asset,
                memo: `@swap:${asset}:${outputasset}`,
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
                    memo: `@swap:${asset}:${outputasset}`,
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
)(SidebarSwap);
