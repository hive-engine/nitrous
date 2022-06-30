/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List, Map, OrderedMap } from 'immutable';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import PostsList from 'app/components/cards/PostsList';
import { isFetchingOrRecentlyUpdated } from 'app/utils/StateFunctions';
import Callout from 'app/components/elements/Callout';
import SidebarLinks from 'app/components/elements/SidebarLinks';
import { GptUtils } from 'app/utils/GptUtils';
import GptAd from 'app/components/elements/GptAd';
import Topics from './Topics';
import SortOrder from 'app/components/elements/SortOrder';
import { PROMOTED_POST_PAD_SIZE } from 'shared/constants';
import tagHeaderMap from 'app/utils/TagFeedHeaderMap';
import MarkdownViewer from 'app/components/cards/MarkdownViewer';
import { ifHivemind } from 'app/utils/Community';
import PostsIndexLayout from 'app/components/pages/PostsIndexLayout';

// posts_index.empty_feed_1 [-5]
const noFriendsText = (
    <div>
        You haven't followed anyone yet!<br />
        <br />
        <span style={{ fontSize: '1.1rem' }}>
            <Link to="/">Explore Trending</Link>
        </span>
        <br />
    </div>
);

const noCommunitiesText = (
    <div>
        You haven't joined any active communities yet!<br />
        <br />
        <span style={{ fontSize: '1.1rem' }}>
            <Link to="/communities">Explore Communities</Link>
        </span>
        {/*
        <br /><br />
        <Link to="/welcome">New users guide</Link>*/}
    </div>
);

class PostsIndex extends React.Component {
    static propTypes = {
        posts: PropTypes.object,
        status: PropTypes.object,
        routeParams: PropTypes.object,
        requestData: PropTypes.func,
        loading: PropTypes.bool,
        username: PropTypes.string,
        blogmode: PropTypes.bool,
        interleavePromoted: PropTypes.bool,
        topics: PropTypes.object,
    };

