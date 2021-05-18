import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { List } from 'immutable';
import _ from 'lodash';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import Icon from 'app/components/elements/Icon';
import Reblog from 'app/components/elements/Reblog';
import resolveRoute from 'app/ResolveRoute';
import Voting from 'app/components/elements/Voting';
import { extractBodySummary, extractImageLink } from 'app/utils/ExtractContent';
import VotesAndComments from 'app/components/elements/VotesAndComments';
import Author from 'app/components/elements/Author';
import Tag from 'app/components/elements/Tag';
import UserNames from 'app/components/elements/UserNames';
import { ifHivemind } from 'app/utils/Community';
import ImageUserBlockList from 'app/utils/ImageUserBlockList';
import { proxifyImageUrl } from 'app/utils/ProxifyUrl';
import Userpic, { SIZE_SMALL } from 'app/components/elements/Userpic';
import { HIVE_SIGNUP_URL, SIGNUP_URL } from 'shared/constants';
import { hasNsfwTag } from 'app/utils/StateFunctions';

const CURATOR_VESTS_THRESHOLD = 1.0 * 1000.0 * 1000.0;

// TODO: document why ` ` => `%20` is needed, and/or move to base fucntion
const proxify = (url, hive, size) =>
    proxifyImageUrl(url, hive, size).replace(/ /g, '%20');

const vote_weights = post => {
    const rshares = post.get('net_rshares');
    const dn = post.getIn(['stats', 'flag_weight']);
    const up = Math.max(String(parseInt(rshares / 2, 10)).length - 10, 0);
    return { dn, up };
};

class PostSummary extends React.Component {
    static propTypes = {
        post: PropTypes.object.isRequired,
        featured: PropTypes.bool,
        featuredOnClose: PropTypes.func,
        onClose: PropTypes.func,
        nsfwPref: PropTypes.string,
        promoted: PropTypes.object,
        interleavePromoted: PropTypes.bool,
    };

    constructor() {
        super();
        this.state = { revealNsfw: false };
        this.onRevealNsfw = this.onRevealNsfw.bind(this);
    }

    componentWillMount() {
        const { post, community, getCommunity } = this.props;
        if (
            ifHivemind(post.get('category')) &&
            !post.has('community_title') &&
            !community
        ) {
            getCommunity(post.get('category'));
        }
    }

    shouldComponentUpdate(props, state) {
        return (
            props.username !== this.props.username ||
            props.nsfwPref !== this.props.nsfwPref ||
            (props.promoted && !props.promoted.equals(this.props.promoted)) ||
            props.blogmode !== this.props.blogmode ||
            state.revealNsfw !== this.state.revealNsfw ||
            props.post != this.props.post ||
            props.community != this.props.community
        );
    }

    onRevealNsfw(e) {
        e.preventDefault();
        this.setState({ revealNsfw: true });
    }

