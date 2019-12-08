const map = {
    FOODIE: {
        jasonbu: 'SuperFoodie',
    },

    //steemit
    ned: 'Steemit',
    justinw: 'Steemit',
    elipowell: 'Steemit',
    vandeberg: 'Steemit',
    birdinc: 'Steemit',
    gerbino: 'Steemit',
    andrarchy: 'Steemit',
    roadscape: 'Steemit',
    steemitblog: 'Steemit',
    steemitdev: 'Steemit',

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

export default map;
