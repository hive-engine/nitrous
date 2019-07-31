import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import tt from 'counterpart';
import { getScotDataAsync } from 'app/utils/steemApi';

import constants from 'app/redux/constants';
import { LIQUID_TOKEN_UPPERCASE } from 'app/client_config';

const MAX_LIMIT = 10;

const formatDate = date => {
    const d = new Date(`${date}Z`);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

class AuthorRecentPosts extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
            posts: [],
        };
    }

    componentDidMount() {
        this.getDiscussionsByAuthor();
    }

    async getDiscussionsByAuthor() {
        const { author, permlink } = this.props;

        let posts = [];
        let fetchDone = false;
        let lastValue;
        let batch = 0;
        let endOfData = false;
        let fetchLimitReached = false;
        while (!fetchDone) {
            const discussionQuery = {
                token: LIQUID_TOKEN_UPPERCASE,
                tag: author,
                limit: MAX_LIMIT + 1,
                start_author: lastValue && lastValue.author,
                start_permlink: lastValue && lastValue.permlink,
            };
            let feedData = await getScotDataAsync(
                `get_discussions_by_blog`,
                discussionQuery
            );
            lastValue = feedData[feedData.length - 1];
            endOfData = feedData.length < MAX_LIMIT;
            feedData = feedData
                .filter(e => e.author === author && e.permlink !== permlink)
                .slice(posts.length ? 1 : 0);

            batch += 1;
            fetchLimitReached = batch >= constants.MAX_BATCHES;
            fetchDone =
                endOfData || fetchLimitReached || feedData.length >= MAX_LIMIT;

            posts = posts.concat(
                feedData.map((e, i) => ({
                    id: e.post_id || e.created.replace(/[^\d]/g, ''),
                    title: e.title,
                    url: e.url || `/${e.authorperm}`,
                    children: e.children,
                    created: e.created,
                }))
            );
        }

        this.setState({
            fetching: false,
            posts: posts.slice(0, 10),
        });
    }

    render() {
        const { fetching, posts } = this.state;
        const { author } = this.props;
        if (!fetching && (posts && posts.length)) {
            return (
                <div className={classNames('AuthorRecentPosts', 'callout')}>
                    <h6>
                        {tt('postfull_jsx.recent_posts_by_author', { author })}
                    </h6>
                    <table>
                        <tbody>
                            {posts.map(e => (
                                <tr key={e.id}>
                                    <th>
                                        <a href={e.url}>{e.title}</a>
                                        {'  '}
                                        <span>({e.children})</span>
                                    </th>
                                    <td>{formatDate(e.created)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        return null;
    }
}

AuthorRecentPosts.propTypes = {
    author: PropTypes.string.isRequired,
};

export default AuthorRecentPosts;
