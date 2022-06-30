const map = {

    //steemit
    elipowell: 'Steemit',
    steemitblog: 'Steemit',
    steemitdev: 'Steemit',
    //hive
    hiveio: 'hive',

    // Add Custom Badges. Use single quotes for the key if user has . or -,  e.g.
    // 'robot.pay' : 'Robot',
};

export function getAffiliation(token, user) {
    if (map[token] && map[token][user]) {
        return map[token][user];
    } else if (map[user]) {
        return map[user];
    } else {
        return '';
    }
}

export function affiliationFromStake(token, accountName, stake) {
    // Put stake based breakdowns here.
    return getAffiliation(token, accountName);
}

export default map;
