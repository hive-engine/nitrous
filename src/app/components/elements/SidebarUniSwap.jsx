import React, { Component } from 'react';
import tt from 'counterpart';
import SSC from 'sscjs';
const ssc = new SSC('https://api.steem-engine.com/rpc');
import { api } from '@steemit/steem-js';
import { connect } from 'react-redux';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import swapinfo from './Swap/config';

const SelectToken = props => {
    var options = props.input_token_type.map(function(token_name, index) {
        return (
            <option value={index} key={index}>
                {token_name}
            </option>
        );
    });

    return (
        <div>
            <div className="able-coin">{`Balnace: ${0}`}</div>
            <input
                type="text"
                className="coin-input"
                placeholder={tt('g.amount')}
                value={props.amount}
                // ref="amount"
                autoComplete="off"
                onChange={props.amountChange}
                disabled={props.inputDisabled}
            />
            <button
                type="button"
                className="coin-select"
                value="0"
                onClick={props.showTokenListCallback}
            >
                Select a token
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
        };
        this.info = new swapinfo();

        // Functions
        this.onClickSwap = this.onClickSwap.bind(this);
        this.amountChange = this.amountChange.bind(this);
        this.inputSelected = this.inputSelected.bind(this);
        this.outputSelected = this.outputSelected.bind(this);
        this.errorCallback = this.errorCallback.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    showTokenList = () => {};

    inputSelected(e) {
        console.log('-- swap.inputSelected -->', e.target.value);
    }

    outputSelected(e) {
        console.log('-- swap.outputSelected -->', e.target.value);
    }

    componentDidMount() {
        document.body.classList.add('theme-swap');
    }

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
            <div className="swap-wrap">
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
                            amount={amount}
                            amountChange={this.amountChange}
                            selectedChange={this.inputSelected}
                            selectedValue={this.state.selectedValue1}
                            input_token_type={this.info.input_token_type}
                            marginBottom={0}
                            inputDisabled={!this.state.loadToken}
                            showTokenListCallback={this.showTokenList}
                        />
                    </div>
                    <div className="arrow-sec" />
                    <div className="input-box">
                        <div className="text-label">{'Output'}</div>
                        <SelectToken
                            amount={output_amount}
                            amountChange={this.amountChange}
                            selectedChange={this.outputSelected}
                            selectedValue={this.state.selectedValue2}
                            input_token_type={this.info.output_token_type}
                            marginBottom={10}
                            inputDisabled={!this.state.loadToken}
                            showTokenListCallback={this.showTokenList}
                        />
                    </div>
                    <dl className="exchange-rate">
                        <dt>Exchange Rate</dt>
                        <dd>{`1KRWP = 4ORG`}</dd>
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
