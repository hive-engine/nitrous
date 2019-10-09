import { fromJSOrdered } from './utils/immutable';

// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const APP_NAME = 'SteemLeo';
// sometimes APP_NAME is written in non-latin characters, but they are needed for technical purposes
// ie. "Голос" > "Golos"
export const APP_NAME_LATIN = 'SteemLeo';
export const APP_NAME_UPPERCASE = 'STEEMLEO';
export const APP_ICON = 'steemleo';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_URL = 'https://www.steemleo.com';
export const APP_DOMAIN = 'www.steemleo.com';
// max num of tags. if unset, default is 10. This is due to previous hardcoded number.
export const APP_MAX_TAG = 12;
export const SCOT_TAG = 'steemleo';
export const TAG_LIST = fromJSOrdered({
    steemleo: [
        'leostats',
        'dailyleo',
        'learnleo',
        'leowritingcontest',
        'syndication',
    ],
    crypto: ['blockchain', 'defi', 'steem', 'bitcoin', 'spanish'],
    investing: ['news', 'politics', 'personalfinance'],
    trading: ['analysis'],
});
export const LIQUID_TOKEN = 'Leo';
// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const LIQUID_TOKEN_UPPERCASE = 'LEO';
// used as backup
export const SCOT_DENOM = 1000;
export const VOTE_WEIGHT_DROPDOWN_THRESHOLD = 1;
export const VESTING_TOKEN = 'LEO POWER';
export const INTERLEAVE_PROMOTED = true;
export const PROMOTED_POST_ACCOUNT = 'null';

export const INVEST_TOKEN_UPPERCASE = 'STEEM POWER';
export const INVEST_TOKEN_SHORT = 'SP';
export const DEBT_TOKEN = 'STEEM DOLLAR';
export const DEBT_TOKENS = 'STEEM DOLLARS';
export const CURRENCY_SIGN = '$';
export const WIKI_URL = ''; // https://wiki.golos.io/
export const LANDING_PAGE_URL = 'https://steemleo.com/welcome';
export const TERMS_OF_SERVICE_URL = 'https://' + APP_DOMAIN + '/tos.html';
export const PRIVACY_POLICY_URL = 'https://' + APP_DOMAIN + '/privacy.html';
export const WHITEPAPER_URL = 'https://steemleo.com/about.html';

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
    'SteemLeo is a social media platform where everyone gets paid for ' +
    'creating and curating content related to investing. By leveraging blockchain technology, SteemLeo ' +
    'supports content creators, curators and users for creating content & interacting on the blockchain. ';

// various
export const SUPPORT_EMAIL = 'support@' + APP_DOMAIN;

// Revive Ads
export const NO_ADS_STAKE_THRESHOLD = 6000;
export const REVIVE_ADS = {
    header_banner: {
        zoneId: '2045',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    //sidebar_left: {
    //    zoneId: '1767',
    //    reviveId: '727bec5e09208690b050ccfc6a45d384',
    //},
    //sidebar_right: {
    //    zoneId: '1761',
    //    reviveId: '727bec5e09208690b050ccfc6a45d384',
    //},
    post_footer_abovecomments: {
        zoneId: '2046',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    post_footer_betweencomments: {
        zoneId: '2047',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    feed: {
        zoneId: '2048',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    feed_small: {
        zoneId: '2049',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
};

// TradingView configurations

export const TRADING_VIEW_CONFIG = {
    TICKER_TAPE: {
        colorTheme: 'light',
        autosize: true,
        symbols: [
            {
                title: 'S&P 500',
                proName: 'OANDA:SPX500USD',
            },
            {
                title: 'Nasdaq 100',
                proName: 'OANDA:NAS100USD',
            },
            {
                title: 'EUR/USD',
                proName: 'FX_IDC:EURUSD',
            },
            {
                title: 'BTC/USD',
                proName: 'BITSTAMP:BTCUSD',
            },
            {
                title: 'ETH/USD',
                proName: 'BITSTAMP:ETHUSD',
            },
        ],
    },
    MARKET_OVERVIEW: {
        colorTheme: 'light',
        autosize: true,
        showChart: true,
        tabs: [
            {
                title: 'Indices',
                symbols: [
                    {
                        s: 'OANDA:SPX500USD',
                        d: 'S&P 500',
                    },
                    {
                        s: 'OANDA:NAS100USD',
                        d: 'Nasdaq 100',
                    },
                    {
                        s: 'FOREXCOM:DJI',
                        d: 'Dow 30',
                    },
                    {
                        s: 'INDEX:NKY',
                        d: 'Nikkei 225',
                    },
                    {
                        s: 'INDEX:DEU30',
                        d: 'DAX Index',
                    },
                    {
                        s: 'OANDA:UK100GBP',
                        d: 'FTSE 100',
                    },
                ],
                originalTitle: 'Indices',
            },
            {
                title: 'Commodities',
                symbols: [
                    {
                        s: 'CME_MINI:ES1!',
                        d: 'E-Mini S&P',
                    },
                    {
                        s: 'CME:6E1!',
                        d: 'Euro',
                    },
                    {
                        s: 'COMEX:GC1!',
                        d: 'Gold',
                    },
                    {
                        s: 'NYMEX:CL1!',
                        d: 'Crude Oil',
                    },
                    {
                        s: 'NYMEX:NG1!',
                        d: 'Natural Gas',
                    },
                    {
                        s: 'CBOT:ZC1!',
                        d: 'Corn',
                    },
                ],
                originalTitle: 'Commodities',
            },
            {
                title: 'Bonds',
                symbols: [
                    {
                        s: 'CME:GE1!',
                        d: 'Eurodollar',
                    },
                    {
                        s: 'CBOT:ZB1!',
                        d: 'T-Bond',
                    },
                    {
                        s: 'CBOT:UB1!',
                        d: 'Ultra T-Bond',
                    },
                    {
                        s: 'EUREX:FGBL1!',
                        d: 'Euro Bund',
                    },
                    {
                        s: 'EUREX:FBTP1!',
                        d: 'Euro BTP',
                    },
                    {
                        s: 'EUREX:FGBM1!',
                        d: 'Euro BOBL',
                    },
                ],
                originalTitle: 'Bonds',
            },
            {
                title: 'Forex',
                symbols: [
                    {
                        s: 'FX:EURUSD',
                    },
                    {
                        s: 'FX:GBPUSD',
                    },
                    {
                        s: 'FX:USDJPY',
                    },
                    {
                        s: 'FX:USDCHF',
                    },
                    {
                        s: 'FX:AUDUSD',
                    },
                    {
                        s: 'FX:USDCAD',
                    },
                ],
                originalTitle: 'Forex',
            },
        ],
    },
};

// Other configurations
export const ALLOW_MASTER_PW = false;
// Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
export const POST_FOOTER = '';
export const SCOT_TAG_FIRST = false;
