import React, { Component } from 'react';
import { connect } from 'react-redux';
import { COMMUNITY_CATEGORY, APP_NAME, TAG_LIST } from 'app/client_config';

class SuggestedTags extends Component {
    constructor(props) {
        super();
        this.state = {
            current: null,
            children: null,
        };
    }

    hasSelected(tag) {
        const { selectedTags } = this.props;
        const tagsList = selectedTags && selectedTags.toLowerCase().split(' ');
        return tag && tagsList && tagsList.includes(tag.toLowerCase());
    }

    insertTag(tag) {
        const { onChange, selectedTags } = this.props;
        if (tag && !this.hasSelected(tag)) {
            onChange(selectedTags ? selectedTags + ' ' + tag : tag);
        }
    }

    getSelectedTags(tag, map) {
        let found = [];
        if (tag && this.hasSelected(tag)) {
            found.push(tag);
            let children = map && map[tag];
            if (children) {
                const tags = Array.isArray(children)
                    ? children
                    : Object.keys(children);
                tags.forEach(tag => {
                    found = found.concat(this.getSelectedTags(tag, children));
                });
            }
        }
        return found;
    }

    removeTag(tag) {
        const { map, onChange, selectedTags } = this.props;
        const tagsToRemove = this.getSelectedTags(tag, map);
        if (tagsToRemove && tagsToRemove.length > 0) {
            const tags = selectedTags.toLowerCase().split(' ');
            tagsToRemove.forEach(tag => {
                const index = tags.indexOf(tag.toLowerCase());
                if (index > -1) {
                    tags.splice(index, 1);
                }
            });
            onChange(tags.join(' '));
        }
    }

    render() {
        const { tags, map, level, onChange, selectedTags } = this.props;
        const { current, children } = this.state;

        const hasChildren =
            current && children && tags && tags.includes(current);
        const childTags = hasChildren
            ? Array.isArray(children) ? children : Object.keys(children)
            : null;

        const onSelected = tag => {
            this.setState({
                current: tag,
                children: map[tag],
            });
            this.insertTag(tag);
        };

        const onDeselected = tag => {
            this.removeTag(tag);
            if (current === tag) {
                this.setState({
                    current: null,
                    children: null,
                });
            }
        };

        const link = tag => {
            const selected = this.hasSelected(tag);
            if (selected) {
                return (
                    <a
                        key={tag}
                        onClick={() => onDeselected(tag)}
                        className="selected"
                    >
                        {'x ' + tag}
                    </a>
                );
            } else {
                return (
                    <a key={tag} onClick={() => onSelected(tag)}>
                        {'#' + tag}
                    </a>
                );
            }
        };

        return (
            <div>
                <div className={`SuggestedTags__horizontal level_${level}`}>
                    {tags.map(link)}
                </div>
                {hasChildren ? (
                    <SuggestedTags
                        tags={childTags}
                        map={children}
                        level={level + 1}
                        onChange={onChange}
                        selectedTags={selectedTags}
                    />
                ) : null}
            </div>
        );
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => ({
        tags: ownProps.tags || Object.keys(TAG_LIST.toJS()),
        map: ownProps.map || TAG_LIST.toJS(),
        level: ownProps.level || 0,
        onChange: ownProps.onChange,
        selectedTags: ownProps.selectedTags,
    })
)(SuggestedTags);
