import { Map } from 'immutable';
/* eslint react/prop-types: 0 */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List } from 'immutable';
import tt from 'counterpart';
import TransferHistoryRow from 'app/components/cards/TransferHistoryRow';
import TransactionError from 'app/components/elements/TransactionError';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import {
    numberWithCommas,
    vestingSteem,
    delegatedSteem,
    powerdownSteem,
    pricePerSteem,
} from 'app/utils/StateFunctions';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import Tooltip from 'app/components/elements/Tooltip';
import { FormattedHTMLMessage } from 'app/Translator';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import * as appActions from 'app/redux/AppReducer';
import { actions as userProfileActions } from 'app/redux/UserProfilesSaga';
import DropdownMenu from 'app/components/elements/DropdownMenu';
import Icon from 'app/components/elements/Icon';
import classNames from 'classnames';
import FormattedAssetTokens from 'app/components/elements/FormattedAssetTokens';

class UserWallet extends React.Component {
    constructor() {
        super();
        this.state = {
            claimInProgress: false,
        };
        this.onShowDepositSteem = e => {
            if (e && e.preventDefault) e.preventDefault();
            const name = this.props.current_user;
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

    componentWillMount() {
        const { profile, fetchWalletProfile, accountname } = this.props;

        if (
            !profile ||
            !profile.has('token_balances') ||
            !profile.has('balance')
        ) {
            fetchWalletProfile(accountname);
        }
    }

    componentDidUpdate(prevProps) {
        const { profile, accountname, fetchWalletProfile } = this.props;
        if (prevProps.accountname != accountname) {
            if (
                !profile ||
                !profile.has('token_balances') ||
                !profile.has('balance')
            ) {
                fetchWalletProfile(accountname);
            }
        }
    }

    handleClaimRewards = profile => {
        const { scotTokenSymbol, claimRewards, useHive } = this.props;
        this.setState({ claimInProgress: true }); // disable the claim button
        claimRewards(profile, scotTokenSymbol, useHive);
    };
    handleClaimTokenRewards = token => {
        const { profile, claimTokenRewards, useHive } = this.props;
        claimTokenRewards(profile, token, useHive);
    };
    handleClaimAllTokensRewards = () => {
        const { profile, claimAllTokensRewards, useHive } = this.props;
        const allTokenStatus = profile.get('all_token_status').toJS();
        const pendingTokenSymbols = Object.values(allTokenStatus)
            .filter(e => parseFloat(e.pending_token))
            .map(({ symbol }) => symbol);
        claimAllTokensRewards(profile, pendingTokenSymbols, useHive);
    };
    render() {
        const {
            onShowDepositSteem,
            onShowWithdrawSteem,
            onShowDepositPower,
        } = this;
        const {
            profile,
            current_user,
            gprops,
            scotPrecision,
            scotTokenName,
            scotTokenSymbol,
            scotVestingToken,
            useHive,
        } = this.props;

        // do not render if profile is not loaded or available
        if (
            !profile ||
            (!profile.has('token_balances') && !profile.has('balance'))
        ) {
            return null;
        }
        const allTokenBalances = profile.has('token_balances')
            ? profile.get('token_balances').toJS()
            : [];
        const tokenBalances = allTokenBalances.find(
            ({ symbol }) => symbol === scotTokenSymbol
        ) || {
            balance: '0',
            stake: '0',
            pendingUnstake: '0',
            symbol: scotTokenSymbol,
        };
        const otherTokenBalances = allTokenBalances
            .filter(({ symbol }) => symbol !== scotTokenSymbol)
            .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
        const tokenUnstakes = profile.has('token_unstakes')
            ? profile.get('token_unstakes').toJS()
            : [];

        const tokenStatus = profile.has('token_status')
            ? profile.get('token_status').toJS()
            : {
                  pending_token: 0,
              };
        const allTokenStatus = profile.has('all_token_status')
            ? profile.get('all_token_status').toJS()
            : [];
        const balance = tokenBalances.balance;
        const delegatedStake = tokenBalances.delegationsOut || '0';
        const stakeBalance =
            parseFloat(tokenBalances.stake) + parseFloat(delegatedStake);
        const netDelegatedStake =
            parseFloat(delegatedStake) -
            parseFloat(tokenBalances.delegationsIn || '0');
        const pendingUnstakeBalance = tokenBalances.pendingUnstake;
        const tokenDelegations = profile.has('token_delegations')
            ? profile.get('token_delegations').toJS()
            : [];
        const [snaxBalance] = profile.has('snax_balance')
            ? profile.get('snax_balance').toJS()
            : [];
        const snax_balance_str = numberWithCommas(
            parseFloat(snaxBalance).toString()
        );
        const pendingTokens = Object.values(allTokenStatus).filter(e =>
            parseFloat(e.pending_token)
        );
        let isMyAccount = current_user && current_user === profile.get('name');

        const disabledWarning = false;

        const showTransfer = (asset, transferType, e) => {
            e.preventDefault();
            this.props.showTransfer({
                to: isMyAccount ? null : profile.get('name'),
                asset,
                transferType,
            });
        };

        const unstake = e => {
            e.preventDefault();
            const name = profile.get('name');
            this.props.showPowerdown({
                account: name,
                stakeBalance: stakeBalance.toFixed(scotPrecision),
                tokenUnstakes,
                delegatedStake,
            });
        };
        const cancelUnstake = e => {
            e.preventDefault();
            const name = profile.get('name');
            this.props.cancelUnstake({
                account: name,
                tokenUnstakes,
                useHive,
            });
        };

        /// transfer log
        let idx = 0;
        const transfer_log = profile
            .get('transfer_history', List())
            .map(item => {
                return (
                    <TransferHistoryRow
                        key={idx++}
                        op={item.toJS()}
                        context={profile.get('name')}
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
                    scotTokenSymbol,
                    'Transfer to Account'
                ),
            },
            {
                value: tt('userwallet_jsx.power_up'),
                link: '#',
                onClick: showTransfer.bind(
                    this,
                    scotVestingToken,
                    'Transfer to Account'
                ),
            },
        ];
        if (isMyAccount) {
            balance_menu.push({
                value: tt('userwallet_jsx.market'),
                link: `https://${
                    useHive ? 'hive' : 'steem'
                }-engine.com/?p=market&t=${scotTokenSymbol}`,
            });
        }
        let power_menu = [
            {
                value: tt('userwallet_jsx.power_down'),
                link: '#',
                onClick: unstake.bind(this),
            },
        ];

        if (tokenUnstakes.length > 0) {
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
        const rewards_str = reward > 0 ? `${reward} ${scotTokenSymbol}` : null;

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
                                    this.handleClaimRewards(profile);
                                }}
                            >
                                {tt('userwallet_jsx.redeem_rewards')}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // -------
        const vesting_steem = vestingSteem(profile.toJS(), gprops);
        const delegated_steem = delegatedSteem(profile.toJS(), gprops);
        // const powerdown_steem = powerdownSteem(profile.toJS(), gprops);

        const savings_balance = profile.get('savings_balance');
        const savings_sbd_balance = profile.get('savings_sbd_balance');

        const powerDown = (cancel, e) => {
            e.preventDefault();
            const name = profile.get('name');
            if (cancel) {
                const vesting_shares = cancel
                    ? '0.000000 VESTS'
                    : profile.get('vesting_shares');
                this.setState({ toggleDivestError: null });
                const errorCallback = e2 => {
                    this.setState({ toggleDivestError: e2.toString() });
                };
                const successCallback = () => {
                    this.setState({ toggleDivestError: null });
                };
                this.props.withdrawVesting({
                    account: name,
                    vesting_shares,
                    errorCallback,
                    successCallback,
                });
            } else {
                const to_withdraw = profile.get('to_withdraw');
                const withdrawn = profile.get('withdrawn');
                const vesting_shares = profile.get('vesting_shares');
                const delegated_vesting_shares = profile.get(
                    'delegated_vesting_shares'
                );
                this.props.showPowerdownSteem({
                    account: name,
                    to_withdraw,
                    withdrawn,
                    vesting_shares,
                    delegated_vesting_shares,
                });
            }
        };

        const balance_steem = parseFloat(profile.get('balance', 0));
        const saving_balance_steem = parseFloat(savings_balance || 0);
        const divesting =
            parseFloat(profile.get('vesting_withdraw_rate', 0)) > 0.0;
        const sbd_balance = parseFloat(profile.get('sbd_balance', 0));
        const sbd_balance_savings = parseFloat(savings_sbd_balance || 0);
        const received_power_balance_str =
            (delegated_steem < 0 ? '+' : '') +
            numberWithCommas((-delegated_steem).toFixed(3));

        const sbd_balance_str = numberWithCommas('$' + sbd_balance.toFixed(3)); // formatDecimal(account.sbd_balance, 3)

        const walletUrl = useHive ? 'wallet.hive.blog' : 'steemitwallet.com';
        const steem_menu = [
            {
                value: tt('userwallet_jsx.wallet'),
                link: `https://${walletUrl}/@${profile.get('name')}/transfers`,
            },
        ];
        if (isMyAccount) {
            steem_menu.push({
                value: tt('userwallet_jsx.market'),
                link: `https://${walletUrl}/market`,
            });
        }
        const steem_power_menu = [
            {
                value: tt('userwallet_jsx.wallet'),
                link: `https://${walletUrl}/@${profile.get('name')}/transfers`,
            },
        ];

        const steem_balance_str = numberWithCommas(balance_steem.toFixed(3));
        const power_balance_str = numberWithCommas(vesting_steem.toFixed(3));
        const native_token_str = useHive ? 'Hive' : 'Steem';
        const native_token_str_upper = useHive ? 'HIVE' : 'STEEM';

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
                        {scotTokenSymbol}
                        <FormattedHTMLMessage
                            className="secondary"
                            id="tips_js.liquid_token"
                            params={{
                                LIQUID_TOKEN: scotTokenName,
                                VESTING_TOKEN: scotVestingToken,
                            }}
                        />
                    </div>
                    <div className="column small-12 medium-4">
                        {isMyAccount ? (
                            <DropdownMenu
                                className="Wallet_dropdown"
                                items={balance_menu}
                                el="li"
                                selected={`${balance_str} ${scotTokenSymbol}`}
                            />
                        ) : (
                            `${balance_str} ${scotTokenSymbol}`
                        )}
                    </div>
                </div>
                <div className="UserWallet__balance row zebra">
                    <div className="column small-12 medium-8">
                        {scotVestingToken}
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
                                    scotTokenSymbol
                                }`}
                            />
                        ) : (
                            `${stake_balance_str} ${scotTokenSymbol}`
                        )}
                        {netDelegatedStake != 0 ? (
                            <div className="Delegations__view">
                                <Tooltip
                                    t={`${
                                        scotVestingToken
                                    } delegated to/from this account`}
                                >
                                    ({received_stake_balance_str}{' '}
                                    {scotTokenSymbol})
                                </Tooltip>
                                <a
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        const name = profile.get('name');
                                        this.props.showDelegations({
                                            account: name,
                                            tokenDelegations,
                                        });
                                    }}
                                >
                                    <Icon
                                        size="1x"
                                        name="eye"
                                        className="Delegations__view-icon"
                                    />
                                </a>
                            </div>
                        ) : null}
                    </div>
                </div>
                {!!parseFloat(pendingUnstakeBalance) && (
                    <div className="UserWallet__balance row">
                        <div className="column small-12">
                            <span>
                                Pending unstake: {pending_unstake_balance_str}{' '}
                                {scotTokenSymbol}.
                            </span>
                            <TransactionError opType="withdraw_vesting" />
                        </div>
                    </div>
                )}
                <hr />
                {/* STEEM */}
                <div className="UserWallet__balance row">
                    <div className="column small-12 medium-8">
                        {native_token_str_upper}
                        <FormattedHTMLMessage
                            className="secondary"
                            id="tips_js.liquid_token"
                            params={{
                                LIQUID_TOKEN: native_token_str,
                                VESTING_TOKEN: `${
                                    native_token_str_upper
                                } POWER`,
                            }}
                        />
                    </div>
                    <div className="column small-12 medium-4">
                        {isMyAccount ? (
                            <DropdownMenu
                                className="Wallet_dropdown"
                                items={steem_menu}
                                el="li"
                                selected={`${steem_balance_str} ${
                                    native_token_str_upper
                                }`}
                            />
                        ) : (
                            `${steem_balance_str} ${native_token_str_upper}`
                        )}
                    </div>
                </div>
                {/* STEEM POWER */}
                <div className="UserWallet__balance row zebra">
                    <div className="column small-12 medium-8">
                        {native_token_str_upper} POWER
                        <FormattedHTMLMessage
                            className="secondary"
                            id="tips_js.influence_token"
                        />
                        {delegated_steem != 0 ? (
                            <span className="secondary">
                                {tt(
                                    'tips_js.part_of_your_hive_power_is_currently_delegated',
                                    { user_name: profile.get('name') }
                                )}
                            </span>
                        ) : null}
                    </div>
                    <div className="column small-12 medium-4">
                        {isMyAccount ? (
                            <DropdownMenu
                                className="Wallet_dropdown"
                                items={steem_power_menu}
                                el="li"
                                selected={`${power_balance_str}  ${
                                    native_token_str_upper
                                }`}
                            />
                        ) : (
                            `${power_balance_str}  ${native_token_str_upper}`
                        )}
                        {delegated_steem != 0 ? (
                            <div
                                style={{
                                    paddingRight: isMyAccount
                                        ? '0.85rem'
                                        : null,
                                }}
                            >
                                <Tooltip
                                    t={`${
                                        native_token_str_upper
                                    } POWER delegated to/from this account`}
                                >
                                    ({received_power_balance_str}{' '}
                                    {native_token_str_upper})
                                </Tooltip>
                            </div>
                        ) : null}
                    </div>
                </div>
                {/* Steem Dollars */}
                <div className="UserWallet__balance row">
                    <div className="column small-12 medium-8">
                        {native_token_str_upper} DOLLARS
                        <div className="secondary">
                            {tt('userwallet_jsx.tradeable_tokens_transferred')}
                        </div>
                    </div>
                    <div className="column small-12 medium-4">
                        {isMyAccount ? (
                            <DropdownMenu
                                className="Wallet_dropdown"
                                items={steem_power_menu}
                                el="li"
                                selected={sbd_balance_str}
                            />
                        ) : (
                            sbd_balance_str
                        )}
                    </div>
                </div>
                <hr />
                {/* Engine Tokens */}
                {otherTokenBalances && otherTokenBalances.length ? (
                    <div
                        className={classNames('UserWallet__balance', 'row', {
                            zebra: parseFloat(pendingUnstakeBalance),
                        })}
                    >
                        <div className="column small-12 medium-9">
                            {useHive ? 'Hive' : 'Steem'} Engine Tokens
                        </div>
                        {isMyAccount && (
                            <div className="column small-12 medium-3">
                                <button
                                    disabled={pendingTokens.length === 0}
                                    className="button hollow ghost slim tiny float-right"
                                    onClick={this.handleClaimAllTokensRewards}
                                >
                                    All in one claim
                                </button>
                            </div>
                        )}
                        <div className="column small-12">
                            <FormattedAssetTokens
                                items={otherTokenBalances}
                                isMyAccount={isMyAccount}
                                pendingTokens={pendingTokens}
                                handleClaimTokenRewards={
                                    this.handleClaimTokenRewards
                                }
                            />
                        </div>
                    </div>
                ) : null}
                {/* SNAX Balance */}
                {parseFloat(snaxBalance) ? (
                    <div className="UserWallet__balance row">
                        <div className="column small-12 medium-8">
                            {' SNAX Tokens'}
                            <FormattedHTMLMessage
                                className="secondary"
                                id="tips_js.snax_token"
                            />
                        </div>
                        <div className="column small-12 medium-4">
                            {snax_balance_str}
                            {' SNAX'}
                        </div>
                    </div>
                ) : null}

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
        const scotTokenName = state.app.getIn(['hostConfig', 'LIQUID_TOKEN']);
        const scotTokenSymbol = state.app.getIn([
            'hostConfig',
            'LIQUID_TOKEN_UPPERCASE',
        ]);
        const scotVestingToken = state.app.getIn([
            'hostConfig',
            'VESTING_TOKEN',
        ]);
        const useHive = state.app.getIn(['hostConfig', 'HIVE_ENGINE']);

        return {
            ...ownProps,
            gprops: gprops ? gprops.toJS() : {},
            scotPrecision: scotConfig.getIn(['info', 'precision'], 0),
            scotTokenName,
            scotTokenSymbol,
            scotVestingToken,
            useHive,
        };
    },
    // mapDispatchToProps
    dispatch => ({
        claimRewards: (account, scotTokenSymbol, useHive) => {
            const username = account.get('name');
            const successCallback = () => {
                dispatch(
                    userProfileActions.fetchWalletProfile({
                        account: username,
                    })
                );
            };

            const operation = {
                id: 'scot_claim_token',
                required_posting_auths: [username],
                json: JSON.stringify({
                    symbol: scotTokenSymbol,
                }),
            };

            dispatch(
                transactionActions.broadcastOperation({
                    type: 'custom_json',
                    operation,
                    successCallback,
                    useHive,
                })
            );
        },

        claimTokenRewards: (profile, symbol, useHive) => {
            const username = profile.get('name');
            const successCallback = () => {
                dispatch(
                    appActions.addNotification({
                        key: 'trx_' + Date.now(),
                        message: `${symbol} Token Claim Completed.`,
                        dismissAfter: 5000,
                    })
                );
                dispatch(
                    userProfileActions.fetchWalletProfile({
                        account: username,
                    })
                );
            };
            const operation = {
                id: 'scot_claim_token',
                required_posting_auths: [username],
                json: JSON.stringify({ symbol }),
            };
            dispatch(
                transactionActions.broadcastOperation({
                    type: 'custom_json',
                    operation,
                    successCallback,
                    useHive,
                })
            );
        },

        claimAllTokensRewards: (profile, symbols, useHive) => {
            const username = profile.get('name');
            const successCallback = () => {
                dispatch(
                    appActions.addNotification({
                        key: 'trx_' + Date.now(),
                        message: tt('g.all_claim_completed'),
                        dismissAfter: 5000,
                    })
                );
                dispatch(
                    userProfileActions.fetchWalletProfile({
                        account: username,
                    })
                );
            };
            const json = symbols.map(symbol => ({ symbol }));
            const operation = {
                id: 'scot_claim_token',
                required_posting_auths: [username],
                json: JSON.stringify(json),
            };
            dispatch(
                appActions.addNotification({
                    key: 'trx_' + Date.now(),
                    message: tt('g.all_claim_started', { seconds: 3 }),
                    dismissAfter: 5000,
                })
            );
            dispatch(
                transactionActions.broadcastOperation({
                    type: 'custom_json',
                    operation,
                    successCallback,
                    useHive,
                })
            );
        },

        fetchWalletProfile: account =>
            dispatch(userProfileActions.fetchWalletProfile({ account })),
    })
)(UserWallet);
