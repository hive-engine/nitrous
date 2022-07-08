import { fromJS, Set, List, Map } from 'immutable';
import { call, put, select, fork, take, takeLatest } from 'redux-saga/effects';
import { api as steemApi, auth as steemAuth } from '@steemit/steem-js';
import { api as hiveApi, auth as hiveAuth } from '@hiveio/hive-js';
import { PrivateKey, Signature, hash } from '@hiveio/hive-js/lib/auth/ecc';

import { accountAuthLookup } from 'app/redux/AuthSaga';
import { logout as chatLogout } from 'app/redux/ChatSaga';
import { getAccount } from 'app/redux/SagaShared';
import * as userActions from 'app/redux/UserReducer';
import { receiveFeatureFlags } from 'app/redux/AppReducer';
import {
    hasCompatibleKeychain,
    isLoggedInWithKeychain,
} from 'app/utils/SteemKeychain';
import { packLoginData, extractLoginData } from 'app/utils/UserUtil';
import { browserHistory } from 'react-router';
import {
    serverApiLogin,
    serverApiLogout,
    serverApiRecordEvent,
    isTosAccepted,
    acceptTos,
} from 'app/utils/ServerApiClient';
import { loadFollows } from 'app/redux/FollowSaga';
import { translate } from 'app/Translator';
import DMCAUserList from 'app/utils/DMCAUserList';
import SSC from '@hive-engine/sscjs';
import { getScotAccountDataAsync } from 'app/utils/steemApi';

const steemSsc = new SSC('https://ha.herpc.dtools.dev');
const hiveSsc = new SSC('https://ha.herpc.dtools.dev');

import {
    setHiveSignerAccessToken,
    isLoggedInWithHiveSigner,
    hiveSignerClient,
} from 'app/utils/HiveSigner';

export const userWatches = [
    takeLatest('@@router/LOCATION_CHANGE', removeHighSecurityKeys), // keep first to remove keys early when a page change happens
    takeLatest(userActions.CHECK_KEY_TYPE, checkKeyType),
    // takeLeading https://redux-saga.js.org/docs/api/#notes-5
    fork(function*() {
        while (true) {
            const action = yield take(userActions.USERNAME_PASSWORD_LOGIN);
            yield call(usernamePasswordLogin, action);
        }
    }),
    takeLatest(userActions.SAVE_LOGIN, saveLogin_localStorage),
    takeLatest(userActions.LOGOUT, logout),
    takeLatest(userActions.LOGIN_ERROR, loginError),
    takeLatest(userActions.UPLOAD_IMAGE, uploadImage),
    takeLatest(userActions.ACCEPT_TERMS, function*() {
        try {
            yield call(acceptTos);
        } catch (e) {
            // TODO: log error to server, conveyor is unavailable
        }
    }),
    takeLatest(userActions.VOTING_POWER_LOOKUP, lookupVotingPower),
    function* getLatestFeedPrice() {
        try {
            const history = yield call([hiveApi, hiveApi.getFeedHistoryAsync]);
            const feed = history.price_history;
            const last = fromJS(feed[feed.length - 1]);
            yield put(userActions.setLatestFeedPrice(last));
        } catch (error) {
            // (exceedingly rare) ignore, UI will fall back to feed_price
        }
    },
];

const highSecurityPages = [
    /\/market/,
    /\/@.+\/(transfers|permissions|password)/,
    /\/~witnesses/,
];

function* isHighSecurityPage(pathname = null) {
    pathname =
        pathname || (yield select(state => state.global.get('pathname')));
    return highSecurityPages.find(p => p.test(pathname)) != null;
}

function* removeHighSecurityKeys({ payload: { pathname } }) {
    // Let the user keep the active key when going from one high security page
    // to another. This helps when the user logins into the Wallet then the
    // Permissions tab appears (it was hidden). This keeps them from getting
    // logged out when they click on Permissions (which is really bad because
    // that tab disappears again).
    const highSecurityPage = yield isHighSecurityPage(pathname);
    if (!highSecurityPage) {
        yield put(userActions.removeHighSecurityKeys());
    }
}

function effectiveVests(account) {
    const vests = parseFloat(account.get('vesting_shares'));
    const delegated = parseFloat(account.get('delegated_vesting_shares'));
    const received = parseFloat(account.get('received_vesting_shares'));
    return vests - delegated + received;
}

