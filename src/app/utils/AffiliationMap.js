const map = {
    //steemit
    elipowell: 'Steemit',
    steemitblog: 'Steemit',
    steemitdev: 'Steemit',
    wehmoen: 'Lead Developer',
    'wehmoen.sports': 'Lead Developer',

    // Add Custom Badges. Use single quotes for the key if user has . or -,  e.g.
    // 'robot.pay' : 'Robot',
};

export function affiliationFromStake(accountName, stake) {
    // Put stake based breakdowns here.
    return map[accountName];
}

export default map;
