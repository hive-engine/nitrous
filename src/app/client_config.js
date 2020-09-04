import { fromJSOrdered } from './utils/immutable';

const STEEMING = {
    APP_NAME: 'Steeming',
    APP_ICON: 'steeming',
    APP_ICON_WIDTH: '200px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://steeming.com',
    APP_DOMAIN: 'steeming.com',
    LIQUID_TOKEN: 'Pesos',
    LIQUID_TOKEN_UPPERCASE: 'PESOS',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'steeming',
    TAG_LIST: fromJSOrdered([
        'pesos',
        'steeming',
        'pets',
        'news',
        'media',
        'finance',
        'travel',
        'cybersecurity',
        'games',
        'myscoop',
        'domainname',
        'entertainment',
        'sports',
        'machinelearning',
        'artificialintelligence',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'PESOS POWER',
    SITE_DESCRIPTION:
        'Steeming is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called PESOS, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER:
        '\n\n---\n\n<center><sub>Posted via [Steeming.com](${POST_URL})</sub></center>',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: null,
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-29',
    DISABLE_HIVE: true,
    DISABLE_BLACKLIST: true,
};

const ONLINEBUZZ = {
    APP_NAME: 'OnlineBuzz',
    APP_ICON: 'onlinebuzz',
    APP_ICON_WIDTH: '200px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://onlinebuzz.com',
    APP_DOMAIN: 'onlinebuzz.com',
    LIQUID_TOKEN: 'Pesos',
    LIQUID_TOKEN_UPPERCASE: 'PESOS',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'onlinebuzz',
    TAG_LIST: fromJSOrdered([
        'pesos',
        'onlinebuzz',
        'pets',
        'news',
        'media',
        'finance',
        'travel',
        'cybersecurity',
        'games',
        'myscoop',
        'domainname',
        'entertainment',
        'sports',
        'machinelearning',
        'artificialintelligence',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'PESOS POWER',
    SITE_DESCRIPTION:
        'OnlineBuzz is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called PESOS, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER:
        '\n\n---\n\n<center><sub>Posted via [Onlinebuzz.com](${POST_URL})</sub></center>',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: null,
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-33',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    DISABLE_BLACKLIST: true,
};

export const CONFIG_MAP = {
    // testing heroku/local options
    'localhost:8080': STEEMING,
    'onlinebuzz.com': ONLINEBUZZ,
    'steeming.com': STEEMING,
};

// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.

export const HIVE_SIGNER_APP = 'ewd';

export const CURRENCY_SIGN = '$';
export const WIKI_URL = ''; // https://wiki.golos.io/

// these are dealing with asset types, not displaying to client, rather sending data over websocket
export const LIQUID_TICKER = 'HIVE';
export const VEST_TICKER = 'VESTS';

// application settings
export const DEFAULT_LANGUAGE = 'en'; // used on application internationalization bootstrap
export const DEFAULT_CURRENCY = 'USD';
export const ALLOWED_CURRENCIES = ['USD'];

export const TOKEN_STATS_EXCLUDE_ACCOUNTS = [];