function* shouldShowLoginWarning({ username, password }, useHive) {
    // If it's a high-security login page, don't show the warning.
    if (yield isHighSecurityPage()) {
        return false;
    }

    // If it's a master key, show the warning.
    const allowMasterPassword = yield select(state =>
        state.app.getIn(['hostConfig', 'ALLOW_MASTER_PW'])
    );
    if (
        !allowMasterPassword &&
        !(useHive ? hiveAuth : steemAuth).isWif(password)
    ) {
        const account = (yield (useHive ? hiveApi : steemApi).getAccountsAsync([
            username,
        ]))[0];
        if (!account) {
            console.error('shouldShowLoginWarning - account not found');
            return false;
        }

        const pubKey = PrivateKey.fromSeed(username + 'posting' + password)
            .toPublicKey()
            .toString();
        const postingPubKeys = account.posting.key_auths[0];
        return postingPubKeys.includes(pubKey);
    }

    // For any other case, don't show the warning.
    return false;
}

/**
    @arg {object} action.username - Unless a WIF is provided, this is hashed
        with the password and key_type to create private keys.
    @arg {object} action.password - Password or WIF private key. A WIF becomes
        the posting key, a password can create all three key_types: active,
        owner, posting keys.
*/
function* checkKeyType(action) {
    const useHive = yield select(state =>
        state.app.getIn(['hostConfig', 'PREFER_HIVE'])
    );
    if (yield call(shouldShowLoginWarning, action.payload, useHive)) {
        yield put(userActions.showLoginWarning(action.payload));
    } else {
        yield put(userActions.usernamePasswordLogin(action.payload));
    }
}

/**
    @arg {object} action.username - Unless a WIF is provided, this is hashed
        with the password and key_type to create private keys.
    @arg {object} action.password - Password or WIF private key. A WIF becomes
        the posting key, a password can create all three key_types: active,
        owner, posting keys.
*/
function* usernamePasswordLogin(action) {
    // This is a great place to mess with session-related user state (:
    // If the user hasn't previously hidden the announcement in this session,
    // or if the user's browser does not support session storage,
    // show the announcement.
    if (
        typeof localStorage === 'undefined' ||
        (typeof localStorage !== 'undefined' &&
            !localStorage.getItem('hideAnnouncement'))
    ) {
        // Uncomment to re-enable announcment
        // TODO: use config to enable/disable
        //yield put(userActions.showAnnouncement());
    }

    // Sets 'loading' while the login is taking place. The key generation can
    // take a while on slow computers.
    yield call(usernamePasswordLogin2, action.payload);
    const current = yield select(state => state.user.get('current'));
    const useHive = yield select(state =>
        state.app.getIn(['hostConfig', 'PREFER_HIVE'])
    );
    if (current) {
        const username = current.get('username');
        yield fork(loadFollows, 'getFollowingAsync', username, 'blog', useHive);
        yield fork(
            loadFollows,
            'getFollowingAsync',
            username,
            'ignore',
            useHive
        );
    }
}

const clean = value =>
    value == null || value === '' || /null|undefined/.test(value)
        ? undefined
        : value;

