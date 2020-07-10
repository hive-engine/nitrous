import { isLoggedIn, extractLoginData } from 'app/utils/UserUtil';
import hivesigner from 'hivesigner';
import { APP_URL, HIVE_SIGNER_APP } from 'app/client_config';

const HOST_URL =
    typeof window !== 'undefined'
        ? window.location.protocol + '//' + window.location.host
        : APP_URL;

export const hiveSignerClient = new hivesigner.Client({
    app: HIVE_SIGNER_APP,
    callbackURL: `${HOST_URL}/login/hivesigner`,
    // scope: ['vote', 'comment'],
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

export const setHiveSignerAccessToken = (
    username,
    access_token,
    expires_in
) => {
    // set access token for Hive Signer
    console.log(`HiveSigner: set access token for @${username}`);
    hiveSignerClient.setAccessToken(access_token);
};
