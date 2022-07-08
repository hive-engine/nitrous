import React from 'react';
import { connect } from 'react-redux';
import Slider from 'react-rangeslider';
import tt from 'counterpart';
import reactForm from 'app/utils/ReactForm';
import * as globalActions from 'app/redux/GlobalReducer';
import { actions as userProfileActions } from 'app/redux/UserProfilesSaga';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as userActions from 'app/redux/UserReducer';
import { numberWithCommas } from 'app/utils/StateFunctions';

class Powerdown extends React.Component {
    constructor(props, context) {
        super(props, context);
        const new_withdraw =
            props.stakeBalance - props.delegatedStake - props.lockedStake;
        this.state = {
            broadcasting: false,
            manual_entry: false,
            new_withdraw,
        };
    }

    render() {
        const { broadcasting, new_withdraw, manual_entry } = this.state;
        const {
            account,
            stakeBalance,
            delegatedStake,
            lockedStake,
            scotPrecision,
            scotTokenSymbol,
            useHive,
        } = this.props;
        const sliderChange = value => {
            this.setState({ new_withdraw: value, manual_entry: false });
        };
        const inputChange = event => {
            event.preventDefault();
            let value = parseFloat(event.target.value.replace(/[, ]/g, ''));
            if (!isFinite(value)) {
                value = new_withdraw;
            }
            this.setState({
                new_withdraw: value,
                manual_entry: event.target.value,
            });
        };
        const powerDown = event => {
            event.preventDefault();
            this.setState({ broadcasting: true, error_message: undefined });
            const successCallback = this.props.successCallback;
            const errorCallback = error => {
                this.setState({
                    broadcasting: false,
                    error_message: String(error),
                });
            };
            // workaround bad math in react-rangeslider
            let withdraw = new_withdraw;
            if (withdraw > stakeBalance - delegatedStake - lockedStake) {
                withdraw = stakeBalance - delegatedStake - lockedStake;
            }
            const unstakeAmount = String(withdraw.toFixed(scotPrecision));
            this.props.withdrawVesting({
                scotTokenSymbol,
                account,
                unstakeAmount,
                errorCallback,
                successCallback,
                useHive,
            });
        };

        const formatBalance = bal =>
            numberWithCommas(String(bal.toFixed(scotPrecision)));

        const notes = [];
        if (delegatedStake !== 0) {
            const AMOUNT = formatBalance(delegatedStake);
            notes.push(
                <li key="delegating">
                    {tt('powerdown_jsx.delegating', {
                        AMOUNT,
                        LIQUID_TICKER: scotTokenSymbol,
                    })}
                </li>
            );
        }
        if (lockedStake !== 0) {
            notes.push(
                <li key="unstaking">
                    {tt('powerdown_jsx.locked_in_unstake', {
                        AMOUNT: formatBalance(lockedStake),
                        LIQUID_TICKER: LIQUID_TOKEN_UPPERCASE,
                    })}
                </li>
            );
        }
        if (this.state.error_message) {
            const MESSAGE = this.state.error_message;
            notes.push(
                <li key="error" className="error">
                    {tt('powerdown_jsx.error', { MESSAGE })}
                </li>
            );
        }

        return (
            <div className="PowerdownModal">
                <div className="row">
                    <h3 className="column">
                        {tt('powerdown_jsx.power_down')} {broadcasting}
                    </h3>
                </div>
                <Slider
                    value={new_withdraw}
                    step={1 / Math.pow(10, scotPrecision)}
                    max={stakeBalance - delegatedStake - lockedStake}
                    format={formatBalance}
                    onChange={sliderChange}
                />
                <p className="powerdown-amount">
                    {tt('powerdown_jsx.amount')}
                    <br />
                    <input
                        value={
                            manual_entry
                                ? manual_entry
                                : formatBalance(new_withdraw)
                        }
                        onChange={inputChange}
                        autoCorrect={false}
                    />
                    {scotTokenSymbol}
                </p>
                <ul className="powerdown-notes">{notes}</ul>
                <button
                    type="submit"
                    className="button"
                    onClick={powerDown}
                    disabled={broadcasting}
                >
                    {tt('powerdown_jsx.power_down')}
                </button>
            </div>
        );
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        const values = state.user.get('powerdown_defaults');
        const account = values.get('account');
        const stakeBalance = parseFloat(values.get('stakeBalance'));
        const delegatedStake = parseFloat(values.get('delegatedStake'));
        const tokenUnstakes = values.get('tokenUnstakes').toJS();
        const scotConfig = state.app.get('scotConfig');
        const scotTokenSymbol = state.app.getIn([
            'hostConfig',
            'LIQUID_TOKEN_UPPERCASE',
        ]);
        const useHive = state.app.getIn(['hostConfig', 'HIVE_ENGINE']);

        const numberTransactions = scotConfig.getIn([
            'config',
            'tokenStats',
            'total_token_balance',
            'numberTransactions',
        ]);
        const scotPrecision = scotConfig.getIn(['info', 'precision'], 0);
        const toFixedNoRounding = x => {
            const xStr = x.toString();
            const pointIndex = xStr.indexOf('.');
            const expIndex = xStr.indexOf('e');
            return +(xStr.slice(
                0,
                pointIndex > -1 ? scotPrecision + 1 + pointIndex : undefined
            ) + (expIndex > -1 ? xStr.slice(expIndex) : ''));
        };
        const lockedStake = tokenUnstakes
            .filter(unstake => unstake.numberTransactionsLeft > 1)
            .map(
                unstake =>
                    parseFloat(unstake.quantityLeft) -
                    toFixedNoRounding(
                        parseFloat(unstake.quantity) / numberTransactions
                    )
            )
            .reduce((x, y) => x + y, 0);
        return {
            ...ownProps,
            account,
            stakeBalance,
            lockedStake,
            delegatedStake,
            state,
            scotTokenSymbol,
            scotPrecision,
            useHive,
        };
    },
    // mapDispatchToProps
    dispatch => ({
        successCallback: () => {
            dispatch(userActions.hidePowerdown());
        },
        powerDown: e => {
            e.preventDefault();
            const name = 'powerDown';
            dispatch(globalActions.showDialog({ name }));
        },
        withdrawVesting: ({
            scotTokenSymbol,
            account,
            unstakeAmount,
            errorCallback,
            successCallback,
            useHive,
        }) => {
            const successCallbackWrapper = (...args) => {
                dispatch(userProfileActions.fetchWalletProfile({ account }));
                return successCallback(...args);
            };
            const unstakeOperation = {
                contractName: 'tokens',
                contractAction: 'unstake',
                contractPayload: {
                    symbol: scotTokenSymbol,
                    quantity: unstakeAmount,
                },
            };
            const operation = {
                id: useHive ? 'ssc-mainnet-hive' : 'ssc-mainnet1',
                required_auths: [account],
                json: JSON.stringify(unstakeOperation),
            };
            dispatch(
                transactionActions.broadcastOperation({
                    type: 'custom_json',
                    operation,
                    successCallback: successCallbackWrapper,
                    errorCallback,
                    useHive,
                })
            );
        },
    })
)(Powerdown);