function* usernamePasswordLogin2({
    username,
    password,
    useKeychain,
    access_token,
    expires_in,
    useHiveSigner,
    lastPath,
    saveLogin,
    operationType /*high security*/,
    afterLoginRedirectToWelcome,
}) {
    const hostConfig = yield select(state =>
        state.app.get('hostConfig', Map()).toJS()
    );
    const user = yield select(state => state.user);
    const loginType = user.get('login_type');
    const justLoggedIn = loginType === 'basic';
    console.log(
        'Login type:',
        loginType,
        'Just logged in?',
        justLoggedIn,
        'username:',
        username
    );

    // login, using saved password
    let feedURL = false;
    let autopost,
        memoWif,
        login_owner_pubkey,
        login_wif_owner_pubkey,
        login_with_keychain,
        login_with_hivesigner;
    if (!username && !password) {
        const data = localStorage.getItem('autopost2');
        if (data) {
            // auto-login with a low security key (like a posting key)
            autopost = true; // must use semi-colon
            // The 'password' in this case must be the posting private wif .. See setItme('autopost')
            [
                username,
                password,
                memoWif,
                login_owner_pubkey,
                login_with_keychain,
                login_with_hivesigner,
                access_token,
                expires_in,
            ] = extractLoginData(data);
            memoWif = clean(memoWif);
            login_owner_pubkey = clean(login_owner_pubkey);
        }
    }
    // no saved password
    if (
        !username ||
        !(
            password ||
            useKeychain ||
            login_with_keychain ||
            useHiveSigner ||
            login_with_hivesigner
        )
    ) {
        console.log('No saved password');
        const offchain_account = yield select(state =>
            state.offchain.get('account')
        );
        if (offchain_account) serverApiLogout();
        return;
    }

    let userProvidedRole; // login via:  username/owner
    if (username.indexOf('/') > -1) {
        // "alice/active" will login only with Alices active key
        [username, userProvidedRole] = username.split('/');
    }

    const highSecurityLogin = yield isHighSecurityPage();
    const isRole = (role, fn) =>
        !userProvidedRole || role === userProvidedRole ? fn() : undefined;

    const account = yield call(getAccount, username, hostConfig['PREFER_HIVE']);
    if (!account) {
        console.log('No account');
        yield put(userActions.loginError({ error: 'Username does not exist' }));
        return;
    }
    //dmca user block
    if (username && DMCAUserList.includes(username)) {
        console.log('DMCA list');
        yield put(
            userActions.loginError({ error: translate('terms_violation') })
        );
        return;
    }
    // fetch SCOT stake
    const scotTokenSymbol = hostConfig['LIQUID_TOKEN_UPPERCASE'];
    const ssc = hostConfig['HIVE_ENGINE'] ? hiveSsc : steemSsc;
    const token_balances = yield call(
        [ssc, ssc.findOne],
        'tokens',
        'balances',
        {
            account: username,
            symbol: scotTokenSymbol,
        }
    );
    //check for defaultBeneficiaries
    let defaultBeneficiaries;
    try {
        const json_metadata = JSON.parse(account.get('json_metadata'));
        if (json_metadata.beneficiaries) {
            defaultBeneficiaries = json_metadata.beneficiaries;
        } else {
            defaultBeneficiaries = [];
        }
    } catch (error) {
        defaultBeneficiaries = [];
    }
    yield put(userActions.setUser({ defaultBeneficiaries }));
    // return if already logged in using keychain
    if (login_with_keychain) {
        console.log('Logged in using keychain');
        yield put(
            userActions.setUser({
                username,
                token_balances,
                login_with_keychain: true,
                vesting_shares: account.get('vesting_shares'),
                received_vesting_shares: account.get('received_vesting_shares'),
                delegated_vesting_shares: account.get(
                    'delegated_vesting_shares'
                ),
                effective_vests: effectiveVests(account),
            })
        );
        // Fetch voting power
        yield put(userActions.lookupVotingPower({ account: username }));
        return;
    }

    // return if already logged in using HiveSigner
    if (login_with_hivesigner) {
        console.log('Logged in using HiveSigner');
        if (access_token) {
            setHiveSignerAccessToken(username, access_token, expires_in);
            yield put(
                userActions.setUser({
                    username,
                    login_with_hivesigner: true,
                    access_token,
                    expires_in,
                    vesting_shares: account.get('vesting_shares'),
                    received_vesting_shares: account.get(
                        'received_vesting_shares'
                    ),
                    delegated_vesting_shares: account.get(
                        'delegated_vesting_shares'
                    ),
                    effective_vests: effectiveVests(account),
                })
            );
        }
        return;
    }

    let private_keys;
    if (!useKeychain && !useHiveSigner) {
        try {
            const private_key = PrivateKey.fromWif(password);
            login_wif_owner_pubkey = private_key.toPublicKey().toString();
            private_keys = fromJS({
                owner_private: isRole('owner', () => private_key),
                posting_private: isRole('posting', () => private_key),
                active_private: isRole('active', () => private_key),
                memo_private: private_key,
            });
        } catch (e) {
            // Password (non wif)
            login_owner_pubkey = PrivateKey.fromSeed(
                username + 'owner' + password
            )
                .toPublicKey()
                .toString();
            private_keys = fromJS({
                posting_private: isRole('posting', () =>
                    PrivateKey.fromSeed(username + 'posting' + password)
                ),
                active_private: isRole('active', () =>
                    PrivateKey.fromSeed(username + 'active' + password)
                ),
                memo_private: PrivateKey.fromSeed(username + 'memo' + password),
            });
        }
        if (memoWif)
            private_keys = private_keys.set(
                'memo_private',
                PrivateKey.fromWif(memoWif)
            );

        yield call(accountAuthLookup, {
            payload: {
                account,
                private_keys,
                login_owner_pubkey,
                useHive: hostConfig['PREFER_HIVE'],
            },
        });
        let authority = yield select(state =>
            state.user.getIn(['authority', username])
        );

        const hasActiveAuth = authority.get('active') === 'full';
        if (!highSecurityLogin) {
            const accountName = account.get('name');
            authority = authority.set('active', 'none');
            yield put(
                userActions.setAuthority({ accountName, auth: authority })
            );
        }

        const hasOwnerAuth = authority.get('owner') === 'full';
        const allowMasterPassword = hostConfig['ALLOW_MASTER_PW'];
        if (!allowMasterPassword && hasOwnerAuth) {
            console.log('Rejecting due to detected owner auth');
            yield put(userActions.loginError({ error: 'owner_login_blocked' }));
            return;
        }

        const fullAuths = authority.reduce(
            (r, auth, type) => (auth === 'full' ? r.add(type) : r),
            Set()
        );
        if (!fullAuths.size) {
            console.log('No full auths');
            yield put(userActions.hideLoginWarning());
            localStorage.removeItem('autopost2');
            const owner_pub_key = account.getIn(['owner', 'key_auths', 0, 0]);
            if (
                !allowMasterPassword &&
                (login_owner_pubkey === owner_pub_key ||
                    login_wif_owner_pubkey === owner_pub_key)
            ) {
                yield put(
                    userActions.loginError({ error: 'owner_login_blocked' })
                );
                return;
            } else if (!highSecurityLogin && hasActiveAuth) {
                yield put(
                    userActions.loginError({ error: 'active_login_blocked' })
                );
                return;
            } else {
                const generated_type =
                    password[0] === 'P' && password.length > 40;
                serverApiRecordEvent(
                    'login_attempt',
                    JSON.stringify({
                        name: username,
                        login_owner_pubkey,
                        owner_pub_key,
                        generated_type,
                    })
                );
                yield put(
                    userActions.loginError({ error: 'Incorrect Password' })
                );
                return;
            }
        }
        if (authority.get('posting') !== 'full')
            private_keys = private_keys.remove('posting_private');
        if (!highSecurityLogin || authority.get('active') !== 'full')
            private_keys = private_keys.remove('active_private');

        const owner_pubkey = account.getIn(['owner', 'key_auths', 0, 0]);
        const active_pubkey = account.getIn(['active', 'key_auths', 0, 0]);
        const posting_pubkey = account.getIn(['posting', 'key_auths', 0, 0]);

        if (!highSecurityLogin) {
            console.log('Not high security login');
            if (
                posting_pubkey === owner_pubkey ||
                posting_pubkey === active_pubkey
            ) {
                yield put(
                    userActions.loginError({
                        error:
                            'This login gives owner or active permissions and should not be used here.  Please provide a posting only login.',
                    })
                );
                localStorage.removeItem('autopost2');
                return;
            }
        }

        const memo_pubkey = private_keys.has('memo_private')
            ? private_keys
                  .get('memo_private')
                  .toPublicKey()
                  .toString()
            : null;

        if (
            account.get('memo_key') !== memo_pubkey ||
            memo_pubkey === owner_pubkey ||
            memo_pubkey === active_pubkey
        )
            // provided password did not yield memo key, or matched active/owner
            private_keys = private_keys.remove('memo_private');

        if (username) feedURL = '/@' + username + '/feed';

        // If user is signing operation by operaion and has no saved login, don't save to RAM
        if (!operationType || saveLogin) {
            // Keep the posting key in RAM but only when not signing an operation.
            // No operation or the user has checked: Keep me logged in...
            yield put(
                userActions.setUser({
                    username,
                    token_balances,
                    private_keys,
                    login_owner_pubkey,
                    vesting_shares: account.get('vesting_shares'),
                    received_vesting_shares: account.get(
                        'received_vesting_shares'
                    ),
                    delegated_vesting_shares: account.get(
                        'delegated_vesting_shares'
                    ),
                    effective_vests: effectiveVests(account),
                })
            );
        } else {
            yield put(
                userActions.setUser({
                    username,
                    token_balances,
                    vesting_shares: account.get('vesting_shares'),
                    received_vesting_shares: account.get(
                        'received_vesting_shares'
                    ),
                    delegated_vesting_shares: account.get(
                        'delegated_vesting_shares'
                    ),
                    effective_vests: effectiveVests(account),
                })
            );
        }
    }

    try {
        // const challengeString = yield serverApiLoginChallenge()
        const offchainData = yield select(state => state.offchain);
        let serverAccount = offchainData.get('account');
        let challengeString = offchainData.get('login_challenge');
        if (!serverAccount && challengeString) {
            console.log('No server account, but challenge string');
            const signatures = {};
            const challenge = { token: challengeString };
            const buf = JSON.stringify(challenge, null, 0);
            const bufSha = hash.sha256(buf);
            const useHive = hostConfig['PREFER_HIVE'];

            if (useKeychain) {
                const response = yield new Promise(resolve => {
                    (useHive
                        ? window.hive_keychain
                        : window.steem_keychain
                    ).requestSignBuffer(username, buf, 'Posting', response => {
                        resolve(response);
                    });
                });
                if (response.success) {
                    signatures['posting'] = response.result;
                } else {
                    yield put(
                        userActions.loginError({ error: response.message })
                    );
                    return;
                }
                feedURL = '/@' + username + '/feed';
                yield put(
                    userActions.setUser({
                        username,
                        token_balances,
                        login_with_keychain: true,
                        vesting_shares: account.get('vesting_shares'),
                        received_vesting_shares: account.get(
                            'received_vesting_shares'
                        ),
                        delegated_vesting_shares: account.get(
                            'delegated_vesting_shares'
                        ),
                        effective_vests: effectiveVests(account),
                    })
                );
            } else if (useHiveSigner) {
                if (access_token) {
                    // redirect url
                    feedURL = '/@' + username + '/feed';
                    // set access setHiveSignerAccessToken
                    setHiveSignerAccessToken(
                        username,
                        access_token,
                        expires_in
                    );
                    // set user data
                    yield put(
                        userActions.setUser({
                            username,
                            login_with_hivesigner: true,
                            access_token,
                            expires_in,
                            vesting_shares: account.get('vesting_shares'),
                            received_vesting_shares: account.get(
                                'received_vesting_shares'
                            ),
                            delegated_vesting_shares: account.get(
                                'delegated_vesting_shares'
                            ),
                            effective_vests: effectiveVests(account),
                        })
                    );
                }
            } else {
                const sign = (role, d) => {
                    console.log('Sign before');
                    if (!d) return;
                    console.log('Sign after');
                    const sig = Signature.signBufferSha256(bufSha, d);
                    signatures[role] = sig.toHex();
                };
                sign('posting', private_keys.get('posting_private'));
                // sign('active', private_keys.get('active_private'))
            }

            console.log('Logging in as', username);
            const response = yield serverApiLogin(
                username,
                signatures,
                useHive
            );
            const body = yield response.json();
        }
    } catch (error) {
        // Does not need to be fatal
        console.error('Server Login Error', error);
    }

    // Fetch voting power
    yield put(userActions.lookupVotingPower({ account: username }));

    if (!autopost && saveLogin) yield put(userActions.saveLogin());

    // Redirect user to the appropriate page after login.
    const path = useHiveSigner ? lastPath : document.location.pathname;
    if (afterLoginRedirectToWelcome) {
        console.log('Redirecting to welcome page');
        browserHistory.push('/welcome');
    } else if (feedURL && path === '/login.html') {
        browserHistory.push(`/@${username}/feed`);
    } else if (feedURL && path === '/') {
        //browserHistory.push(feedURL);
        browserHistory.push(`/@${username}/feed`);
    } else if (useHiveSigner && lastPath) {
        browserHistory.push(lastPath);
    }
}

