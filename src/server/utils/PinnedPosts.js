import * as config from 'config';
import * as https from 'https';
import * as steem from '@steemit/steem-js';
import { getContentAsync } from 'app/utils/steemApi';
import { CONFIG_MAP } from 'app/client_config';

function loadPinnedPosts(pinnedPostsUrl) {
    return new Promise((resolve, reject) => {
        const emptyPinnedPosts = {
            pinned_posts: [],
            notices: [],
        };

        if (!pinnedPostsUrl) {
            resolve(emptyPinnedPosts);
            return;
        }

        const request = https.get(pinnedPostsUrl, resp => {
            let data = '';
            resp.on('data', chunk => {
                data += chunk;
            });
            resp.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.info('Received pinned posts payload', json);
                    if (json === Object(json)) {
                        resolve(json);
                    }
                } catch (err) {
                    console.error('Could not load pinned posts', err);
                    resolve(emptyPinnedPosts);
                }
            });
        });

        request.on('error', e => {
            console.error('Could not load pinned posts', e);
            resolve(emptyPinnedPosts);
        });
    });
}

export async function pinnedPosts() {
    console.info('Loading pinned posts');

    const allPinnedPostData = {};

    for (const config of Object.values(CONFIG_MAP)) {
        const scotTokenSymbol = config['LIQUID_TOKEN_UPPERCASE'];
        const preferHive = config['PREFER_HIVE'];
        console.info(`Loading pinned posts for ${scotTokenSymbol}`);
        const postData = await loadPinnedPosts(config['PINNED_POSTS_URL']);
        let loadedPostData = {
            pinned_posts: [],
            notices: [],
        };

        loadedPostData.announcement = postData.announcement;
        for (const url of postData.pinned_posts) {
            const [username, postId] = url.split('@')[1].split('/');
            let post = await getContentAsync(
                username,
                postId,
                scotTokenSymbol,
                preferHive
            );
            if (post) {
              post.pinned = true;
              loadedPostData.pinned_posts.push(post);
            }
        }

        for (const notice of postData.notices) {
            if (notice.permalink) {
                const [username, postId] = notice.permalink
                    .split('@')[1]
                    .split('/');
                let post = await getContentAsync(
                    username,
                    postId,
                    scotTokenSymbol
                );
                loadedPostData.notices.push(Object.assign({}, notice, post));
            } else {
                loadedPostData.notices.push(notice);
            }
        }
        allPinnedPostData[config['LIQUID_TOKEN_UPPERCASE']] = loadedPostData;
    }

    console.info('Loaded pinned posts');

    return allPinnedPostData;
}
