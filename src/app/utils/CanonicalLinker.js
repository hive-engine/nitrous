import Apps from 'steemscript/apps.json';

function read_md_app(metadata) {
    return metadata &&
        metadata.app &&
        typeof metadata.app === 'string' &&
        metadata.app.split('/').length === 2
        ? metadata.app.split('/')[0]
        : null;
}

function read_md_canonical(metadata) {
    const url =
        metadata.canonical_url && typeof metadata.canonical_url === 'string'
            ? metadata.canonical_url
            : null;

    const saneUrl = new RegExp(/^https?:\/\//);
    return saneUrl.test(url) ? url : null;
}

function build_scheme(scheme, post) {
    // https://github.com/bonustrack/steemscript/blob/master/apps.json
    return scheme
        .split('{category}')
        .join(post.category)
        .split('{username}')
        .join(post.author)
        .split('{permlink}')
        .join(post.permlink);
}

function allowed_app(app) {
    // apps which follow (reciprocate) canonical URLs (as of 2020-03-21)
    const whitelist = [
        'hive',
        'peakd',
        'steemit',
        'esteem',
        'steempeak',
        'travelfeed',
    ];
    return whitelist.includes(app);
}

export function makeCanonicalLink(post, metadata) {
    let scheme;

    if (metadata) {
        const canonUrl = read_md_canonical(metadata);
        if (canonUrl) return canonUrl;

        const app = read_md_app(metadata);
        if (app && allowed_app(app)) {
            scheme = Apps[app] ? Apps[app].url_scheme : null;
        }
    }
    // TOOD 'hive' does not exist in steemscript package. Need an update to handle it correctly
    if (!scheme) scheme = Apps['steemit'].url_scheme;
    return build_scheme(scheme, post);
}
