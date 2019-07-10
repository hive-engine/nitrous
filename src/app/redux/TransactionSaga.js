import { call, put, select, all, takeEvery } from 'redux-saga/effects';
import { fromJS, Set, Map } from 'immutable';
import tt from 'counterpart';
import getSlug from 'speakingurl';
import base58 from 'bs58';
import secureRandom from 'secure-random';
import { PrivateKey, PublicKey } from '@blocktradesdev/steem-js/lib/auth/ecc';
import { api, broadcast, auth, memo } from '@blocktradesdev/steem-js';

import { getAccount } from 'app/redux/SagaShared';
import { findSigningKey } from 'app/redux/AuthSaga';
import * as appActions from 'app/redux/AppReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as userActions from 'app/redux/UserReducer';
import { DEBT_TICKER } from 'app/client_config';
import { serverApiRecordEvent } from 'app/utils/ServerApiClient';

export const transactionWatches = [
    takeEvery(transactionActions.BROADCAST_OPERATION, broadcastOperation),
    takeEvery(transactionActions.UPDATE_AUTHORITIES, updateAuthorities),
    takeEvery(transactionActions.RECOVER_ACCOUNT, recoverAccount),
];

const hook = {
    preBroadcast_transfer,
    preBroadcast_account_witness_vote,
    preBroadcast_update_proposal_votes,
    preBroadcast_remove_proposal,
    error_account_witness_vote,
    accepted_account_witness_vote,
    accepted_account_update,
    accepted_withdraw_vesting,
    accepted_update_proposal_votes,
};

export function* preBroadcast_transfer({ operation }) {
    let memoStr = operation.memo;
    if (memoStr) {
        memoStr = toStringUtf8(memoStr);
        memoStr = memoStr.trim();
        if (/^#/.test(memoStr)) {
            const memo_private = yield select(state =>
                state.user.getIn(['current', 'private_keys', 'memo_private'])
            );
            if (!memo_private)
                throw new Error(
                    'Unable to encrypt memo, missing memo private key'
                );
            const account = yield call(getAccount, operation.to);
            if (!account) throw new Error(`Unknown to account ${operation.to}`);
            const memo_key = account.get('memo_key');
            memoStr = memo.encode(memo_private, memo_key, memoStr);
            operation.memo = memoStr;
        }
    }
    return operation;
}
const toStringUtf8 = o =>
    o ? (Buffer.isBuffer(o) ? o.toString('utf-8') : o.toString()) : o;

function* preBroadcast_account_witness_vote({ operation, username }) {
    if (!operation.account) operation.account = username;
    const { account, witness, approve } = operation;
    // give immediate feedback
    yield put(
        globalActions.addActiveWitnessVote({
            account,
            witness,
        })
    );
    return operation;
}

function* preBroadcast_update_proposal_votes({ operation, username }) {
    if (!operation.voter) operation.voter = username;
    const { voter, proposal_ids } = operation;
    yield put(
        globalActions.addActiveProposalVote({
            voter,
            proposal_ids,
        })
    );
    return operation;
}

function preBroadcast_remove_proposal({ operation, username }) {
    if (!operation.proposal_owner) operation.proposal_owner = username;
    return operation;
}

function* error_account_witness_vote({
    operation: { account, witness, approve },
}) {
    yield put(
        globalActions.updateAccountWitnessVote({
            account,
            witness,
            approve: !approve,
        })
    );
}

