/* eslint react/prop-types: 0 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List } from 'immutable';
import ReactDOM, { findDOMNode } from 'react-dom';
import Overlay from 'react-overlays/lib/Overlay';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import Icon from 'app/components/elements/Icon';
import Reputation from 'app/components/elements/Reputation';
import { affiliationFromStake } from 'app/utils/AffiliationMap';
import UserTitle from 'app/components/elements/UserTitle';
import AuthorDropdown from '../AuthorDropdown';
import { actions as fetchActions } from 'app/redux/FetchDataSaga';

const { string, bool, number } = PropTypes;

const closers = [];

const fnCloseAll = () => {
    let close;
    while ((close = closers.shift())) {
        close();
    }
};

class Author extends React.Component {
    static propTypes = {
        author: string.isRequired,
        hideEditor: bool,
        follow: bool,
        mute: bool,
        authorRep: number,
        showAffiliation: bool,
        role: string,
        title: string,
        community: string,
        crossPostedBy: string,
        crossPostAuthor: string,
        resolveCrossPost: bool,
        showRole: bool,
    };
    static defaultProps = {
        follow: true,
        mute: true,
        showAffiliation: false,
        role: '',
        title: '',
        community: '',
        crossPostedBy: null,
        crossPostAuthor: null,
        resolveCrossPost: true,
    };

    constructor(...args) {
        super(...args);
        this.state = { show: false };
        this.toggle = this.toggle.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillMount() {
        const { stakedAccounts, getStakedAccounts } = this.props;
        if (!stakedAccounts) {
            getStakedAccounts();
        }
    }

    componentDidMount() {
        const { stakedAccounts, getStakedAccounts } = this.props;
        if (!stakedAccounts) {
            getStakedAccounts();
        }
        if (!this.authorProfileLink) {
            return;
        }
        const node = ReactDOM.findDOMNode(this.authorProfileLink);
        if (node.addEventListener) {
            node.addEventListener('click', this.toggle, false);
        } else {
            node.attachEvent('click', this.toggle, false);
        }
    }

    componentWillUnmount() {
        if (!this.authorProfileLink) {
            return;
        }
        const node = ReactDOM.findDOMNode(this.authorProfileLink);
        if (node.removeEventListener) {
            node.removeEventListener('click', this.toggle);
        } else {
            node.detachEvent('click', this.toggle);
        }
    }

    toggle = e => {
        if (!(e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            e.stopPropagation();
            const show = !this.state.show;
            fnCloseAll();
            if (show) {
                this.setState({ show });
                closers.push(this.close);
            }
        }
    };

    close = () => {
        this.setState({
            show: false,
        });
    };

    shouldComponentUpdate = shouldComponentUpdate(this, 'Author');

    render() {
        const {
            author,
            authorRep,
            username,
            follow,
            mute,
            showAffiliation,
            scotTokenSymbol,
            hive,
            blacklists,
            showRole,
            community,
            permlink,
            role,
            title,
            tribeCommunityTitle,
            stakedAccounts,
        } = this.props;

        const warn = blacklists && (
            <span className="account_warn" title={blacklists.join(', ')}>
                ({blacklists.length})
            </span>
        );

        const affiliation = tribeCommunityTitle
            ? tribeCommunityTitle
            : affiliationFromStake(
                  scotTokenSymbol,
                  author,
                  stakedAccounts ? stakedAccounts.get(author) : 0
              );
        const userTitle = (
            <span>
                {false &&
                    community && (
                        <UserTitle
                            username={username}
                            community={community}
                            author={author}
                            permlink={permlink}
                            role={showRole ? role : null}
                            title={title}
                            hideEdit={this.props.hideEditor}
                        />
                    )}
                {showAffiliation && affiliation ? (
                    <span className="affiliation">{affiliation}</span>
                ) : null}
            </span>
        );

        if (!(follow || mute)) {
            return (
                <span
                    className="author"
                    itemProp="author"
                    itemScope
                    itemType="http://schema.org/Person"
                >
                    <strong>
                        <Link to={'/@' + author}>{author}</Link>
                    </strong>{' '}
                    {false && <Reputation value={authorRep} />}
                    {warn}
                    {userTitle}
                </span>
            );
        }

        return (
            <span className="Author">
                <span
                    itemProp="author"
                    itemScope
                    itemType="http://schema.org/Person"
                >
                    <strong>
                        <Link
                            ref={link => {
                                this.authorProfileLink = link;
                            }}
                            to={'/@' + author}
                        >
                            {author} {false && <Reputation value={authorRep} />}
                            <Icon name="dropdown-arrow" />
                        </Link>
                    </strong>
                    {warn}
                    {userTitle}
                </span>
                <Overlay
                    show={this.state.show}
                    onHide={this.close}
                    placement="bottom"
                    container={this}
                    target={() => findDOMNode(this.target)}
                    rootClose
                >
                    <AuthorDropdown
                        author={author}
                        follow={follow}
                        mute={mute}
                        authorRep={authorRep}
                        username={username}
                        hive={hive}
                        blacklists={blacklists}
                    />
                </Overlay>
            </span>
        );
    }
}

export default connect(
    (state, props) => {
        const { post, resolveCrossPost } = props;
        const blacklists = post.get('blacklists', List()).toJS();
        const crossPostedBy = post.get('cross_posted_by');

        let author = post.get('author');
        let authorRep = post.get('author_reputation');
        if (resolveCrossPost && crossPostedBy) {
            author = post.get('cross_post_author');
            authorRep = post.get('cross_post_author_reputation');
        }

        const scotTokenSymbol = state.app.getIn([
            'hostConfig',
            'LIQUID_TOKEN_UPPERCASE',
        ]);
        const COMMUNITY_CATEGORY = state.app.getIn([
            'hostConfig',
            'COMMUNITY_CATEGORY',
        ]);

        const tribeCommunityTitle = state.global.getIn([
            'community',
            COMMUNITY_CATEGORY,
            'team',
            author,
            'title',
        ]);
        const disableBlacklist = state.app.getIn([
            'hostConfig',
            'DISABLE_BLACKLIST',
        ]);

        return {
            follow: typeof props.follow === 'undefined' ? true : props.follow,
            mute: typeof props.mute === 'undefined' ? props.follow : props.mute,
            username: state.user.getIn(['current', 'username']),
            authorRep,
            author,
            community: post.get('community'), // UserTitle
            permlink: post.get('permlink'), // UserTitle
            role: post.get('author_role'), // UserTitle
            title: post.get('author_title'), // UserTitle
            blacklists:
                !disableBlacklist && blacklists.length > 0 ? blacklists : null,
            crossPostedBy: post.get('cross_posted_by'),
            crossPostAuthor: post.get('cross_post_author'),
            showRole: props.showRole,
            tribeCommunityTitle,
            scotTokenSymbol,
            stakedAccounts: state.global.get('stakedAccounts'),
        };
    },
    dispatch => ({
        getStakedAccounts: () => {
            dispatch(fetchActions.getStakedAccounts());
        },
    })
)(Author);