function* promptTosAcceptance(username) {
    try {
        const accepted = yield call(isTosAccepted, username);
        if (!accepted) {
            yield put(userActions.showTerms());
        }
    } catch (e) {
        // TODO: log error to server, conveyor is unavailable
    }
}

function* getFeatureFlags(username, posting_private) {
    // not yet in use
    return;
    try {
        let flags;
        if (!posting_private && hasCompatibleKeychain()) {
            flags = yield new Promise((resolve, reject) => {
                window.hive_keychain.requestSignedCall(
                    username,
                    'conveyor.get_feature_flags',
                    { account: username },
                    'posting',
                    response => {
                        if (!response.success) {
                            reject(response.message);
                        } else {
                            resolve(response.result);
                        }
                    }
                );
            });
        } else {
            flags = yield call(
                [steemApi, steemApi.signedCallAsync],
                'conveyor.get_feature_flags',
                { account: username },
                username,
                posting_private
            );
        }
        yield put(receiveFeatureFlags(flags));
    } catch (error) {
        // Do nothing; feature flags are not ready yet. Or posting_private is not available.
    }
}

function* saveLogin_localStorage() {
    if (!process.env.BROWSER) {
        console.error('Non-browser environment, skipping localstorage');
        return;
    }
    localStorage.removeItem('autopost2');
    const [
        username,
        private_keys,
        login_owner_pubkey,
        login_with_keychain,
        login_with_hivesigner,
        access_token,
        expires_in,
    ] = yield select(state => [
        state.user.getIn(['current', 'username']),
        state.user.getIn(['current', 'private_keys']),
        state.user.getIn(['current', 'login_owner_pubkey']),
        state.user.getIn(['current', 'login_with_keychain']),
        state.user.getIn(['current', 'login_with_hivesigner']),
        state.user.getIn(['current', 'access_token']),
        state.user.getIn(['current', 'expires_in']),
    ]);
    if (!username) {
        console.error('Not logged in');
        return;
    }

    // Save the lowest security key, or owner if allowed
    const allowMasterPassword = yield select(state =>
        state.app.getIn(['hostConfig', 'ALLOW_MASTER_PW'])
    );
    let posting_private = private_keys && private_keys.get('posting_private');
    if (private_keys && !posting_private && allowMasterPassword) {
        posting_private = private_keys.get('owner_private');
    }

    if (!login_with_keychain && !login_with_hivesigner && !posting_private) {
        console.error('No posting key to save?');
        return;
    }
    const account = yield select(state =>
        state.global.getIn(['accounts', username])
    );
    if (!account) {
        console.error('Missing global.accounts[' + username + ']');
        return;
    }
    const postingPubkey = posting_private
        ? posting_private.toPublicKey().toString()
        : 'none';
    try {
        account.getIn(['active', 'key_auths']).forEach(auth => {
            if (auth.get(0) === postingPubkey)
                throw 'Login will not be saved, posting key is the same as active key';
        });
        if (!allowMasterPassword) {
            account.getIn(['owner', 'key_auths']).forEach(auth => {
                if (auth.get(0) === postingPubkey)
                    throw 'Login will not be saved, posting key is the same as owner key';
            });
        }
    } catch (e) {
        console.error('login_auth_err', e);
        return;
    }

    const memoKey = private_keys ? private_keys.get('memo_private') : null;
    const memoWif = memoKey && memoKey.toWif();
    const postingPrivateWif = posting_private
        ? posting_private.toWif()
        : 'none';
    const data = packLoginData(
        username,
        postingPrivateWif,
        memoWif,
        login_owner_pubkey,
        login_with_keychain,
        login_with_hivesigner,
        access_token,
        expires_in
    );
    // autopost is a auto login for a low security key (like the posting key)
    localStorage.setItem('autopost2', data);
}

