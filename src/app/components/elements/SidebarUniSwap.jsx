import React, { Component } from 'react';
import tt from 'counterpart';
import { connect } from 'react-redux';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import swapinfo from './Swap/config';

import Reveal from 'app/components/elements/Reveal';
import CloseButton from 'app/components/elements/CloseButton';
import TokenList from 'app/components/elements/Swap/TokenList';
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
                value="0"
                onClick={props.showTokenListCallback}
            >
                {props.token_name == '' ? 'Select a token' : props.token_name}
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
        };
        this.info = new swapinfo();
        this.selected = '';
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
            parent.setState({ input_token: token.name });
        else if (parent.selected == 'output')
            parent.setState({ output_token: token.name });
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

    amountChange = e => {
        const amount = e.target.value;
        console.log('amountChange', amount);
    };

    errorCallback = estr => {
        console.log('errorCallback');
    };

    onClose = () => {
        console.log('onClose');
    };

    onClickSwap = e => {};

    calculateOutput = () => {};

    selectToken = token => {
        console.log('selectToken', token);
    };

    calculateExchangeRate() {}

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
                            amountChange={this.amountChange}
                            selectedChange={this.inputSelected}
                            selectedValue={this.state.selectedValue1}
                            token_name={this.state.input_token}
                            inputDisabled={!this.state.loadToken}
                            showTokenListCallback={this.selectInputToken}
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
                            token_name={this.state.output_token}
                            inputDisabled={!this.state.loadToken}
                            showTokenListCallback={this.selectOutputToken}
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