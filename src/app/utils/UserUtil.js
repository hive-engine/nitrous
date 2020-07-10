/**
 *
 * @returns {boolean}
 */
export const isLoggedIn = () =>
    typeof localStorage !== 'undefined' && !!localStorage.getItem('autopost2');

/**
 *
 * @returns {string}
 */
export const packLoginData = (
    username,
    password,
    memoWif,
    login_owner_pubkey,
    login_with_keychain,
    login_with_hive_signer,
    access_token,
    expires_in
) =>
    new Buffer(
        `${username}\t${password}\t${memoWif || ''}\t${login_owner_pubkey ||
            ''}\t${login_with_keychain || ''}\t${login_with_hive_signer ||
            ''}\t${access_token || ''}\t${expires_in || ''}`
    ).toString('hex');

/**
 *
 * @returns {array} [username, password, memoWif, login_owner_pubkey, login_with_keychain,
 * login_with_hive_signer]
 */
export const extractLoginData = data =>
    new Buffer(data, 'hex').toString().split('\t');

export default {
    isLoggedIn,
    extractLoginData,
};
