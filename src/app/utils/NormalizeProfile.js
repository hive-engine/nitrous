import linksRe from 'app/utils/Links';
import o2j from 'shared/clash/object2json';

function truncate(str, len) {
    if (str) {
        str = str.trim();
        if (str.length > len) {
            str = str.substring(0, len - 1) + '...';
        }
    }
    return str;
}

/**
 * Enforce profile data length & format standards.
 */
export default function normalizeProfile(account) {
    if (!account) return {};

    // Parse
    let profile = {};
    let md = o2j.ifStringParseJSON(account.posting_json_metadata);
    if (!md || !md.profile || !md.profile.version) {
        md = o2j.ifStringParseJSON(account.json_metadata);
    }
    if (typeof md === 'string') md = o2j.ifStringParseJSON(md); // issue #1237, double-encoded
    if (md) {
        if (md.profile) {
            profile = md.profile;
        }
        if (!(typeof profile == 'object')) {
            console.error(
                'Expecting object in account.json_metadata.profile:',
                profile
            );
            profile = {};
        }
    }

    // Read & normalize
    let {
        name,
        about,
        location,
        website,
        profile_image,
        cover_image,
    } = profile;

    name = truncate(name, 20);
    about = truncate(about, 160);
    location = truncate(location, 30);

    if (/^@/.test(name)) name = null;
    if (website && website.length > 100) website = null;
    if (website && website.indexOf('http') === -1) {
        website = 'http://' + website;
    }
    if (website) {
        // enforce that the url regex matches, and fully
        const m = website.match(linksRe.any);
        if (!m || m[0] !== website) {
            website = null;
        }
    }

    if (profile_image && !/^https?:\/\//.test(profile_image))
        profile_image = null;
    if (cover_image && !/^https?:\/\//.test(cover_image)) cover_image = null;

    return {
        name,
        about,
        location,
        website,
        profile_image,
        cover_image,
    };
}
