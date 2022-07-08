import Apps from '@hiveio/hivescript/apps.json';

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
    // https://github.com/bgornicki/hivescript/blob/master/apps.json
    return scheme
        .split('{category}')
        .join(post.category)
        .split('{username}')
        .join(post.author)
        .split('{permlink}')
        .join(post.permlink);
}

export function makeCanonicalLink(post, metadata) {
    let scheme;
    if (metadata) {
        const canonUrl = read_md_canonical(metadata);
        if (canonUrl) return canonUrl;

        const app = read_md_app(metadata);

        if (app) {
            scheme = Apps[app] ? Apps[app].url_scheme : null;
        }
    }

    if (!scheme) scheme = Apps['hiveblog'].url_scheme;
    return build_scheme(scheme, post);
}