/** Keys, username, and password are not needed for the initial call.  This will check the login and may trigger an action to prompt for the password / key. */
export function* broadcastOperation({
    payload: {
        type,
        operation,
        confirm,
        warning,
        keys,
        username,
        password,
        successCallback,
        errorCallback,
        allowPostUnsafe,
    },
}) {
    const operationParam = {
        type,
        operation,
        keys,
        username,
        password,
        successCallback,
        errorCallback,
        allowPostUnsafe,
    };

    const conf = typeof confirm === 'function' ? confirm() : confirm;
    if (conf) {
        yield put(
            transactionActions.confirmOperation({
                confirm,
                warning,
                operation: operationParam,
                errorCallback,
            })
        );
        return;
    }
    const payload = {
        operations: [[type, operation]],
        keys,
        username,
        successCallback,
        errorCallback,
    };
    if (!allowPostUnsafe && hasPrivateKeys(payload)) {
        const confirm = tt('g.post_key_warning.confirm');
        const warning = tt('g.post_key_warning.warning');
        const checkbox = tt('g.post_key_warning.checkbox');
        operationParam.allowPostUnsafe = true;
        yield put(
            transactionActions.confirmOperation({
                confirm,
                warning,
                checkbox,
                operation: operationParam,
                errorCallback,
            })
        );
        return;
    }
    try {
        if (!keys || keys.length === 0) {
            payload.keys = [];
            // user may already be logged in, or just enterend a signing passowrd or wif
            const signingKey = yield call(findSigningKey, {
                opType: type,
                username,
                password,
            });
            if (signingKey) payload.keys.push(signingKey);
            else {
                if (!password) {
                    yield put(
                        userActions.showLogin({
                            operation: {
                                type,
                                operation,
                                username,
                                successCallback,
                                errorCallback,
                                saveLogin: true,
                            },
                        })
                    );
                    return;
                }
            }
        }
        yield call(broadcastPayload, { payload });
        let eventType = type
            .replace(/^([a-z])/, g => g.toUpperCase())
            .replace(/_([a-z])/g, g => g[1].toUpperCase());
        if (eventType === 'Comment' && !operation.parent_author)
            eventType = 'Post';
        const page =
            eventType === 'Vote'
                ? `@${operation.author}/${operation.permlink}`
                : '';
        serverApiRecordEvent(eventType, page);
    } catch (error) {
        console.error('TransactionSage', error);
        if (errorCallback) errorCallback(error.toString());
    }
}

function hasPrivateKeys(payload) {
    const blob = JSON.stringify(payload.operations);
    let m,
        re = /P?(5[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50})/g;
    while (true) {
        m = re.exec(blob);
        if (m) {
            try {
                PrivateKey.fromWif(m[1]); // performs the base58check
                return true;
            } catch (e) {}
        } else {
            break;
        }
    }
    return false;
}

function* broadcastPayload({
    payload: { operations, keys, username, successCallback, errorCallback },
}) {
    // console.log('broadcastPayload')
    if ($STM_Config.read_only_mode) return;
    for (const [type] of operations) // see also transaction/ERROR
        yield put(
            transactionActions.remove({ key: ['TransactionError', type] })
        );

    {
        const newOps = [];
        for (const [type, operation] of operations) {
            if (hook['preBroadcast_' + type]) {
                const op = yield call(hook['preBroadcast_' + type], {
                    operation,
                    username,
                });
                if (Array.isArray(op)) for (const o of op) newOps.push(o);
                else newOps.push([type, op]);
            } else {
                newOps.push([type, operation]);
            }
        }
        operations = newOps;
    }

    // status: broadcasting
    const broadcastedEvent = () => {
        for (const [type, operation] of operations) {
            if (hook['broadcasted_' + type]) {
                try {
                    hook['broadcasted_' + type]({ operation });
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

    try {
        yield new Promise((resolve, reject) => {
            // Bump transaction (for live UI testing).. Put 0 in now (no effect),
            // to enable browser's autocomplete and help prevent typos.
            const env = process.env;
            const bump = env.BROWSER
                ? parseInt(localStorage.getItem('bump') || 0)
                : 0;
            if (env.BROWSER && bump === 1) {
                // for testing
                console.log(
                    'TransactionSaga bump(no broadcast) and reject',
                    JSON.stringify(operations, null, 2)
                );
                setTimeout(() => {
                    reject(new Error('Testing, fake error'));
                }, 2000);
            } else if (env.BROWSER && bump === 2) {
                // also for testing
                console.log(
                    'TransactionSaga bump(no broadcast) and resolve',
                    JSON.stringify(operations, null, 2)
                );
                setTimeout(() => {
                    resolve();
                    broadcastedEvent();
                }, 2000);
            } else {
                broadcast.send({ extensions: [], operations }, keys, err => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        broadcastedEvent();
                        resolve();
                    }
                });
            }
        });
        // status: accepted
        for (const [type, operation] of operations) {
            if (hook['accepted_' + type]) {
                try {
                    yield call(hook['accepted_' + type], { operation });
                } catch (error) {
                    console.error(error);
                }
            }
            const config = operation.__config;
            if (config && config.successMessage) {
                yield put(
                    appActions.addNotification({
                        key: 'trx_' + Date.now(),
                        message: config.successMessage,
                        dismissAfter: 5000,
                    })
                );
            }
        }
        if (successCallback)
            try {
                successCallback();
            } catch (error) {
                console.error(error);
            }
    } catch (error) {
        console.error('TransactionSaga\tbroadcastPayload', error);
        // status: error
        yield put(
            transactionActions.error({ operations, error, errorCallback })
        );
        for (const [type, operation] of operations) {
            if (hook['error_' + type]) {
                try {
                    yield call(hook['error_' + type], { operation });
                } catch (error2) {
                    console.error(error2);
                }
            }
        }
    }
}

function* accepted_account_witness_vote({
    operation: { account, witness, approve },
}) {
    yield put(
        globalActions.updateAccountWitnessVote({ account, witness, approve })
    );

    yield put(
        globalActions.removeActiveWitnessVote({
            account,
            witness,
        })
    );
}

function* accepted_update_proposal_votes({
    operation: { voter, proposal_ids },
}) {
    yield put(
        globalActions.removeActiveProposalVote({
            voter,
            proposal_ids,
        })
    );
}

function* accepted_withdraw_vesting({ operation }) {
    let [account] = yield call(
        [api, api.getAccountsAsync],
        [operation.account]
    );
    account = fromJS(account);
    yield put(globalActions.receiveAccount({ account }));
}

function* accepted_account_update({ operation }) {
    let [account] = yield call(
        [api, api.getAccountsAsync],
        [operation.account]
    );
    account = fromJS(account);
    yield put(globalActions.receiveAccount({ account }));
}

import diff_match_patch from 'diff-match-patch';
const dmp = new diff_match_patch();

export function createPatch(text1, text2) {
    if (!text1 && text1 === '') return undefined;
    const patches = dmp.patch_make(text1, text2);
    const patch = dmp.patch_toText(patches);
    return patch;
}

function slug(text) {
    return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 });
}

