import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import reactForm from 'app/utils/ReactForm';
import { Map } from 'immutable';
import Autocomplete from 'react-autocomplete';
import tt from 'counterpart';

import * as transactionActions from 'app/redux/TransactionReducer';
import * as userActions from 'app/redux/UserReducer';
import { actions as userProfileActions } from 'app/redux/UserProfilesSaga';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import ConfirmTransfer from 'app/components/elements/ConfirmTransfer';
import runTests, { browserTests } from 'app/utils/BrowserTests';
import {
    validate_account_name_with_memo,
    validate_memo_field,
} from 'app/utils/ChainValidation';
import { countDecimals } from 'app/utils/ParsersAndFormatters';

/** Warning .. This is used for Power UP too. */

class TransferForm extends Component {
    static propTypes = {
        // redux
        currentUser: PropTypes.object.isRequired,
        toVesting: PropTypes.bool.isRequired,
        currentAccount: PropTypes.object.isRequired,
        following: PropTypes.object.isRequired,
        hostConfig: PropTypes.object,
    };

    constructor(props) {
        super();
        const { transferToSelf } = props;
        this.state = {
            advanced: !transferToSelf,
            transferTo: false,
            autocompleteUsers: [],
        };
        this.initForm(props);
    }

    componentDidMount() {
        setTimeout(() => {
            const { advanced } = this.state;
            if (advanced) this.to.focus();
            else ReactDOM.findDOMNode(this.refs.amount).focus();
        }, 300);

        runTests();

        this.buildTransferAutocomplete();
    }

    buildTransferAutocomplete() {
        // Get names for the recent account transfers
        const labelPreviousTransfers = tt(
            'transfer_jsx.autocomplete_previous_transfers'
        );
        const labelFollowingUser = tt(
            'transfer_jsx.autocomplete_user_following'
        );

        const transferToLog = this.props.currentAccount
            .get('transfer_history')
            .reduce((acc, cur) => {
                if (cur.getIn([1, 'op', 0]) === 'transfer') {
                    const username = cur.getIn([1, 'op', 1, 'to']);
                    const numTransfers = acc.get(username)
                        ? acc.get(username).numTransfers + 1
                        : 1;
                    return acc.set(username, {
                        username,
                        label: `${numTransfers} ${labelPreviousTransfers}`,
                        numTransfers,
                    });
                }
                return acc;
            }, Map())
            .remove(this.props.currentUser.get('username'));

        // Build a combined list of users you follow & have previously transferred to,
        // and sort it by 1. desc the number of previous transfers 2. username asc.
        this.setState({
            autocompleteUsers: this.props.following
                .toOrderedMap()
                .map(username => ({
                    username,
                    label: labelFollowingUser,
                    numTransfers: 0,
                }))
                .merge(transferToLog)
                .sortBy(null, (a, b) => {
                    //prioritize sorting by number of transfers
                    if (a.numTransfers > b.numTransfers) {
                        return -1;
                    }
                    if (b.numTransfers > a.numTransfers) {
                        return 1;
                    }
                    //if transfer number is the same, sort by username
                    if (a.username > b.username) {
                        return 1;
                    }
                    if (b.username > a.username) {
                        return -1;
                    }
                    return 0;
                })
                .toArray(),
        });
    }

    matchAutocompleteUser(item, value) {
        return item.username.toLowerCase().indexOf(value.toLowerCase()) > -1;
    }

    onAdvanced = e => {
        e.preventDefault(); // prevent form submission!!
        const username = this.props.currentUser.get('username');
        this.state.to.props.onChange(username);
        // setTimeout(() => {ReactDOM.findDOMNode(this.refs.amount).focus()}, 300)
        this.setState({ advanced: !this.state.advanced });
    };

