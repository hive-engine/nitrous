import { fromJSOrdered } from './utils/immutable';

export const CONFIG_MAP = {
    'localhost:8080': {
        APP_NAME: 'WeedCash',
        APP_ICON: 'weedcash',
        APP_ICON_WIDTH: '150px',
        APP_ICON_HEIGHT: '40px',
        APP_URL: 'https://www.weedcash.network',
        APP_DOMAIN: 'www.weedcash.network',
        LIQUID_TOKEN: 'Weed',
        LIQUID_TOKEN_UPPERCASE: 'WEED',
        APP_MAX_TAG: 10,
        SCOT_TAG: 'weedcash',
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
        ]),
        INTERLEAVE_PROMOTED: true,
        PROMOTED_POST_ACCOUNT: 'weedcash',
        VESTING_TOKEN: 'WEED POWER',
        SITE_DESCRIPTION:
            'Weedcash is a social media platform where everyone gets paid for ' +
            'creating and curating content. It leverages a robust digital points system, called WEED, that ' +
            'supports real value for digital rewards through market price discovery and liquidity',
        // Revive Ads
        NO_ADS_STAKE_THRESHOLD: 9999999999,
        REVIVE_ADS: {},
        ALLOW_MASTER_PW: false,
        // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
        POST_FOOTER: '',
        SCOT_TAG_FIRST: false,
        PINNED_POSTS_URL: null,
        SDC_GTAG_MEASUREMENT_ID: 'UA-140856330-1',
    },
};

// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.

export const INVEST_TOKEN_UPPERCASE = 'STEEM POWER';
export const INVEST_TOKEN_SHORT = 'SP';
export const DEBT_TOKEN = 'STEEM DOLLAR';
export const DEBT_TOKENS = 'STEEM DOLLARS';
export const CURRENCY_SIGN = '$';
export const WIKI_URL = ''; // https://wiki.golos.io/
export const LANDING_PAGE_URL = 'https://steem.io/';
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
