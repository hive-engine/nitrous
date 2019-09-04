import { fromJSOrdered } from './utils/immutable';

// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const APP_NAME = 'SportsTalkSocial';
// sometimes APP_NAME is written in non-latin characters, but they are needed for technical purposes
// ie. "Голос" > "Golos"
export const APP_NAME_LATIN = 'SportsTalkSocial';
export const APP_NAME_UPPERCASE = 'SPORTSTALKSOCIAL';
export const APP_ICON = 'sports';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_URL = 'https://www.sportstalksocial.com';
export const APP_DOMAIN = 'www.sportstalksocial.com';
// max num of tags. if unset, default is 10. This is due to previous hardcoded number.
export const APP_MAX_TAG = 10;
export const SCOT_TAG = 'sportstalk';
export const TAG_LIST = fromJSOrdered({
    football: {
        tourneyplay: {
            afcon: ['afcon2019', 'afcon2021'],
            'american-cup': ['americancup2015', 'americancup2019'],
            copaamerica: ['copaamerica2019', 'copaamerica2020'],
            'euro-cup': ['eurocup2016', 'eurocup2020'],
            worldcup: ['worldcup2018', 'worldcup2022'],
        },
        leagueplay: {
            premierleague: [
                'arsenal',
                'astonvilla',
                'bournemouth',
                'brighton',
                'burnley',
                'chelsea',
                'crystalpalace',
                'everton',
                'leicestercity',
                'liverpool',
                'manchestercity',
                'manchesterunited',
                'newcastleunited',
                'norwichcity',
                'sheffieldunited',
                'southampton',
                'tottenham',
                'watford',
                'westham',
                'wolverhampton',
            ],
            laliga: [
                'alaves',
                'athleticbilbao',
                'atleticomadrid',
                'barcelona',
                'celtavigo',
                'eibar',
                'espanyol',
                'getafe',
                'granada',
                'leganes',
                'levante',
                'mallorca',
                'osasuna',
                'realbetis',
                'realmadrid',
                'realsociedad',
                'sevilla',
                'valencia',
                'valladolid',
                'villarreal',
            ],
            mls: [
                'atlantaunitedfc',
                'chicagofire',
                'fccincinnati',
                'coloradorapids',
                'columbuscrewsc',
                'dcunited',
                'fcdallas',
                'houstondynamo',
                'lagalaxy',
                'lafc',
                'minnesotaunitedfc',
                'montrealimpact',
                'newenglandrevolution',
                'nycfc',
                'nyredbulls',
                'orlandocitysc',
                'philadelphiaunion',
                'portlandtimbers',
                'realsaltlake',
                'sanjoseearthquakes',
                'seattlesoundersfc',
                'sportingkansascity',
                'torontofc',
                'vancouverwhitecapsfc',
            ],
        },
    },
    amfootball: {
        nfl: {
            afc: [
                'bengals',
                'bills',
                'broncos',
                'browns',
                'chargers',
                'chiefs',
                'chargers',
                'colts',
                'dolphins',
                'jaguars',
                'jets',
                'patriots',
                'raiders',
                'steelers',
                'texans',
                'titans',
            ],
            nfc: [
                '49ers',
                'bears',
                'buccaneers',
                'cardinals',
                'cowboys',
                'cowboys',
                'eagles',
                'falcons',
                'giants',
                'lions',
                'packers',
                'panthers',
                'rams',
                'redskins',
                'seahawks',
                'vikings',
            ],
        },
        xfl: {
            westernxfl: [
                'dallasrenegades',
                'houstonroughnecks',
                'lawildcats',
                'seattledragons',
            ],
            easternxfl: [
                'dcdefenders',
                'nyguardians',
                'stlbattlehawks',
                'tbvipers',
            ],
        },
        ncaafb: {
            accfb: [
                'bostoncollegefb',
                'clemsonfb',
                'dukefb',
                'fsufb',
                'georigatechfb',
                'louisvillefb',
                'miamifb',
                'ncstatefb',
                'uncfb',
                'notredamefb',
                'pittsburghfb',
                'syracusefb',
                'virginiafb',
                'virginiatechfb',
                'wakeforestfb',
            ],
            bigtenfb: [
                'illinoisfb',
                'indianafb',
                'iowafb',
                'marylandfb',
                'michiganfb',
                'michiganstatefb',
                'minnesotafb',
                'nebraskafb',
                'northwesternfb',
                'ohiostatefb',
                'pennstatefb',
                'purduefb',
                'rutgersfb',
                'wisconsinfb',
            ],
            big12fb: [
                'baylorfb',
                'iowastatefb',
                'kansasfb',
                'kansasstatefb',
                'oklahomafb',
                'oklahomastatefb',
                'tcufb',
                'texasfb',
                'texastechfb',
                'westvirginiafb',
            ],
            pac12fb: [
                'arizonafb',
                'asufb',
                'californiafb',
                'coloradofb',
                'oregonfb',
                'oregonstatefb',
                'standfordfb',
                'uclafb',
                'uscfb',
                'utahfb',
                'washingtonfb',
                'washingtonstatefb',
            ],
            secfb: [
                'alabamafb',
                'arkansasfb',
                'auburnfb',
                'floridafb',
                'georgiafb',
                'kentuckyfb',
                'lsufb',
                'mississippistatefb',
                'missourifb',
                'olemissfb',
                'southcarolinafb',
                'tennesseefb',
                'texasamfb',
                'vanderbiltfb',
            ],
        },
    },
    baseball: {
        mlb: {
            americanleague: [
                'angels',
                'astros',
                'athletics',
                'bluejays',
                'indians',
                'mariners',
                'orioles',
                'rangers',
                'rays',
                'redsox',
                'royals',
                'tigers',
                'twins',
                'whitesox',
                'yankees',
            ],
            nationalleague: [
                'braves',
                'brewers',
                'cardinals',
                'cubs',
                'diamondbacks',
                'dodgers',
                'giants',
                'marlins',
                'mets',
                'nationals',
                'padres',
                'phillies',
                'pirates',
                'reds',
                'rockies',
            ],
        },
        ncaabaseball: {
            accbb: [
                'bostoncollegebb',
                'clemsonbb',
                'dukebb',
                'fsubb',
                'georigatechbb',
                'louisvillebb',
                'miamibb',
                'ncstatebb',
                'uncbb',
                'notredamebb',
                'pittsburghbb',
                'syracusebb',
                'virginiabb',
                'virginiatechbb',
                'wakeforestbb',
            ],
            bigtenbb: [
                'illinoisbb',
                'indianabb',
                'iowabb',
                'marylandbb',
                'michiganbb',
                'michiganstatebb',
                'minnesotabb',
                'nebraskabb',
                'northwesternbb',
                'ohiostatebb',
                'pennstatebb',
                'purduebb',
                'rutgersbb',
                'wisconsinbb',
            ],
            big12bb: [
                'baylorbb',
                'iowastatebb',
                'kansasbb',
                'kansasstatebb',
                'oklahomabb',
                'oklahomastatebb',
                'tcubb',
                'texasbb',
                'texastechbb',
                'westvirginiabb',
            ],
            pac12bb: [
                'arizonabb',
                'asubb',
                'californiabb',
                'coloradobb',
                'oregonbb',
                'oregonstatebb',
                'standfordbb',
                'uclabb',
                'uscbb',
                'utahbb',
                'washingtonbb',
                'washingtonstatebb',
            ],
            secbb: [
                'alabamabb',
                'arkansasbb',
                'auburnbb',
                'floridabb',
                'georgiabb',
                'kentuckybb',
                'lsubb',
                'mississippistatebb',
                'missouribb',
                'olemissbb',
                'southcarolinabb',
                'tennesseebb',
                'texasambb',
                'vanderbiltbb',
            ],
        },
    },
    basketball: {
        nba: {
            eastern: [
                'hawks',
                'celtics',
                'nets',
                'hornets',
                'bulls',
                'cavaliers',
                'pistons',
                'pacers',
                'heat',
                'bucks',
                'knicks',
                'magic',
                '76ers',
                'raptors',
                'wizards',
            ],
            western: [
                'mavericks',
                'nuggets',
                'warriors',
                'rockets',
                'clippers',
                'lakers',
                'grizzlies',
                'timberwolves',
                'pelicans',
                'thunder',
                'suns',
                'trailblazers',
                'kings',
                'spurs',
                'jazz',
            ],
        },
        ncaamb: {
            accmb: [
                'bostoncollegemb',
                'clemsonmb',
                'dukemb',
                'fsumb',
                'georigatechmb',
                'louisvillemb',
                'miamimb',
                'ncstatemb',
                'uncmb',
                'notredamemb',
                'pittsburghmb',
                'syracusemb',
                'virginiamb',
                'virginiatechmb',
                'wakeforestmb',
            ],
            bigtenmb: [
                'illinoismb',
                'indianamb',
                'iowamb',
                'marylandmb',
                'michiganmb',
                'michiganstatemb',
                'minnesotamb',
                'nebraskamb',
                'northwesternmb',
                'ohiostatemb',
                'pennstatemb',
                'purduemb',
                'rutgersmb',
                'wisconsinmb',
            ],
            big12mb: [
                'baylormb',
                'iowastatemb',
                'kansasmb',
                'kansasstatemb',
                'oklahomamb',
                'oklahomastatemb',
                'tcumb',
                'texasmb',
                'texastechmb',
                'westvirginiamb',
            ],
            pac12mb: [
                'arizonamb',
                'asumb',
                'californiamb',
                'coloradomb',
                'oregonmb',
                'oregonstatemb',
                'standfordmb',
                'uclamb',
                'uscmb',
                'utahmb',
                'washingtonmb',
                'washingtonstatemb',
            ],
            secmb: [
                'alabamamb',
                'arkansasmb',
                'auburnmb',
                'floridamb',
                'georgiamb',
                'kentuckymb',
                'lsumb',
                'mississippistatemb',
                'missourimb',
                'olemissmb',
                'southcarolinamb',
                'tennesseemb',
                'texasammb',
                'vanderbiltmb',
            ],
        },
    },
    combat: {
        boxing: [],
        mma: ['ufc'],
        wrestling: ['wwe', 'aew', 'njpw', 'roh'],
    },
    hockey: {
        nhl: {
            nhleastern: [
                'bostonbruins',
                'buffalosabres',
                'carolinahurricanes',
                'columbusbluejackets',
                'detroitredwings',
                'floridapanthers',
                'montrealcanadiens',
                'newjerseydevils',
                'newyorkislanders',
                'newyorkrangers',
                'ottawasenators',
                'philadelphiaflyers',
                'pttsburghpenguins',
                'tampabaylightning',
                'torontomapleleafs',
                'washingtoncapitals',
            ],
            nhlwestern: [
                'anaheimducks',
                'arizonacoyotes',
                'calgaryflames',
                'chicagoblackhawks',
                'coloradoavalanche',
                'dallasstars',
                'edmontonoilers',
                'losangeleskings',
                'minnesotawild',
                'nashvillepredators',
                'saintlouisblues',
                'sanjosesharks',
                'vancouvercanucks',
                'vegasgoldenknights',
                'winnipegjets',
            ],
        },
    },
    sports: {
        golf: [
            'masters',
            'usopenchampionship',
            'britishopen',
            'pgachampionship',
        ],
        tennis: ['wimbledon', 'usopen', 'australianopen', 'frenchopen'],
        volleyball: [],
        cricket: [],
        rugby: [],
        lacrosse: [],
        billards: ['pool', 'snooker'],
        cycling: ['giroditalia', 'tourdefrance', 'lavuelta'],
        motorsports: ['nascar', 'indycar', 'nhra', 'formulaone', 'motocross'],
        horseracing: [
            'breederscup',
            'kentuckyderby',
            'preaknessstakes',
            'belmontstakes',
            'kentuckyoaks',
            'pegasusworldcup',
        ],
        competitionsports: [
            'dance',
            'cheer',
            'gymnastics',
            'bodybuilding',
            'weightlifting',
            'figureskating',
        ],
        watersports: ['swimming', 'surfing', 'rowing', 'waterpolo'],
        mentalsports: [
            'chess',
            'poker',
            'go',
            'backgammon',
            'draughts',
            'mahjong',
        ],
        discsports: ['discgolf', 'ultimatefrisbee'],
        extremesports: [
            'skateboarding',
            'bmx',
            'snowboarding',
            'skiing',
            'rollerskating',
            'lugeing',
            'mountainbiking',
            'rockclimbing',
            'skydiving',
            'rodeo',
        ],
        tabletennis: [],
        bowling: [],
        outdoors: ['fishing', 'hunting', 'kayaking', 'shooting'],
        esports: [
            'fortniteworldcup',
            'leagueworldchampionship',
            'theinternational',
            'cwl',
            'overwatchleague',
            'haloworldchampionship',
            'pubgglobalchampionship',
            'dota2asiachampionships',
        ],
    },
    fantasy: [
        'fantasypremierleague',
        'sfpl',
        'fantasybaseball',
        'fantasybasketball',
        'fantasyfootball',
    ],
    actifit: [],
});
export const LIQUID_TOKEN = 'Sports';
// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const LIQUID_TOKEN_UPPERCASE = 'SPORTS';
// used as backup
export const SCOT_DENOM = 1000;
export const VOTE_WEIGHT_DROPDOWN_THRESHOLD = 1;
export const VESTING_TOKEN = 'SPORTS POWER';
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
export const TWITTER_HANDLE = '@SportsTalkSteem';
export const SHARE_IMAGE =
    'https://' + APP_DOMAIN + '/images/steemit-share.png';
