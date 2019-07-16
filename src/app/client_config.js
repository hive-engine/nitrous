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
export const SCOT_TAG = 'sportstalk';
export const TAG_LIST = fromJSOrdered({
    football: {
        tourneyplay: {
            'afcon': ['afcon2019', 'afcon2021'],
            'american-cup': ['americancup2015', 'americancup2019'],
            'copaamerica': ['copaamerica2019', 'copaamerica2020'],
            'euro-cup': ['eurocup2016', 'eurocup2020'],
            'worldcup': ['worldcup2018', 'worldcup2022'],
        },
        leagueplay: {
            'premierleague': ['arsenal', 'astonvilla', 'bournemouth', 'brighton', 'burnley', 'chelsea', 'crystalpalace', 'everton', 'leicestercity', 'liverpool', 'manchestercity', 'manchesterunited', 'newcastleunited', 'norwichcity', 'sheffieldunited', 'southampton', 'tottenham', 'watford', 'westham', 'wolverhampton'],
            'laliga': ['alaves', 'athleticbilbao', 'atleticomadrid', 'barcelona', 'celtavigo', 'eibar', 'espanyol', 'getafe', 'granada', 'leganes', 'levante', 'mallorca', 'osasuna', 'realbetis', 'realmadrid', 'realsociedad', 'sevilla', 'valencia', 'valladolid', 'villarreal'],
            'mls': ['atlantaunitedfc', 'chicagofire', 'fccincinnati', 'coloradorapids', 'columbuscrewsc', 'dcunited', 'fcdallas', 'houstondynamo', 'lagalaxy', 'lafc', 'minnesotaunitedfc', 'montrealimpact', 'newenglandrevolution', 'nycfc', 'nyredbulls', 'orlandocitysc', 'philadelphiaunion', 'portlandtimbers', 'realsaltlake', 'sanjoseearthquakes', 'seattlesoundersfc', 'sportingkansascity', 'torontofc', 'vancouverwhitecapsfc'],   
        },
    },    
    amfootball: {
        nfl: {
            'afc': ['bengals', 'bills', 'broncos', 'browns', 'chargers', 'chiefs', 'chargers', 'colts', 'dolphins', 'jaguars', 'jets', 'patriots', 'raiders', 'steelers', 'texans', 'titans'],
            'nfc': ['49ers', 'bears', 'buccaneers', 'cardinals', 'cowboys', 'cowboys', 'eagles', 'falcons', 'giants', 'lions', 'packers', 'panthers', 'rams', 'redskins', 'seahawks', 'vikings'],
        },
        ncaafb: {
            'acc': ['bostoncollege', 'clemson', 'duke', 'fsu', 'georigatech', 'louisville', 'miami', 'ncstate', 'unc', 'notredame', 'pittsburgh', 'syracuse', 'virginia', 'virginiatech', 'wakeforest'],
            'bigten': ['illinois', 'indiana', 'iowa', 'maryland', 'michigan', 'michiganstate', 'minnesota', 'nebraska', 'northwestern', 'ohiostate', 'pennstate', 'purdue', 'rutgers', 'wisconsin'],
            'big12': ['baylor', 'iowastate', 'kansas', 'kansasstate', 'oklahoma', 'oklahomastate', 'tcu', 'texas', 'texastech', 'westvirginia'],            
            'pac12': ['arizona', 'asu', 'california', 'colorado', 'oregon', 'oregonstate', 'standford', 'ucla', 'usc', 'utah', 'washington', 'washingtonstate'],
            'sec': ['alabama', 'arkansas', 'auburn', 'florida', 'georgia', 'kentucky', 'lsu', 'mississippistate', 'missouri', 'olemiss', 'southcarolina', 'tennessee', 'texasam', 'vanderbilt'],            
        },
    },
    baseball: {
        mlb: {
            'americanleague': ['angels', 'astros', 'athletics', 'bluejays', 'indians', 'mariners', 'orioles', 'rangers', 'rays', 'redsox', 'royals', 'tigers', 'twins', 'whitesox', 'yankees'],
            'nationalleague': ['braves', 'brewers', 'cardinals', 'cubs', 'diamondbacks', 'dodgers', 'giants', 'marlins', 'mets', 'nationals', 'padres', 'phillies', 'pirates', 'reds', 'rockies'],
        },
        ncaabaseball: {
            'acc': ['bostoncollege', 'clemson', 'duke', 'fsu', 'georigatech', 'louisville', 'miami', 'ncstate', 'unc', 'notredame', 'pittsburgh', 'syracuse', 'virginia', 'virginiatech', 'wakeforest'],
            'bigten': ['illinois', 'indiana', 'iowa', 'maryland', 'michigan', 'michiganstate', 'minnesota', 'nebraska', 'northwestern', 'ohiostate', 'pennstate', 'purdue', 'rutgers', 'wisconsin'],
            'big12': ['baylor', 'iowastate', 'kansas', 'kansasstate', 'oklahoma', 'oklahomastate', 'tcu', 'texas', 'texastech', 'westvirginia'],            
            'pac12': ['arizona', 'asu', 'california', 'colorado', 'oregon', 'oregonstate', 'standford', 'ucla', 'usc', 'utah', 'washington', 'washingtonstate'],
            'sec': ['alabama', 'arkansas', 'auburn', 'florida', 'georgia', 'kentucky', 'lsu', 'mississippistate', 'missouri', 'olemiss', 'southcarolina', 'tennessee', 'texasam', 'vanderbilt'],
        },
    },
    basketball: {
        nba: {
            'eastern': ['hawks', 'celtics', 'nets', 'hornets', 'bulls', 'cavaliers', 'pistons', 'pacers', 'heat', 'bucks', 'knicks', 'magic', '76ers', 'raptors', 'wizards'],
            'western': ['mavericks', 'nuggets', 'warriors', 'rockets', 'clippers', 'lakers', 'grizzlies', 'timberwolves', 'pelicans', 'thunder', 'suns', 'trailblazers', 'kings', 'spurs', 'jazz'],
        },
        ncaamcb: {
            'acc': ['bostoncollege', 'clemson', 'duke', 'fsu', 'georigatech', 'louisville', 'miami', 'ncstate', 'unc', 'notredame', 'pittsburgh', 'syracuse', 'virginia', 'virginiatech', 'wakeforest'],
            'bigten': ['illinois', 'indiana', 'iowa', 'maryland', 'michigan', 'michiganstate', 'minnesota', 'nebraska', 'northwestern', 'ohiostate', 'pennstate', 'purdue', 'rutgers', 'wisconsin'],
            'big12': ['baylor', 'iowastate', 'kansas', 'kansasstate', 'oklahoma', 'oklahomastate', 'tcu', 'texas', 'texastech', 'westvirginia'],            
            'pac12': ['arizona', 'asu', 'california', 'colorado', 'oregon', 'oregonstate', 'standford', 'ucla', 'usc', 'utah', 'washington', 'washingtonstate'],
            'sec': ['alabama', 'arkansas', 'auburn', 'florida', 'georgia', 'kentucky', 'lsu', 'mississippistate', 'missouri', 'olemiss', 'southcarolina', 'tennessee', 'texasam', 'vanderbilt'], 
        },     
    },
    combat: ['boxing', 'mma', 'wrestling'],
    horseracing: [],
    cricket: [],
    golf: [],
    hockey: {
        nhl: {
            'nhleastern': ['bostonbruins', 'buffalosabres', 'carolinahurricanes', 'columbusbluejackets', 'detroitredwings', 'floridapanthers', 'montrealcanadiens', 'newjerseydevils', 'newyorkislanders', 'newyorkrangers', 'ottawasenators', 'philadelphiaflyers', 'pttsburghpenguins', 'tampabaylightning', 'torontomapleleafs', 'washingtoncapitals'],
            'nhlwestern': ['anaheimducks', 'arizonacoyotes', 'calgaryflames', 'chicagoblackhawks', 'coloradoavalanche', 'dallasstars', 'edmontonoilers', 'losangeleskings', 'minnesotawild', 'nashvillepredators', 'saintlouisblues', 'sanjosesharks', 'vancouvercanucks', 'vegasgoldenknights', 'winnipegjets'],
        },      
    },
    tennis: [],
    fantasy: ['fantasybaseball', 'fantasybasketball', 'fantasyfootball'],
    esports: [],
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
export const PROMOTED_POST_ACCOUNT = 'sportspromo';

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
    'SportsTalkSocial is a social media platform where everyone gets paid for ' +
    'creating and curating content. It leverages a robust digital points system, called SPORTS, that ' +
    'supports real value for digital rewards through market price discovery and liquidity';

// various
export const SUPPORT_EMAIL = 'support@' + APP_DOMAIN;
