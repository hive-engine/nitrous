import * as steem from '@steemit/steem-js';
import axios from 'axios';

const movieImageBaseUrl = 'https://image.tmdb.org/t/p';

export function convertUnixTimestampToDate(value) {
    const date = new Date(Number(value.replace('/Date(', '').replace(')/', '')))
        .toISOString()
        .substring(0, 10);

    if (date !== '0001-01-01') {
        return date;
    } else {
        return '';
    }
}

export function getSummary(value) {
    if (!value) {
        return null;
    }

    return value.length > 100 ? value.substring(0, 100) + ' ...' : value;
}

export function getRuntimeString(value, locale) {
    if (!value || isNaN(value)) {
        return '-';
    }

    const hours = parseInt(value / 60);
    const minutes = value % 60;

    if (locale === 'ko') {
        if (hours > 0) {
            return `${hours}시간 ${minutes}분`;
        } else {
            return `${minutes}분`;
        }
    } else {
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }
}

export function getMovieGenres(genreIdsString, allGenres) {
    if (!genreIdsString) {
        return [];
    }

    const result = [];
    const genreIds = genreIdsString.split(',');

    for (const i in allGenres) {
        const genre = allGenres[i];

        if (genreIds.indexOf(genre.id.toString()) > -1) {
            result.push(genre);
        }
    }

    return result;
}

export function getJsonValueByMultipleKeys(json, keyNames, separator) {
    if (!json || !keyNames || separator === null) {
        return null;
    }

    const result = [];

    keyNames.map(keyName => result.push(json[keyName]));

    return result.join(separator);
}

export function arrayToDict(list, keyName, keyPrefix) {
    return arrayToDictWithMultipleKeys(list, [keyName], '', keyPrefix || '');
}

export function arrayToDictWithMultipleKeys(
    list,
    keyNames,
    separator,
    keyPrefix
) {
    if (!list || !keyNames || separator === null) {
        return null;
    }

    const result = {};

    list.map(
        o =>
            (result[
                (!!keyPrefix ? keyPrefix : '') +
                    getJsonValueByMultipleKeys(o, keyNames, separator)
            ] = o)
    );

    return result;
}

export function dictToArray(o) {
    if (!o) {
        return null;
    }

    const result = [];

    for (const key in o) {
        result.push(o[key]);
    }

    return result;
}

export function getPostCoverThumbnailUrl(url) {
    if (url) {
        return `https://steemitimages.com/19x28/${url}`;
    } else {
        return null;
    }
}

export function getMoviePosterThumbnailUrl(imagePath) {
    if (imagePath) {
        return `${movieImageBaseUrl}/w92${imagePath}`;
    } else {
        return null;
    }
}

export function getMoviePosterUrl(imagePath) {
    if (imagePath) {
        return `${movieImageBaseUrl}/w500${imagePath}`;
    } else {
        return null;
    }
}

export function getMovieBackdropUrl(imagePath) {
    if (imagePath) {
        return `${movieImageBaseUrl}/w780${imagePath}`;
    } else {
        return null;
    }
}

export function getMovieProfileImageUrl(imagePath) {
    if (imagePath) {
        return `${movieImageBaseUrl}/w185${imagePath}`;
    } else {
        //https://www.flaticon.com/free-icon/actor_1909819
        return '/images/actor.svg';
    }
}

export function getMovieTopCrews(movieDetails) {
    if (!movieDetails || !movieDetails.Credits || !movieDetails.Credits.Crew) {
        return [];
    }

    return movieDetails.Credits.Crew.slice(0, 6);
}

export function getMovieTopCasts(movieDetails) {
    if (!movieDetails || !movieDetails.Credits || !movieDetails.Credits.Cast) {
        return [];
    }

    return movieDetails.Credits.Cast.slice(0, 6);
}

export function getMovieTypeName(movieType) {
    return movieType === 1 ? 'movie' : 'tv';
}

export function getMovieListName(movieType) {
    return movieType === 1 ? 'movies' : 'tvs';
}

export function getNextListConditionName(movieType) {
    return movieType === 1 ? 'hasNextMovies' : 'hasNextTvs';
}

export function getListLoadedConditionName(movieType) {
    return movieType === 1 ? 'isMoviesLoaded' : 'isTvsLoaded';
}

export function getMovieTypeNameByState(state) {
    let type = state.app.get('location').pathname.toLowerCase();

    if (type.indexOf('/movie') === 0) {
        type = 'movie';
    } else {
        type = 'tv';
    }

    return type;
}

export function getRecentMovies(movieType, list) {
    return list
        .filter(o => o.Type === movieType)
        .sort((o, n) => n.ReleaseDate - o.ReleaseDate || n.Id - o.Id);
}

export function getRecentReviews(movieType, list) {
    return list
        .filter(o => o.MovieType === movieType)
        .sort((o, n) => n.AddDate - o.AddDate);
}

export async function signTransactionByState(stateUser) {
    const username = stateUser.getIn(['current', 'username']);
    if (!username) return null;

    const postingKey = stateUser.getIn([
        'current',
        'private_keys',
        'posting_private',
    ]);
    if (!postingKey) return null;

    return await signTransaction(username, postingKey.toWif());
}

export async function signTransaction(username, postingKey) {
    const globals = await steem.api.getDynamicGlobalPropertiesAsync();

    const head_block_number = globals['head_block_number'] & 0xffff;
    const ref_block_prefix = parseInt(
        globals['head_block_id'].substring(8, 16),
        16
    );
    const now = new Date();
    const expiration = new Date(now.getTime() + 10000);
    const transaction = {
        ref_block_num: head_block_number,
        ref_block_prefix: ref_block_prefix,
        expiration: expiration.toISOString().split('.')[0],
        operations: [
            [
                'custom_json',
                {
                    required_auths: [],
                    required_posting_auths: [username],
                    id: 'authenticate',
                    json: JSON.stringify({ app: 'triplea' }),
                },
            ],
        ],
        extensions: [],
        signatures: [],
    };

    steem.auth.signTransaction(transaction, [postingKey]);
    let signatures = transaction['signatures'];

    for (let i = 0; i < signatures.length; ++i) {
        let signature = signatures[i];
        let s = '';
        let h;
        for (let j = 0; j < signature.length; ++j) {
            h = signature[j].toString(16);
            if (h.length < 2) {
                h = '0' + h;
            }
            s += h;
        }
        signature = s;
        signatures[i] = s;
    }

    transaction['signatures'] = signatures;

    return transaction;
}

export function setLocalStorageWithExpiry(key, value, ttlInSecond) {
    const now = new Date();

    const item = {
        value: value,
        expiry: now.getTime() + ttlInSecond * 1000,
    };

    localStorage.setItem(key, JSON.stringify(item));
}

export function getLocalStorageWithExpiry(key) {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
        return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }

    return item.value;
}

export async function getToken(stateUser) {
    try {
        let token = getLocalStorageWithExpiry('AppToken');
        if (token) return token;

        const transaction = await signTransactionByState(stateUser);
        if (!transaction) return null;

        const transactionPara = encodeURIComponent(JSON.stringify(transaction));
        const response = await axios.get(
            `https://tool.steem.world/AAA/GetToken?transaction=${
                transactionPara
            }`
        );

        if (!response.data) return null;

        const expiresIn = response.data.ExpiresIn;
        token = response.data.Token;

        if (!expiresIn) return null;
        if (!token) return null;

        setLocalStorageWithExpiry('AppToken', token, expiresIn);

        console.log(token);

        return token;
    } catch (e) {
        console.log(e);
        return null;
    }
}
