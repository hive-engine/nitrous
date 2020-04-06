import React, { Component } from 'react';
import tt from 'counterpart';
import { connect } from 'react-redux';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';

import swapinfo from 'app/components/elements/Swap/config';
const swap_node = 'sct.swap';

const SelectToken = props => {
    var options = props.input_token_type.map(function(token_name, index) {
        return (
            <option value={index} key={index}>
                {token_name}
            </option>
        );
    });

    return (
        <div
            className="input-group"
            style={{ marginBottom: props.marginBottom }}
        >
            <input
                className="input-group-field"
                type="text"
                placeholder={tt('g.amount')}
                value={props.amount}
                // ref="amount"
                autoComplete="off"
                onChange={props.amountChange}
                disabled={props.inputDisabled}
            />
            <div className="pd-0 bg-x">
                <select
                    value={props.selectedValue}
                    onChange={props.selectedChange}
                >
                    {options}
                </select>
            </div>
        </div>
    );
};

class SidebarSwap extends Component {
    constructor(props) {
        // console.log(props);
        super(props);
        this.state = {
            selectedValue1: 0,
            selectedValue2: 1,
            loadToken: true,
            output_amount: 0,
            input_token: 'STEEM',
            output_token: 'KRWP',
            node_output_balance: 0,
            user_input_balance: 0,
            click_exchnage: 0,
        };

        this.info = new swapinfo();
        this.input_token_type = [];
        for (const token of this.info.tokens) {
            this.input_token_type.push(token.name);
        }
        this.output_token_type = this.input_token_type;
        console.log(this.input_token_type);

        this.swap_fee = 3.0;
        this.selected_token = [0, 1];
        this.input_amount = 0;

        // Functions
        this.onClickSwap = this.onClickSwap.bind(this);
        this.amountChange = this.amountChange.bind(this);
        this.inputSelected = this.inputSelected.bind(this);
        this.outputSelected = this.outputSelected.bind(this);
        this.errorCallback = this.errorCallback.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    inputSelected(e) {
        console.log('-- swap.inputSelected -->', e.target.value);
        this.selected_token[0] = e.target.value * 1;
        this.setState({ selectedValue1: this.selected_token[0] });
        this.calculateExchange();
    }

    outputSelected(e) {
        console.log('-- swap.outputSelected -->', e.target.value);
        this.selected_token[1] = e.target.value * 1;
        this.setState({ selectedValue2: this.selected_token[1] });
        this.calculateExchange();
    }

    componentDidMount() {
        var that = this;
        var input_token = this.input_token_type[this.selected_token[0]];
        var output_token = this.output_token_type[this.selected_token[1]];
        this.info
            .getTokenBalance(
                this.props.currentUser.get('username'),
                input_token
            )
            .then(balance => {
                that.setState({ user_input_balance: balance });
            });

        var node1 = this.info.findNode(input_token, output_token);

        this.info.getTokenBalance(node1.account, output_token).then(balance => {
            that.setState({ node_output_balance: balance });
        });
    }

    amountChange(e) {
        const amount = e.target.value;
        this.input_amount = amount;
        this.calculateExchange();
    }

    errorCallback(estr) {
        console.log('errorCallback');
    }

    onClose() {
        console.log('onClose');
    }
    onClickSwap = e => {
        console.log('transfer');
        var input_token = this.input_token_type[this.selected_token[0]];
        var output_token = this.output_token_type[this.selected_token[1]];
        console.log(
            this.input_amount,
            this.output_amoun,
            input_token,
            output_token
        );
        if (
            this.input_amount > 0 &&
            this.output_amount > 0 &&
            input_token != '' &&
            output_token != ''
        ) {
            if (input_token == 'HIVEP' || output_token == 'HIVEP') {
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
            } else if (input_token != 'KRWP' && output_token != 'KRWP') {
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
        var input_token = this.input_token_type[this.selected_token[0]];
        var output_token = this.output_token_type[this.selected_token[1]];

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
            var results = null;
            if (input_token == output_token) {
                results = 0;
            } else if (input_token == 'HIVEP' || output_token == 'HIVEP') {
                results = await this.info.calculateExchangeAmount(
                    input_token,
                    output_token,
                    this.input_amount,
                    2
                );
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

    render() {
        const { amount, output_amount } = this.state;
        const styleToken = { color: 'rgb(0, 120, 167)' };
        var input_token = this.input_token_type[this.selected_token[0]];
        var output_token = this.output_token_type[this.selected_token[1]];

        return (
            <div className="c-sidebar__module">
                <div className="c-sidebar__header" style={styleToken}>
                    <h3 className="c-sidebar__h3">Token Swap</h3>
                </div>
                <div className="c-sidebar__content">
                    <div className="swap-form">
                        <div className="swap-input">
                            {/* input component */}
                            <div className="c-sidebar__list-small">
                                {`input: ${this.state.user_input_balance} ${
                                    input_token
                                }`}
                            </div>
                            <SelectToken
                                amount={amount}
                                amountChange={this.amountChange}
                                selectedChange={this.inputSelected}
                                selectedValue={this.state.selectedValue1}
                                input_token_type={this.input_token_type}
                                marginBottom={0}
                                inputDisabled={!this.state.loadToken}
                            />

                            <div className="text-center">
                                {/* <Icon name="dropdown-arrow" /> */}
                                {'▼'}
                            </div>
                            <div className="c-sidebar__list-small">{`output: ${
                                this.state.node_output_balance == undefined
                                    ? 0
                                    : this.state.node_output_balance
                            } ${output_token}`}</div>
                            <SelectToken
                                amount={output_amount}
                                amountChange={this.amountChange}
                                selectedChange={this.outputSelected}
                                selectedValue={this.state.selectedValue2}
                                input_token_type={this.output_token_type}
                                marginBottom={10}
                                inputDisabled={true}
                            />
                        </div>
                        <div className="text-right">
                            <span
                                className="articles__icon-100"
                                title={`Fee is ${
                                    this.swap_fee
                                }%. TThe exchange rate is based on balances of two tokens in the pool.`}
                            >
                                <button className="button" disabled={true}>
                                    {'Fees'}
                                </button>
                            </span>

                            <button
                                type="button"
                                className="button"
                                onClick={this.onClickSwap}
                            >
                                {'Swap'}
                            </button>
                        </div>
                        <div
                            className="c-sidebar__list-small text-right"
                            onClick={this.chnageRate}
                        >
                            {this.state.exchange_rate > 0
                                ? `1 ${
                                      this.state.click_exchnage > 0
                                          ? output_token
                                          : input_token
                                  } = ${this.info.floorNumberWithNumber(
                                      this.state.click_exchnage > 0
                                          ? 1 / this.state.exchange_rate
                                          : this.state.exchange_rate,
                                      5
                                  )} 
                                    ${
                                        this.state.click_exchnage > 0
                                            ? input_token
                                            : output_token
                                    }`
                                : '- '}
                        </div>
                    </div>
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
)(SidebarSwap);
