import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import constants from 'app/redux/constants';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import PostsList from 'app/components/cards/PostsList';
import { isFetchingOrRecentlyUpdated } from 'app/utils/StateFunctions';
import Callout from 'app/components/elements/Callout';
import { List, OrderedMap } from 'immutable';
import { INTERLEAVE_PROMOTED, TAG_LIST } from 'app/client_config';
import MarkdownViewer from 'app/components/cards/MarkdownViewer';
import tagHeaderMap from 'app/utils/TagFeedHeaderMap';
import tt from 'counterpart';

class PostPanel extends React.Component {
    static propTypes = {
        discussions: PropTypes.object,
        accounts: PropTypes.object,
        status: PropTypes.object,
        requestData: PropTypes.func,
        loading: PropTypes.bool,
        username: PropTypes.string,
        blogmode: PropTypes.bool,
        categories: PropTypes.object,
    };

    static defaultProps = {
        showSpam: false,
    };

    constructor() {
        super();
        this.state = {};
        this.loadMore = this.loadMore.bind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'PostPanel');
    }

    componentDidUpdate(prevProps) {
        if (
            window.innerHeight &&
            window.innerHeight > 3000 &&
            prevProps.discussions !== this.props.discussions
        ) {
            this.refs.list.fetchIfNeeded();
        }
    }

    getPosts(username, category) {
        const topic_discussions = this.props.discussions.get(username || '');
        if (!topic_discussions) return { posts: List(), promotedPosts: List() };
        const mainDiscussions = topic_discussions.get(category);
        if (
            INTERLEAVE_PROMOTED &&
            (category === 'trending' || category === 'hot')
        ) {
            let promotedDiscussions = topic_discussions.get('promoted');
            if (
                promotedDiscussions &&
                promotedDiscussions.size > 0 &&
                mainDiscussions
            ) {
                const processed = new Set(); // mutable
                // pinnedPosts.map(p => `${p.author}/${p.permlink}`)
                const interleaved = [];
                const promoted = [];
                let promotedIndex = 0;
                for (let i = 0; i < mainDiscussions.size; i++) {
                    if (i % PROMOTED_POST_PAD_SIZE === 0) {
                        while (
                            processed.has(
                                promotedDiscussions.get(promotedIndex)
                            ) &&
                            promotedIndex < promotedDiscussions.size
                        ) {
                            promotedIndex++;
                        }
                        if (promotedIndex < promotedDiscussions.size) {
                            const nextPromoted = promotedDiscussions.get(
                                promotedIndex
                            );
                            interleaved.push(nextPromoted);
                            promoted.push(nextPromoted);
                            processed.add(nextPromoted);
                        }
                    }
                    const nextDiscussion = mainDiscussions.get(i);
                    if (!processed.has(nextDiscussion)) {
                        interleaved.push(nextDiscussion);
                        processed.add(nextDiscussion);
                    }
                }
                return {
                    posts: List(interleaved),
                    promotedPosts: List(promoted),
                };
            }
        }
        return { posts: mainDiscussions || List(), promotedPosts: List() };
    }

    loadMore(last_post) {
        if (!last_post) return;
        let { account, category } = this.props;
        let order = null;
        if (category === 'feed') {
            order = 'by_feed';
        } else if (category === 'blog') {
            order = 'by_author';
        } else if (category === 'vote') {
            order = 'by_voter';
        }
        console.log('loadMore', last_post, account, category, order);
        if (isFetchingOrRecentlyUpdated(this.props.status, category, account))
            return;
        const [author, permlink] = last_post.split('/');
        this.props.requestData({
            author,
            permlink,
            order,
            category,
            accountname: account,
        });
    }

    onShowSpam = () => {
        this.setState({ showSpam: !this.state.showSpam });
    };

    render() {
        const {
            account,
            username,
            category,
            discussions,
            nightmodeEnabled,
        } = this.props;

        let topics_order = category;
        let posts = List();
        let promotedPosts = List();
        let emptyText = '';
        if (category === 'feed' || category === 'blog' || category === 'vote') {
            posts = this.props.accounts.getIn([account, category]) || List();
        }
        if (category === 'feed') {
            topics_order = 'trending';
            const isMyAccount = this.props.username === account;
            if (isMyAccount) {
                emptyText = (
                    <div>
                        {tt('posts_index.empty_feed_1')}.<br />
                        <br />
                        {tt('posts_index.empty_feed_2')}.<br />
                        <br />
                        <Link to="/trending">
                            {tt('posts_index.empty_feed_3')}
                        </Link>
                        <br />
                    </div>
                );
            } else {
                emptyText = (
                    <div>
                        {tt('user_profile.user_hasnt_followed_anything_yet', {
                            name: account,
                        })}
                    </div>
                );
            }
        } else if (category === 'blog') {
            emptyText = <div> {tt('posts_panel_jsx.no_blog')} </div>;
        } else if (category === 'vote') {
            emptyText = <div> {tt('posts_panel_jsx.no_recommended')} </div>;
        } else {
            const processedPosts = this.getPosts(account, category);
            posts = processedPosts.posts;
            // promotedPosts = processedPosts.promotedPosts;
            if (posts && posts.size === 0) {
                emptyText = (
                    <div>
                        {'No ' +
                            topics_order +
                            (category ? ' #' + category : '') +
                            ' posts found'}
                    </div>
                );
            }
        }

        const status = this.props.status
            ? this.props.status.getIn([account || '', category])
            : null;
        const fetching = (status && status.fetching) || this.props.loading;
        const { showSpam } = this.state;

        const topicDiscussions = discussions.get(category || '');

        // If we're at one of the four sort order routes without a tag filter,
        // use the translated string for that sort order, f.ex "trending"
        //
        // If you click on a tag while you're in a sort order route,
        // the title should be the translated string for that sort order
        // plus the tag string, f.ex "trending: blog"
        //
        // Logged-in:
        // At homepage (@user/feed) say "My feed"
        let page_title = 'Posts'; // sensible default here?
        if (category === 'vote') {
            page_title = tt('g.recommended');
        } else if (category === 'feed') {
            if (account === this.props.username)
                page_title = tt('posts_index.my_feed');
            else
                page_title = tt('posts_index.accountnames_feed', {
                    account_name: account,
                });
        } else if (category === 'blog') {
            if (account === this.props.username) page_title = tt('g.my_blog');
            else
                page_title = tt('posts_panel_jsx.accountnames_blog', {
                    account_name: account,
                });
        } else {
            switch (topics_order) {
                case 'trending': // cribbed from Header.jsx where it's repeated 2x already :P
                    page_title = tt('main_menu.trending');
                    break;
                case 'created':
                    page_title = tt('g.new');
                    break;
                case 'hot':
                    page_title = tt('main_menu.hot');
                    break;
                case 'promoted':
                    page_title = tt('g.promoted');
                    break;
            }
            if (typeof category !== 'undefined') {
                page_title = `${page_title}: ${category}`; // maybe todo: localize the colon?
            } else {
                page_title = `${page_title}: ${tt('g.all_tags')}`;
            }
        }
        const layoutClass = this.props.blogmode
            ? ' layout-block'
            : ' layout-list';

        return (
            <div
                className={'row' + (fetching ? ' fetching' : '') + layoutClass}
            >
                <article className="articles">
                    <div className="articles__header row">
                        <div className="small-6 medium-6 large-6 column">
                            <h1 className="articles__h1 show-for-mq-large articles__h1--no-wrap">
                                {page_title}
                            </h1>
                        </div>
                    </div>
                    {category !== 'feed' && (
                        <MarkdownViewer
                            text={tagHeaderMap[category] || tagHeaderMap['']}
                        />
                    )}
                    <hr className="articles__hr" />
                    {!fetching && (posts && !posts.size) ? (
                        <Callout>{emptyText}</Callout>
                    ) : (
                        <PostsList
                            ref="list"
                            posts={posts}
                            loading={fetching}
                            anyPosts={true}
                            category={category}
                            loadMore={this.loadMore}
                            showPinned={false}
                            showSpam={showSpam}
                            promoted={promotedPosts}
                        />
                    )}
                </article>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        return {
            ...ownProps,
            discussions: state.global.get('discussion_idx'),
            status: state.global.get('status'),
            loading: state.app.get('loading'),
            accounts: state.global.get('accounts'),
            username:
                state.user.getIn(['current', 'username']) ||
                state.offchain.get('account'),
            blogmode: state.app.getIn(['user_preferences', 'blogmode']),
            categories: TAG_LIST,
            maybeLoggedIn: state.user.get('maybeLoggedIn'),
            isBrowser: process.env.BROWSER,
            gptEnabled: state.app.getIn(['googleAds', 'gptEnabled']),
            reviveEnabled: state.app.get('reviveEnabled'),
            nightmodeEnabled: state.app.getIn([
                'user_preferences',
                'nightmode',
            ]),
        };
    },
    dispatch => {
        return {
            requestData: args =>
                dispatch(fetchDataSagaActions.requestData(args)),
        };
    }
)(PostPanel);
