import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import NativeSelect from 'app/components/elements/NativeSelect';
import { RECOMMENDED_FOLLOW_ACCOUNT } from 'app/client_config';

const SortOrder = ({ topic, sortOrder, horizontal, pathname }) => {
    /*
     * We do not sort the user feed by anything other than 'new'.
     * So don't make links to it from the SortOrder component.
     * Instead fall back to the 'all tags' route when a user attempts to sort from a feed page.
     * If a user lands on the 'feed' page and the sort order is displayed (e.g. a mobile user) 
     * display the active sort as 'new'.
     */
    let tag = topic;
    let sort = sortOrder;

    if (topic === 'feed') {
        tag = '';
        sort = 'created';
    }

    // If we are at the homepage, the sort order is 'hot'
    if (pathname === '/') {
        tag = '';
        sort = 'hot';
    }

    if (pathname === '/created/sct-consumer') {
        sort = 'review';
    } else if (pathname === '/created/sct-producer') {
        sort = 'market';
    } else if (pathname === `/@${RECOMMENDED_FOLLOW_ACCOUNT}/feed`) {
        sort = 'recommend';
    }

    const makeRoute = (tag, sort) => {
        console.log(`tag:${tag}, sort.value:${sort.value}`);
        if (sort.value === 'market') {
            return '/created/sct-producer';
        } else if (sort.value === 'review') {
            return '/created/sct-consumer';
        } else if (sort.value === 'recommend') {
            return `/@${RECOMMENDED_FOLLOW_ACCOUNT}/feed`;
        } else {
            return `/${sort.value}`;
        }
    };

    const handleChange = tag => sort => {
        browserHistory.replace(makeRoute(tag, sort));
    };

    const sorts = tag => {
        return [
            {
                value: 'recommend',
                label: tt('g.recommend'),
                link: `/@${RECOMMENDED_FOLLOW_ACCOUNT}/feed`,
            },
            {
                value: 'hot',
                label: tt('main_menu.hot'),
                link: `/hot/`,
            },
            {
                value: 'created',
                label: tt('g.new'),
                link: `/created/`,
            },
            {
                value: 'promoted',
                label: tt('g.promoted'),
                link: `/promoted/`,
            },
            {
                value: 'market',
                label: tt('g.market'),
                link: `/created/sct-producer`,
            },
            {
                value: 'review',
                label: tt('g.review'),
                link: `/created/sct-consumer`,
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
                        <Link to={i.link}>{i.label}</Link>
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
};

SortOrder.defaultProps = {
    horizontal: false,
    topic: '',
    sortOrder: '',
    pathname: '',
};

export default SortOrder;
