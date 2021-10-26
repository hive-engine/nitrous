import { Map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import Icon from 'app/components/elements/Icon';
import { connect } from 'react-redux';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import Voting from 'app/components/elements/Voting';
import Reblog from 'app/components/elements/Reblog';
import MarkdownViewer from 'app/components/cards/MarkdownViewer';
import ReplyEditor from 'app/components/elements/ReplyEditor';
import { extractBodySummary } from 'app/utils/ExtractContent';
import Tag from 'app/components/elements/Tag';
import TagList from 'app/components/elements/TagList';
import Author from 'app/components/elements/Author';
import DMCAList from 'app/utils/DMCAList';
import ShareMenu from 'app/components/elements/ShareMenu';
import MuteButton from 'app/components/elements/MuteButton';
import FlagButton from 'app/components/elements/FlagButton';
import { serverApiRecordEvent } from 'app/utils/ServerApiClient';
import Userpic from 'app/components/elements/Userpic';
import tt from 'counterpart';
import { ifHivemind } from 'app/utils/Community';
import userIllegalContent from 'app/utils/userIllegalContent';
import ImageUserBlockList from 'app/utils/ImageUserBlockList';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import AuthorRecentPosts from '../elements/AuthorRecentPosts';
import { allowDelete } from 'app/utils/StateFunctions';
import { Role } from 'app/utils/Community';
import UserNames from 'app/components/elements/UserNames';
import ContentEditedWrapper from '../elements/ContentEditedWrapper';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';

function TimeAuthorCategory({ post, community, hive }) {
    return (
        <span className="PostFull__time_author_category vcard">
            <Icon name="clock" className="space-right" />
            <TimeAgoWrapper date={post.get('created')} /> {tt('g.in')}{' '}
            <Tag post={post} community={community} /> {tt('g.by')}{' '}
            <Author post={post} showAffiliation hive={hive} />
        </span>
    );
}

function TimeAuthorCategoryLarge({ post, community, hive }) {
    const crossPostedBy = post.get('cross_posted_by');
    let author = post.get('author');
    let created = post.get('created');
    let updated = post.get('updated');

    if (crossPostedBy) {
        author = post.get('cross_post_author');
        created = post.get('cross_post_created');
        updated = post.get('cross_post_updated');
    }

    return (
        <span className="PostFull__time_author_category_large vcard">
            <Userpic account={author} hive={hive} />
            <div className="right-side">
                <Author
                    post={post}
                    showAffiliation
                    resolveCrossPost
                    hive={hive}
                />
                {tt('g.in')} <Tag post={post} community={community} />
                {' • '}
                <TimeAgoWrapper date={created} />{' '}
                <ContentEditedWrapper
                    createDate={created}
                    updateDate={updated}
                />
            </div>
        </span>
    );
}

class PostFull extends React.Component {
    static propTypes = {
        // html props
        /* Show extra options (component is being viewed alone) */
        postref: PropTypes.string.isRequired,
        post: PropTypes.object.isRequired,

        // connector props
        username: PropTypes.string,
        hostConfig: PropTypes.object,
        deletePost: PropTypes.func.isRequired,
        showPromotePost: PropTypes.func.isRequired,
        showExplorePost: PropTypes.func.isRequired,
        togglePinnedPost: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.fbShare = this.fbShare.bind(this);
        this.twitterShare = this.twitterShare.bind(this);
        this.redditShare = this.redditShare.bind(this);
        this.linkedInShare = this.linkedInShare.bind(this);
        this.showExplorePost = this.showExplorePost.bind(this);

        this.onShowReply = () => {
            const { state: { showReply, formId } } = this;
            this.setState({ showReply: !showReply, showEdit: false });
            saveOnShow(formId, !showReply ? 'reply' : null);
        };
        this.onShowEdit = () => {
            const { state: { showEdit, formId } } = this;
            this.setState({ showEdit: !showEdit, showReply: false });
            saveOnShow(formId, !showEdit ? 'edit' : null);
        };
        this.onDeletePost = () => {
            const { deletePost, post } = this.props;
            deletePost(
                post.get('author'),
                post.get('permlink'),
                post.get('hive')
            );
        };
        this.onTribeMute = () => {
            const { username, hostConfig, tribeMute, post } = this.props;
            tribeMute(
                username,
                hostConfig['LIQUID_TOKEN_UPPERCASE'],
                post.get('author'),
                post.get('permlink'),
                !post.get('muted'),
                post.get('hive'),
            );
        };
    }

    componentWillMount() {
        const { postref, post, community, getCommunity } = this.props;
        const formId = `postFull-${postref}`;
        this.setState({
            formId,
            PostFullReplyEditor: ReplyEditor(formId + '-reply'),
            PostFullEditEditor: ReplyEditor(formId + '-edit'),
        });
        if (process.env.BROWSER) {
            let showEditor = localStorage.getItem('showEditor-' + formId);
            if (showEditor) {
                showEditor = JSON.parse(showEditor);
                if (showEditor.type === 'reply') {
                    this.setState({ showReply: true });
                }
                if (showEditor.type === 'edit') {
                    this.setState({ showEdit: true });
                }
            }
        }
        if (
            ifHivemind(post.get('category')) &&
            !post.has('community_title') &&
            !community
        ) {
            getCommunity(post.get('category'));
        }
    }

    fbShare(e) {
        const href = this.share_params.url;
        e.preventDefault();
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${href}`,
            'fbshare',
            'width=600, height=400, scrollbars=no'
        );
        serverApiRecordEvent('FbShare', this.share_params.link);
    }

    twitterShare(e) {
        serverApiRecordEvent('TwitterShare', this.share_params.link);
        e.preventDefault();
        const winWidth = 640;
        const winHeight = 320;
        const winTop = screen.height / 2 - winWidth / 2;
        const winLeft = screen.width / 2 - winHeight / 2;
        const s = this.share_params;
        const q =
            'text=' +
            encodeURIComponent(s.title) +
            '&url=' +
            encodeURIComponent(s.url);
        window.open(
            'http://twitter.com/share?' + q,
            'Share',
            'top=' +
                winTop +
                ',left=' +
                winLeft +
                ',toolbar=0,status=0,width=' +
                winWidth +
                ',height=' +
                winHeight
        );
    }

    redditShare(e) {
        serverApiRecordEvent('RedditShare', this.share_params.link);
        e.preventDefault();
        const s = this.share_params;
        const q =
            'title=' +
            encodeURIComponent(s.title) +
            '&url=' +
            encodeURIComponent(s.url);
        window.open('https://www.reddit.com/submit?' + q, 'Share');
    }

    linkedInShare(e) {
        const { hostConfig } = this.props;
        serverApiRecordEvent('LinkedInShare', this.share_params.link);
        e.preventDefault();
        const winWidth = 720;
        const winHeight = 480;
        const winTop = screen.height / 2 - winWidth / 2;
        const winLeft = screen.width / 2 - winHeight / 2;
        const s = this.share_params;
        const q =
            'title=' +
            encodeURIComponent(s.title) +
            '&url=' +
            encodeURIComponent(s.url) +
            `&source=${hostConfig['APP_NAME']}&mini=true`;
        window.open(
            'https://www.linkedin.com/shareArticle?' + q,
            'Share',
            'top=' +
                winTop +
                ',left=' +
                winLeft +
                ',toolbar=0,status=0,width=' +
                winWidth +
                ',height=' +
                winHeight
        );
    }

    showPromotePost = () => {
        const { post } = this.props;
        if (!post) return;
        const author = post.get('author');
        const permlink = post.get('permlink');
        const hive = post.get('hive');
        this.props.showPromotePost(author, permlink, hive);
    };

    showExplorePost = () => {
        const permlink = this.share_params.link;
        const title = this.share_params.rawtitle;
        this.props.showExplorePost(permlink, title);
    };

    onTogglePin = isPinned => {
        const { community, username, post, postref } = this.props;
        if (!community || !username) console.error('pin fail', this.props);

        const key = ['content', postref, 'stats', 'is_pinned'];
        this.props.stateSet(key, !isPinned);

        const account = post.get('author');
        const permlink = post.get('permlink');
        const hive = post.get('hive');
        this.props.togglePinnedPost(
            !isPinned,
            username,
            community,
            account,
            permlink,
            hive
        );
    };

    render() {
        const {
            props: {
                username,
                post,
                community,
                viewer_role,
                hostConfig,
                tokenAccount,
                muteAccount,
            },
            state: {
                PostFullReplyEditor,
                PostFullEditEditor,
                formId,
                showReply,
                showEdit,
            },
            onShowReply,
            onShowEdit,
            onDeletePost,
            onTribeMute,
        } = this;
        const {
            APP_NAME,
            APP_DOMAIN,
            POSTED_VIA_NITROUS_ICON,
            COMMUNITY_CATEGORY,
            SHOW_AUTHOR_RECENT_POSTS,
        } = hostConfig;
        if (!post) return null;
        const communityName = community ? community.get('name') : null;
        const content = post.toJS();
        const {
            author,
            permlink,
            parent_author,
            parent_permlink,
            community_title,
            cross_posted_by,
            cross_post_author: crossPostAuthor,
            cross_post_permlink: crossPostPermlink,
            cross_post_category: crossPostCategory,
            hive,
        } = content;
        const jsonMetadata = showReply ? null : post.get('json_metadata');
        const link = `/${category}/@${author}/${permlink}`;
        let app_info = post.get('app');

        const { category, title, body } = content;

        let crossPostedBy = cross_posted_by;
        if (crossPostedBy) {
            crossPostedBy = (
                <div className="articles__crosspost">
                    <p className="articles__crosspost-text">
                        <span className="articles__crosspost-icon">
                            <Icon name="cross-post" />
                        </span>
                        <UserNames names={[author]} />{' '}
                        {tt('postsummary_jsx.crossposted')}{' '}
                        <Link
                            to={`/${crossPostCategory}/@${crossPostAuthor}/${
                                crossPostPermlink
                            }`}
                        >
                            this post
                        </Link>{' '}
                        {tt('g.in')}{' '}
                        <Link to={`/created/${communityName}`}>
                            {community_title}
                        </Link>{' '}
                        <TimeAgoWrapper date={post.get('created')} />
                    </p>
                    <hr />
                </div>
            );
        }

        if (process.env.BROWSER && title)
            document.title = title + ' — ' + APP_NAME;

        let content_body = crossPostedBy
            ? post.get('cross_post_body')
            : post.get('body');
        const bDMCAStop = DMCAList.includes(link);
        const bIllegalContentUser = userIllegalContent.includes(author);
        if (bDMCAStop) {
            content_body = tt(
                'postfull_jsx.this_post_is_not_available_due_to_a_copyright_claim'
            );
        }
        // detect illegal users
        if (bIllegalContentUser) {
            content_body = 'Not available for legal reasons.';
        }

        // TODO: get global loading state
        //loading = !bIllegalContentUser && !bDMCAStop && partial data loaded;
        const bShowLoading = !post || post.get('body').length < post.get('body_length');

        // hide images if user is on blacklist
        const hideImages = ImageUserBlockList.includes(author);

        const replyParams = {
            author,
            permlink,
            parent_author,
            parent_permlink:
                post.get('depth') == 0 ? post.get('category') : parent_permlink,
            category,
            title,
            body: post.get('body'),
            hive,
        };

        this.share_params = {
            link,
            url: 'https://' + APP_DOMAIN + link,
            rawtitle: title,
            title: title + ' — ' + APP_NAME,
            desc: extractBodySummary(post.get('body')),
        };

        const share_menu = [
            {
                onClick: this.fbShare,
                title: tt('postfull_jsx.share_on_facebook'),
                icon: 'facebook',
            },
            {
                onClick: this.twitterShare,
                title: tt('postfull_jsx.share_on_twitter'),
                icon: 'twitter',
            },
            {
                onClick: this.redditShare,
                title: tt('postfull_jsx.share_on_reddit'),
                icon: 'reddit',
            },
            {
                onClick: this.linkedInShare,
                title: tt('postfull_jsx.share_on_linkedin'),
                icon: 'linkedin',
            },
        ];

        const Editor = this.state.showReply
            ? PostFullReplyEditor
            : PostFullEditEditor;
        let renderedEditor = null;
        if (showReply || showEdit) {
            const editJson = showReply ? null : post.get('json_metadata');
            renderedEditor = (
                <div key="editor">
                    <Editor
                        {...replyParams}
                        type={this.state.showReply ? 'submit_comment' : 'edit'}
                        successCallback={() => {
                            this.setState({
                                showReply: false,
                                showEdit: false,
                            });
                            saveOnShow(formId, null);
                        }}
                        onCancel={() => {
                            this.setState({
                                showReply: false,
                                showEdit: false,
                            });
                            saveOnShow(formId, null);
                        }}
                        jsonMetadata={editJson}
                    />
                </div>
            );
        }
        const high_quality_post = post.get('payout') > 10.0;
        const full_power = post.get('percent_steem_dollars') === 0;
        const isReply = post.get('depth') > 0;

        let post_header = (
            <div>
                {crossPostedBy}
                <h1 className="entry-title">
                    {content.title}
                    {POSTED_VIA_NITROUS_ICON &&
                        app_info &&
                        app_info.startsWith(`${APP_NAME.toLowerCase()}/`) && (
                            <span
                                className="articles__icon-100"
                                title={tt('g.written_from', {
                                    app_name: APP_NAME,
                                })}
                            >
                                <Icon name={POSTED_VIA_NITROUS_ICON} />
                            </span>
                        )}
                    {full_power && (
                        <span title={tt('g.powered_up_100')}>
                            <Icon name={hive ? 'hive' : 'steempower'} />
                        </span>
                    )}
                </h1>
            </div>
        );

        if (isReply) {
            const rooturl = post.get('url');
            const prnturl = `/${category}/@${parent_author}/${parent_permlink}`;
            post_header = (
                <div className="callout">
                    <div>
                        {tt(
                            'postfull_jsx.you_are_viewing_a_single_comments_thread_from'
                        )}:
                    </div>
                    <h4>{post.get('title')}</h4>
                    <ul>
                        <li>
                            <Link to={rooturl}>
                                {tt('postfull_jsx.view_the_full_context')}
                            </Link>
                        </li>
                        {post.get('depth') > 1 && (
                            <li>
                                <Link to={prnturl}>
                                    {tt('postfull_jsx.view_the_direct_parent')}
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            );
        }

        const allowReply = Role.canComment(communityName, viewer_role);
        const canReblog = !isReply;
        const canPromote = !post.get('is_paidout') && !isReply;
        const canPin =
            post.get('depth') == 0 && Role.atLeast(viewer_role, 'mod');
        const canMute = username && Role.atLeast(viewer_role, 'mod');
        const canFlag =
            username && community && Role.atLeast(viewer_role, 'guest');
        const canReply = allowReply && post.get('depth') < 255;
        const canEdit = username === author && !showEdit;
        const canDelete = username === author && allowDelete(post);
        const canTribeMute = (tokenAccount && username === tokenAccount) || (muteAccount && username === muteAccount);

        const isPinned = post.getIn(['stats', 'is_pinned'], false);

        const isPreViewCount = Date.parse(post.get('created')) < 1480723200000; // check if post was created before view-count tracking began (2016-12-03)
        let contentBody;

        if (bShowLoading) {
            contentBody = <LoadingIndicator type="circle-strong" />;
        } else {
            contentBody = (
                <MarkdownViewer
                    formId={formId + '-viewer'}
                    text={content_body}
                    large
                    highQualityPost={high_quality_post}
                    noImage={post.getIn(['stats', 'gray'])}
                    hideImages={hideImages}
                />
            );
        }

        return (
            <div>
                <article
                    className="PostFull hentry"
                    itemScope
                    itemType="http://schema.org/Blog"
                >
                    {canFlag && <FlagButton post={post} />}
                    {showEdit ? (
                        renderedEditor
                    ) : (
                        <span>
                            <div className="PostFull__header">
                                {post_header}
                                <TimeAuthorCategoryLarge
                                    post={post}
                                    community={community}
                                    hive={hive}
                                />
                            </div>
                            <div className="PostFull__body entry-content">
                                {contentBody}
                            </div>
                            {SHOW_AUTHOR_RECENT_POSTS && (
                                <AuthorRecentPosts
                                    author={author}
                                    permlink={permlink}
                                />
                            )}
                        </span>
                    )}

                    {canPromote &&
                        username && (
                            <button
                                className="Promote__button float-right button hollow tiny"
                                onClick={this.showPromotePost}
                            >
                                {tt('g.promote')}
                            </button>
                        )}
                    {!isReply && (
                        <TagList
                            post={post}
                            hiveTag={COMMUNITY_CATEGORY}
                            appName={APP_NAME}
                        />
                    )}
                    <div className="PostFull__footer row">
                        <div className="columns medium-12 large-9">
                            <TimeAuthorCategory
                                post={post}
                                community={community}
                                hive={hive}
                            />
                            <Voting post={post} />
                        </div>
                        <div className="RightShare__Menu small-11 medium-12 large-3 columns">
                            {canReblog && (
                                <Reblog
                                    author={author}
                                    permlink={permlink}
                                    hive={hive}
                                />
                            )}
                            <span className="PostFull__reply">
                                {/* all */}
                                {canReply && (
                                    <a onClick={onShowReply}>{tt('g.reply')}</a>
                                )}{' '}
                                {/* mods */}
                                {canPin && (
                                    <a
                                        onClick={() =>
                                            this.onTogglePin(isPinned)
                                        }
                                    >
                                        {isPinned ? tt('g.unpin') : tt('g.pin')}
                                    </a>
                                )}{' '}
                                {canMute && <MuteButton post={post} />}{' '}
                                {/* owner */}
                                {canEdit && (
                                    <a onClick={onShowEdit}>{tt('g.edit')}</a>
                                )}{' '}
                                {canDelete && (
                                    <a onClick={onDeletePost}>
                                        {tt('g.delete')}
                                    </a>
                                )}
                                {canTribeMute && (
                                    <a onClick={onTribeMute}>
                                        Tribe-{ post.get('muted') ? 'Unmute' : 'Mute' }
                                    </a>
                                )}
                            </span>
                            <span className="PostFull__responses">
                                <Link
                                    to={link}
                                    title={tt('g.responses', {
                                        count: post.get('children'),
                                    })}
                                >
                                    <Icon
                                        name="chatboxes"
                                        className="space-right"
                                    />
                                    {post.get('children')}
                                </Link>
                            </span>
                            <ShareMenu menu={share_menu} />
                            <button
                                className="explore-post"
                                title={tt('g.share_this_post')}
                                onClick={this.showExplorePost}
                            >
                                <Icon name="link" className="chain-right" />
                            </button>
                        </div>
                        {crossPostedBy && (
                            <div className="PostFull__crosspost-footer columns large-12">
                                <Link
                                    className="button"
                                    to={`/${crossPostCategory}/@${
                                        crossPostAuthor
                                    }/${crossPostPermlink}`}
                                >
                                    Browse to the original post by @{
                                        crossPostAuthor
                                    }
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="row comment-editor">
                        <div className="column large-12 medium-10 small-12">
                            {showReply && renderedEditor}
                        </div>
                    </div>
                </article>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const postref = ownProps.post;
        const post = ownProps.cont.get(postref);

        const category = post.get('category');
        const community = state.global.getIn(['community', category]);
        const tokenAccount = state.app.getIn(['scotConfig', 'config', 'token_account']);
        const muteAccount = state.app.getIn(['scotConfig', 'config', 'muting_account']);

        return {
            hostConfig: state.app.get('hostConfig', Map()).toJS(),
            post,
            postref,
            community,
            username: state.user.getIn(['current', 'username']),
            viewer_role: state.global.getIn(
                ['community', community, 'context', 'role'],
                'guest'
            ),
            tokenAccount,
            muteAccount,
        };
    },
    dispatch => ({
        deletePost: (author, permlink, hive) => {
            dispatch(
                transactionActions.broadcastOperation({
                    type: 'delete_comment',
                    operation: { author, permlink },
                    confirm: tt('g.are_you_sure'),
                    useHive: hive,
                })
            );
        },
        tribeMute: (username, token, author, permlink, mute, hive) => {
            dispatch(
                transactionActions.broadcastOperation({
                    type: 'custom_json',
                    operation: {
                        id: 'scot_mute_post',
                        required_posting_auths: [username],
                        json: JSON.stringify({
                            token,
                            authorperm: `@${author}/${permlink}`,
                            mute,
                        }),
                    },
                    confirm: tt('g.are_you_sure'),
                    useHive: hive,
                })
            );
        },
        stateSet: (key, value) => {
            dispatch(globalActions.set({ key, value }));
        },
        showPromotePost: (author, permlink, hive) => {
            dispatch(
                globalActions.showDialog({
                    name: 'promotePost',
                    params: { author, permlink, hive },
                })
            );
        },
        showExplorePost: (permlink, title) => {
            dispatch(
                globalActions.showDialog({
                    name: 'explorePost',
                    params: { permlink, title },
                })
            );
        },
        togglePinnedPost: (
            pinPost,
            username,
            community,
            account,
            permlink,
            successCallback,
            errorCallback,
            hive
        ) => {
            let action = 'unpinPost';
            if (pinPost) action = 'pinPost';

            const payload = [
                action,
                {
                    community: community.get('name'),
                    account,
                    permlink,
                },
            ];

            return dispatch(
                transactionActions.broadcastOperation({
                    type: 'custom_json',
                    operation: {
                        id: 'community',
                        required_posting_auths: [username],
                        json: JSON.stringify(payload),
                    },
                    successCallback,
                    errorCallback,
                    useHive: hive,
                })
            );
        },
        getCommunity: category =>
            dispatch(fetchDataSagaActions.getCommunity(category)),
    })
)(PostFull);

const saveOnShow = (formId, type) => {
    if (process.env.BROWSER) {
        if (type)
            localStorage.setItem(
                'showEditor-' + formId,
                JSON.stringify({ type }, null, 0)
            );
        else {
            localStorage.removeItem('showEditor-' + formId);
            localStorage.removeItem('replyEditorData-' + formId + '-reply');
            localStorage.removeItem('replyEditorData-' + formId + '-edit');
        }
    }
};
