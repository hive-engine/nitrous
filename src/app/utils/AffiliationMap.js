const map = {
    //steemit
    elipowell: 'Steemit',
    steemitblog: 'Steemit',
    steemitdev: 'Steemit',
    //hive
    hiveio: 'hive',

    // Add Custom Badges. Use single quotes for the key if user has . or -,  e.g.
    // 'robot.pay' : 'Robot',

    alchemage: 'Alchemist',
    nateonsteemit: 'Forest Person',
    riverflows: 'Walk As If You Kiss the Earth With Your Feet',
    porters: 'Believe in Kindness',
    artemislives: 'Pure Thai Natural Products',
    nainaztengra:
        'Unlimited Abundance Blissful Happiness and Unconditional Love',
    ravenlotus: 'Lotus Curator',
    riverlotus: 'Lotus Curator',
    bynarikode: 'Helpie Curator',
    naturalmedicine: 'Natural Medicine Official',
    riverflows: 'Natural Medicine Founder',
    metametheus: 'And if you listen very hard...',
    tryskele: 'Be The Change',
    'a1-shroom-spores': 'Hemp token owner',
    justinparke: 'Italist',
};

export function affiliationFromStake(accountName, stake) {
    // Put stake based breakdowns here.
    return map[accountName];
}

export default map;
