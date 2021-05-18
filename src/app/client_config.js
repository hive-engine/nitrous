import { fromJSOrdered } from './utils/immutable';

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
<<<<<<< HEAD
        'pesos',
        'steeming',
        'pets',
||||||| merged common ancestors
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
=======
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

const LERN = {
    APP_NAME: 'LernHerstory',
    APP_ICON: 'lern',
    APP_ICON_WIDTH: '70px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.lernblogs.com/',
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
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
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

const ALIVE = {
    APP_NAME: 'WeAreAliveAndSocial',
    APP_ICON: 'alive',
    APP_ICON_WIDTH: '180px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.wearealiveand.social/',
    APP_DOMAIN: 'www.wearealiveand.social',
    LIQUID_TOKEN: 'Alive',
    LIQUID_TOKEN_UPPERCASE: 'ALIVE',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'alive',
	TAG_LIST: fromJSOrdered([
		'alive',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'ALIVE POWER',
    SITE_DESCRIPTION:
        'WeAreAliveAndSocial is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called ALIVE, that ' +
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
    SDC_GTAG_MEASUREMENT_ID: 'G-2YXSKZNZFS',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    CHAT_CONVERSATIONS: null,
    APPEND_TRENDING_TAGS_COUNT: 10,
    COMMUNITY_CATEGORY: 'hive-155221',
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
>>>>>>> scotty_multi
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

<<<<<<< HEAD
const ONLINEBUZZ = {
    APP_NAME: 'OnlineBuzz',
    APP_ICON: 'onlinebuzz',
    APP_ICON_WIDTH: '200px',
||||||| merged common ancestors
const PIMP = {
    APP_NAME: 'PimpStudio',
    APP_ICON: 'pimpstudio',
    APP_ICON_WIDTH: '40px',
=======
const PHOTO = {
    APP_NAME: 'PhotoStreem',
    APP_ICON: 'photostreem',
    APP_ICON_WIDTH: '150px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.photostreem.com/',
    APP_DOMAIN: 'www.photostreem.com',
    LIQUID_TOKEN: 'Photo',
    LIQUID_TOKEN_UPPERCASE: 'PHOTO',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'photo',
    TAG_LIST: fromJSOrdered([
        'photo',
    ]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'PHOTO POWER',
    SITE_DESCRIPTION:
        'PhotoStreem is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called PHOTO, that ' +
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
    SDC_GTAG_MEASUREMENT_ID: 'UA-145448693-15',
    DISABLE_HIVE: true,
    APPEND_TRENDING_TAGS_COUNT: 10,
    COMMUNITY_CATEGORY: 'hive-191448',
};

const PIMP = {
    APP_NAME: 'PimpStudio',
    APP_ICON: 'pimpstudio',
    APP_ICON_WIDTH: '40px',
>>>>>>> scotty_multi
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
<<<<<<< HEAD
        'OnlineBuzz is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called PESOS, that ' +
||||||| merged common ancestors
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
=======
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
    CHAT_CONVERSATIONS: null,
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
    TAG_LIST: fromJSOrdered([]),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'POB POWER',
    SITE_DESCRIPTION:
        'ProofOfBrain is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called POB, that ' +
>>>>>>> scotty_multi
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER:
<<<<<<< HEAD
        '\n\n---\n\n<center><sub>Posted via [Onlinebuzz.com](${POST_URL})</sub></center>',
    COMMENT_FOOTER:
        '\n\n---\n\n<center><sub>Posted via [Onlinebuzz.com](${POST_URL})</sub></center>',
||||||| merged common ancestors
        '\n\n---\n\n<center><sub>Posted via [proofofbrain.io](${POST_URL})</sub></center>',
    COMMENT_FOOTER: '',
=======
        '\n\n---\n\n<center><sub>Posted via [proofofbrain.io](${POST_URL})</sub></center>',
    COMMENT_FOOTER:
        '\n\n---\n\n<center><sub>Posted via [proofofbrain.io](${POST_URL})</sub></center>',
>>>>>>> scotty_multi
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
<<<<<<< HEAD
||||||| merged common ancestors
    APPEND_TRENDING_TAGS_COUNT: 10,
    COMMUNITY_CATEGORY: 'hive-150329',
    POSTED_VIA_NITROUS_ICON: 'proofofbrain',
=======
    APPEND_TRENDING_TAGS_COUNT: 30,
    TRENDING_TAGS_TO_IGNORE: fromJSOrdered([
        'proofofbrain',
        'neoxian',
        'palnet',
        'archon',
        'leofinance',
        'ctp',
        'hustler',
        'ash',
        'aeneas',
        'creativecoin',
    ]),
    COMMUNITY_CATEGORY: 'hive-150329',
    POSTED_VIA_NITROUS_ICON: 'proofofbrain',
>>>>>>> scotty_multi
};

const CINETV = {
    APP_NAME: 'CineTV',
    APP_ICON: 'cinetv',
    APP_ICON_WIDTH: '40px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.cinetv.io',
    APP_DOMAIN: 'www.cinetv.io',
    LIQUID_TOKEN: 'Cine',
    LIQUID_TOKEN_UPPERCASE: 'CINE',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'cinetv',
    TAG_LIST: fromJSOrdered(['cine', 'cinetv']),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'CINE POWER',
    SITE_DESCRIPTION:
        'CineTV is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called CINE, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    SDC_GTAG_MEASUREMENT_ID: 'G-7GY47S41VV',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    APPEND_TRENDING_TAGS_COUNT: 10,
    COMMUNITY_CATEGORY: 'hive-121744',
    CHAT_CONVERSATIONS: null,
    GOOGLE_AD_CLIENT: 'ca-pub-5975884733498941',
};

const BROADHIVE = {
    APP_NAME: 'BroadHive',
    APP_ICON: 'broadhive',
    APP_ICON_WIDTH: '40px',
    APP_ICON_HEIGHT: '40px',
    APP_URL: 'https://www.broadhive.org',
    APP_DOMAIN: 'www.broadhive.org',
    LIQUID_TOKEN: 'BHT',
    LIQUID_TOKEN_UPPERCASE: 'BHT',
    APP_MAX_TAG: 10,
    SCOT_TAG: 'broadhive',
    TAG_LIST: fromJSOrdered(['broadhive', 'bhive']),
    INTERLEAVE_PROMOTED: true,
    PROMOTED_POST_ACCOUNT: 'null',
    VESTING_TOKEN: 'BHT POWER',
    SITE_DESCRIPTION:
        'BroadHive is a social media platform where everyone gets paid for ' +
        'creating and curating content. It leverages a robust digital points system, called BHT, that ' +
        'supports real value for digital rewards through market price discovery and liquidity',
    // Revive Ads
    NO_ADS_STAKE_THRESHOLD: 9999999999,
    REVIVE_ADS: {},
    ALLOW_MASTER_PW: false,
    // Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
    POST_FOOTER: '',
    COMMENT_FOOTER: '',
    SCOT_TAG_FIRST: false,
    SDC_GTAG_MEASUREMENT_ID: 'G-4DDBVVGDLL',
    DISABLE_STEEM: true,
    PREFER_HIVE: true,
    HIVE_ENGINE: true,
    APPEND_TRENDING_TAGS_COUNT: 10,
    COMMUNITY_CATEGORY: 'hive-162770',
    CHAT_CONVERSATIONS: null,
};

export const CONFIG_MAP = {
    // testing heroku/local options
<<<<<<< HEAD
    'localhost:8080': STEEMING,
    'onlinebuzz.com': ONLINEBUZZ,
    'steeming.com': STEEMING,
||||||| merged common ancestors
    'localhost:8080': HIVEHUSTLERS,
    'frozen-retreat-15997.herokuapp.com': POB,
    'www.proofofbrain.io': POB,
    'www.musicforlife.io': VIBES,
    'www.projectrevelation.io': REVELATION,
    'www.hivehustlers.io': HIVEHUSTLERS,
    'www.gradnium.com': GRADNIUM,
    'www.pimpstudio.cash': PIMP,
    'www.d-social.com': DSOCIAL,
    'www.aeneas.blog': AENEAS,
    'www.lieta.io': LIETA,
    'www.archonapp.net': ARCHON,
    'www.hivelist.org': HIVELIST,
    'nitrous.telokanda.com': KANDA,
    'www.trafficinsider.org': TIX,
    'www.cryptowars.me': INFOWARS,
=======
    'localhost:8080': PHOTO,
    'frozen-retreat-15997.herokuapp.com': ALIVE,
    'www.wearealiveand.social': ALIVE,
    'www.photostreem.com': PHOTO,
    'www.broadhive.org': BROADHIVE,
    'www.cinetv.io': CINETV,
    'www.proofofbrain.io': POB,
    'www.lernblogs.com': LERN,
    'www.musicforlife.io': VIBES,
    'www.projectrevelation.io': REVELATION,
    'www.hivehustlers.io': HIVEHUSTLERS,
    'www.gradnium.com': GRADNIUM,
    'www.pimpstudio.cash': PIMP,
    'www.d-social.com': DSOCIAL,
    'www.aeneas.blog': AENEAS,
    'www.lieta.io': LIETA,
    'www.archonapp.net': ARCHON,
    'www.hivelist.org': HIVELIST,
    'nitrous.telokanda.com': KANDA,
    'www.trafficinsider.org': TIX,
    'www.cryptowars.me': INFOWARS,
>>>>>>> scotty_multi
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
