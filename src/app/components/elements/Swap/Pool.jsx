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
            <div className="able-coin">{`My balance: ${
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

class SidebarSwap extends Component {
    constructor(props) {
        // console.log(props);
        super(props);
        this.state = {
            loadToken: true,
            show: false,
            input_token: 'KRWP',
            input_token_symbol: '/images/tokens/noimage.png',
            output_token: '',
            output_token_symbol: '',
            exchange_rate: 0,
            node_input_balance: 0,
            node_output_balance: 0,
            user_input_balance: 0,
            user_output_balance: 0,
            user_get_liqudity: 0,
            liqudity_token: 0,
            liqudity_token_rate: 0,
            liqudity_token_all: 0,
            liqudity_token_symbol: '',
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

        var user_get_liqudity =
            this.state.liqudity_token * 1 * this.input_amount;
        user_get_liqudity = user_get_liqudity.toFixed(3);

        var all = user_get_liqudity * 1 + this.state.liqudity_token_all * 1;
        var rate = 100 * user_get_liqudity / all;
        rate = rate.toFixed(3);

        this.output_amount = this.state.exchange_rate * this.input_amount;
        this.output_amount = this.output_amount.toFixed(3);

        this.setState({
            user_get_liqudity,
            liqudity_token_rate: rate,
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
            console.log('one');
            console.log(this.input_amount);
            console.log(input_token);
            console.log(node.name);
            console.log(memo_1);

            console.log('two');
            console.log(this.output_amount);
            console.log(output_token);
            console.log(node.name);
            console.log(memo_2);
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
        var exchange_rate = 0;
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
                output_token
            );

            this.setState({
                exchange_rate: results.exchange_rate,
                node_input_balance: results.node_input_balance,
                node_output_balance: results.node_output_balance,
                liqudity_token_all: results.liqudity_token_all,
                liqudity_token: results.liqudity_token,
                liqudity_token_symbol: results.liqudity_token_symbol,
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
                <Reveal
                    show={this.state.show}
                    onHide={this.hideTokenList}
                    isSwapModal={true}
                >
                    <CloseButton onClick={this.hideTokenList} />
                    <h2 className="token-title">Select Token</h2>
                    <div className="token-search">
                        <form>
                            <input
                                type="text"
                                placeholder="Search Token Name"
                            />
                            <button type="submit" className="srh-btn">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    viewBox="0 0 50 50"
                                >
                                    <path d="M 25 0 C 19.3545 0 14.239922 1.0161444 10.447266 2.7226562 C 8.5509372 3.5759123 6.978214 4.601147 5.8417969 5.8105469 C 4.7053797 7.0199467 4 8.4567299 4 10 L 4 39 C 4 44.607 13.225 49 25 49 C 28.494 49 31.754 48.605062 34.625 47.914062 C 33.149 47.745063 31.755234 47.305437 30.490234 46.648438 C 28.780234 46.870438 26.95 47 25 47 C 13.635 47 6 42.863 6 39 L 6 34.304688 C 9.284 37.656687 16.315266 39.940141 24.697266 39.994141 C 24.467266 39.346141 24.293734 38.674469 24.177734 37.980469 C 13.273734 37.784469 6 33.768 6 30 L 6 24.304688 C 9.323 27.697687 16.484 30 25 30 C 25.212 30 25.419859 29.991281 25.630859 29.988281 C 26.057859 29.254281 26.558953 28.574219 27.126953 27.949219 C 26.432953 27.982219 25.725 28 25 28 C 13.635 28 6 23.863 6 20 L 6 14.337891 C 7.1234422 15.480958 8.6314885 16.460332 10.447266 17.277344 C 14.239922 18.983856 19.3545 20 25 20 C 30.6455 20 35.760078 18.983856 39.552734 17.277344 C 41.368511 16.460332 42.876558 15.480958 44 14.337891 L 44 20 C 44 21.647 42.601906 23.341094 40.128906 24.746094 C 40.864906 25.017094 41.565562 25.358719 42.226562 25.761719 C 42.896563 25.302719 43.498 24.817688 44 24.304688 L 44 27.080078 C 44.758 27.761078 45.435 28.528859 46 29.380859 L 46 10 C 46 8.4567299 45.29462 7.0199467 44.158203 5.8105469 C 43.021786 4.601147 41.449062 3.5759123 39.552734 2.7226562 C 35.760078 1.0161444 30.6455 2.9605947e-16 25 0 z M 25 2 C 30.4025 2 35.287078 2.9966369 38.732422 4.546875 C 40.455094 5.3219941 41.811886 6.2353686 42.699219 7.1796875 C 43.586552 8.1240064 44 9.0567701 44 10 C 44 10.94323 43.586552 11.875994 42.699219 12.820312 C 41.811886 13.764632 40.455094 14.678006 38.732422 15.453125 C 35.287078 17.003363 30.4025 18 25 18 C 19.5975 18 14.712922 17.003363 11.267578 15.453125 C 9.5449063 14.678006 8.1881142 13.764632 7.3007812 12.820312 C 6.4134484 11.875995 6 10.94323 6 10 C 6 9.0567701 6.4134485 8.1240064 7.3007812 7.1796875 C 8.1881142 6.2353686 9.5449063 5.3219941 11.267578 4.546875 C 14.712922 2.9966369 19.5975 2 25 2 z M 36 26 C 30.488994 26 26 30.488998 26 36 C 26 41.511002 30.488994 46 36 46 C 38.396509 46 40.597385 45.148986 42.322266 43.736328 L 48.292969 49.707031 L 49.707031 48.292969 L 43.736328 42.322266 C 45.148985 40.597385 46 38.396507 46 36 C 46 30.488998 41.511006 26 36 26 z M 36 28 C 40.430126 28 44 31.569877 44 36 C 44 40.430123 40.430126 44 36 44 C 31.569874 44 28 40.430123 28 36 C 28 31.569877 31.569874 28 36 28 z" />
                                </svg>
                            </button>
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
                            <a href="/beta/swap">Swap</a>
                        </li>
                        <li>
                            <a href="/beta/swap#send">Send</a>
                        </li>
                        <li className="active">
                            <a href="/beta/pool">Pool</a>
                        </li>
                    </ul>
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
                        <button type="button" className="turn-upDown">
                            <svg
                                width="10"
                                height="10"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M5.298 0H4.24v7.911h-.075L1.256 4.932l-.717.735L4.769 10 9 5.667l-.718-.735-2.908 2.979h-.076V0z" />
                            </svg>
                        </button>
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
                        <dt>Exchange Rate</dt>
                        <dd>
                            {this.state.exchange_rate == 0
                                ? '-'
                                : `1 ${this.state.input_token} = ${
                                      this.state.exchange_rate
                                  } ${this.state.output_token}`}
                        </dd>
                    </dl>
                    <dl className="exchange-rate">
                        <dt>Current Pool Size</dt>
                        <dd>
                            {this.state.exchange_rate == 0
                                ? '-'
                                : `${this.state.node_input_balance} ${
                                      this.state.input_token
                                  } + ${this.state.node_output_balance} ${
                                      this.state.output_token
                                  }`}
                        </dd>
                    </dl>
                    <dl className="exchange-rate">
                        <dt>Your Pool Share (%)</dt>
                        <dd>
                            {this.state.exchange_rate > 0 &&
                            this.input_amount > 0
                                ? `${this.state.user_get_liqudity} ${
                                      this.state.liqudity_token_symbol
                                  } (${this.state.liqudity_token_rate}%)`
                                : '-'}
                        </dd>
                    </dl>
                    <button
                        type="button"
                        className="submit-coin"
                        onClick={this.onClickDeposit}
                    >
                        {'Add Liquidity'}
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
)(SidebarSwap);
