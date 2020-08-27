import { settlePromises } from 'app/utils/StateFunctions';
import { callBridge } from './steemApi';

export async function fetchCrossPosts(posts, observer) {
    const crossPostRegex = /^This is a cross post of \[@(.*?)\/(.*?)\]\(\/.*?@.*?\/.*?\) by @.*?\.<br>/;
    const crossPostPromises = [];

    const content = {};
    const keys = [];

    for (let idx = 0; idx < posts.length; idx += 1) {
        const post = posts[idx];
        const crossPostMatches = crossPostRegex.exec(post.body);

        if (crossPostMatches) {
            const [, crossPostAuthor, crossPostPermlink] = crossPostMatches;
            const crossPostParams = {
                author: crossPostAuthor,
                permlink: crossPostPermlink,
                observer,
            };
            crossPostPromises.push(callBridge('get_post', crossPostParams));
            post.cross_post_key = `${crossPostAuthor}/${crossPostPermlink}`;
        }

        const key = post.author + '/' + post.permlink;
        content[key] = post;
        keys.push(key);
    }

    const crossPosts = {};

    if (crossPostPromises.length > 0) {
        try {
            const responses = await settlePromises(crossPostPromises);

            for (let ri = 0; ri < responses.length; ri += 1) {
                const response = responses[ri];

                if (response.state === 'resolved') {
                    const crossPost = response.value;
                    const crossPostKey = `${crossPost.author}/${
                        crossPost.permlink
                    }`;
                    crossPosts[crossPostKey] = crossPost;
                } else {
                    console.error('cross post error', response);
                }
            }
        } catch (error) {
            console.error('Failed fetching cross posts', error.message);
        }
    }

    return {
        content,
        keys,
        crossPosts,
    };
}

export function augmentContentWithCrossPost(post, crossPost) {
    if (!crossPost) {
        return post;
    }

    const fieldsToAugment = [
        'body',
        'author',
        'permlink',
        'author_reputation',
        'created',
        'category',
        'community',
        'community_title',
        'json_metadata',
        'updated',
    ];

    for (let fi = 0; fi < fieldsToAugment.length; fi += 1) {
        const fieldToRewrite = fieldsToAugment[fi];

        if (Object.prototype.hasOwnProperty.call(crossPost, fieldToRewrite)) {
            post[`cross_post_${fieldToRewrite}`] = crossPost[fieldToRewrite];
        }
    }

    post.cross_posted_by = post.author;

    return post;
}
