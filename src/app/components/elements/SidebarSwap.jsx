import React, { Component } from 'react';
import tt from 'counterpart';
import SSC from 'sscjs';
const ssc = new SSC('https://api.steem-engine.com/rpc');

import { api } from '@steemit/steem-js';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
const SWAP_ACCOUNT = 'sct.swap';

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
                <select onChange={props.selectedChange}>{options}</select>
                {/* <select>
                    {props.input_token_type.map((token_name, i) => {
                        return <option>{token_name}</option>;
                    })}
                </select> */}
            </div>
        </div>
    );
};

class SidebarSwap extends Component {
    constructor(props) {
        // console.log(props);
        super(props);
        this.state = {
            amount: 0,
            output_amount: 0,
            selectedValue: '',
            loadToken: false,
            providerBalance: ['', '', '', ''],
            swap_rate: 1,
        };
        const {
            sct_to_steemp,
            steem_to_dollor,
            sctm_to_steem,
            krwp_to_steem,
            sbd_to_dollar,
            steem_to_krw,
        } = this.props;
        console.log(
            sct_to_steemp,
            steem_to_dollor,
            sctm_to_steem,
            krwp_to_steem,
            sbd_to_dollar,
            steem_to_krw
        );
        this.steem_to_krw = steem_to_krw;
        this.steem_to_krw = steem_to_krw;

        // console.log(sbd_to_dollor, steem_to_dollor);
        // I should get ratio between tokens from .. api.
        this.ratio_toke_by_steem = {
            SCT: sct_to_steemp * 1,
            SCTM: sctm_to_steem * 1,
            KRWP: krwp_to_steem * 1,
            SBD: sbd_to_dollar / steem_to_dollor * 1,
        };

        var that = this;
        this.getSwapAccountInfo(SWAP_ACCOUNT).then(allInfo => {
            var providerBalance = [
                allInfo[0] + ' ' + 'SCT',
                allInfo[1] + ' ' + 'SCTM',
                allInfo[2] + ' ' + 'KRWP',
                allInfo[3][0].sbd_balance,
            ];
            that.setState({
                providerBalance,
                loadToken: true,
            });
        });

        this.input_token_type = ['SCT', 'SCTM', 'KRWP', 'SBD'];
        this.output_token_type = ['SCT', 'SCTM', 'KRWP', 'SBD'];

        this.swap_fee = 3.0;
        this.selected_token = [0, 0];
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
        console.log('-- PromotePost.inputSelected -->', e.target.value);
        this.selected_token[0] = e.target.value * 1;
        if (this.input_token_type[this.selected_token[0]] == 'SBD') {
            this.output_token_type = ['KRWP'];
            this.selected_token[1] = 0;
        } else {
            this.output_token_type = ['SCT', 'SCTM', 'KRWP', 'SBD'];
        }
        this.calculateOutput();
    }

    outputSelected(e) {
        console.log('-- PromotePost.outputSelected -->', e.target.value);
        this.selected_token[1] = e.target.value * 1;
        if (this.output_token_type[this.selected_token[1]] == 'SBD') {
            this.input_token_type = ['KRWP'];
            this.selected_token[0] = 0;
        } else {
            this.input_token_type = ['SCT', 'SCTM', 'KRWP', 'SBD'];
        }
        this.calculateOutput();
    }

    componentDidMount() {}

    amountChange(e) {
        const amount = e.target.value;
        this.input_amount = amount;
        this.calculateOutput();
    }

    errorCallback(estr) {
        console.log('errorCallback');
    }

    onClose() {
        console.log('onClose');
    }

    onClickSwap(e) {
        console.log('onClickSwap', this.props.currentUser);
        if (this.props.currentUser == null) return;

        const username = this.props.currentUser.get('username');
        console.log(
            'onClickSwap',
            username,
            this.input_token_type[this.selected_token[0]],
            this.output_token_type[this.selected_token[1]]
        );
        if (this.selected_token[0] > 2) {
            //3,4
            this.props.dispatchTransfer({
                amount: this.input_amount,
                asset: this.input_token_type[this.selected_token[0]],
                outputasset: this.output_token_type[this.selected_token[1]],
                onClose: this.onClose,
                currentUser: this.props.currentUser,
                errorCallback: this.errorCallback,
            });
        } else {
            this.props.dispatchSubmit({
                amount: this.input_amount,
                asset: this.input_token_type[this.selected_token[0]],
                outputasset: this.output_token_type[this.selected_token[1]],
                onClose: this.onClose,
                currentUser: this.props.currentUser,
                errorCallback: this.errorCallback,
            });
        }
    }