    constructor() {
        super();
        this.state = {};
        this.loadMore = this.loadMore.bind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'PostsIndex');
    }

    componentWillMount() {
        const {
            category,
            community,
            subscriptions,
            username,
            categories,
            getSubscriptions,
            getCommunity,
            getCategories,
        } = this.props;
        if (!subscriptions && username) getSubscriptions(username);
        if (ifHivemind(category) && !community) {
            getCommunity(category);
        }
        if (!categories) getCategories();
    }

    componentDidUpdate(prevProps) {
        if (
            window.innerHeight &&
            window.innerHeight > 3000 &&
            prevProps.posts !== this.props.posts
        ) {
            this.refs.list.fetchIfNeeded();
        }
    }

    getPosts() {
        const {
            order,
            pinned,
            posts,
            promotedPosts,
            interleavePromoted,
        } = this.props;
        const pinnedPosts = pinned
            ? pinned.has('pinned_posts')
              ? pinned.get('pinned_posts').toJS()
              : []
            : [];
        if (interleavePromoted && (order === 'trending' || order === 'hot')) {
            let promotedDiscussions = promotedPosts;
            if (promotedDiscussions && promotedDiscussions.size > 0 && posts) {
                const processed = new Set(
                    pinnedPosts.map(p => `${p.author}/${p.permlink}`)
                ); // mutable
                const interleaved = [];
                const promoted = [];
                let promotedIndex = 0;
                for (let i = 0; i < posts.size; i++) {
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
                    const nextDiscussion = posts.get(i);
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
        return { posts: posts || List(), promotedPosts: List() };
    }

    loadMore() {
        const last_post = this.props.posts ? this.props.posts.last() : null;
        if (!last_post) return;
        if (last_post == this.props.pending) return; // if last post is 'pending', its an invalid start token
        const { username, status, order, category } = this.props;

        if (isFetchingOrRecentlyUpdated(status, order, category)) return;

        const [author, permlink] = last_post.split('/');
        this.props.requestData({
            author,
            permlink,
            order,
            category,
            observer: username,
            useHive: this.props.preferHive,
        });
    }

    searchCategories(cat, parent, categories) {
        if (!cat || !categories) return { par: parent, cats: categories, found: false };

        // leaf nodes
        if (List.isList(categories)) {
            if (categories.includes(cat))
                return { par: parent, cats: categories, found: true };
            else return { par: parent, cats: null, found: false };
        } else {
            for (const c of categories.keys()) {
                const v = categories.get(c);
                if (cat === c && v !== null && !v.isEmpty()) {
                    return { par: parent, cats: v, found: true };
                } else {
                    const { par, cats, found } = this.searchCategories(
                        cat,
                        c,
                        v
                    );
                    if (cats !== null && !cats.isEmpty()) {
                        return { par, cats, found };
                    }
                }
            }
            return { par: parent, cats: null, found: false };
        }
    }

    buildCategories(cat, parent, categories) {
        if (!categories) return this.props.categories;

        if (!cat) {
            return categories;
        } else {
            let cats = OrderedMap();
            if (categories.includes(cat)) cats = categories;
            else cats = cats.set(cat, categories);
            if (parent !== null) {
                const children = cats;
                cats = OrderedMap();
                cats = cats.set(parent, children);
            }
            return cats;
        }
    }

    render() {
        const {
            topics,
            subscriptions,
            enableAds,
            community,
            category,
            account_name, // TODO: for feed
            order,
            pinned,
            username,
        } = this.props;

        const { par, cats, found } = this.searchCategories(
            category,
            null,
            this.props.categories
        );
        const categories = this.buildCategories(category, par, cats);
        const max_levels = category && found ? 3 : 2;

        const status = this.props.status
            ? this.props.status.getIn([category || '', order])
            : null;
        let fetching = (status && status.fetching) || this.props.loading;

        const processedPosts = this.getPosts();
        const posts = processedPosts.posts;
        const promotedPosts = processedPosts.promotedPosts;

        let emptyText = '';
        if (order === 'feed') {
            emptyText = noFriendsText;
        } else if (category === 'my') {
            if (!process.env.BROWSER) {
                fetching = true;
            } else {
                emptyText = noCommunitiesText;
            }
        } else if (posts.size === 0) {
            const cat = community
                ? 'community' //community.get('title')
                : category ? ' #' + category : '';

            if (order == 'payout')
                emptyText = `No pending ${
                    cat
                } posts found. This view only shows posts within 12 - 36 hours of payout.`;
            else if (order == 'created') emptyText = `No posts in ${cat} yet!`;
            else emptyText = `No ${order} ${cat} posts found.`;
        } else {
            emptyText = 'Nothing here to see...';
        }

        // page title
        let page_title = tt('g.all_tags');
        if (order === 'feed') {
            if (account_name === this.props.username)
                page_title = 'My friends' || tt('posts_index.my_feed');
            else
                //page_title = tt('posts_index.accountnames_feed', {
                //    account_name,
                //});
                //page_title = '@' + account_name + "'s friends"
                page_title = 'My friends';
        } else if (category === 'my') {
            page_title = 'My communities';
        } else if (community) {
            page_title = community.get('title');
        } else if (category) {
            page_title = '#' + category;
        }

        let postsIndexDisplay = (
            <PostsList
                ref="list"
                post_refs={posts}
                promoted={promotedPosts}
                loading={fetching}
                order={order}
                category={category}
                hideCategory={!!community}
                loadMore={this.loadMore}
            />
        );

        if (!fetching && !posts.size) {
            postsIndexDisplay = <Callout>{emptyText}</Callout>;
        }
        if (!username && posts.size && category === 'my') {
            postsIndexDisplay = <Callout>{emptyText}</Callout>;
        }
        if (order === 'feed' && !username && !posts.size) {
            postsIndexDisplay = <Callout>{emptyText}</Callout>;
        }

        return (
            <PostsIndexLayout
                order={order}
                categories={categories}
                max_levels={max_levels}
                category={category}
                enableAds={enableAds}
                blogmode={this.props.blogmode}
            >
                {order !== 'feed' && (
                    <div className="tag-feed-header row">
                        <div className="column">
                            <MarkdownViewer
                                text={
                                    tagHeaderMap[category] || tagHeaderMap['']
                                }
                            />
                        </div>
                    </div>
                )}
                <div className="articles__header row">
                    <div className="small-8 medium-7 large-8 column">
                        <h1 className="articles__h1 show-for-mq-large articles__h1--no-wrap">
                            {page_title}
                        </h1>
                        <div className="show-for-mq-large">
                            {community && (
                                <div
                                    style={{
                                        fontSize: '80%',
                                        color: 'gray',
                                    }}
                                >
                                    Community
                                </div>
                            )}
                            {!community &&
                                category &&
                                order !== 'feed' &&
                                category !== 'my' && (
                                    <div
                                        style={{
                                            fontSize: '80%',
                                            color: 'gray',
                                        }}
                                    >
                                        Unmoderated tag
                                    </div>
                                )}
                        </div>

                        <span className="hide-for-mq-large articles__header-select">
                            <Topics
                                username={this.props.username}
                                current={category}
                                topics={topics}
                                subscriptions={subscriptions}
                                compact
                                order={order}
                                categories={categories}
                                levels={max_levels}
                            />
                        </span>
                    </div>
                    {order != 'feed' &&
                        !(category === 'my' && !posts.size) && (
                            <div className="small-4 medium-5 large-4 column articles__header-select">
                                <SortOrder
                                    sortOrder={order}
                                    topic={category}
                                    horizontal={false}
                                />
                            </div>
                        )}
                </div>
                <hr className="articles__hr" />
                {postsIndexDisplay}
            </PostsIndexLayout>
        );
    }
}

module.exports = {
    path: ':order(/:category)',
    component: connect(
        (state, ownProps) => {
            const hostConfig = state.app.get('hostConfig', Map());
            const preferHive = hostConfig.get('PREFER_HIVE');
            // route can be e.g. trending/food (order/category);
            //   or, @username/feed (category/order). Branch on presence of `@`.
            const route = ownProps.routeParams;
            const account_name =
                route.order && route.order[0] == '@'
                    ? route.order.slice(1).toLowerCase()
                    : null;
            const category = account_name
                ? route.order
                : route.category ? route.category.toLowerCase() : null;
            const order = account_name
                ? route.category
                : route.order || (hostConfig.get('DEFAULT_URL', '/trending').split('/')[1]);

            const hive = ifHivemind(category);
            const community = state.global.getIn(['community', hive], null);

            const enableAds =
                ownProps.gptEnabled &&
                !GptUtils.HasBannedTags(
                    [category],
                    state.app.getIn(['googleAds', 'gptBannedTags'])
                );

            const key = ['discussion_idx', category || '', order];
            let posts = state.global.getIn(key, List());
            const promotedKey = ['discussion_idx', category || '', 'promoted'];
            const promotedPosts = state.global.getIn(promotedKey, List());

            // if 'pending' post is found, prepend it to posts list
            //   (see GlobalReducer RECEIVE_CONTENT)
            const pkey = ['discussion_idx', category || '', '_' + order];
            const pending = state.global.getIn(pkey, null);
            if (pending && !posts.includes(pending)) {
                posts = posts.unshift(pending);
            }
            const username =
                state.user.getIn(['current', 'username']) ||
                state.offchain.get('account');

            return {
                subscriptions: state.global.getIn(['subscriptions', username]),
                status: state.global.get('status'),
                loading: state.app.get('loading'),
                account_name,
                category,
                order,
                posts,
                promotedPosts,
                pending,
                community,
                username,
                blogmode: state.app.getIn(['user_preferences', 'blogmode']),
                topics: state.global.getIn(['topics'], List()),
                categories: state.global.get('categories'),
                pinned: state.offchain.get('pinned_posts'),
                isBrowser: process.env.BROWSER,
                gptEnabled: state.app.getIn(['googleAds', 'gptEnabled']),
                interleavePromoted: hostConfig.get(
                    'INTERLEAVE_PROMOTED',
                    false
                ),
                preferHive,
                enableAds,
            };
        },
        dispatch => ({
            getSubscriptions: account =>
                dispatch(fetchDataSagaActions.getSubscriptions(account)),
            requestData: args =>
                dispatch(fetchDataSagaActions.requestData(args)),
            getCommunity: category =>
                dispatch(fetchDataSagaActions.getCommunity(category)),
            getCategories: () =>
                dispatch(fetchDataSagaActions.getCategories()),
        })
    )(PostsIndex),
};