    initForm(props) {
        const { transferType } = props.initialValues;
        const insufficientFunds = (asset, amount) => {
            const { currentAccount, tokenBalances } = props;
            return parseFloat(amount) > parseFloat(tokenBalances.balance);
        };
        const { toVesting } = props;
        const fields = toVesting ? ['to', 'amount'] : ['to', 'amount', 'asset'];
        if (
            !toVesting &&
            transferType !== 'Transfer to Savings' &&
            transferType !== 'Savings Withdraw'
        )
            fields.push('memo');
        reactForm({
            name: 'transfer',
            instance: this,
            fields,
            initialValues: props.initialValues,
            validation: values => ({
                to: !values.to
                    ? tt('g.required')
                    : validate_account_name_with_memo(values.to, values.memo),
                amount: !values.amount
                    ? 'Required'
                    : !/^\d+(\.\d+)?$/.test(values.amount)
                      ? tt('transfer_jsx.amount_is_in_form')
                      : insufficientFunds(values.asset, values.amount)
                        ? tt('transfer_jsx.insufficient_funds')
                        : null,
                asset: props.toVesting
                    ? null
                    : !values.asset ? tt('g.required') : null,
                memo: values.memo
                    ? validate_memo_field(
                          values.memo,
                          props.currentUser.get('username'),
                          props.currentAccount.get('memo_key')
                      )
                    : values.memo &&
                      (!browserTests.memo_encryption && /^#/.test(values.memo))
                      ? 'Encrypted memos are temporarily unavailable (issue #98)'
                      : null,
            }),
        });
    }

    clearError = () => {
        this.setState({ trxError: undefined });
    };

    errorCallback = estr => {
        this.setState({ trxError: estr, loading: false });
    };

    balanceValue() {
        const { transferType } = this.props.initialValues;
        const { currentAccount, tokenBalances, hostConfig } = this.props;
        const { asset } = this.state;
        const tokenBalance = tokenBalances.find(
            ({ symbol }) => symbol === hostConfig['LIQUID_TOKEN_UPPERCASE']
        );
        return !asset || asset.value === hostConfig['LIQUID_TOKEN_UPPERCASE']
            ? `${tokenBalance.balance} ${hostConfig['LIQUID_TOKEN_UPPERCASE']}`
            : null;
    }

    assetBalanceClick = e => {
        e.preventDefault();
        // Convert '9.999 STEEM' to 9.999
        this.state.amount.props.onChange(this.balanceValue().split(' ')[0]);
    };

    onChangeTo = value => {
        this.state.to.props.onChange(value.toLowerCase().trim());
        this.setState({
            to: { ...this.state.to, value: value.toLowerCase().trim() },
        });
    };

    render() {
        const {
            currentUser,
            currentAccount,
            tokenBalances,
            hostConfig,
            toVesting,
            transferToSelf,
            dispatchSubmit,
        } = this.props;

        const APP_NAME = hostConfig['APP_NAME'];
        const LIQUID_TOKEN = hostConfig['LIQUID_TOKEN'];
        const LIQUID_TOKEN_UPPERCASE = hostConfig['LIQUID_TOKEN_UPPERCASE'];
        const VESTING_TOKEN = hostConfig['VESTING_TOKEN'];
        const useHive = hostConfig['HIVE_ENGINE'];
        const transferTips = {
            'Transfer to Account': tt(
                'transfer_jsx.move_funds_to_another_account',
                { APP_NAME }
            ),
        };
        const powerTip3 = tt(
            'tips_js.converted_VESTING_TOKEN_can_be_sent_to_yourself_but_can_not_transfer_again',
            { LIQUID_TOKEN, VESTING_TOKEN }
        );
        const { to, amount, asset, memo } = this.state;
        const { loading, trxError, advanced } = this.state;

        const { transferType } = this.props.initialValues;
        const { submitting, valid, handleSubmit } = this.state.transfer;
        // const isMemoPrivate = memo && /^#/.test(memo.value); -- private memos are not supported yet
        const isMemoPrivate = false;

        const form = (
            <form
                onSubmit={handleSubmit(({ data }) => {
                    this.setState({ loading: true });
                    dispatchSubmit({
                        ...data,
                        errorCallback: this.errorCallback,
                        currentUser,
                        toVesting,
                        transferType,
                        symbol: LIQUID_TOKEN_UPPERCASE,
                        useHive,
                    });
                })}
                onChange={this.clearError}
            >
                {toVesting && (
                    <div className="row">
                        <div className="column small-12">
                            <p>{tt('tips_js.influence_token')}</p>
                            <p>
                                {tt('tips_js.non_transferable', {
                                    LIQUID_TOKEN,
                                    VESTING_TOKEN,
                                })}
                            </p>
                        </div>
                    </div>
                )}

                {!toVesting && (
                    <div>
                        <div className="row">
                            <div className="column small-12">
                                {transferTips[transferType]}
                            </div>
                        </div>
                        <br />
                    </div>
                )}

                <div className="row">
                    <div className="column small-2" style={{ paddingTop: 5 }}>
                        {tt('transfer_jsx.from')}
                    </div>
                    <div className="column small-10">
                        <div
                            className="input-group"
                            style={{ marginBottom: '1.25rem' }}
                        >
                            <span className="input-group-label">@</span>
                            <input
                                className="input-group-field bold"
                                type="text"
                                disabled
                                value={currentUser.get('username')}
                            />
                        </div>
                    </div>
                </div>

                {advanced && (
                    <div className="row">
                        <div
                            className="column small-2"
                            style={{ paddingTop: 5 }}
                        >
                            {tt('transfer_jsx.to')}
                        </div>
                        <div className="column small-10">
                            <div
                                className="input-group"
                                style={{ marginBottom: '1.25rem' }}
                            >
                                <span className="input-group-label">@</span>
                                <Autocomplete
                                    wrapperStyle={{
                                        display: 'inline-block',
                                        width: '100%',
                                    }}
                                    inputProps={{
                                        type: 'text',
                                        className: 'input-group-field',
                                        autoComplete: 'off',
                                        autoCorrect: 'off',
                                        autoCapitalize: 'off',
                                        spellCheck: 'false',
                                        disabled: loading,
                                    }}
                                    renderMenu={items => (
                                        <div
                                            className="react-autocomplete-input"
                                            children={items}
                                        />
                                    )}
                                    ref={el => (this.to = el)}
                                    getItemValue={item => item.username}
                                    items={this.state.autocompleteUsers}
                                    shouldItemRender={
                                        this.matchAutocompleteUser
                                    }
                                    renderItem={(item, isHighlighted) => (
                                        <div
                                            className={
                                                isHighlighted ? 'active' : ''
                                            }
                                        >
                                            {`${item.username} (${item.label})`}
                                        </div>
                                    )}
                                    value={this.state.to.value || ''}
                                    onChange={e => {
                                        this.setState({
                                            to: {
                                                ...this.state.to,
                                                touched: true,
                                                value: e.target.value,
                                            },
                                        });
                                    }}
                                    onSelect={val =>
                                        this.setState({
                                            to: {
                                                ...this.state.to,
                                                value: val,
                                            },
                                        })
                                    }
                                />
                            </div>
                            {to.touched && to.error ? (
                                <div className="error">{to.error}&nbsp;</div>
                            ) : (
                                <p>{toVesting && powerTip3}</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="row">
                    <div className="column small-2" style={{ paddingTop: 5 }}>
                        {tt('g.amount')}
                    </div>
                    <div className="column small-10">
                        <div
                            className="input-group"
                            style={{ marginBottom: 5 }}
                        >
                            <input
                                type="text"
                                placeholder={tt('g.amount')}
                                {...amount.props}
                                ref="amount"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                disabled={loading}
                            />
                            {asset && (
                                <span
                                    className="input-group-label"
                                    style={{ paddingLeft: 0, paddingRight: 0 }}
                                >
                                    <select
                                        {...asset.props}
                                        placeholder={tt('transfer_jsx.asset')}
                                        disabled={loading}
                                        style={{
                                            minWidth: '5rem',
                                            height: 'inherit',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                        }}
                                    >
                                        <option value="{LIQUID_TOKEN_UPPERCASE}">
                                            {LIQUID_TOKEN_UPPERCASE}
                                        </option>
                                    </select>
                                </span>
                            )}
                        </div>
                        <div style={{ marginBottom: '0.6rem' }}>
                            <AssetBalance
                                balanceValue={this.balanceValue()}
                                onClick={this.assetBalanceClick}
                            />
                        </div>
                        {(asset && asset.touched && asset.error) ||
                        (amount.touched && amount.error) ? (
                            <div className="error">
                                {asset &&
                                    asset.touched &&
                                    asset.error &&
                                    asset.error}&nbsp;
                                {amount.touched &&
                                    amount.error &&
                                    amount.error}&nbsp;
                            </div>
                        ) : null}
                    </div>
                </div>

                {memo && (
                    <div className="row">
                        <div
                            className="column small-2"
                            style={{ paddingTop: 33 }}
                        >
                            {tt('g.memo')}
                        </div>
                        <div className="column small-10">
                            <small>
                                {isMemoPrivate
                                    ? tt('transfer_jsx.this_memo_is_private')
                                    : tt('transfer_jsx.this_memo_is_public')}
                            </small>
                            <input
                                type="text"
                                placeholder={tt('g.memo')}
                                {...memo.props}
                                ref="memo"
                                autoComplete="on"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                disabled={loading}
                            />
                            <div className="error">
                                {memo.touched && memo.error && memo.error}&nbsp;
                            </div>
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="column">
                        {loading && (
                            <span>
                                <LoadingIndicator type="circle" />
                                <br />
                            </span>
                        )}
                        {!loading && (
                            <span>
                                {trxError && (
                                    <div className="error">{trxError}</div>
                                )}
                                <button
                                    type="submit"
                                    disabled={submitting || !valid}
                                    className="button"
                                >
                                    {toVesting
                                        ? tt('g.power_up')
                                        : tt('g.next')}
                                </button>
                                {transferToSelf && (
                                    <button
                                        className="button hollow no-border"
                                        disabled={submitting}
                                        onClick={this.onAdvanced}
                                    >
                                        {advanced
                                            ? tt('g.basic')
                                            : tt('g.advanced')}
                                    </button>
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </form>
        );
        return (
            <div>
                <div className="row">
                    <h3 className="column">
                        {toVesting
                            ? tt('transfer_jsx.convert_to_VESTING_TOKEN', {
                                  VESTING_TOKEN,
                              })
                            : transferType}
                    </h3>
                </div>
                {form}
            </div>
        );
    }
}

const AssetBalance = ({ onClick, balanceValue }) => (
    <a
        onClick={onClick}
        style={{ borderBottom: '#A09F9F 1px dotted', cursor: 'pointer' }}
    >
        {tt('g.balance', { balanceValue })}
    </a>
);

import { connect } from 'react-redux';

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        const hostConfig = state.app.get('hostConfig', Map()).toJS();
        const initialValues = state.user.get('transfer_defaults', Map()).toJS();
        const toVesting = initialValues.asset === hostConfig['VESTING_TOKEN'];
        const currentUser = state.user.getIn(['current']);
        const currentAccount = state.userProfiles.getIn([
            'profiles',
            currentUser.get('username'),
        ]);
        const tokenBalances = currentAccount.has('token_balances')
            ? currentAccount.get('token_balances').toJS()
            : {
                  balance: '0',
                  stake: '0',
                  pendingUnstake: '0',
              };

        if (!toVesting && !initialValues.transferType)
            initialValues.transferType = 'Transfer to Account';

        let transferToSelf =
            toVesting ||
            /Transfer to Savings|Savigs Withdraw/.test(
                initialValues.transferType
            );
        if (transferToSelf && !initialValues.to)
            initialValues.to = currentUser.get('username');

        if (initialValues.to !== currentUser.get('username'))
            transferToSelf = false; // don't hide the to field

        return {
            ...ownProps,
            currentUser,
            currentAccount,
            tokenBalances,
            toVesting,
            transferToSelf,
            following: state.global.getIn([
                'follow',
                'getFollowingAsync',
                currentUser.get('username'),
                'blog_result',
            ]),
            initialValues,
            hostConfig,
        };
    },

    // mapDispatchToProps
    dispatch => ({
        dispatchSubmit: ({
            to,
            amount,
            asset,
            memo,
            transferType,
            toVesting,
            symbol,
            currentUser,
            errorCallback,
            useHive,
        }) => {
            if (!toVesting && !/Transfer to Account/.test(transferType))
                throw new Error(
                    `Invalid transfer params: toVesting ${
                        toVesting
                    }, transferType ${transferType}`
                );

            const username = currentUser.get('username');
            const successCallback = () => {
                // refresh transfer history
                dispatch(
                    userProfileActions.fetchWalletProfile({ account: username })
                );
                dispatch(userActions.hideTransfer());
            };
            const transferOperation = toVesting
                ? {
                      contractName: 'tokens',
                      contractAction: 'stake',
                      contractPayload: {
                          symbol,
                          to,
                          quantity: amount,
                      },
                  }
                : {
                      contractName: 'tokens',
                      contractAction: 'transfer',
                      contractPayload: {
                          symbol,
                          to,
                          quantity: amount,
                          memo: memo ? memo : '',
                      },
                  };
            const operation = {
                id: useHive ? 'ssc-mainnet-hive' : 'ssc-mainnet1',
                required_auths: [username],
                json: JSON.stringify(transferOperation),
            };
            const confirm =
                toVesting && username === to
                    ? null
                    : () => (
                          <ConfirmTransfer
                              operation={{
                                  contractName: transferOperation.contractName,
                                  contractAction:
                                      transferOperation.contractAction,
                                  ...transferOperation.contractPayload,
                              }}
                          />
                      );
            dispatch(
                transactionActions.broadcastOperation({
                    type: 'custom_json',
                    operation,
                    successCallback,
                    errorCallback,
                    confirm,
                    useHive,
                })
            );
        },
    })
)(TransferForm);
