import React, { Component } from 'react';
import tt from 'counterpart';
import SSC from 'sscjs';
const ssc = new SSC('https://api.steem-engine.com/rpc');
import { api } from '@steemit/steem-js';
import { connect } from 'react-redux';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';

const SWAP_ACCOUNT = 'sct.jcob';
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
            </div>
        </div>
    );
};

class SidebarSwap extends Component {
    constructor(props) {
        // console.log(props);
        super(props);
        this.state = {
            loadToken: true,
        };

        // member variable
        this.swap_fee = 3.0;

        this.input_token_type = [
            'SCT',
            'SCTM',
            'KRWP',
            'SBD',
            'STEEM',
            'ORG',
            'SVC',
            'DEC',
        ];
        this.output_token_type = [
            'SCT',
            'SCTM',
            'KRWP',
            'SBD',
            'STEEM',
            'ORG',
            'SVC',
            'DEC',
        ];

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
    }

    outputSelected(e) {
        console.log('-- swap.outputSelected -->', e.target.value);
    }

    componentDidMount() {}

    amountChange(e) {
        const amount = e.target.value;
        console.log('amountChange', amount);
    }

    errorCallback(estr) {
        console.log('errorCallback');
    }

    onClose() {
        console.log('onClose');
    }

    onClickSwap(e) {}

    calculateOutput() {}

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
                                selectedValue={this.state.selectedValue1}
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
                            {`Available: ${0}`}
                        </div>
                        <div className="c-sidebar__list-small text-right">
                            {`1KRWP = 4ORG`}
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
