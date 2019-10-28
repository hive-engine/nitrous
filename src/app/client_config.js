import { fromJSOrdered } from './utils/immutable';

// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const APP_NAME = 'Marlians';
// sometimes APP_NAME is written in non-latin characters, but they are needed for technical purposes
// ie. "Голос" > "Golos"
export const APP_NAME_LATIN = 'Marlians';
export const APP_NAME_UPPERCASE = 'MARLIANS';
export const APP_ICON = 'marlians';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_URL = 'https://www.marlians.com';
export const APP_DOMAIN = 'www.marlians.com';
// max num of tags. if unset, default is 10. This is due to previous hardcoded number.
export const APP_MAX_TAG = 10;
export const SCOT_TAG = 'marlians';
export const TAG_LIST = fromJSOrdered([
    'marlians',
    'helloworld',
    'ye',
    'iamnotayahooboy',
    'mamaput',
    'wazobia',
    'wetinday',
    'myagbada',
    'mybuba',
    'myeba',
    'iwantdata (locked)',
    'ourmamaterry',
    'ulog',
    'upnepa',
    'naijagists',
    'connections (locked)',
    'grow (locked)',
    'postpromotion (locked)',
    'imadethis',
    'whoami',
    'steemgigs',
    'hangouts',
    'untalented',
]);
export const LIQUID_TOKEN = 'Marlians';
// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const LIQUID_TOKEN_UPPERCASE = 'MARLIANS';
// used as backup
export const SCOT_DENOM = 100000000;
export const VOTE_WEIGHT_DROPDOWN_THRESHOLD = 1;
export const VESTING_TOKEN = 'MARLIANS POWER';
export const INTERLEAVE_PROMOTED = true;
export const PROMOTED_POST_ACCOUNT = 'marlians';
export const CERTIFIED_POST_ACCOUNT = 'uloggers';

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
    'Marlians.com is a social media platform that rewards you ' +
    "becoming 'confirm naijan. There is 'naijan' and there is " +
    "'confirm naijan' and while one is regular, the other is 'great'. " +
    'There is a "Naira Marley" and there is a "Bob Marley", ' +
    'then there is the likes of "Fela" & "Mohammed Ali". ' +
    'Now, there is also "you". ' +
    "\n\nBe 'confirm naijan'; be great; get rewarded!\n" +
    "You get rewarded in 'MARLIANS', a digital currency " +
    "that attempts to reward 'greatness'. 'Greatness' being " +
    "a by-product of 'evolving the human'.";

// various
export const SUPPORT_EMAIL = 'support@' + APP_DOMAIN;

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
    //feed_small: {
    //    zoneId: '',
    //    reviveId: '727bec5e09208690b050ccfc6a45d384',
    //},
};

// Other configurations
export const ALLOW_MASTER_PW = false;
// Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
export const POST_FOOTER = '';
export const SCOT_TAG_FIRST = false;
export const SCOT_DEFAULT_BENEFICIARY_ACCOUNT = '';
export const SCOT_DEFAULT_BENEFICIARY_PERCENT = 0; // between 0 amd 100