export const TWITTER_SHARE_IMAGE =
    'https://' + APP_DOMAIN + '/images/steemit-twshare.png';
export const SITE_DESCRIPTION =
    'SportsTalkSocial is a sports focused social media platform where everyone gets ' +
    'paid for creating and curating content. It leverages a robust digital points system, called SPORTS, ' +
    'that supports real value for digital rewards through market price discovery and liquidity';

// various
export const SUPPORT_EMAIL = 'support@' + APP_DOMAIN;

// Revive Ads
export const NO_ADS_STAKE_THRESHOLD = 500000;
export const REVIVE_ADS = {
    //header_banner: {
    //    zoneId: '1848',
    //    reviveId: '727bec5e09208690b050ccfc6a45d384',
    //},
    sidebar_left: {
        zoneId: '1849',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    sidebar_right: {
        zoneId: '1850',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    post_footer_abovecomments: {
        zoneId: '1851',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    post_footer_betweencomments: {
        zoneId: '1852',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
    feed: {
        zoneId: '1847',
        reviveId: '727bec5e09208690b050ccfc6a45d384',
    },
};

// Other configurations
export const ALLOW_MASTER_PW = false;
// Footer to attach to posts. ${POST_URL} is a macro that can be used, will be expanded to the URL of the post.
export const POST_FOOTER = '';
export const SCOT_TAG_FIRST = false;