    calculateOutput() {
        const amount = this.input_amount;
        const input_symbol = this.input_token_type[this.selected_token[0]];
        const output_symbol = this.output_token_type[this.selected_token[1]];
        const a = this.ratio_toke_by_steem[input_symbol];
        const b = this.ratio_toke_by_steem[output_symbol];

        console.log('calculateOutput');
        console.log(input_symbol, output_symbol);
        var output_amount =
            amount * (1 * a / b) * (100.0 - this.swap_fee) / 100.0;
        output_amount = output_amount.toFixed(3);
        this.setState({
            amount,
            output_amount,
            swap_rate: (1 * a / b).toFixed(3),
        });
    }

    render() {
        const { amount, output_amount } = this.state;
        const styleToken = { color: 'rgb(0, 120, 167)' };

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
                                {'from:'}
                            </div>
                            <SelectToken
                                amount={amount}
                                amountChange={this.amountChange}
                                selectedChange={this.inputSelected}
                                selectedValue={this.state.selectedValue}
                                input_token_type={this.input_token_type}
                                marginBottom={0}
                                inputDisabled={!this.state.loadToken}
                            />

                            <div className="text-center">
                                {/* <Icon name="dropdown-arrow" /> */}
                                {'▼'}
                            </div>
                            <div className="c-sidebar__list-small">{'to:'}</div>
                            <SelectToken
                                amount={output_amount}
                                amountChange={this.amountChange}
                                selectedChange={this.outputSelected}
                                selectedValue={this.state.selectedValue}
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
                                }%. The rate is based on the average token price traded for 3 days.`}
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
                        <div className="c-sidebar__list-small text-right">
                            {`Available: ${
                                this.state.providerBalance[
                                    this.selected_token[1]
                                ]
                            }`}
                        </div>
                        <div className="c-sidebar__list-small text-right">
                            {`1${
                                this.input_token_type[this.selected_token[0]]
                            }=${this.state.swap_rate}${
                                this.output_token_type[this.selected_token[1]]
                            }=${this.ratio_toke_by_steem[
                                this.input_token_type[this.selected_token[0]]
                            ].toFixed(3)}STEEM`}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    async getSwapAccountInfo(account) {
        var allInfo = await Promise.all([
            this.getTokenBalance(SWAP_ACCOUNT, 'SCT'),
            this.getTokenBalance(SWAP_ACCOUNT, 'SCTM'),
            this.getTokenBalance(SWAP_ACCOUNT, 'KRWP'),
            new Promise((resolve, reject) => {
                api.getAccounts([account], function(err, response) {
                    if (err) reject(err);
                    resolve(response);
                });
            }),
        ]);
        return allInfo;
    }

    getTokenBalance(account, symbol) {
        return new Promise((resolve, reject) => {
            ssc.findOne(
                'tokens',
                'balances',
                { account, symbol },
                (err, result) => {
                    if (err) reject(err);
                    // console.log(result)
                    if (result == null) resolve('0.0');
                    else resolve(result.balance);
                }
            );
        });
    }

    async getAllTokenInfo() {
        var allInfo = await Promise.all([
            this.getTokenPrice('SCT'),
            this.getTokenPrice('SCTM'),
            this.getTokenPrice('KRWP'),
        ]);
        // console.log(allInfo);
        return allInfo;
    }

    getTokenPrice(symbol) {
        return new Promise((resolve, reject) => {
            ssc.find(
                'market',
                'metrics',
                { symbol: symbol },
                1000,
                0,
                [],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result[0].lastPrice);
                }
            );
        });
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
                to: SWAP_ACCOUNT,
                amount: parseFloat(amount, 10).toFixed(3) + ' ' + asset,
                memo: `@${username}:${asset}:${outputasset}`,
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
                    to: SWAP_ACCOUNT,
                    quantity: amount,
                    memo: `@${username}:${asset}:${outputasset}`,
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
