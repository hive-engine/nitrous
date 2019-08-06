import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import tt from 'counterpart';

import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';

const MAX_LIMIT = 10;

const formatDate = date => {
    const d = new Date(`${date}Z`);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

class AuthorRecentPosts extends React.PureComponent {
    componentDidMount() {
        // this.getDiscussionsByAuthor();
        const { author, permlink } = this.props;
        const postFilter = value =>
            value.author === author && value.permlink !== permlink;
        this.props.fetchAuthorRecentPosts({
            order: 'recent_user_posts',
            category: '',
            accountname: author,
            postFilter,
            limit: MAX_LIMIT,
        });
    }

    render() {
        const { author, loading, discussions, content } = this.props;
        if (!loading && (discussions && discussions.size)) {
            return (
                <div className={classNames('AuthorRecentPosts', 'callout')}>
                    <h6>
                        {tt('postfull_jsx.recent_posts_by_author', { author })}
                    </h6>
                    <table>
                        <tbody>
                            {discussions.map(e => {
                                const cont = content.get(e).toJS();
                                return (
                                    <tr key={cont.id || cont.post_id}>
                                        <th>
                                            <a
                                                href={
                                                    cont.url || cont.authorperm
                                                }
                                            >
                                                {cont.title}
                                            </a>
                                            {'  '}
                                            <span>({cont.children})</span>
                                        </th>
                                        <td>{formatDate(cont.created)}</td>
                                    </tr>
                                );
                            })}
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

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        return {
            ...ownProps,
            loading: state.app.get('loading'),
            discussions: state.global.getIn([
                'discussion_idx',
                '',
                'recent_user_posts',
            ]),
            content: state.global.get('content'),
        };
    },
    // mapDispatchToProps
    dispatch => ({
        fetchAuthorRecentPosts: args =>
            dispatch(fetchDataSagaActions.fetchAuthorRecentPosts(args)),
    })
)(AuthorRecentPosts);