function* logout(action) {
    const payload = (action || {}).payload || {};
    const logoutType = payload.type || 'default';
    console.log('Logging out', arguments, 'logout type', logoutType);

    // Just in case it is still showing
    yield put(userActions.saveLoginConfirm(false));

    if (process.env.BROWSER) {
        localStorage.removeItem('autopost2');
    }

    yield chatLogout();
    yield serverApiLogout();
}

function* loginError({
    payload: {
        /*error*/
    },
}) {
    serverApiLogout();
}

function* uploadImage({
    payload: { file, dataUrl, filename = 'image.txt', progress },
}) {
    const _progress = progress;
    progress = msg => {
        _progress(msg);
    };

    const stateUser = yield select(state => state.user);
    const username = stateUser.getIn(['current', 'username']);
    const keychainLogin = isLoggedInWithKeychain();
    const hiveSignerLogin = isLoggedInWithHiveSigner();
    const d = stateUser.getIn(['current', 'private_keys', 'posting_private']);
    if (!username) {
        progress({ error: 'Please login first.' });
        return;
    }
    if (!(keychainLogin || hiveSignerLogin || d)) {
        progress({ error: 'Login with your posting key' });
        return;
    }

    if (!file && !dataUrl) {
        console.error('uploadImage required: file or dataUrl');
        return;
    }

    let data, dataBs64;
    if (file) {
        // drag and drop
        const reader = new FileReader();
        data = yield new Promise(resolve => {
            reader.addEventListener('load', () => {
                const result = new Buffer(reader.result, 'binary');
                resolve(result);
            });
            reader.readAsBinaryString(file);
        });
    } else {
        // recover from preview
        const commaIdx = dataUrl.indexOf(',');
        dataBs64 = dataUrl.substring(commaIdx + 1);
        data = new Buffer(dataBs64, 'base64');
    }

    // The challenge needs to be prefixed with a constant (both on the server and checked on the client) to make sure the server can't easily make the client sign a transaction doing something else.
    const prefix = new Buffer('ImageSigningChallenge');
    const buf = Buffer.concat([prefix, data]);
    const bufSha = hash.sha256(buf);

    const formData = new FormData();
    if (file) {
        formData.append('file', file);
    } else {
        // formData.append('file', file, filename) <- Failed to add filename=xxx to Content-Disposition
        // Can't easily make this look like a file so this relies on the server supporting: filename and filebinary
        formData.append('filename', filename);
        formData.append('filebase64', dataBs64);
    }

    let sig;
    let postUrl;
    const useHive = yield select(state =>
        state.app.getIn(['hostConfig', 'PREFER_HIVE'])
    );
    if (hiveSignerLogin) {
        // verify user with access_token for HiveSigner login
        postUrl = `${$STM_Config.hive_upload_image}/hs/${
            hiveSignerClient.accessToken
        }`;
    } else {
        if (keychainLogin) {
            const response = yield new Promise(resolve => {
                (useHive
                    ? window.hive_keychain
                    : window.steem_keychain
                ).requestSignBuffer(
                    username,
                    JSON.stringify(buf),
                    'Posting',
                    response => {
                        resolve(response);
                    }
                );
            });
            if (response.success) {
                sig = response.result;
            } else {
                progress({ error: response.message });
                return;
            }
        } else {
            sig = Signature.signBufferSha256(bufSha, d).toHex();
        }

        const baseUploadUrl = useHive
            ? $STM_Config.hive_upload_image
            : $STM_Config.upload_image;
        postUrl = `${baseUploadUrl}/${username}/${sig}`;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl);
    xhr.onload = function() {
        console.log(xhr.status, xhr.responseText);
        if (xhr.status === 200) {
            try {
                const res = JSON.parse(xhr.responseText);
                const { error } = res;
                if (error) {
                    console.error('upload_error', error, xhr.responseText);
                    progress({ error: 'Error: ' + error });
                    return;
                }

                const { url } = res;
                progress({ url });
            } catch (e) {
                console.error('upload_error2', 'not json', e, xhr.responseText);
                progress({ error: 'Error: response not JSON' });
                return;
            }
        } else {
            console.error('upload_error3', xhr.status, xhr.statusText);
            progress({ error: `Error: ${xhr.status}: ${xhr.statusText}` });
            return;
        }
    };
    xhr.onerror = function(error) {
        console.error('xhr', filename, error);
        progress({ error: 'Unable to contact the server.' });
    };
    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            const percent = Math.round(event.loaded / event.total * 100);
            progress({ message: `Uploading ${percent}%` });
        }
    };
    xhr.send(formData);
}

function* lookupVotingPower({ payload: { account } }) {
    const accountData = yield call(getScotAccountDataAsync, account);
    const scotTokenSymbol = yield select(state =>
        state.app.getIn(['hostConfig', 'LIQUID_TOKEN_UPPERCASE'])
    );
    const rewardPoolId = yield select(state =>
        state.app.getIn(['hostConfig', 'HIVE_ENGINE_SMT'])
    );
    yield put(
        userActions.setVotingPower({
            account,
            ...accountData.data[rewardPoolId],
            staked_tokens: accountData.tokenData[scotTokenSymbol],
        })
    );
}
