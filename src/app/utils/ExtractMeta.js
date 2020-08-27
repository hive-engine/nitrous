import { extractBodySummary, extractImageLink } from 'app/utils/ExtractContent';
import { makeCanonicalLink } from 'app/utils/CanonicalLinker.js';
import {
    APP_NAME,
    APP_URL,
    APP_ICON,
    SITE_DESCRIPTION,
    TWITTER_HANDLE,
} from 'app/client_config';

import { proxifyImageUrl } from 'app/utils/ProxifyUrl';

const proxify = (url, size) => proxifyImageUrl(url, size).replace(/ /g, '%20');

function addSiteMeta(metas) {
    metas.push({ title: APP_NAME });
    metas.push({ name: 'description', content: SITE_DESCRIPTION });
    metas.push({ property: 'og:type', content: 'website' });
    metas.push({ property: 'og:site_name', content: APP_NAME });
    metas.push({ property: 'og:title', content: APP_NAME });
    metas.push({ property: 'og:description', content: SITE_DESCRIPTION });
    metas.push({
        property: 'og:image',
        content: `${APP_URL}/images/${APP_ICON}.png`,
    });
    metas.push({ property: 'fb:app_id', content: $STM_Config.fb_app });
    metas.push({ name: 'twitter:card', content: 'summary' });
    metas.push({ name: 'twitter:site', content: TWITTER_HANDLE });
    metas.push({ name: 'twitter:title', content: `#${APP_NAME}` });
    metas.push({ name: 'twitter:description', SITE_DESCRIPTION });
    metas.push({
        name: 'twitter:image',
        content: `${APP_URL}/images/${APP_ICON}.png`,
    });
}

function addPostMeta(metas, content, profile) {
    const { profile_image } = profile;
    const { category, created, body, json_metadata } = content;
    const isReply = content.depth > 0;

    const title = content.title + ` — ${APP_NAME}`;
    const desc = extractBodySummary(body, isReply) + ' by ' + content.author;
    const image_link = extractImageLink(json_metadata, body);

    const canonicalUrl = makeCanonicalLink(content, json_metadata);
    const localUrl = makeCanonicalLink(content, null);
    const image = image_link || profile_image;

    // Standard meta
    metas.push({ title });
    metas.push({ canonical: canonicalUrl });
    metas.push({ name: 'description', content: desc });

    // Open Graph data
    metas.push({ name: 'og:title', content: title });
    metas.push({ name: 'og:type', content: 'article' });
    metas.push({ name: 'og:url', content: localUrl });
    metas.push({
        name: 'og:image',
        content:
            proxify(image, '1200x630') || `${APP_URL}/images/${APP_ICON}.png`,
    });
    metas.push({ name: 'og:description', content: desc });
    metas.push({ name: 'og:site_name', content: APP_NAME });
    metas.push({ name: 'fb:app_id', content: $STM_Config.fb_app });
    metas.push({ name: 'article:tag', content: category });
    metas.push({
        name: 'article:published_time',
        content: created,
    });

    // Twitter card data
    metas.push({
        name: 'twitter:card',
        content: image ? 'summary_large_image' : 'summary',
    });
    metas.push({ name: 'twitter:site', content: TWITTER_HANDLE });
    metas.push({ name: 'twitter:title', content: title });
    metas.push({ name: 'twitter:description', content: desc });
    metas.push({
        name: 'twitter:image',
        content:
            proxify(image, '1200x630') || `${APP_URL}/images/${APP_ICON}.png`,
    });
}

function addAccountMeta(metas, accountname, profile) {
    let { name, about, profile_image } = profile;

    name = name || accountname;
    about = about || SITE_DESCRIPTION;
    profile_image = profile_image || `${APP_URL}/images/${APP_ICON}.png`;

    // Set profile tags
    const title = `@${accountname}`;
    const desc = `The latest posts from ${name}. Follow me at @${
        accountname
    }. ${about}`;

    // Standard meta
    metas.push({ name: 'description', content: desc });

    // Twitter card data
    metas.push({ name: 'twitter:card', content: 'summary' });
    metas.push({ name: 'twitter:site', content: TWITTER_HANDLE });
    metas.push({ name: 'twitter:title', content: title });
    metas.push({ name: 'twitter:description', content: desc });
    metas.push({ name: 'twitter:image', content: profile_image });
}

function readProfile(chain_data, account) {
    if (!chain_data.profiles[account]) return {};
    return chain_data.profiles[account]['metadata']['profile'];
}

export default function extractMeta(chain_data, rp) {
    let username;
    let content;
    if (rp.username && rp.slug) {
        // post
        const obj = chain_data.content[`${rp.username}/${rp.slug}`];
        content = obj && obj.id !== '0.0.0' ? obj : null;
        username = content ? content.author : null;
    } else if (rp.accountname) {
        // user profile root
        username = rp.accountname;
    }

    const profile = username ? readProfile(chain_data, username) : null;

    const metas = [];
    if (content) {
        addPostMeta(metas, content, profile);
    } else if (username) {
        addAccountMeta(metas, username, profile);
    } else {
        addSiteMeta(metas);
    }

    return metas;
}