const pwPubkey = (name, pw, role) =>
    auth.wifToPublic(auth.toWif(name, pw.trim(), role));

export function* recoverAccount({
    payload: {
        account_to_recover,
        old_password,
        new_password,
        onError,
        onSuccess,
    },
}) {
    const [account] = yield call(
        [api, api.getAccountsAsync],
        [account_to_recover]
    );

    if (!account) {
        onError('Unknown account ' + account);
        return;
    }
    if (auth.isWif(new_password)) {
        onError('Your new password should not be a WIF');
        return;
    }
    if (auth.isPubkey(new_password)) {
        onError('Your new password should not be a Public Key');
        return;
    }

    const oldOwnerPrivate = auth.isWif(old_password)
        ? old_password
        : auth.toWif(account_to_recover, old_password, 'owner');

    const oldOwner = auth.wifToPublic(oldOwnerPrivate);

    const newOwnerPrivate = auth.toWif(
        account_to_recover,
        new_password.trim(),
        'owner'
    );
    const newOwner = auth.wifToPublic(newOwnerPrivate);
    const newActive = pwPubkey(
        account_to_recover,
        new_password.trim(),
        'active'
    );
    const newPosting = pwPubkey(
        account_to_recover,
        new_password.trim(),
        'posting'
    );
    const newMemo = pwPubkey(account_to_recover, new_password.trim(), 'memo');

    const new_owner_authority = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[newOwner, 1]],
    };

    const recent_owner_authority = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[oldOwner, 1]],
    };

    try {
        // TODO: Investigate wrapping in a redux-saga call fn, so it can be tested!.
        yield broadcast.sendAsync(
            {
                extensions: [],
                operations: [
                    [
                        'recover_account',
                        {
                            account_to_recover,
                            new_owner_authority,
                            recent_owner_authority,
                        },
                    ],
                ],
            },
            [oldOwnerPrivate, newOwnerPrivate]
        );

        // change password
        // change password probably requires a separate transaction (single trx has not been tested)
        const { json_metadata } = account;
        // TODO: Investigate wrapping in a redux-saga call fn, so it can be tested!
        yield broadcast.sendAsync(
            {
                extensions: [],
                operations: [
                    [
                        'account_update',
                        {
                            account: account.name,
                            active: {
                                weight_threshold: 1,
                                account_auths: [],
                                key_auths: [[newActive, 1]],
                            },
                            posting: {
                                weight_threshold: 1,
                                account_auths: [],
                                key_auths: [[newPosting, 1]],
                            },
                            memo_key: newMemo,
                            json_metadata,
                        },
                    ],
                ],
            },
            [newOwnerPrivate]
        );
        // Reset all outgoing auto-vesting routes for this user. Condenser - #2835
        const outgoingAutoVestingRoutes = yield call(
            [api, api.getWithdrawRoutes],
            [account.name, 'outgoing']
        );
        if (outgoingAutoVestingRoutes && outgoingAutoVestingRoutes.length > 0) {
            yield all(
                outgoingAutoVestingRoutes.map(ovr => {
                    return call(
                        [broadcast, broadcast.setWithdrawVestingRoute],
                        [newActive, ovr.from_account, ovr.to_account, 0, true]
                    );
                })
            );
        }
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error('Recover account', error);
        if (onError) onError(error);
    }
}

