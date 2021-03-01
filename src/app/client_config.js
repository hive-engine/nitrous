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

const TIX = {
    APP_NAME: 'TrafficInsider',
    APP_ICON: 'trafficinsider',
    APP_ICON_WIDTH: '230px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.trafficinsider.org',
    APP_DOMAIN: 'www.trafficinsider.org',
    LIQUID_TOKEN: 'TIX',
    LIQUID_TOKEN_UPPERCASE: 'TIX',
    APP_MAX_TAG: 15,
    SCOT_TAG: 'trafficinsider',
    TAG_LIST: fromJSOrdered(['trafficinsider']),
    INTERLEAVE_PROMOTED: true,
    VESTING_TOKEN: 'TIX POWER',
    SITE_DESCRIPTION:
        'TrafficInsider is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called TIX, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-31',
    COMMUNITY_CATEGORY: 'hive-177225',
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: [
        { id: '01EPB6A2PPSW0BQVJ7WDDP568C', name: 'BeeChat Trollbox' },
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

const KANDA = {
    APP_NAME: 'Telokanda',
    APP_ICON: 'kanda',
    APP_ICON_WIDTH: '40px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://nitrous.telokanda.com',
    APP_DOMAIN: 'nitrous.telokanda.com',
    LIQUID_TOKEN: 'Kanda',
    LIQUID_TOKEN_UPPERCASE: 'KANDA',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'telokanda',
    TAG_LIST: fromJSOrdered([
        'telokanda',
        'africa',
        'nigeria',
        'ghana',
        'money',
        'music',
    ]),
    INTERLEAVE_PROMOTED: true,
    VESTING_TOKEN: 'KANDA POWER',
    SITE_DESCRIPTION:
        'Telokanda is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called KANDA, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER:
        '\n\n---\n\n<center><sub>Posted from [Telokanda Hive Dapp](${POST_URL})</sub></center>',
    COMMENT_FOOTER:
        '\n\n---\n\n<center><sub>Posted from [Telokanda Hive Dapp](${POST_URL})</sub></center>',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: null,
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-32',
    COMMUNITY_CATEGORY: 'hive-182425',
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: [
        { id: '01EPB6A2PPSW0BQVJ7WDDP568C', name: 'BeeChat Trollbox' },
    ],
};

const STEEMING = {
    APP_NAME: 'Steeming',
    APP_ICON: 'steeming',
    APP_ICON_WIDTH: '200px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://steeming.com',
    APP_DOMAIN: 'steeming.com',
    LIQUID_TOKEN: 'Pesos',
    LIQUID_TOKEN_UPPERCASE: 'PESOS',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'steeming',
    TAG_LIST: fromJSOrdered([
        'pesos',
        'steeming',
        'pets',
        'news',
        'media',
        'finance',
        'travel',
        'cybersecurity',
        'games',
        'myscoop',
        'domainname',
        'entertainment',
        'sports',
        'machinelearning',
        'artificialintelligence',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'PESOS POWER',
    SITE_DESCRIPTION:
        'Steeming is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called PESOS, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER:
        '\n\n---\n\n<center><sub>Posted via [Steeming.com](${POST_URL})</sub></center>',
    COMMENT_FOOTER:
        '\n\n---\n\n<center><sub>Posted via [Steeming.com](${POST_URL})</sub></center>',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: null,
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-29',
    DISABLE_HIVE: true,
    DISABLE_BLACKLIST: true,
};

const ONLINEBUZZ = {
    APP_NAME: 'OnlineBuzz',
    APP_ICON: 'onlinebuzz',
    APP_ICON_WIDTH: '200px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://onlinebuzz.com',
    APP_DOMAIN: 'onlinebuzz.com',
    LIQUID_TOKEN: 'Pesos',
    LIQUID_TOKEN_UPPERCASE: 'PESOS',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'onlinebuzz',
    TAG_LIST: fromJSOrdered([
        'pesos',
        'onlinebuzz',
        'pets',
        'news',
        'media',
        'finance',
        'travel',
        'cybersecurity',
        'games',
        'myscoop',
        'domainname',
        'entertainment',
        'sports',
        'machinelearning',
        'artificialintelligence',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'PESOS POWER',
    SITE_DESCRIPTION:
        'OnlineBuzz is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called PESOS, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER:
        '\n\n---\n\n<center><sub>Posted via [Onlinebuzz.com](${POST_URL})</sub></center>',
    COMMENT_FOOTER:
        '\n\n---\n\n<center><sub>Posted via [Onlinebuzz.com](${POST_URL})</sub></center>',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: null,
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-33',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    DISABLE_BLACKLIST: true,
    CHAT_CONVERSATIONS: [
        { id: '01EPB6A2PPSW0BQVJ7WDDP568C', name: 'BeeChat Trollbox' },
    ],
};

const HIVELIST = {
    APP_NAME: 'HiveList',
    APP_ICON: 'hivelist',
    APP_ICON_WIDTH: '170px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://hivelist.org',
    APP_DOMAIN: 'hivelist.org',
    LIQUID_TOKEN: 'List',
    LIQUID_TOKEN_UPPERCASE: 'LIST',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'hivelist',
    TAG_LIST: fromJSOrdered([
        'hivelist',
        'classifieds',
        'hivecommerce ',
        'forsale',
        'services',
        'contests',
        'gigs',
        'jobs',
        'nft',
        'art',
        'ebooks',
        'handmade',
        'clothing',
        'electronics',
        'household',
        'collectibles ',
        'personals',
        'charity',
        'insearchof ',
        'workfromhome',
        'consulting',
        'graphics',
        'marketing',
        'designer',
        'developer',
        'programmer',
        'hivehustlers',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'LIST POWER',
    SITE_DESCRIPTION:
        'HiveList is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called LIST, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: 'https://hivelist.github.io/',
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-34',
    COMMUNITY_CATEGORY: 'hive-150840',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: null,
    DISCORD_SERVER: '714648560443850783', // HiveHustlers
    DISCORD_CHANNEL: '744375332122918942', // #hivelist-chat
};

const HIVEHUSTLERS = {
    APP_NAME: 'HiveHustlers',
    APP_ICON: 'hivehustlers',
    APP_ICON_WIDTH: '175px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.hivehustlers.io',
    APP_DOMAIN: 'www.hivehustlers.io',
    LIQUID_TOKEN: 'Hustler',
    LIQUID_TOKEN_UPPERCASE: 'HUSTLER',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'hivehustlers',
	TAG_LIST: fromJSOrdered([
		'hivehustlers',
        'hustler',
        'hivecommerce',
        'hivelist',
        'forsale',
        'services',
        'gigs',
        'contests',
        'ctp',
        'leofinance',
        'weedcash',
        'entrepreneur',
        'ecommerce',
        'business',
        'dcity',
        'nftshowroom',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'HUSTLER POWER',
    SITE_DESCRIPTION:
        'HiveHustlers is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called HUSTLER, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: '',
    SDC_GTAG_MEASUREMENT_ID: 'G-100QXN02XM',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: null,
    DISCORD_SERVER: '714648560443850783', // HiveHustlers
    DISCORD_CHANNEL: '714648560443850786', // #hustlers-lounge
    COMMUNITY_CATEGORY: 'hive-183630',
};

const REVELATION = {
    APP_NAME: 'ProjectRevelation',
    APP_ICON: 'projectrevelation',
    APP_ICON_WIDTH: '166px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.projectrevelation.io/',
    APP_DOMAIN: 'www.projectrevelation.io',
    LIQUID_TOKEN: 'Revx',
    LIQUID_TOKEN_UPPERCASE: 'REVX',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'revx',
	TAG_LIST: fromJSOrdered([
		'revx',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'REVX POWER',
    SITE_DESCRIPTION:
        'ProjectRevolution is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called REVX, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: '',
    SDC_GTAG_MEASUREMENT_ID: 'G-KR1KJL19KV',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: null,
    APPEND_TRENDING_TAGS_COUNT: 10,
    COMMUNITY_CATEGORY: 'hive-198141',
};

const VIBES = {
    APP_NAME: 'MusicForLife',
    APP_ICON: 'musicforlife',
    APP_ICON_WIDTH: '40px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.musicforlife.io/',
    APP_DOMAIN: 'www.musicforlife.io',
    LIQUID_TOKEN: 'Vibes',
    LIQUID_TOKEN_UPPERCASE: 'VIBES',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'musicforlife',
	TAG_LIST: fromJSOrdered([
		'musicforlife',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'VIBES POWER',
    SITE_DESCRIPTION:
        'MusicForLife is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called VIBES, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    PINNED_POSTS_URL: '',
    SDC_GTAG_MEASUREMENT_ID: 'G-8SB0V2MDLS',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: null,
    APPEND_TRENDING_TAGS_COUNT: 10,
    COMMUNITY_CATEGORY: 'hive-175836',
};

const ARCHON = {
    APP_NAME: 'ArchonApp',
    APP_ICON: 'archon',
    APP_ICON_WIDTH: '40px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://archonapp.net',
    APP_DOMAIN: 'archonapp.net',
    LIQUID_TOKEN: 'Archon',
    LIQUID_TOKEN_UPPERCASE: 'ARCHON',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'archon',
    TAG_LIST: fromJSOrdered(['archon', 'upfundme']),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'ARCHON POWER',
    SITE_DESCRIPTION:
        'ArchonApp is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called ARCHON, that ' +
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
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-35',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: [
        { id: '01EPB6A2PPSW0BQVJ7WDDP568C', name: 'BeeChat Trollbox' },
    ],
    COMMUNITY_CATEGORY: 'hive-177956',
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

const INFOWARS = {
    APP_NAME: 'InfoWars',
    APP_ICON: 'infowars',
    APP_ICON_WIDTH: '40px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.cryptowars.me',
    APP_DOMAIN: 'www.cryptowars.me',
    LIQUID_TOKEN: 'Infowars',
    LIQUID_TOKEN_UPPERCASE: 'INFOWARS',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'infowars',
    TAG_LIST: fromJSOrdered(['infowars']),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'INFOWARS POWER',
    SITE_DESCRIPTION:
        'InfoWars is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called INFOWARS, that ' +
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
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-30',
    COMMUNITY_CATEGORY: 'hive-172447',
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: [
        { id: '01EPB6A2PPSW0BQVJ7WDDP568C', name: 'BeeChat Trollbox' },
    ],
};

const LIETA = {
    APP_NAME: 'Lieta',
    APP_ICON: 'lieta',
    APP_ICON_WIDTH: '156px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.lieta.io',
    APP_DOMAIN: 'www.lieta.io',
    LIQUID_TOKEN: 'Gile',
    LIQUID_TOKEN_UPPERCASE: 'GILE',
    APP_MAX_TAG: 15,
    SCOT_TAG: 'lieta',
    COMMUNITY_CATEGORY: 'hive-109522',
    TAG_LIST: fromJSOrdered(['lieta']),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'LIETA POWER',
    SITE_DESCRIPTION:
        'Lieta is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called GILE, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-36',
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: [
        { id: '01EPB6A2PPSW0BQVJ7WDDP568C', name: 'BeeChat Trollbox' },
    ],
};

const AENEAS = {
    APP_NAME: 'Aeneas',
    APP_ICON: 'aeneas',
    APP_ICON_WIDTH: '110px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.aeneas.blog',
    APP_DOMAIN: 'www.aeneas.blog',
    LIQUID_TOKEN: 'Ash',
    LIQUID_TOKEN_UPPERCASE: 'ASH',
    APP_MAX_TAG: 15,
    SCOT_TAG: 'aeneas',
    COMMUNITY_CATEGORY: 'hive-165469',
    TAG_LIST: fromJSOrdered([
        'ash',
        'aeneas',
        'cryptocurrency',
        'hive',
        'cbm',
        'gaming',
        'cryptobrewmaster',
        'oceanplanet',
        'community',
        'atheism',
        'religion',
        'illuminati',
        'government',
        'revolution',
        'war',
        'censorship',
        'infowar',
        'freewrite',
        'writing',
        'citizen',
        'journalists',
        'аrt',
        'bloggers',
        'discussion',
        'discovery',
        'travel',
        'music',
        'news',
        'ecology',
        'economics',
        'education',
        'finance',
        'politics',
        'science',
        'social',
        'beer',
        'space',
        'universe',
        'ua',
        'mova',
        'world',
        'ukraine',
        'argentina',
        'australia',
        'austria',
        'bangladesh',
        'belarus',
        'belgium',
        'brazil',
        'bulgaria',
        'canada',
        'chile',
        'china',
        'croatia',
        'czechrepublic',
        'egypt',
        'estonia',
        'finland',
        'france',
        'germany',
        'greece',
        'hongkong',
        'india',
        'indonesia',
        'israel',
        'italy',
        'japan',
        'latvia',
        'lithuania',
        'malaysia',
        'mexico',
        'netherlands',
        'nigeria',
        'norway',
        'pakistan',
        'panama',
        'peru',
        'philippines',
        'poland',
        'portugal',
        'romania',
        'slovakia',
        'southafrica',
        'southkorea',
        'spain',
        'sweden',
        'switzerland',
        'taiwan',
        'thailand',
        'turkey',
        'uganda',
        'uae',
        'uk',
        'usa',
        'venezuela',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'ASH POWER',
    SITE_DESCRIPTION:
        'Aeneas is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called ASH, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER:
        '\n\n---\n\n<center><sub>[Posted Using Aeneas.Blog](${POST_URL})</sub></center>',
    COMMENT_FOOTER:
        '\n\n---\n\n<center><sub>[Posted Using Aeneas.Blog](${POST_URL})</sub></center>',
    SCOT_TAG_FIRST: false,
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-37',
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: [
        { id: '01EPB6A2PPSW0BQVJ7WDDP568C', name: 'BeeChat Trollbox' },
    ],
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

const DSOCIAL = {
    APP_NAME: 'DSocial',
    APP_ICON: 'dsocial',
    APP_ICON_WIDTH: '110px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.d-social.com/',
    APP_DOMAIN: 'www.d-social.com',
    LIQUID_TOKEN: 'Dsl',
    LIQUID_TOKEN_UPPERCASE: 'DSL',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'dsocial',
    TAG_LIST: fromJSOrdered([
        'dsocial',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'DSL POWER',
    SITE_DESCRIPTION:
        'DSocial is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called DSL, that ' +
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
    SDC_GTAG_MEASUREMENT_ID: 'G-JBZP273GQB',
    DISABLE_HIVE: true,
};

const PIMP = {
    APP_NAME: 'PimpStudio',
    APP_ICON: 'pimpstudio',
    APP_ICON_WIDTH: '40px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.pimpstudio.cash/',
    APP_DOMAIN: 'www.pimpstudio.cash',
    LIQUID_TOKEN: 'Pimp',
    LIQUID_TOKEN_UPPERCASE: 'PIMP',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'pimp',
    TAG_LIST: fromJSOrdered([
        'pimp',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'PIMP POWER',
    SITE_DESCRIPTION:
        'PimpStudio is a social media platform where everyone gets paid for ' +
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
    PINNED_POSTS_URL: null,
    SDC_GTAG_MEASUREMENT_ID: 'G-3VQW60G4LG',
    DISABLE_HIVE: true,
};

const GRADNIUM = {
    APP_NAME: 'Gradnium',
    APP_ICON: 'gradnium',
    APP_ICON_WIDTH: '40px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.gradnium.com',
    APP_DOMAIN: 'www.gradnium.com',
    LIQUID_TOKEN: 'Grad',
    LIQUID_TOKEN_UPPERCASE: 'GRAD',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'gradnium',
    TAG_LIST: fromJSOrdered(['grad', 'gradnium']),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'GRAD POWER',
    SITE_DESCRIPTION:
        'Gradnium is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called GRAD, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    SDC_GTAG_MEASUREMENT_ID: 'G-SH3WDSWXF8',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: [],
    APPEND_TRENDING_TAGS_COUNT: 10,
    COMMUNITY_CATEGORY: 'hive-101093',
};

const POB = {
    APP_NAME: 'ProofOfBrain',
    APP_ICON: 'proofofbrain',
    APP_ICON_WIDTH: '40px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.proofofbrain.io',
    APP_DOMAIN: 'www.proofofbrain.io',
    LIQUID_TOKEN: 'Pob',
    LIQUID_TOKEN_UPPERCASE: 'POB',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'proofofbrain',
    TAG_LIST: fromJSOrdered(['proofofbrain']),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'POB POWER',
    SITE_DESCRIPTION:
        'ProofOfBrain is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called POB, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER:
        '\n\n---\n\n<center><sub>Posted via [proofofbrain.io](${POST_URL})</sub></center>',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    SDC_GTAG_MEASUREMENT_ID: 'G-TESG0YWB7G',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: [],
    APPEND_TRENDING_TAGS_COUNT: 10,
    COMMUNITY_CATEGORY: 'hive-150329',
    POSTED_VIA_NITROUS_ICON: 'proofofbrain',
};

export const CONFIG_MAP = {
    // testing heroku/local options
    'localhost:8080': HIVEHUSTLERS,
    'frozen-retreat-15997.herokuapp.com': POB,
    'www.proofofbrain.io': POB,
    'www.musicforlife.io': VIBES,
    'www.projectrevelation.io': REVELATION,
    'www.hivehustlers.io': HIVEHUSTLERS,
    'www.gradnium.com': GRADNIUM,
    'www.pimpstudio.cash': PIMP,
    'www.d-social.com': DSOCIAL,
    'blogtoken.io': BLOG,
    'www.aeneas.blog': AENEAS,
    'www.lieta.io': LIETA,
    'www.archonapp.net': ARCHON,
    'www.hivelist.org': HIVELIST,
    'nitrous.telokanda.com': KANDA,
    'www.trafficinsider.org': TIX,
    'onlinebuzz.com': ONLINEBUZZ,
    'www.cryptowars.me': INFOWARS,
    'steeming.com': STEEMING,
    'steemdiamond.com': {
        APP_NAME: 'SteemDiamond',
        APP_ICON: 'steemdiamond',
        APP_ICON_WIDTH: '140px',
        APP_ICON_HEIGHT: '40px',
        APP_URL: 'https://steemdiamond.com',
        APP_DOMAIN: 'steemdiamond.com',
        LIQUID_TOKEN: 'Diamond',
        LIQUID_TOKEN_UPPERCASE: 'DIAMOND',
        APP_MAX_TAG: 10,
        SCOT_TAG: 'diamondtoken',
        TAG_LIST: fromJSOrdered([
            'diamondtoken',
            'diamondstats',
            'dailydiamond',
            'learndiamond',
            'giveaway',
            'crypto',
            'blockchain',
            'steem',
            'bitcoin',
            'trading',
            'news',
        ]),
        INTERLEAVE_PROMOTED: true,
        PROMOTED_POST_ACCOUNT: 'null',
        VESTING_TOKEN: 'DIAMOND POWER',
        SITE_DESCRIPTION:
            'SteemDiamond is a social media platform where everyone gets paid for ' +
            'creating and curating content. It leverages a robust digital points system, called DIAMOND, that ' +
            'supports real value for digital rewards through market price discovery and liquidity',
        // Revive Ads
        NO_ADS_STAKE_THRESHOLD: 9999999999,
        REVIVE_ADS: {},
        ALLOW_MASTER_PW: false,
        // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
        POST_FOOTER: '',
        COMMENT_FOOTER: '',
        SCOT_TAG_FIRST: false,
        PINNED_POSTS_URL: 'https://steemdiamond.github.io/',
        SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-28',
    },
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
    'vit.global': {
        APP_NAME: 'VisionIndustry',
        APP_ICON: 'vitp',
        APP_ICON_WIDTH: '125px',
        APP_ICON_HEIGHT: '40px',
        APP_URL: 'https://vit.global',
        APP_DOMAIN: 'vit.global',
        LIQUID_TOKEN: 'VIT',
        LIQUID_TOKEN_UPPERCASE: 'VITP',
        APP_MAX_TAG: 10,
        SCOT_TAG: 'vit',
        TAG_LIST: fromJSOrdered(['vit']),
        INTERLEAVE_PROMOTED: true,
        PROMOTED_POST_ACCOUNT: 'null',
        VESTING_TOKEN: 'VIT POWER',
        SITE_DESCRIPTION:
            'VisionIndustry is a social media platform where everyone gets paid for ' +
            'creating and curating content. It leverages a robust digital points system, called VIT, that ' +
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
        SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-26',
    },
    'dblog.io': DBLOG,
    'weedcash.network': WEEDCASH,
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
