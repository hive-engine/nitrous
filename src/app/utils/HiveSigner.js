import { isLoggedIn, extractLoginData } from 'app/utils/UserUtil';
import hivesigner from 'hivesigner';

export const hiveSignerClient = new hivesigner.Client({
    app: 'hive.blog',
    callbackURL: 'http://localhost:8080',
    scope: ['vote', 'comment'],
});

/**
 *
 * @returns {boolean}
 */
export function isLoggedInWithHiveSigner() {
    if (!isLoggedIn()) {
        return false;
    }
    const data = localStorage.getItem('autopost2');
    const [
        username,
        password,
        memoWif,
        login_owner_pubkey,
        login_with_keychain,
        login_with_hive_signer,
    ] = extractLoginData(data);
    return !!login_with_hive_signer;
}
