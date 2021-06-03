import { fromJSOrdered } from './utils/immutable';

const LERN = {
    APP_NAME: 'LERNBlogs by LERNHerstory',
    APP_ICON: 'lern',
    APP_ICON_WIDTH: '70px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.lernblogs.com',
    APP_DOMAIN: 'www.lernblogs.com',
    LIQUID_TOKEN: 'Lern',
    LIQUID_TOKEN_UPPERCASE: 'LERN',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'lern',
	TAG_LIST: fromJSOrdered([
		'lern',
        'herstory',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'LERN POWER',
    SITE_DESCRIPTION:
        'LernHerstory is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called LERN, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER:
        '\n\n---\n\n<center><sub>Published on [LERNblogs.com](${POST_URL})</sub></center>',
    COMMENT_FOOTER:
        '\n\n---\n\n<center><sub>Posted via [LERNblogs.com](${POST_URL})</sub></center>',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: '',
    SDC_GTAG_MEASUREMENT_ID: 'G-TX4HJ2V8VM',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: null,
    APPEND_TRENDING_TAGS_COUNT: 10,
    COMMUNITY_CATEGORY: 'hive-186927',
};

export const CONFIG_MAP = {
    // testing heroku/local options
    'localhost:8080': LERN,
    'scotlern.herokuapp.com': LERN,
    'www.lernblogs.com': LERN,
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
