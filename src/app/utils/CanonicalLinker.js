import Apps from 'steemscript/apps.json';
import { APP_URL } from 'app/client_config';

export function makeCanonicalLink(d) {
    let canonicalUrl = APP_URL + d.link;

    if (d.json_metadata) {
        if (
            d.json_metadata.canonical_url &&
            typeof d.json_metadata.canonical_url === 'string'
        ) {
            const urlTester = new RegExp(/^https?:\/\//);
            if (urlTester.test(d.json_metadata.canonical_url)) {
                return d.json_metadata.canonical_url;
            }
        }

        if (d.json_metadata.app && typeof d.json_metadata.app === 'string') {
            const hasAppTemplateData =
                d.json_metadata &&
                d.json_metadata.app &&
                d.category &&
                d.json_metadata.app.split('/').length === 2;
            if (hasAppTemplateData) {
                const app = d.json_metadata.app.split('/')[0];
                const hasAppData = Apps[app] && Apps[app].url_scheme;
                if (hasAppData) {
                    canonicalUrl = Apps[app].url_scheme
                        .split('{category}')
                        .join(d.category)
                        .split('{username}')
                        .join(d.author)
                        .split('{permlink}')
                        .join(d.permlink);
                }
            }
        }
    }
    return canonicalUrl;
}
