import React from 'react';
import { Link } from 'react-router';
import { filterTags } from 'app/utils/StateFunctions';
import DropdownMenu from 'app/components/elements/DropdownMenu';

function getDisplayTag(tag, hiveTag, appName) {
    return tag === hiveTag ? appName : tag;
}

function getUrl(sort_order, tag, hiveTag) {
    return tag === hiveTag ? `/${sort_order}` : `/${sort_order}/${tag}`;
}

export default ({ post, hiveTag, appName, horizontal, single }) => {
    let sort_order = 'trending';
    if (process.env.BROWSER && window.last_sort_order)
        sort_order = window.last_sort_order;

    if (single)
        return (
            <Link to={getUrl(sort_order, post.category, hiveTag)}>
                {getDisplayTag(post.category, hiveTag, appName)}
            </Link>
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
        const list = tags.map((tag, idx) => (
            <Link to={getUrl(sort_order, tag, hiveTag)} key={idx}>
                {' '}
                {getDisplayTag(tag, hiveTag, appName)}{' '}
            </Link>
        ));
        return <div className="TagList__horizontal">{list}</div>;
    }
    if (tags.length == 1) {
        return (
            <Link to={getUrl(sort_order, tag)}>
                {getDisplayTag(tags[0], hiveTag, appName)}
            </Link>
        );
    }
    const list = tags.map(tag => {
        return {
            value: getDisplayTag(tag, hiveTag, appName),
            link: getUrl(sort_order, tag),
        };
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
