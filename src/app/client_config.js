import { fromJSOrdered } from './utils/immutable';

// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const APP_NAME = 'SteemCoinPan';
// sometimes APP_NAME is written in non-latin characters, but they are needed for technical purposes
// ie. "Голос" > "Golos"
export const APP_NAME_LATIN = 'SteemCoinPan';
export const APP_NAME_UPPERCASE = 'STEEMCOINPAN';
export const APP_ICON = 'steemcoinpan';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_URL = 'https://www.steemcoinpan.com';
export const APP_DOMAIN = 'www.steemcoinpan.com';
export const SCOT_TAG = 'sct';
// max num of tags. if unset, default is 10. This is due to previous hardcoded number.
export const APP_MAX_TAG = 10;
export const SCT_API_BASE_URL = 'https://apisct.cloud';
export const TAG_LIST = fromJSOrdered([
    'sct',
    'sct-kr',
    'sct-en',
    'sct-cn',
    'sct-notice',
    'sct-altcoin',
    'sct-bitcoin',
    'sct-alliance',
    'sct-freeboard',
    'sct-userguide',
    'sct-otc',
    'sct-prediction',
    'sct-qna',
    'sct-market',
    'sct-consumer',
    'sct-producer',
    'sct-diary',
    'sct-invest',
    'sct-dev',
    'sct-game',
    'sct-movie',
    'sct-book',
    'sct-mining',
    'sct-sports',
    'sct-cartoon',
    'sct-meetup',
    'palnet',
    'steemleo',
    'zzan',
]);
export const MAIN_TAG_LIST = fromJSOrdered(['sct']);
export const LANG_TAG_LIST = fromJSOrdered([
    'sct-kr',
    'sct-en',
    'sct-cn',
    'sct-fr',
    'sct-deutsch',
    'sct-polish',
    'sct-jp',
]);
export const TOPIC_TAG_LIST = fromJSOrdered([
    'sct-freeboard',
    'sct-bitcoin',
    'sct-altcoin',
    'sct-market',
    'sct-consumer',
    'sct-producer',
    'sct-diary',
    'sct-invest',
    'sct-dev',
    'sct-game',
    'sct-movie',
    'sct-book',
    'sct-mining',
    'sct-sports',
    'sct-cartoon',
    'sct-meetup',
    'sct-notice',
    'sct-alliance',
    'sct-userguide',
    'sct-otc',
    'sct-prediction',
    'sct-qna',
]);
export const LIQUID_TOKEN = 'Sct';
// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const LIQUID_TOKEN_UPPERCASE = 'SCT';
// used as backup
export const SCOT_DENOM = 1000;
export const VOTE_WEIGHT_DROPDOWN_THRESHOLD = 1;
export const VESTING_TOKEN = 'SCT POWER';
export const INTERLEAVE_PROMOTED = false;
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
    'SteemCoinPan is a social media platform where everyone gets paid for ' +
    'creating and curating content. It leverages a robust digital points system, called SCT, that ' +
    'supports real value for digital rewards through market price discovery and liquidity';

// various
export const SUPPORT_EMAIL = 'support@' + APP_DOMAIN;

// search feature configurations
export const GOOGLE_CUSTOM_SEARCH_ID = '007300013170064212310:6xze6cdavke';
export const SEARCH_SELECTION_REWARD_AMOUNT = 0.5;
export const SEARCH_SELECTION_BURN_AMOUNT = 0.5;

// Revive Ads
export const NO_ADS_STAKE_THRESHOLD = 2000;
export const REVIVE_ADS = {
    //header_banner: {
    //    zoneId: '1699',
    //    reviveId: '727bec5e09208690b050ccfc6a45d384',
    //},
    //sidebar_left: {
    //    zoneId: '1767',
    //    reviveId: '727bec5e09208690b050ccfc6a45d384',
    //},
    //sidebar_right: {
    //    zoneId: '1761',
    //    reviveId: '727bec5e09208690b050ccfc6a45d384',
    //},
    //post_footer_abovecomments: {
    //    zoneId: '1768',
    //    reviveId: '727bec5e09208690b050ccfc6a45d384',
    //},
    //post_footer_betweencomments: {
    //    zoneId: '1769',
    //    reviveId: '727bec5e09208690b050ccfc6a45d384',
    //},
    //feed: {
    //    zoneId: '1777',
    //    reviveId: '727bec5e09208690b050ccfc6a45d384',
    //},
};

// Other configurations
export const ALLOW_MASTER_PW = true;
// Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
export const POST_FOOTER = '';
export const SCOT_TAG_FIRST = false;
