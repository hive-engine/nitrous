import {
    SEARCH_SELECTION_REWARD_AMOUNT,
    SEARCH_SELECTION_BURN_AMOUNT,
} from 'app/client_config';
import { getSteemEngineAccountHistoryAsync } from 'app/utils/steemApi';

export function clean_permlink(link) {
    if (link) return link.replace(/[^\d\w-]+/g, '-');
    else return link;
}

export function setPostRewardedByUser(author, permlink, username) {
    // save the selected status in local storage
    localStorage.setItem(
        `rewarded-@${author}/${permlink}-by-${username}`,
        'true'
    );
}

export function isPostRewardedByUser(author, permlink, username) {
    // check the rewarded in local storage
    // if the post is owned by the user, don't need to reward
    if (
        process.env.BROWSER &&
        localStorage.getItem(
            `rewarded-@${author}/${permlink}-by-${username}`
        ) === 'true'
    ) {
        return true;
    } else {
        return false;
    }
}

export async function updatePostRewardingRecords(username, callback) {
    const [transfers] = await Promise.all([
        getSteemEngineAccountHistoryAsync(username, 500),
    ]);
    const memo_prefix = 'search and click: ';
    // filter valid transfers
    const matched_transfers = transfers.filter(
        t =>
            t['memo'] != null &&
            t['memo'].indexOf(memo_prefix) != -1 &&
            ((t['to'] == 'null' &&
                t['quantity'] >= SEARCH_SELECTION_BURN_AMOUNT) ||
                (t['to'] != 'null' &&
                    t['quantity'] >= SEARCH_SELECTION_REWARD_AMOUNT))
    );
    let rewarded_posts = matched_transfers
        .filter(t => {
            let receivers = matched_transfers
                .filter(t1 => t1['memo'] === t['memo'])
                .map(t1 => t1['to']);
            receivers = [...new Set(receivers)];
            return receivers.length >= 2 && receivers.includes('null');
        })
        .map(t => {
            if (t['to'] === 'null') {
                return t['memo'].replace(memo_prefix, '');
            } else {
                return null;
            }
        })
        .filter(k => k != null);
    // deduplicate and set reward post records
    rewarded_posts = [...new Set(rewarded_posts)];
    rewarded_posts.forEach(k => {
        const author = k.split('/')[0].replace('@', '');
        const permlink = k.split('/')[1];
        setPostRewardedByUser(author, permlink, username);
    });
    console.log('Rewarded Posts:', rewarded_posts);
    // callback
    if (callback && typeof callback === 'function') callback();
}
