import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import Comment from 'app/components/cards/Comment';
import PostFull from 'app/components/cards/PostFull';
import NotFoundMessage from 'app/components/cards/NotFoundMessage';
import { parseJsonTags } from 'app/utils/StateFunctions';
import { sortComments } from 'app/components/cards/Comment';
import DropdownMenu from 'app/components/elements/DropdownMenu';
import { serverApiRecordEvent } from 'app/utils/ServerApiClient';
import { HIVE_SIGNUP_URL, SIGNUP_URL } from 'shared/constants';
import GptAd from 'app/components/elements/GptAd';
import ReviveAd from 'app/components/elements/ReviveAd';
import { isLoggedIn } from 'app/utils/UserUtil';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';

function isEmptyPost(post) {
    // check if the post doesn't exist
    // !dis may be enough but keep 'created' & 'body' test for potential compat
    return (
        !post ||
        (post.get('created') === '1970-01-01T00:00:00' &&
            post.get('body') === '')
    );
}

class Post extends React.Component {
    static propTypes = {
        post: PropTypes.string,
        content: PropTypes.object.isRequired,
        dis: PropTypes.object,
        sortOrder: PropTypes.string,
        scotTokenSymbol: PropTypes.string,
        loading: PropTypes.bool,
    };
    constructor() {
        super();
        this.state = {
            showNegativeComments: false,
        };
    }

    toggleNegativeReplies = e => {
        this.setState({
            showNegativeComments: !this.state.showNegativeComments,
        });
        e.preventDefault();
    };

    showSignUp = () => {
        window.location = this.props.preferHive ? HIVE_SIGNUP_URL : SIGNUP_URL;
    };

    onHideComment = () => {
        this.setState({ commentHidden: true });
    };

    showAnywayClick = () => {
        this.setState({ showAnyway: true });
    };

