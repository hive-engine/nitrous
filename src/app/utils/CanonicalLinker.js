import SteemApps from 'steemscript/apps.json';
import HiveApps from '@hivechain/hivescript/apps.json';

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
    // apps which follow (reciprocate) canonical URLs
    const whitelist = [
        'hive',
        'hiveblog',
        'peakd',
        'steemit',
        'esteem',
        'steempeak',
        'travelfeed',
    ];
    return whitelist.includes(app);
}

export function makeCanonicalLink(d, hostConfig) {
    const metadata = d.json_metadata;
    const Apps = hostConfig['PREFER_HIVE'] ? HiveApps : SteemApps;
    const FallbackApps = hostConfig['PREFER_HIVE'] ? SteemApps : HiveApps;
    if (metadata) {
        const canonUrl = read_md_canonical(metadata);
        if (canonUrl) return canonUrl;

        const app = read_md_app(metadata);
        if (app && allowed_app(app)) {
            let scheme = Apps[app] ? Apps[app].url_scheme : null;
            scheme =
                !scheme && FallbackApps[app]
                    ? FallbackApps[app].url_scheme
                    : scheme;
            if (scheme && d.category) {
                return build_scheme(scheme, d);
            }
        }
    }
    return (
        (hostConfig['PREFER_HIVE']
            ? 'https://hive.blog'
            : 'https://steemit.com') + d.link
    );
}
