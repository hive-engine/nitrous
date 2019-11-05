import { fromJSOrdered } from './utils/immutable';

// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const APP_NAME = 'NeoxianCity';
// sometimes APP_NAME is written in non-latin characters, but they are needed for technical purposes
// ie. "Голос" > "Golos"
export const APP_NAME_LATIN = 'NeoxianCity';
export const APP_NAME_UPPERCASE = 'NEOXIANCITY';
export const APP_ICON = 'neoxag';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_URL = 'https://www.neoxian.city';
export const APP_DOMAIN = 'www.neoxian.city';
// max num of tags. if unset, default is 10. This is due to previous hardcoded number.
export const APP_MAX_TAG = 10;
export const SCOT_TAG = 'neoxian';
export const TAG_LIST = fromJSOrdered(['neoxian']);
export const LIQUID_TOKEN = 'Neoxian Silver';
// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const LIQUID_TOKEN_UPPERCASE = 'NEOXAG';
// used as backup
export const SCOT_DENOM = 100000000;
export const VOTE_WEIGHT_DROPDOWN_THRESHOLD = 1;
export const VESTING_TOKEN = 'NEOXIAN POWER';
export const INTERLEAVE_PROMOTED = true;
export const PROMOTED_POST_ACCOUNT = 'null';

export const INVEST_TOKEN_UPPERCASE = 'STEEM POWER';
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
    'NeoxianCity is a social media platform where everyone gets paid for ' +
    'creating and curating content. It leverages a robust digital points system, called NEOXAG, that ' +
    'supports real value for digital rewards through market price discovery and liquidity';

// various
export const SUPPORT_EMAIL = 'support@' + APP_DOMAIN;

// Revive Ads
export const NO_ADS_STAKE_THRESHOLD = 15000;
export const REVIVE_ADS = {
    header_banner: {
        zoneId: '1893',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    sidebar_left: {
        zoneId: '1894',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    sidebar_right: {
        zoneId: '1895',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    post_footer_abovecomments: {
        zoneId: '1896',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    post_footer_betweencomments: {
        zoneId: '1897',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    feed: {
        zoneId: '1898',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    feed_small: {
        zoneId: '1899',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
};

// Other configurations
export const ALLOW_MASTER_PW = false;
// Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
export const POST_FOOTER = '';
export const SCOT_TAG_FIRST = false;
export const SCOT_DEFAULT_BENEFICIARY_ACCOUNT = 'neoxianburn';
export const SCOT_DEFAULT_BENEFICIARY_PERCENT = 5;
export const SHOW_AUTHOR_RECENT_POSTS = false;
export const POSTED_VIA_NITROUS_ICON = ''; // put corresponding svg in src/app/assets/icons/___.svg
