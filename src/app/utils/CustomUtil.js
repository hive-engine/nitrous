export function convertUnixTimestampToDate(value) {
    return new Date(Number(value.replace('/Date(', '').replace(')/', '')))
        .toISOString()
        .substring(0, 10);
}

export function getSummary(value) {
    if (!value) {
        return null;
    }

    return value.length > 100 ? value.substring(0, 100) + ' ...' : value;
}

export function getRuntimeString(value) {
    if (!value || isNaN(value)) {
        return '-';
    }

    const hours = parseInt(value / 60);
    const minutes = value % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

export function getDistinctGenres(genres) {
    const result = [];
    const map = new Map();

    for (const genre of genres) {
        if (!map.has(genre.Id)) {
            map.set(genre.Id, true);
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

export function getMovieImageUrl(imagePath) {
    if (imagePath) {
        return `https://image.tmdb.org/t/p${imagePath}`;
    } else {
        return null;
    }
}