    render() {
        const { showSignUp } = this;
        const {
            content,
            sortOrder,
            appDomain,
            scotTokenSymbol,
            post,
            dis,
            loading,
        } = this.props;
        const { showNegativeComments, commentHidden, showAnyway } = this.state;

        if (!content) {
            if (loading) {
                return (
                    <center>
                        <LoadingIndicator type="circle" />
                    </center>
                );
            } else if (isEmptyPost(dis)) {
                return <NotFoundMessage />;
            }
        }

        const gptTags = parseJsonTags(dis);

        // A post should be hidden if it is not special, is not told to "show
        // anyway", and is designated "gray".
        let postBody;
        const special = dis.get('special');
        if (!special && !showAnyway && dis.getIn(['stats', 'gray'], false)) {
            postBody = (
                <div className="Post">
                    <div className="row">
                        <div className="column">
                            <div className="PostFull">
                                <p onClick={this.showAnywayClick}>
                                    {tt(
                                        'promote_post_jsx.this_post_was_hidden_due_to_low_ratings'
                                    )}.{' '}
                                    <button
                                        style={{ marginBottom: 0 }}
                                        className="button hollow tiny float-right"
                                        onClick={this.showAnywayClick}
                                    >
                                        {tt('g.show')}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            postBody = <PostFull post={post} cont={content} />;
        }

        let replies = dis
            .get('replies')
            .toJS()
            .filter(c => content.get(c));

        sortComments(content, replies, sortOrder, scotTokenSymbol);

        // Don't render too many comments on server-side
        const commentLimit = 100;
        if (global.process !== undefined && replies.length > commentLimit) {
            replies = replies.slice(0, commentLimit);
        }
        let commentCount = 0;
        const positiveComments = replies.map(reply => {
            commentCount++;
            const showAd =
                commentCount % 5 === 0 &&
                commentCount !== replies.length &&
                commentCount !== commentLimit;

            return (
                <div key={post + reply}>
                    <Comment
                        postref={reply}
                        cont={content}
                        sort_order={sortOrder}
                        showNegativeComments={showNegativeComments}
                        onHide={this.onHideComment}
                    />

                    {this.props.gptEnabled && showAd ? (
                        <div className="Post_footer__ad">
                            <GptAd
                                tags={gptTags}
                                type="Freestar"
                                id="bsa-zone_1566494240874-7_123456"
                            />
                        </div>
                    ) : null}
                    {this.props.reviveEnabled && showAd ? (
                        <div className="Post_footer__ad">
                            <ReviveAd adKey="feed_small" />
                        </div>
                    ) : null}
                </div>
            );
        });

        const negativeGroup = commentHidden && (
            <div className="hentry Comment root Comment__negative_group">
                <p>
                    {showNegativeComments
                        ? tt('post_jsx.now_showing_comments_with_low_ratings')
                        : tt(
                              'post_jsx.comments_were_hidden_due_to_low_ratings'
                          )}.{' '}
                    <button
                        className="button hollow tiny float-right"
                        onClick={e => this.toggleNegativeReplies(e)}
                    >
                        {showNegativeComments ? tt('g.hide') : tt('g.show')}
                    </button>
                </p>
            </div>
        );

        const sort_orders = ['trending', 'votes', 'new'];
        const sort_labels = [
            tt('post_jsx.comment_sort_order.trending'),
            tt('post_jsx.comment_sort_order.votes'),
            tt('post_jsx.comment_sort_order.age'),
        ];
        const sort_menu = [];
        let sort_label;
        const selflink = `/${dis.get('category')}/@${post}`;
        for (let o = 0; o < sort_orders.length; ++o) {
            if (sort_orders[o] == sortOrder) sort_label = sort_labels[o];
            sort_menu.push({
                value: sort_orders[o],
                label: sort_labels[o],
                link: selflink + '?sort=' + sort_orders[o] + '#comments',
            });
        }

        return (
            <div className="Post">
                <div className="row">
                    <div className="column">{postBody}</div>
                </div>
                {false &&
                    !isLoggedIn() && (
                        <div className="row">
                            <div className="column">
                                <div className="Post__promo">
                                    {tt(
                                        'g.next_7_strings_single_block.authors_get_paid_when_people_like_you_upvote_their_post'
                                    )}.
                                    <br />
                                    {tt(
                                        'g.next_7_strings_single_block.if_you_enjoyed_what_you_read_earn_amount'
                                    )}
                                    <br />
                                    <button
                                        type="button"
                                        className="button e-btn"
                                        onClick={showSignUp}
                                    >
                                        {tt('loginform_jsx.sign_up_get_hive')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                {this.props.gptEnabled && commentCount >= 5 ? (
                    <div className="Post_footer__ad">
                        <GptAd
                            tags={gptTags}
                            type="Freestar"
                            id="bsa-zone_1566494147292-7_123456"
                        />
                    </div>
                ) : null}
                {this.props.reviveEnabled ? (
                    <div className="Post_footer__ad">
                        <ReviveAd adKey="feed_small" />
                    </div>
                ) : null}

                <div id="#comments" className="Post_comments row hfeed">
                    <div className="column large-12">
                        <div className="Post_comments__content">
                            {positiveComments.length ? (
                                <div className="Post__comments_sort_order float-right">
                                    {tt('post_jsx.sort_order')}: &nbsp;
                                    <DropdownMenu
                                        items={sort_menu}
                                        el="li"
                                        selected={sort_label}
                                        position="left"
                                    />
                                </div>
                            ) : null}
                            {positiveComments}
                            {negativeGroup}
                        </div>
                    </div>
                </div>
                {this.props.gptEnabled ? (
                    <div className="Post_footer__ad">
                        <GptAd
                            tags={gptTags}
                            type="Freestar"
                            id="bsa-zone_1566494371533-0_123456"
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

export default connect((state, ownProps) => {
    const currLocation = ownProps.router.getCurrentLocation();
    const { username, slug } = ownProps.routeParams;
    const post = username + '/' + slug;
    const content = state.global.get('content');
    const dis = content.get(post);

    return {
        post,
        content,
        dis,
        sortOrder: currLocation.query.sort || 'trending',
        gptEnabled: state.app.getIn(['googleAds', 'gptEnabled']),
        reviveEnabled: state.app.get('reviveEnabled'),
        scotTokenSymbol: state.app.getIn([
            'hostConfig',
            'LIQUID_TOKEN_UPPERCASE',
        ]),
        appDomain: state.app.getIn(['hostConfig', 'APP_DOMAIN']),
        loading: state.app.get('loading'),
    };
})(Post);
