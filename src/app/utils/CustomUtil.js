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

export function getMovieListName(movieType) {
    return movieType === 1 ? 'movies' : 'tvs';
}

export function getNextListConditionName(movieType) {
    return movieType === 1 ? 'hasNextMovies' : 'hasNextTvs';
}

export function getListLoadedConditionName(movieType) {
    return movieType === 1 ? 'isMoviesLoaded' : 'isTvsLoaded';
}

export function getMovieTypeName(state) {
    let type = state.app.get('location').pathname;

    if (type.indexOf('/movie') === 0) {
        type = 'movie';
    } else {
        type = 'tv';
    }

    return type;
}
