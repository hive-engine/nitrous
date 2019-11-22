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
export const APP_MAX_TAG = 15;
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
    investing: ['news', 'politics', 'personalfinance', 'steemsilvergold'],
    trading: ['analysis'],
});
export const LIQUID_TOKEN = 'Leo';
// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const LIQUID_TOKEN_UPPERCASE = 'LEO';
export const CURATOR_ACCOUNT = 'leo.voter';
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
export const TWITTER_HANDLE = '@steemleo';
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
export const NO_ADS_STAKE_THRESHOLD = 100000;
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
                description: 'Nasdaq',
                proName: 'NASDAQ:NDAQ',
            },
            {
                description: 'Bitcoin',
                proName: 'COINBASE:BTCUSD',
            },
            {
                description: 'Ethereum',
                proName: 'COINBASE:ETHUSD',
            },
            {
                description: 'Steem',
                proName: 'BITTREX:STEEMUSD',
            },
            {
                description: 'SBD',
                proName: 'BITTREX:SBDUSD',
            },
            {
                description: 'Litecoin',
                proName: 'COINBASE:LTCUSD',
            },
            {
                description: 'Binance Coin',
                proName: 'BINANCE:BNBUSD',
            },
            {
                description: 'Basic Attention Token',
                proName: 'BINANCE:BATUSD',
            },
            {
                description: 'Monero',
                proName: 'BITTREX:XMRUSD',
            },
            {
                description: 'Eos',
                proName: 'COINBASE:EOSUSD',
            },
        ],
    },
    MARKET_OVERVIEW: {
        colorTheme: 'light',
        autosize: true,
        showChart: false,
        tabs: [
            {
                title: 'Overview',
                symbols: [
                    {
                        s: 'OANDA:SPX500USD',
                        d: 'S&P 500',
                    },
                    {
                        s: 'NASDAQ:NDAQ',
                        d: 'Nasdaq',
                    },
                    {
                        s: 'DJCFD:DJI',
                        d: 'Dow Jones',
                    },
                    {
                        s: 'COINBASE:BTCUSD',
                        d: 'Bitcoin',
                    },
                    {
                        s: 'COINBASE:ETHUSD',
                        d: 'Ethereum',
                    },
                    {
                        s: 'BITTREX:STEEMUSD',
                        d: 'Steem',
                    },
                    {
                        s: 'TVC:GOLD',
                        d: 'Gold',
                    },
                    {
                        s: 'NYMEX:CL1!',
                        d: 'Crude Oil',
                    },
                ],
                originalTitle: 'Indices',
            },
            {
                title: 'Crypto',
                symbols: [
                    {
                        s: 'COINBASE:BTCUSD',
                        d: 'BTC',
                    },
                    {
                        s: 'COINBASE:ETHUSD',
                        d: 'ETH',
                    },
                    {
                        s: 'BINANCE:STEEMUSD',
                        d: 'STEEM',
                    },
                    {
                        s: 'BITTREX:SBDUSD',
                        d: 'Steem-Backed Dollars',
                    },
                    {
                        s: 'COINBASE:LTCUSD',
                        d: 'Litecoin',
                    },
                    {
                        s: 'BINANCE:BNBUSD',
                        d: 'BNB',
                    },
                    {
                        s: 'BINANCE:BATUSD',
                        d: 'Basic Attention Token',
                    },
                    {
                        s: 'BINANCE:XMRUSD',
                        d: 'Monero',
                    },
                    {
                        s: 'COINBASE:EOSUSD',
                        d: 'Eos',
                    },
                ],
                originalTitle: 'Bonds',
            },
            {
                title: 'Stocks',
                symbols: [
                    {
                        s: 'NASDAQ:TSLA',
                        d: 'Tesla',
                    },
                    {
                        s: 'NASDAQ:AAPL',
                        d: 'AAPL',
                    },
                    {
                        s: 'NYSE:BRK.B',
                        d: 'Berkshire Hathaway',
                    },
                    {
                        s: 'NYSE:KO',
                        d: 'Coca Cola',
                    },
                    {
                        s: 'NYSE:TWTR',
                        d: 'Twitter',
                    },
                    {
                        s: 'NASDAQ:AMZN',
                        d: 'Amazon',
                    },
                    {
                        s: 'NYSE:F',
                        d: 'Ford',
                    },
                    {
                        s: 'NASDAQ:FB',
                        d: 'Facebook',
                    },
                    {
                        s: 'NYSE:BABA',
                        d: 'Alibaba',
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
export const SCOT_DEFAULT_BENEFICIARY_ACCOUNT = '';
export const SCOT_DEFAULT_BENEFICIARY_PERCENT = 0; // between 0 amd 100
export const SHOW_AUTHOR_RECENT_POSTS = true;
export const POSTED_VIA_NITROUS_ICON = 'steemleo'; // put corresponding svg in src/app/assets/icons/___.svg
