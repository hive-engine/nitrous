import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { filterTags } from 'app/utils/StateFunctions';
import DropdownMenu from 'app/components/elements/DropdownMenu';

export default ({ post, scotTokens = [], horizontal, single }) => {
    let sort_order = 'hot';
    if (process.env.BROWSER && window.last_sort_order)
        sort_order = window.last_sort_order;

    if (single)
        return (
            <Link to={`/${sort_order}/${post.category}`}>{post.category}</Link>
        );

    const json = post.json_metadata;
    let tags = [];

    try {
        if (typeof json == 'object') {
            tags = json.tags || [];
        } else {
            tags = (json && JSON.parse(json).tags) || [];
        }
        if (typeof tags == 'string') tags = tags.split(' ');
        if (!Array.isArray(tags)) {
            tags = [];
        }
    } catch (e) {
        tags = [];
    }

    // Category should always be first.
    tags.unshift(post.category);

    tags = filterTags(tags);

    if (horizontal) {
        // show it as a dropdown in Preview
        const list = tags.map((tag, idx) => {
            // find nitrous tag
            const [scot_nitrous_info] = scotTokens.filter(scot => {
                return scot && scot.get('json_metadata_value').includes(tag);
            });
            let tooltip;
            if (scot_nitrous_info && scot_nitrous_info.size) {
                const {
                    token,
                    author_reward_percentage,
                    beneficiaries_reward_percentage,
                } = scot_nitrous_info.toJS();
                tooltip = `token: ${token}
author reward: ${author_reward_percentage}%
curation reward: ${100 -
                    author_reward_percentage -
                    beneficiaries_reward_percentage}%
beneficiaries reward: ${beneficiaries_reward_percentage}%`;
            }
            return (
                <span
                    key={idx}
                    data-tooltip={tooltip}
                    className={classNames({
                        TagItem__nitrous: scot_nitrous_info,
                    })}
                >
                    <Link to={`/${sort_order}/${tag}`}> {tag} </Link>
                </span>
            );
        });
        return <div className="TagList__horizontal">{list}</div>;
    }
    if (tags.length == 1) {
        return <Link to={`/${sort_order}/${tags[0]}`}>{tags[0]}</Link>;
    }
    const list = tags.map(tag => {
        return { value: tag, link: `/${sort_order}/${tag}` };
    });
    return (
        <DropdownMenu
            selected={' ' + tags[0]}
            className="TagList"
            items={list}
            el="div"
        />
    );
};
