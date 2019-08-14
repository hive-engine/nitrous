export function convertUnixTimestampToDate(value) {
    return new Date(Number(value.replace('/Date(', '').replace(')/', '')))
        .toISOString()
        .substring(0, 10);
}