    render() {
        const {
            ignore,
            hideCategory,
            net_vests,
            post,
            community,
            promoted,
            featured,
            featuredOnClose,
            appName,
            appDomain,
            nitrousPostedIcon,
            interleavePromoted,
        } = this.props;
        const { account } = this.props;
        let requestedCategory;
        if (typeof window !== 'undefined') {
            const route = resolveRoute(window.location.pathname);
            if (route.page === 'PostsIndex') {
                requestedCategory = _.get(route, 'params[1]');
            }
        }

        if (!post) return null;

        let reblogged_by;
        if (post.get('reblogged_by', List()).size > 0) {
            reblogged_by = post.get('reblogged_by').toJS();
        }

        if (reblogged_by) {
            reblogged_by = (
                <div className="articles__resteem">
                    <p className="articles__resteem-text">
                        <span className="articles__resteem-icon">
                            <Icon name="reblog" />
                        </span>
                        <UserNames names={reblogged_by} />{' '}
                        {tt('postsummary_jsx.reblogged')}
                    </p>
                </div>
            );
        }

        let crossPostedBy = post.get('cross_posted_by');

        if (crossPostedBy) {
            const crossPostAuthor = post.get('cross_post_author');
            const crossPostPermlink = post.get('cross_post_permlink');
            const crossPostCategory = `/${post.get('cross_post_category', '')}`;

            crossPostedBy = (
                <div className="articles__crosspost">
                    <div className="articles__crosspost-text">
                        <span className="articles__crosspost-icon">
                            <Icon name="cross-post" />
                        </span>
                        <UserNames names={[crossPostedBy]} />{' '}
                        {tt('postsummary_jsx.crossposted')}{' '}
                        <Link
                            to={`${crossPostCategory}/@${crossPostAuthor}/${
                                crossPostPermlink
                            }`}
                        >
                            @{crossPostAuthor}/{crossPostPermlink}
                        </Link>
                    </div>
                </div>
            );
        }

        const gray = post.getIn(['stats', 'gray']);
        const isNsfw = hasNsfwTag(post);
        const isPromoted =
            interleavePromoted &&
            promoted &&
            promoted.contains(`${post.get('author')}/${post.get('permlink')}`);
        const hive = post.get('hive');
        const full_power = post.get('percent_steem_dollars') === 0;
        const app_info = post.get('app') || '';

        const author = post.get('author');
        const permlink = post.get('permlink');
        const category = post.get('category');
        const post_url = category
            ? `/${category}/@${author}/${permlink}`
            : `/@${author}/${permlink}`;
        const isReply = post.get('depth') > 0;
        const showReblog = !isReply;
        const showCommunityLabels = requestedCategory === category;

        let summary;
        if (crossPostedBy) {
            summary = extractBodySummary(post.get('cross_post_body'), isReply);
        } else {
            summary = extractBodySummary(post.get('body'), isReply);
        }

        const content_body = (
            <div className="PostSummary__body entry-content">
                <Link to={post_url}>{summary}</Link>
            </div>
        );

        const content_title = (
            <h2 className="articles__h2 entry-title">
                <Link to={post_url}>
                    {isNsfw && <span className="nsfw-flag">nsfw</span>}
                    {post.get('title')}
                </Link>
                {featured && <span className="PinText">Featured</span>}
            </h2>
        );

        const summaryAuthor = crossPostedBy
            ? post.get('cross_post_author')
            : post.get('author');

        // New Post Summary heading
        const summary_header = (
            <div className="articles__summary-header">
                <div className="user">
                    {!isNsfw ? (
                        <div className="user__col user__col--left">
                            <a
                                className="user__link"
                                href={`/@${summaryAuthor}`}
                            >
                                <Userpic
                                    account={summaryAuthor}
                                    size={SIZE_SMALL}
                                    hive={hive}
                                />
                            </a>
                        </div>
                    ) : null}
                    <div className="user__col user__col--right">
                        <span className="user__name">
                            <Author
                                post={post}
                                follow={false}
                                hive={hive}
                                showAffiliation
                                hideEditor={true}
                                resolveCrossPost
                                showRole={showCommunityLabels}
                            />
                        </span>

                        {hideCategory || (
                            <span className="articles__tag-link">
                                {tt('g.in')}&nbsp;
                                <Tag post={post} community={community} />
                                &nbsp;•&nbsp;
                            </span>
                        )}
                        <Link className="timestamp__link" to={post_url}>
                            <span className="timestamp__time">
                                {this.props.order == 'payout' && (
                                    <span>payout </span>
                                )}
                                <TimeAgoWrapper
                                    date={
                                        this.props.order == 'payout'
                                            ? post.get('cashout_time')
                                            : post.get('created')
                                    }
                                    className="updated"
                                />
                            </span>

                            {nitrousPostedIcon &&
                                app_info.startsWith(
                                    `${appName.toLowerCase()}/`
                                ) && (
                                    <span
                                        className="articles__icon-100"
                                        title={tt('g.written_from', {
                                            app_name: appName,
                                        })}
                                    >
                                        <Icon name={nitrousPostedIcon} />
                                    </span>
                                )}

                            {full_power && (
                                <span
                                    className="articles__icon-100"
                                    title={tt('g.powered_up_100')}
                                >
                                    <Icon name="hivepower" />
                                </span>
                            )}
                            {showCommunityLabels &&
                                post.getIn(['stats', 'is_pinned'], false) && (
                                    <span className="FeaturedTag">Pinned</span>
                                )}
                        </Link>
                        {isPromoted && (
                            <span className="articles__tag-link">
                                &nbsp;•&nbsp;{tt('g.promoted')}
                            </span>
                        )}
                    </div>

                    {featured && (
                        <a
                            onClick={featuredOnClose}
                            className="PinDismiss"
                            title="Dismiss Post"
                        >
                            <Icon name="close" />
                        </a>
                    )}
                </div>
            </div>
        );

        let dots;
        if (net_vests >= CURATOR_VESTS_THRESHOLD) {
            const _dots = cnt => {
                return cnt > 0 ? '•'.repeat(cnt) : null;
            };
            const { up, dn } = vote_weights(post);
            dots =
                up || dn ? (
                    <span className="vote_weights">
                        {_dots(up)}
                        {<span>{_dots(dn)}</span>}
                    </span>
                ) : null;
        }

        const summary_footer = (
            <div className="articles__summary-footer">
                {dots}
                <Voting post={post} showList={false} />
                <VotesAndComments
                    post={post}
                    commentsLink={post_url + '#comments'}
                />
                <span className="PostSummary__time_author_category">
                    {showReblog && (
                        <Reblog
                            author={post.get('author')}
                            permlink={post.get('permlink')}
                            hive={hive}
                        />
                    )}
                </span>
            </div>
        );

        const { nsfwPref, username } = this.props;
        const { revealNsfw } = this.state;

        if (isNsfw) {
            if (nsfwPref === 'hide') {
                // user wishes to hide these posts entirely
                return null;
            } else if (nsfwPref === 'warn' && !revealNsfw) {
                // user wishes to be warned, and has not revealed this post
                return (
                    <article
                        className={'PostSummary hentry'}
                        itemScope
                        itemType="http://schema.org/blogPost"
                    >
                        <div className="PostSummary__nsfw-warning">
                            {summary_header}
                            <span className="nsfw-flag">nsfw</span>&nbsp;&nbsp;
                            <span role="button" onClick={this.onRevealNsfw}>
                                <a>{tt('postsummary_jsx.reveal_it')}</a>
                            </span>{' '}
                            {tt('g.or') + ' '}
                            {username ? (
                                <span>
                                    {tt('postsummary_jsx.adjust_your')}{' '}
                                    <Link to={`/@${username}/settings`}>
                                        {tt(
                                            'postsummary_jsx.display_preferences'
                                        )}
                                    </Link>
                                    .
                                </span>
                            ) : (
                                <span>
                                    <a
                                        href={
                                            hive ? HIVE_SIGNUP_URL : SIGNUP_URL
                                        }
                                    >
                                        {tt(
                                            'postsummary_jsx.create_an_account'
                                        )}
                                    </a>{' '}
                                    {tt(
                                        'postsummary_jsx.to_save_your_preferences'
                                    )}
                                    .
                                </span>
                            )}
                            {summary_footer}
                        </div>
                    </article>
                );
            }
        }

        let image_link = extractImageLink(
            post.get('json_metadata'),
            appDomain,
            hive,
            post.get('body')
        );

        if (crossPostedBy) {
            image_link = extractImageLink(
                post.get('cross_post_json_metadata'),
                appDomain,
                hive,
                post.get('cross_post_body')
            );
        }

        let listImgMedium;
        let listImgLarge;
        if (!image_link && !isReply) {
            image_link = `https://images.hive.blog/u/${author}/avatar`;
            listImgMedium = `https://images.hive.blog/u/${
                author
            }/avatar/medium`;
            listImgLarge = `https://images.hive.blog/u/${author}/avatar/large`;
        } else if (image_link) {
            listImgMedium = proxify(image_link, hive, '256x512');
            listImgLarge = proxify(image_link, hive, '640x480');
        }

        let thumb = null;
        if (!gray && image_link && !ImageUserBlockList.includes(author)) {
            thumb = (
                <span className="articles__feature-img-container">
                    <picture className="articles__feature-img">
                        <source
                            srcSet={listImgMedium}
                            media="(min-width: 1000px)"
                        />
                        <source
                            srcSet={listImgLarge}
                            media="(max-width: 999px)"
                        />
                        <img srcSet={image_link} />
                    </picture>
                </span>
            );
        }

        return (
            <div
                className={
                    'articles__summary' + (isPromoted ? ' promoted' : '')
                }
            >
                {reblogged_by}
                {crossPostedBy}
                {summary_header}
                <div
                    className={
                        'articles__content hentry' +
                        (thumb ? ' with-image ' : ' ') +
                        (gray || ignore ? ' downvoted' : '')
                    }
                    itemScope
                    itemType="http://schema.org/blogPost"
                >
                    {thumb ? (
                        <div className="articles__content-block articles__content-block--img">
                            <Link className="articles__link" to={post_url}>
                                {thumb}
                            </Link>
                        </div>
                    ) : null}
                    <div className="articles__content-block articles__content-block--text">
                        {content_title}
                        {content_body}
                        {this.props.blogmode ? null : (
                            <div className="articles__footer">
                                {summary_footer}
                            </div>
                        )}
                    </div>
                    {this.props.blogmode ? summary_footer : null}
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const { post, hideCategory, nsfwPref } = props;
        const net_vests = state.user.getIn(['current', 'effective_vests'], 0.0);

        const category = post.get('category');
        const community = state.global.getIn(
            ['community', ifHivemind(category)],
            null
        );
        return {
            post,
            community,
            hideCategory,
            username:
                state.user.getIn(['current', 'username']) ||
                state.offchain.get('account'),
            blogmode: state.app.getIn(['user_preferences', 'blogmode']),
            appName: state.app.getIn(['hostConfig', 'APP_NAME']),
            appDomain: state.app.getIn(['hostConfig', 'APP_DOMAIN']),
            nitrousPostedIcon: state.app.getIn([
                'hostConfig',
                'POSTED_VIA_NITROUS_ICON',
            ]),
            interleavePromoted: state.app.getIn(
                ['hostConfig', 'INTERLEAVE_PROMOTED'],
                false
            ),
            nsfwPref,
            net_vests,
        };
    },
    dispatch => ({
        getCommunity: category =>
            dispatch(fetchDataSagaActions.getCommunity(category)),
    })
)(PostSummary);
