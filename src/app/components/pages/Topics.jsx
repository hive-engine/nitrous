import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import tt from 'counterpart';
import PropTypes from 'prop-types';
import NativeSelect from 'app/components/elements/NativeSelect';
import { List } from 'immutable';

const Topics = ({
    order,
    current,
    compact,
    className,
    username,
    categories,
    levels,
}) => {
    const handleChange = selectedOption => {
        browserHistory.push(selectedOption.value);
    };

    const currentlySelected = (currentTag, username, currentOrder = false) => {
        const opts = {
            feed: `/@${username}/feed`,
            tagOnly: `/trending/${currentTag}`,
            orderOnly: `/${currentOrder}`,
            tagWithOrder: `/${currentOrder}/${currentTag}`,
            default: `/trending`,
        };
        if (currentTag === 'feed') return opts['feed'];
        if (currentTag && currentOrder) return opts['tagWithOrder'];
        if (!currentTag && currentOrder) return opts['orderOnly'];
        if (currentTag && !currentOrder) return opts['tagOnly'];
        return opts['default'];
    };

    const buildPrefix = level => {
        let a = '';
        for (let i = 0; i < level; i++) {
            a = a + '>';
        }
        return a;
    };

    const buildCategories = (categories, level, max) => {
        const prefix = buildPrefix(level);
        if (List.isList(categories)) {
            return categories.map(c => prefix + c);
        } else {
            let c_list = List();
            categories.mapKeys((c, v) => {
                c_list = c_list.push(prefix + c);
                // only display max levels
                if (level < max - 1) {
                    c_list = c_list.concat(buildCategories(v, level + 1, max));
                }
            });
            return c_list;
        }
    };

    const parseCategory = cat => {
        const tag = cat.replace(/\>/g, '');
        const label = cat.replace(/\>/g, '\u00a0\u00a0\u00a0');
        return { tag, label };
    };

    categories = buildCategories(categories, 0, levels);

    if (compact) {
        const extras = username => {
            const ex = {
                allTags: order => ({
                    value: `/${order}`,
                    label: `${tt('g.all_tags_mobile')}`,
                }),
                myFeed: name => ({
                    value: `/@${name}/feed`,
                    label: `${tt('g.my_feed')}`,
                }),
            };
            return username
                ? [ex.allTags(order), ex.myFeed(username)]
                : [ex.allTags(order)];
        };

        const opts = extras(username).concat(
            categories
                .map(cat => {
                    const { tag, label } = parseCategory(cat);
                    const link = order ? `/${order}/${tag}` : `/${tag}`;
                    return { value: link, label: label };
                })
                .toJS()
        );

        return (
            <NativeSelect
                currentlySelected={currentlySelected(current, username, order)}
                options={opts}
                onChange={handleChange}
            />
        );
    } else {
        const categoriesLinks = categories.map(cat => {
            const { tag, label } = parseCategory(cat);
            const link = order ? `/${order}/${tag}` : `/hot/${tag}`;
            return (
                <li className="c-sidebar__list-item" key={tag}>
                    <Link
                        to={link}
                        className="c-sidebar__link"
                        activeClassName="active"
                    >
                        {label}
                    </Link>
                </li>
            );
        });
        return (
            <div className="c-sidebar__module">
                <div className="c-sidebar__content">
                    <ul className="c-sidebar__list">
                        <li className="c-sidebar__list-item">
                            <div className="c-sidebar__header">
                                <Link
                                    to={'/' + order}
                                    className="c-sidebar__link"
                                    activeClassName="active"
                                >
                                    {tt('g.all_tags')}
                                </Link>
                            </div>
                        </li>
                        {categoriesLinks}
                        <li className="c-sidebar__link">
                            <Link
                                className="c-sidebar__link c-sidebar__link--emphasis"
                                to={`/tags`}
                            >
                                {tt('g.show_more_topics')}&hellip;
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
};

Topics.propTypes = {
    categories: PropTypes.object.isRequired,
    order: PropTypes.string.isRequired,
    current: PropTypes.string,
    compact: PropTypes.bool.isRequired,
};

Topics.defaultProps = {
    current: '',
};

export default Topics;
