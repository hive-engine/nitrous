import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import NativeSelect from 'app/components/elements/NativeSelect';
import { actions as movieActions } from 'app/redux/MovieReducer';
import Hidden from '@material-ui/core/Hidden';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import TvIcon from '@material-ui/icons/Tv';
import RateReviewIcon from '@material-ui/icons/RateReview';
import PostAddIcon from '@material-ui/icons/PostAdd';

const SortOrder = ({
    topic,
    sortOrder,
    horizontal,
    pathname,
    requestNewList,
}) => {
    /*
     * We do not sort the user feed by anything other than 'new'.
     * So don't make links to it from the SortOrder component.
     * Instead fall back to the 'all tags' route when a user attempts to sort from a feed page.
     * If a user lands on the 'feed' page and the sort order is displayed (e.g. a mobile user) 
     * display the active sort as 'new'.
     */
    let tag = topic;
    let sort = sortOrder;

    // If we are at the homepage, the sort order is 'trending'
    if (pathname === '/') {
        tag = '';
        sort = '';
    } else if (topic === 'feed') {
        tag = '';
        sort = 'created';
    } else {
        const match = /^\/[a-z]+/i.exec(pathname);
        if (match) {
            sort = match[0].substr(1).toLowerCase();
        }
    }

    const makeRoute = (tag, sort) =>
        tag ? `/${sort.value}/${tag}` : `/${sort.value}`;

    const handleChange = tag => sort => {
        browserHistory.replace(makeRoute(tag, sort));
    };

    const sorts = tag => {
        return [
            {
                value: 'movie',
                label: tt('review.top_menu.movies'),
                link: `/movie`,
                icon: <MovieFilterIcon className="nav__icon" />,
                onClick: () => requestNewList(),
            },
            {
                value: 'tv',
                label: tt('review.top_menu.tvs'),
                link: `/tv`,
                icon: <TvIcon className="nav__icon" />,
                onClick: () => requestNewList(),
            },
            {
                value: 'review',
                label: tt('review.top_menu.reviews'),
                link: `/review`,
                icon: <RateReviewIcon className="nav__icon" />,
                onClick: () => requestNewList(),
            },
            {
                value: 'created',
                label: tt('g.new').toUpperCase(),
                link: `/created/${tag}`,
                icon: <PostAddIcon className="nav__icon" />,
                onClick: null,
            },
        ];
    };

    return horizontal ? (
        <ul className="nav__block-list">
            {sorts(tag).map(i => {
                return (
                    <li
                        key={i.value}
                        className={`nav__block-list-item ${
                            i.value === sort
                                ? 'nav__block-list-item--active'
                                : ''
                        }`}
                    >
                        <Link to={i.link} onClick={i.onClick}>
                            {i.icon}
                            <Hidden xsDown>{i.label}</Hidden>
                        </Link>
                    </li>
                );
            })}
        </ul>
    ) : (
        <NativeSelect
            currentlySelected={sort}
            options={sorts(tag)}
            onChange={handleChange(tag)}
        />
    );
};

SortOrder.propTypes = {
    topic: PropTypes.string,
    sortOrder: PropTypes.string,
    horizontal: PropTypes.bool,
    pathname: PropTypes.string,
    requestNewList: PropTypes.func,
};

SortOrder.defaultProps = {
    horizontal: false,
    topic: '',
    sortOrder: '',
    pathname: '',
};

export default connect(
    (state, ownProps) => {
        return {};
    },
    dispatch => ({
        requestNewList: args => dispatch(movieActions.requestNewList(args)),
    })
)(SortOrder);