/** auths must start with most powerful key: owner for example */
export function* updateAuthorities({
    payload: { accountName, signingKey, auths, twofa, onSuccess, onError },
}) {
    // Be sure this account is up-to-date (other required fields are sent in the update)
    const [account] = yield call([api, api.getAccountsAsync], [accountName]);
    if (!account) {
        onError('Account not found');
        return;
    }
    const ops2 = {};
    let oldPrivate;
    const addAuth = (authType, oldAuth, newAuth) => {
        let oldAuthPubkey, oldPrivateAuth;
        try {
            oldPrivateAuth = PrivateKey.fromWif(oldAuth);
            oldAuthPubkey = oldPrivateAuth.toPublic().toString();
        } catch (e) {
            try {
                oldAuthPubkey = PublicKey.fromStringOrThrow(oldAuth).toString();
            } catch (e2) {
                //
            }
        }
        if (!oldAuthPubkey) {
            if (!oldAuth) {
                onError('Missing old key, not sure what to replace');
                console.error('Missing old key, not sure what to replace');
                return false;
            }
            oldPrivateAuth = PrivateKey.fromSeed(
                accountName + authType + oldAuth
            );
            oldAuthPubkey = oldPrivateAuth.toPublicKey().toString();
        }
        if (authType === 'owner' && !oldPrivate) oldPrivate = oldPrivateAuth;
        else if (authType === 'active' && !oldPrivate)
            oldPrivate = oldPrivateAuth;
        else if (authType === 'posting' && !oldPrivate)
            oldPrivate = oldPrivateAuth;

        let newPrivate, newAuthPubkey;
        try {
            newPrivate = PrivateKey.fromWif(newAuth);
            newAuthPubkey = newPrivate.toPublicKey().toString();
        } catch (e) {
            newPrivate = PrivateKey.fromSeed(accountName + authType + newAuth);
            newAuthPubkey = newPrivate.toPublicKey().toString();
        }

        let authority;
        if (authType === 'memo') {
            account.memo_key = newAuthPubkey;
        } else {
            authority = fromJS(account[authType]).toJS();
            authority.key_auths = [];
            authority.key_auths.push([
                newAuthPubkey,
                authority.weight_threshold,
            ]);
        }
        ops2[authType] = authority ? authority : account[authType];
        return true;
    };
    for (const auth of auths)
        if (!addAuth(auth.authType, auth.oldAuth, auth.newAuth)) return;

    let key = oldPrivate;
    if (!key) {
        try {
            key = PrivateKey.fromWif(signingKey);
        } catch (e2) {
            // probably updating a memo .. see if we got an active or owner
            const auth = authType => {
                const priv = PrivateKey.fromSeed(
                    accountName + authType + signingKey
                );
                const pubkey = priv.toPublicKey().toString();
                const authority = account[authType];
                const key_auths = authority.key_auths;
                for (let i = 0; i < key_auths.length; i++) {
                    if (key_auths[i][0] === pubkey) {
                        return priv;
                    }
                }
                return null;
            };
            key = auth('active');
            if (!key) key = auth('owner');
        }
    }
    if (!key) {
        onError(`Incorrect Password`);
        throw new Error('Trying to update a memo without a signing key?');
    }
    const { memo_key, json_metadata } = account;
    const payload = {
        type: 'account_update',
        operation: {
            account: account.name,
            ...ops2,
            memo_key,
            json_metadata,
        },
        keys: [key],
        successCallback: onSuccess,
        errorCallback: onError,
    };
    yield call(broadcastOperation, { payload });
}
