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

export function affiliationFromStake(accountName, stake) {
    if (accountName === 'lasseehlers') {
        return 'Tribe Leader';
    }

    if (stake >= 250000) {
        return 'Hero Tribe Member';
    } else if (stake >= 150000) {
        return 'Legendary Tribe Member';
    } else if (stake >= 100000) {
        return 'Full Tribe Member';
    } else if (stake >= 50000) {
        return 'Tribe Member';
    } else if (stake >= 15000) {
        return 'Noob Tribe Member';
    } else {
        return 'Dust Account';
    }
}

export default map;
