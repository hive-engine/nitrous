import { isLoggedIn, extractLoginData } from 'app/utils/UserUtil';
import hivesigner from 'hivesigner';
import { APP_URL, HIVE_SIGNER_APP } from 'app/client_config';
import { encodeOps } from 'hive-uri';

const isBrowser = () => typeof window !== 'undefined' && window;

const HOST_URL = isBrowser()
    ? window.location.protocol + '//' + window.location.host
    : APP_URL;

const HIVE_SIGNER_URL = 'https://hivesigner.com';

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

function getUri(ops, params) {
    if (ops.length > 1 || ops[0][0] != 'custom_json' ||
        ops[0][1].id != 'ssc-mainnet-hive') {
        return encodeOps(ops, params);
    }
    return `hive://sign/custom_json?id=ssc-mainnet-hive&required_auths=${JSON.stringify(ops[0][1].required_auths)}&json=${ops[0][1].json}`;
}

export const sendOperationsWithHiveSigner = (ops, params, cb) => {
    if (!params) params = {};
    if (!params.callback && isBrowser()) {
        params.callback = window.location.href;
    }
    const uri = getUri(ops, params);
    const webUrl = uri
        .replace('hive://', `${HIVE_SIGNER_URL}/`)
        .concat('&authority=active&required_posting_auths=[]');
    if (cb && isBrowser()) {
        window.location = webUrl;
    }
    return webUrl;
};
