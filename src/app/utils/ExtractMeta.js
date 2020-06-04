import extractContent from 'app/utils/ExtractContent';
import { objAccessor } from 'app/utils/Accessors';
import normalizeProfile from 'app/utils/NormalizeProfile';
import { makeCanonicalLink } from 'app/utils/CanonicalLinker.js';

function addSiteMeta(metas, hostConfig) {
    metas.push({ title: hostConfig['APP_NAME'] });
    metas.push({
        name: 'description',
        content: hostConfig['SITE_DESCRIPTION'],
    });
    metas.push({ property: 'og:type', content: 'website' });
    metas.push({ property: 'og:site_name', content: hostConfig['APP_NAME'] });
    metas.push({ property: 'og:title', content: hostConfig['APP_NAME'] });
    metas.push({
        property: 'og:description',
        content: hostConfig['SITE_DESCRIPTION'],
    });
    metas.push({
        property: 'og:image',
        content: `${hostConfig['APP_URL']}/images/${
            hostConfig['APP_ICON']
        }.png`,
    });
    metas.push({ property: 'fb:app_id', content: $STM_Config.fb_app });
    metas.push({ name: 'twitter:card', content: 'summary' });
    metas.push({
        name: 'twitter:title',
        content: `#${hostConfig['APP_NAME']}`,
    });
    metas.push({
        name: 'twitter:description',
        content: hostConfig['SITE_DESCRIPTION'],
    });
    metas.push({
        name: 'twitter:image',
        content: `${hostConfig['APP_URL']}/images/${
            hostConfig['APP_ICON']
        }.png`,
    });
}

export default function extractMeta(chain_data, rp, hostConfig) {
    const metas = [];
    if (rp.username && rp.slug) {
        // post
        const post = `${rp.username}/${rp.slug}`;
        const content = chain_data.content[post];
        const author = chain_data.accounts[rp.username];
        const profile = normalizeProfile(author);
        if (content && content.id !== '0.0.0') {
            // API currently returns 'false' data with id 0.0.0 for posts that do not exist
            const d = extractContent(
                objAccessor,
                content,
                false,
                hostConfig['APP_DOMAIN']
            );
            const url = hostConfig['APP_URL'] + d.link;
            const canonicalUrl = makeCanonicalLink(d, hostConfig);
            const title = d.title + ` — ${hostConfig['APP_NAME']}`;
            const desc = d.desc + ' by ' + d.author;
            const image = d.image_link || profile.profile_image;
            const { category, created } = d;

            // Standard meta
            metas.push({ title });
            metas.push({ canonical: canonicalUrl });
            metas.push({ name: 'description', content: desc });

            // Open Graph data
            metas.push({ name: 'og:title', content: title });
            metas.push({ name: 'og:type', content: 'article' });
            metas.push({ name: 'og:url', content: url });
            metas.push({
                name: 'og:image',
                content:
                    image ||
                    `${hostConfig['APP_URL']}/images/${
                        hostConfig['APP_ICON']
                    }.png`,
            });
            metas.push({ name: 'og:description', content: desc });
            metas.push({
                name: 'og:site_name',
                content: hostConfig['APP_NAME'],
            });
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
            metas.push({ name: 'twitter:title', content: title });
            metas.push({ name: 'twitter:description', content: desc });
            metas.push({
                name: 'twitter:image',
                content:
                    image ||
                    `${hostConfig['APP_URL']}/images/${
                        hostConfig['APP_ICON']
                    }.png`,
            });
        } else {
            addSiteMeta(metas, hostConfig);
        }
    } else if (rp.accountname) {
        // user profile root
        const account = chain_data.accounts[rp.accountname];
        let { name, about, profile_image } = normalizeProfile(account);
        if (!account) {
            return metas;
        }
        if (name == null) name = account.name;
        if (about == null)
            about = `Join thousands on ${
                hostConfig['APP_NAME']
            } who share, post and earn rewards.`;
        if (profile_image == null)
            profile_image = `${hostConfig['APP_URL']}/images/${
                hostConfig['APP_ICON']
            }.png`;
        // Set profile tags
        const title = `@${account.name}`;
        const desc = `The latest posts from ${name}. Follow me at @${
            account.name
        }. ${about}`;
        const image = profile_image;

        // Standard meta
        metas.push({ name: 'description', content: desc });

        // Twitter card data
        metas.push({ name: 'twitter:card', content: 'summary' });
        metas.push({ name: 'twitter:title', content: title });
        metas.push({ name: 'twitter:description', content: desc });
        metas.push({ name: 'twitter:image', content: image });
    } else {
        // site
        addSiteMeta(metas, hostConfig);
    }
    return metas;
}
