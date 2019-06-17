export function getDate(value) {
    if (value && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d$/.test(value)) {
        value = value + 'Z'; // Firefox really wants this Z (Zulu)
    }
    return Date.parse(value);
}
