import React, { Component } from 'react';
import tt from 'counterpart';
import SSC from 'sscjs';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import { LIQUID_TOKEN_UPPERCASE } from 'app/client_config';

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
        super(props);
        this.state = {
            amount: 0,
            output_amount: 0,
            selectedValue: '',
            loadToken: false,
        };
        const { sbd_to_dollor, steem_to_dollor } = this.props;
        console.log(sbd_to_dollor, steem_to_dollor);
        // I should get ratio between tokens from .. api.
        this.ratio_toke_by_steem = [1, 1, 1, 1, 1];

        var that = this;
        this.getAllTokenInfo().then(allPrice => {
            that.ratio_toke_by_steem[0] = allPrice[0] * 1; //SCT
            that.ratio_toke_by_steem[1] = allPrice[1] * 1; //SCTM
            that.ratio_toke_by_steem[2] = allPrice[2] * 1; //KRWP
            that.ratio_toke_by_steem[4] = sbd_to_dollor / steem_to_dollor * 1; //SBD
            console.log(that.ratio_toke_by_steem);
            that.setState({ loadToken: true });
        });

        this.input_token_type = ['SCT', 'SCTM', 'KRWP', 'STEEM', 'SBD'];
        this.output_token_type = ['SCT', 'SCTM', 'KRWP', 'STEEM', 'SBD'];

        this.swap_fee = 1.0;
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
        // update value = amount * (100-swap_fee)/100 * a/b
        this.calculateOutput();
    }

    outputSelected(e) {
        console.log('-- PromotePost.outputSelected -->', e.target.value);
        this.selected_token[1] = e.target.value * 1;
        // update value = amount * (100-swap_fee)/100 * a/b
        this.calculateOutput();
    }

    componentDidMount() {}

    amountChange(e) {
        const amount = e.target.value;
        this.input_amount = amount;
        // update value = amount * (100-swap_fee)/100 * a/b
        this.calculateOutput();
    }

    errorCallback(estr) {
        console.log('errorCallback');
    }

    onClose() {
        console.log('onClose');
    }

    onClickSwap(e) {
        const username = this.props.currentUser.get('username');

        console.log(
            'onClickSwap',
            username,
            this.input_token_type[this.selected_token[0]]
        );
        if (this.selected_token[0] > 2) {
            //3,4
            this.props.dispatchTransfer({
                amount: this.input_amount,
                asset: this.input_token_type[this.selected_token[0]],
                outputasset: this.input_token_type[this.selected_token[1]],
                onClose: this.onClose,
                currentUser: this.props.currentUser,
                errorCallback: this.errorCallback,
            });
        } else {
            this.props.dispatchSubmit({
                amount: this.input_amount,
                asset: this.input_token_type[this.selected_token[0]],
                outputasset: this.input_token_type[this.selected_token[1]],
                onClose: this.onClose,
                currentUser: this.props.currentUser,
                errorCallback: this.errorCallback,
            });
        }
    }

    calculateOutput() {
        // update value = amount * (100-swap_fee)/100 * a/b
        const amount = this.input_amount;
        const a = this.ratio_toke_by_steem[this.selected_token[0]];
        const b = this.ratio_toke_by_steem[this.selected_token[1]];

        console.log('calculateOutput');
        console.log(this.selected_token[0]);
        console.log(this.selected_token[1]);
        // token pair가 krwp and sbd라면, 1:1로 한다.
        if (
            (this.selected_token[0] == 2 && this.selected_token[1] == 4) ||
            (this.selected_token[0] == 4 && this.selected_token[1] == 2)
        ) {
            var output_amount = amount * ((100 - this.swap_fee) / 100.0) * 1;
            output_amount = output_amount.toFixed(3);
            this.setState({ amount, output_amount });
        } else {
            var output_amount =
                amount * ((100 - this.swap_fee) / 100.0) * (1 * a / b);
            output_amount = output_amount.toFixed(3);
            this.setState({ amount, output_amount });
        }
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
                                title={`수수료는 ${this.swap_fee}%입니다.`}
                            >
                                <button className="button" disabled={true}>
                                    {'수수료'}
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
                    </div>
                </div>
            </div>
        );
    }

    async getAllTokenInfo() {
        var allInfo = await Promise.all([
            this.getTokenPrice('SCT'),
            this.getTokenPrice('SCTM'),
            this.getTokenPrice('KRWP'),
        ]);
        console.log(allInfo);
        return allInfo;
    }

    getTokenPrice(symbol) {
        return new Promise((resolve, reject) => {
            const ssc = new SSC('https://api.steem-engine.com/rpc');

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
        const currentUser = state.user.getIn(['current']);
        const username = currentUser.get('username');
        return { ...ownProps, currentUser };
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
                    successMessage: '토큰을 전송했습니다.' + '.',
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
                    successMessage: '토큰을 전송했습니다.' + '.',
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
