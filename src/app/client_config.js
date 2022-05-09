import { fromJSOrdered } from './utils/immutable';

const BUIDL = {
    APP_NAME: 'BuildIt',
    APP_ICON: 'build-it',
    APP_ICON_WIDTH: '150px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.build-it.io',
    APP_DOMAIN: 'www.build-it.io',
    LIQUID_TOKEN: 'BUIDL',
    LIQUID_TOKEN_UPPERCASE: 'BUIDL',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'build-it',
    TAG_LIST: fromJSOrdered(['build-it', 'buidl', 'diy']),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'BUIDL POWER',
    SITE_DESCRIPTION:
        'BuildIt is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called BUIDL, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-22',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    HIVE_ENGINE_SMT: 5,
    APPEND_TRENDING_TAGS_COUNT: 10,
    COMMUNITY_CATEGORY: 'hive-129017',
    CHAT_CONVERSATIONS: [
        { id: '01EPB6A2PPSW0BQVJ7WDDP568C', name: 'BeeChat Trollbox' },
    ],
    POSTED_VIA_NITROUS_ICON: 'buildcaravan',
    SHOW_AUTHOR_RECENT_POSTS: true,
    SHOW_TOKEN_STATS: true,
};

export const CONFIG_MAP = {
    // testing heroku/local options
    'localhost:8080': BUIDL,
    'www.build-it.io': BUIDL,
};

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
