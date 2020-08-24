import { isLoggedIn, extractLoginData } from 'app/utils/UserUtil';

/**
 *
 * @returns {boolean}
 */
export function hasCompatibleKeychain() {
    return (
        window.hive_keychain &&
        window.hive_keychain.requestSignBuffer &&
        window.hive_keychain.requestBroadcast &&
        window.hive_keychain.requestSignedCall
    );
}

/**
 *
 * @returns {boolean}
 */
export function isLoggedInWithKeychain() {
    if (!isLoggedIn()) {
        return false;
    }
    if (!hasCompatibleKeychain()) {
        // possible to log in w/ keychain, then disable plugin
        return false;
    }
    const data = localStorage.getItem('autopost2');
    const [
        username,
        password,
        memoWif,
        login_owner_pubkey,
        login_with_keychain,
    ] = extractLoginData(data);
    return !!login_with_keychain;
}
