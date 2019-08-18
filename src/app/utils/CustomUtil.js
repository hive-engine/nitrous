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
        return null;
    }

    const hours = parseInt(value / 60);
    const minutes = value % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}
