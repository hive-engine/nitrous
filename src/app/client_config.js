import { fromJSOrdered } from './utils/immutable';

const WEEDCASH = {
    APP_NAME: 'WeedCash',
    APP_ICON: 'weedcash',
    APP_ICON_WIDTH: '145px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.weedcash.network',
    APP_DOMAIN: 'www.weedcash.network',
    LIQUID_TOKEN: 'Weed',
    LIQUID_TOKEN_UPPERCASE: 'WEED',
    APP_MAX_TAG: 15,
    SCOT_TAG: 'weedcash',
    COMMUNITY_CATEGORY: 'hive-195708',
    TAG_LIST: fromJSOrdered([
        'weedcash',
        'weed',
        'cannabis',
        'hemp',
        'psychedelic',
        'review',
        'naturalmedicine',
        'concentrate',
        'edibles',
        'breeding',
        'glass',
        'canna-curate',
        'hash',
        'cbd',
        'news',
        'props4crops',
        'ganja',
        'psilocybin',
        'dmt',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'WEED POWER',
    SITE_DESCRIPTION:
        'Weedcash is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called WEED, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {
        header_banner: {
            zoneId: '3167',
            reviveId: '727bec5e09208690b050ccfc6a45d384',
        },
        sidebar_left: {
            zoneId: '3168',
            reviveId: '727bec5e09208690b050ccfc6a45d384',
        },
        sidebar_right: {
            zoneId: '3169',
            reviveId: '727bec5e09208690b050ccfc6a45d384',
        },
        feed_small: {
            zoneId: '3170',
            reviveId: '727bec5e09208690b050ccfc6a45d384',
        },
    },
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER:
        '\n\n---\n\n<center><sub>Posted via [weedcash.network](${POST_URL})</sub></center>',
    COMMENT_FOOTER:
        '\n\n---\n\n<center><sub>Posted via [weedcash.network](${POST_URL})</sub></center>',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: 'https://richardcrill.github.io',
    SDC_GTAG_MEASUREMENT_ID: 'UA-140856330-1',
    SCOT_DEFAULT_BENEFICIARY_ACCOUNT: 'weedcash-gov',
    SCOT_DEFAULT_BENEFICIARY_PERCENT: 4.2, // between 0 amd 100
    SHOW_AUTHOR_RECENT_POSTS: true,
    POSTED_VIA_NITROUS_ICON: 'weedcash',
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: [
        { id: '01EPB6A2PPSW0BQVJ7WDDP568C', name: 'BeeChat Trollbox' },
        { id: '01EQ9N7F815N9R184KYN12H0NR', name: 'Weedcash Chat' },
    ],
};

const FOODIE = {
    APP_NAME: 'FoodiesUnite',
    APP_ICON: 'foodies',
    APP_ICON_WIDTH: '240px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://foodiesunite.net',
    APP_DOMAIN: 'foodiesunite.net',
    LIQUID_TOKEN: 'FOODIE',
    LIQUID_TOKEN_UPPERCASE: 'FOODIE',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'foodie',
    TAG_LIST: fromJSOrdered({
        bbq: [],
        beverages: [
            'functionalbeverages',
            'healthybeverages',
            'sportsbeverages',
        ],
        dairy: [],
        desserts: [],
        food: ['fooding', 'functionalfood', 'healthfood'],
        gastronomy: [],
        healthyfoods: [],
        keto: [],
        organic: [],
        snacks: [],
        sweets: [],
        vegetarian: [],
        vegan: [],
        recipes: [],
        community: [
            'cleanplanet',
            'innerblocks',
            'ecotrain',
            'weedcash',
            'vegansofsteemit',
        ],
        contest: [],
    }),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'foodiepromo',
    VESTING_TOKEN: 'FOODIE POWER',
    SITE_DESCRIPTION:
        'FoodiesUnite is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called FOODIE, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {
        header_banner: {
            zoneId: '3113',
            reviveId: '727bec5e09208690b050ccfc6a45d384',
        },
        sidebar_left: {
            zoneId: '3111',
            reviveId: '727bec5e09208690b050ccfc6a45d384',
        },
        sidebar_right: {
            zoneId: '3112',
            reviveId: '727bec5e09208690b050ccfc6a45d384',
        },
        feed_small: {
            zoneId: '3114',
            reviveId: '727bec5e09208690b050ccfc6a45d384',
        },
    },
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '\n\n---\n\n<center><sub>Posted via [foodiesunite.net](${POST_URL})</sub></center>',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: null,
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-27',
    SCOT_DEFAULT_BENEFICIARY_ACCOUNT: 'foodiesunite',
    SCOT_DEFAULT_BENEFICIARY_PERCENT: 5, // between 0 amd 100
    GOOGLE_AD_CLIENT: 'ca-pub-1391439792985803',
    COMMUNITY_CATEGORY: 'hive-120586',
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: [
        { id: '01ER4Z5GK5GK9X40W7G0P6S0B7', name: 'Foodie Buzz' },
    ],
};

