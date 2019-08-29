import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import tt from 'counterpart';
import { Link } from 'react-router';

import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';

const MAX_LIMIT = 10;

const formatDate = date => {
    const d = new Date(`${date}Z`);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

class AuthorRecentPosts extends React.Component {
    componentDidMount() {
        const { author } = this.props;
        this.props.fetchAuthorRecentPosts({
            category: 'recent_user_posts',
            accountname: author,
            limit: MAX_LIMIT,
        });
    }

    render() {
        const { author, permlink, discussions, content } = this.props;
        if (discussions && discussions.size) {
            return (
                <div className={classNames('AuthorRecentPosts', 'callout')}>
                    <h6>
                        {tt('postfull_jsx.recent_posts_by_author', { author })}
                    </h6>
                    <table>
                        <tbody>
                            {discussions.map((e, i) => {
                                const cont = content.get(e).toJS();
                                const post_url = `/${cont.category}/${
                                    cont.authorperm
                                }`;
                                return (
                                    <tr key={String(i)}>
                                        <th>
                                            {author === cont.author &&
                                            permlink === cont.permlink ? (
                                                <span>{cont.title}</span>
                                            ) : (
                                                <Link to={post_url}>
                                                    {cont.title}
                                                </Link>
                                            )}
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
                'accounts',
                ownProps.author,
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
