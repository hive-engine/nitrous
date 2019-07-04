import { List } from 'immutable';

// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier.
export const APP_NAME = 'Triple A';
// sometimes APP_NAME is written in non-latin characters, but they are needed for technical purposes
// ie. "Голос" > "Golos"
export const APP_NAME_LATIN = 'TripleA';
export const APP_NAME_UPPERCASE = 'TRIPLEA';
export const APP_ICON = 'aaa';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_URL = 'https://www.triplea.reviews';
export const APP_DOMAIN = 'www.triplea.reviews';
export const SCOT_TAG = 'aaa';
export const TAG_LIST = List(['aaa']);
export const LIQUID_TOKEN = 'AAA';
// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const LIQUID_TOKEN_UPPERCASE = 'AAA';
// used as backup
export const SCOT_DENOM = 10000;
export const VOTE_WEIGHT_DROPDOWN_THRESHOLD = 1;
export const VESTING_TOKEN = 'AAA POWER';
export const INTERLEAVE_PROMOTED = false;
export const PROMOTED_POST_ACCOUNT = 'triplea.promoted';

export const INVEST_TOKEN_UPPERCASE = 'AAA POWER';
export const INVEST_TOKEN_SHORT = 'SP';
export const DEBT_TOKEN = 'STEEM DOLLAR';
export const DEBT_TOKENS = 'STEEM DOLLARS';
export const CURRENCY_SIGN = '$';
export const WIKI_URL = ''; // https://wiki.golos.io/
export const LANDING_PAGE_URL = 'https://steem.io/';
export const TERMS_OF_SERVICE_URL = 'https://' + APP_DOMAIN + '/tos.html';
export const PRIVACY_POLICY_URL = 'https://' + APP_DOMAIN + '/privacy.html';
export const WHITEPAPER_URL = 'https://steem.io/SteemWhitePaper.pdf';

// these are dealing with asset types, not displaying to client, rather sending data over websocket
export const LIQUID_TICKER = 'STEEM';
export const VEST_TICKER = 'VESTS';
export const DEBT_TICKER = 'SBD';
export const DEBT_TOKEN_SHORT = 'SBD';

// application settings
export const DEFAULT_LANGUAGE = 'en'; // used on application internationalization bootstrap
export const DEFAULT_CURRENCY = 'USD';
export const ALLOWED_CURRENCIES = ['USD'];

// meta info
export const TWITTER_HANDLE = '@steemit';
export const SHARE_IMAGE =
    'https://' + APP_DOMAIN + '/images/steemit-share.png';
export const TWITTER_SHARE_IMAGE =
    'https://' + APP_DOMAIN + '/images/steemit-twshare.png';
export const SITE_DESCRIPTION =
    'Triple A Reviews is a social media platform where everyone gets paid for ' +
    'creating and curating reviews. It leverages a robust digital points system, called AAA, that ' +
    'supports real value for digital rewards through market price discovery and liquidity';

// facebook
export const FACEBOOK_CONFIG = {
    APP_ID: '406085026783648',
    SDK_VERSION: 'v3.3',
};

// various
export const SUPPORT_EMAIL = 'support@' + APP_DOMAIN;