const DBLOG = {
    APP_NAME: 'DBlog',
    APP_ICON: 'dblog',
    APP_ICON_WIDTH: '150px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://dblog.io',
    APP_DOMAIN: 'dblog.io',
    LIQUID_TOKEN: 'DBLOG',
    LIQUID_TOKEN_UPPERCASE: 'DBLOG',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'dblog',
    TAG_LIST: fromJSOrdered(['dblog']),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'dblog.promo',
    VESTING_TOKEN: 'DBLOG POWER',
    SITE_DESCRIPTION:
        'DBlog is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called DBLOG, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: null,
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-25',
    GOOGLE_AD_CLIENT: 'ca-pub-8763908884278473',
};

const BLOG = {
    APP_NAME: 'BlogToken',
    APP_ICON: 'blogtoken',
    APP_ICON_WIDTH: '140px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://blogtoken.io',
    APP_DOMAIN: 'blogtoken.io',
    LIQUID_TOKEN: 'Blog',
    LIQUID_TOKEN_UPPERCASE: 'BLOG',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'blogtoken',
    TAG_LIST: fromJSOrdered(['blogtoken']),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'BLOG POWER',
    SITE_DESCRIPTION:
        'BlogToken is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called BLOG, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-38',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: [
        { id: '01EPB6A2PPSW0BQVJ7WDDP568C', name: 'BeeChat Trollbox' },
    ],
};

const PIMP = {
    APP_NAME: 'PimpToken',
    APP_ICON: 'pimptoken',
    APP_ICON_WIDTH: '40px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://pimp.media',
    APP_DOMAIN: 'pimp.media',
    LIQUID_TOKEN: 'Pimp',
    LIQUID_TOKEN_UPPERCASE: 'PIMP',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'pimp',
    TAG_LIST: fromJSOrdered(['pimp']),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'PIMP POWER',
    SITE_DESCRIPTION:
        'PimpToken is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called PIMP, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    SDC_GTAG_MEASUREMENT_ID: 'G-NNF38J0317',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: [
        { id: '01EPB6A2PPSW0BQVJ7WDDP568C', name: 'BeeChat Trollbox' },
    ],
    APPEND_TRENDING_TAGS_COUNT: 10,
}

export const CONFIG_MAP = {
    // testing heroku/local options
    'localhost:8080': BLOG,
    'blogtoken.io': BLOG,
    'dblog.io': DBLOG,
    'lago.com.gt': {
        APP_NAME: 'Lago',
        APP_ICON: 'lago',
        APP_ICON_WIDTH: '40px',
        APP_ICON_HEIGHT: '40px',
        APP_URL: 'https://lago.com.gt',
        APP_DOMAIN: 'lago.com.gt',
        LIQUID_TOKEN: 'Lago',
        LIQUID_TOKEN_UPPERCASE: 'LAGO',
        APP_MAX_TAG: 10,
        SCOT_TAG: 'lago',
        TAG_LIST: fromJSOrdered(['lago']),
        INTERLEAVE_PROMOTED: true,
        PROMOTED_POST_ACCOUNT: 'null',
        VESTING_TOKEN: 'LAGO POWER',
        SITE_DESCRIPTION:
            'Lago is a social media platform where everyone gets paid for ' +
            'creating and curating content. It leverages a robust digital points system, called LAGO, that ' +
            'supports real value for digital rewards through market price discovery and liquidity',
        // Revive Ads
        NO_ADS_STAKE_THRESHOLD: 9999999999,
        REVIVE_ADS: {},
        ALLOW_MASTER_PW: false,
        // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
        POST_FOOTER: '',
        COMMENT_FOOTER: '',
        SCOT_TAG_FIRST: false,
        PINNED_POSTS_URL: null,
        SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-16',
    },
    'foodiesunite.net': FOODIE,
    'weedcash.network': WEEDCASH,
    'pimp.media': PIMP,
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
