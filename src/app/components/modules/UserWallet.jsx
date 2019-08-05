/* eslint react/prop-types: 0 */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import TransferHistoryRow from 'app/components/cards/TransferHistoryRow';
import TransactionError from 'app/components/elements/TransactionError';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import { numberWithCommas } from 'app/utils/StateFunctions';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import Tooltip from 'app/components/elements/Tooltip';
import { FormattedHTMLMessage } from 'app/Translator';
import {
    LIQUID_TOKEN,
    LIQUID_TOKEN_UPPERCASE,
    VESTING_TOKEN,
} from 'app/client_config';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import DropdownMenu from 'app/components/elements/DropdownMenu';

class UserWallet extends React.Component {
    constructor() {
        super();
        this.state = {
            claimInProgress: false,
        };
        this.onShowDepositSteem = e => {
            if (e && e.preventDefault) e.preventDefault();
            const name = this.props.current_user.get('username');
            const new_window = window.open();
            new_window.opener = null;
            new_window.location =
                'https://blocktrades.us/?input_coin_type=eth&output_coin_type=steem&receive_address=' +
                name;
        };
        this.onShowWithdrawSteem = e => {
            e.preventDefault();
            const new_window = window.open();
            new_window.opener = null;
            new_window.location =
                'https://blocktrades.us/unregistered_trade/steem/eth';
        };
        this.onShowDepositPower = (current_user_name, e) => {
            e.preventDefault();
            const new_window = window.open();
            new_window.opener = null;
            new_window.location =
                'https://blocktrades.us/?input_coin_type=eth&output_coin_type=steem_power&receive_address=' +
                current_user_name;
        };
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'UserWallet');
    }

    handleClaimRewards = account => {
        this.setState({ claimInProgress: true }); // disable the claim button
        this.props.claimRewards(account);
    };
    render() {
        const {
            onShowDepositSteem,
            onShowWithdrawSteem,
            onShowDepositPower,
        } = this;
        const { account, current_user, gprops, scotPrecision } = this.props;

        // do not render if account is not loaded or available
        if (!account) return null;

        const tokenBalances = account.has('token_balances')
            ? account.get('token_balances').toJS()
            : {
                  balance: '0',
                  stake: '0',
                  pendingUnstake: '0',
              };
        const tokenUnstakes = account.has('token_unstakes')
            ? account.get('token_unstakes').toJS()
            : {
                  quantityLeft: '0',
              };

        const tokenStatus = account.has('token_status')
            ? account.get('token_status').toJS()
            : {
                  pending_token: 0,
              };
        const balance = tokenBalances.balance;
        const delegatedStake = tokenBalances.delegationsOut || '0';
        const stakeBalance =
            parseFloat(tokenBalances.stake) + parseFloat(delegatedStake);
        const netDelegatedStake =
            parseFloat(delegatedStake) -
            parseFloat(tokenBalances.delegationsIn || '0');
        const pendingUnstakeBalance = tokenBalances.pendingUnstake;
        const tokenDelegations = account.has('token_delegations')
            ? account.get('token_delegations').toJS()
            : [];
        debugger;

        let isMyAccount =
            current_user &&
            current_user.get('username') === account.get('name');

        const disabledWarning = false;

        const showTransfer = (asset, transferType, e) => {
            e.preventDefault();
            this.props.showTransfer({
                to: isMyAccount ? null : account.get('name'),
                asset,
                transferType,
            });
        };

        const unstake = e => {
            e.preventDefault();
            const name = account.get('name');
            this.props.showPowerdown({
                account: name,
                stakeBalance: stakeBalance.toFixed(scotPrecision),
                delegatedStake,
            });
        };
        const cancelUnstake = e => {
            e.preventDefault();
            const name = account.get('name');
            this.props.cancelUnstake({
                account: name,
                transactionId: tokenUnstakes.txID,
            });
        };

        /// transfer log
        let idx = 0;
        const transfer_log = account
            .get('transfer_history')
            .map(item => {
                return (
                    <TransferHistoryRow
                        key={idx++}
                        op={item.toJS()}
                        context={account.get('name')}
                    />
                );
            })
            .filter(el => !!el)
            .reverse();

        let balance_menu = [
            {
                value: tt('userwallet_jsx.transfer'),
                link: '#',
                onClick: showTransfer.bind(
                    this,
                    LIQUID_TOKEN_UPPERCASE,
                    'Transfer to Account'
                ),
            },
            {
                value: tt('userwallet_jsx.power_up'),
                link: '#',
                onClick: showTransfer.bind(
                    this,
                    VESTING_TOKEN,
                    'Transfer to Account'
                ),
            },
        ];
        let power_menu = [
            {
                value: tt('userwallet_jsx.power_down'),
                link: '#',
                onClick: unstake.bind(this),
            },
        ];

        if (parseFloat(tokenUnstakes.quantityLeft) > 0) {
            power_menu.push({
                value: 'Cancel Unstake',
                link: '#',
                onClick: cancelUnstake.bind(this),
            });
        }

        const balance_str = numberWithCommas(balance);
        const stake_balance_str = numberWithCommas(
            stakeBalance.toFixed(scotPrecision)
        );
        const received_stake_balance_str =
            (netDelegatedStake < 0 ? '+' : '') +
            numberWithCommas((-netDelegatedStake).toFixed(scotPrecision));
        const pending_unstake_balance_str = numberWithCommas(
            pendingUnstakeBalance
        );

        const reward = tokenStatus.pending_token / Math.pow(10, scotPrecision);
        const rewards_str =
            reward > 0 ? `${reward} ${LIQUID_TOKEN_UPPERCASE}` : null;

        let claimbox;
        if (current_user && rewards_str && isMyAccount) {
            claimbox = (
                <div className="row">
                    <div className="columns small-12">
                        <div className="UserWallet__claimbox">
                            <span className="UserWallet__claimbox-text">
                                Your current rewards: {rewards_str}
                            </span>
                            <button
                                disabled={this.state.claimInProgress}
                                className="button"
                                onClick={e => {
                                    this.handleClaimRewards(account);
                                }}
                            >
                                {tt('userwallet_jsx.redeem_rewards')}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="UserWallet">
                {claimbox}
                <div className="row">
                    <div className="columns small-10 medium-12 medium-expand">
                        <div>
                            <br />
                            <h4>{tt('g.balances')}</h4>
                            <br />
                        </div>
                    </div>
                </div>
                <div className="UserWallet__balance row">
                    <div className="column small-12 medium-8">
                        {LIQUID_TOKEN_UPPERCASE}
                        <FormattedHTMLMessage
                            className="secondary"
                            id="tips_js.liquid_token"
                            params={{ LIQUID_TOKEN, VESTING_TOKEN }}
                        />
                    </div>
                    <div className="column small-12 medium-4">
                        {isMyAccount ? (
                            <DropdownMenu
                                className="Wallet_dropdown"
                                items={balance_menu}
                                el="li"
                                selected={`${balance_str} ${
                                    LIQUID_TOKEN_UPPERCASE
                                }`}
                            />
                        ) : (
                            `${balance_str} ${LIQUID_TOKEN_UPPERCASE}`
                        )}
                    </div>
                </div>
                <div className="UserWallet__balance row zebra">
                    <div className="column small-12 medium-8">
                        {VESTING_TOKEN}
                        <FormattedHTMLMessage
                            className="secondary"
                            id="tips_js.influence_token"
                        />
                    </div>
                    <div className="column small-12 medium-4">
                        {isMyAccount ? (
                            <DropdownMenu
                                className="Wallet_dropdown"
                                items={power_menu}
                                el="li"
                                selected={`${stake_balance_str} ${
                                    LIQUID_TOKEN_UPPERCASE
                                }`}
                            />
                        ) : (
                            `${stake_balance_str} ${LIQUID_TOKEN_UPPERCASE}`
                        )}
                        {netDelegatedStake != 0 ? (
                            <div
                                style={{
                                    paddingRight: isMyAccount
                                        ? '0.85rem'
                                        : null,
                                }}
                            >
                                <Tooltip t="{VESTING_TOKEN} delegated to/from this account">
                                    ({received_stake_balance_str}{' '}
                                    {LIQUID_TOKEN_UPPERCASE})
                                </Tooltip>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="UserWallet__balance row">
                    <div className="column small-12">
                        {!!parseFloat(pendingUnstakeBalance) && (
                            <span>
                                Pending unstake: {pending_unstake_balance_str}{' '}
                                {LIQUID_TOKEN_UPPERCASE}.
                            </span>
                        )}
                        <TransactionError opType="withdraw_vesting" />
                    </div>
                </div>
                {disabledWarning && (
                    <div className="row">
                        <div className="column small-12">
                            <div className="callout warning">
                                {tt(
                                    'userwallet_jsx.transfers_are_temporary_disabled'
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="column small-12">
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <div className="column small-12">
                        {/** history */}
                        <h4>{tt('userwallet_jsx.history')}</h4>
                        <div className="secondary">
                            <span>
                                {tt(
                                    'transfer_jsx.beware_of_spam_and_phishing_links'
                                )}
                            </span>
                            &nbsp;
                            <span>
                                {tt(
                                    'transfer_jsx.transactions_make_take_a_few_minutes'
                                )}
                            </span>
                        </div>
                        <table>
                            <tbody>{transfer_log}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        const gprops = state.global.get('props');
        const scotConfig = state.app.get('scotConfig');
        return {
            ...ownProps,
            gprops: state.global.get('props').toJS(),
            scotPrecision: scotConfig.getIn(['info', 'precision'], 0),
        };
    },
    // mapDispatchToProps
    dispatch => ({
        claimRewards: account => {
            const username = account.get('name');
            const successCallback = () => {
                dispatch(
                    globalActions.getState({ url: `@${username}/transfers` })
                );
            };

            const operation = {
                id: 'scot_claim_token',
                required_posting_auths: [username],
                json: JSON.stringify({
                    symbol: LIQUID_TOKEN_UPPERCASE,
                }),
            };

            dispatch(
                transactionActions.broadcastOperation({
                    type: 'custom_json',
                    operation,
                    successCallback,
                })
            );
        },
    })
)(UserWallet);
