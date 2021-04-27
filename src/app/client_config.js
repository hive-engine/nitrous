import { fromJSOrdered } from './utils/immutable';

const PAL = {
    APP_NAME: 'PalnetHE',
    APP_ICON: 'pal',
    APP_ICON_WIDTH: '125px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.palnet.io',
    APP_DOMAIN: 'www.palnet.io',
    LIQUID_TOKEN: 'PAL',
    LIQUID_TOKEN_UPPERCASE: 'PAL',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'palnet',
    TAG_LIST: fromJSOrdered(['palnet']),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'PAL POWER',
    SITE_DESCRIPTION:
        'Palnet is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called PAL, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    SDC_GTAG_MEASUREMENT_ID: null,
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    HIVE_ENGINE_SMT: 1,
    APPEND_TRENDING_TAGS_COUNT: 10,
    COMMUNITY_CATEGORY: null,
    CHAT_CONVERSATIONS: null,
};

export const CONFIG_MAP = {
    // testing heroku/local options
    'localhost:8080': PAL,
    'eonhetest.herokuapp.com': PAL,
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
