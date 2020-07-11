// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const APP_NAME = 'Hive';
// sometimes APP_NAME is written in non-latin characters, but they are needed for technical purposes
// ie. "Голос" > "Golos"
export const APP_NAME_LATIN = 'Hive';
export const APP_NAME_UPPERCASE = 'HIVE';
export const APP_ICON = 'hive';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_URL = 'https://hive.blog';
export const APP_DOMAIN = 'hive.blog';
export const HIVE_SIGNER_APP = 'hive.blog';
export const LIQUID_TOKEN = 'Hive';
// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const LIQUID_TOKEN_UPPERCASE = 'HIVE';
export const VESTING_TOKEN = 'HIVE POWER';
export const INVEST_TOKEN_UPPERCASE = 'HIVE POWER';
export const INVEST_TOKEN_SHORT = 'HP';
export const DEBT_TOKEN = 'HIVE DOLLAR';
export const DEBT_TOKENS = 'HIVE DOLLARS';
export const CURRENCY_SIGN = '$';
export const WIKI_URL = ''; // https://wiki.golos.io/
export const LANDING_PAGE_URL = 'https://hive.io';
export const TERMS_OF_SERVICE_URL = 'https://' + APP_DOMAIN + '/tos.html';
export const PRIVACY_POLICY_URL = 'https://' + APP_DOMAIN + '/privacy.html';
export const WHITEPAPER_URL = 'https://hive.io/hive-whitepaper.pdf';

// these are dealing with asset types, not displaying to client, rather sending data over websocket
export const LIQUID_TICKER = 'HIVE';
export const VEST_TICKER = 'VESTS';
export const DEBT_TICKER = 'HBD';
export const DEBT_TOKEN_SHORT = 'HBD';

// application settings
export const DEFAULT_LANGUAGE = 'en'; // used on application internationalization bootstrap
export const DEFAULT_CURRENCY = 'USD';
export const ALLOWED_CURRENCIES = ['USD'];

// meta info
export const TWITTER_HANDLE = '@';
export const SHARE_IMAGE =
    'https://' + APP_DOMAIN + '/images/hive-blog-share.png';
export const TWITTER_SHARE_IMAGE =
    'https://' + APP_DOMAIN + '/images/hive-blog-twshare.png';
export const SITE_DESCRIPTION =
    'Hive is a social media platform where everyone gets paid for ' +
    'creating and curating content. It leverages a robust digital points system, called Hive, that ' +
    'supports real value for digital rewards through market price discovery and liquidity';

// various
export const SUPPORT_EMAIL = 'support@' + APP_DOMAIN;
