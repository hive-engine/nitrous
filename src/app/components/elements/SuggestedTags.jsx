import React, { Component } from 'react';
import { connect } from 'react-redux';
import { COMMUNITY_CATEGORY, APP_NAME, TAG_LIST } from 'app/client_config';

function getDisplayTag(tag) {
    return tag === COMMUNITY_CATEGORY ? APP_NAME : ` #${tag} `;
}

// import { normalizeTags } from 'app/utils/StateFunctions';

class SuggestedTags extends Component {
    constructor(props) {
        super();
        this.state = {
            selected: null,
            children: null,
        };
    }

    render() {
        const { tags, map, onClick, level } = this.props;
        const { selected, children } = this.state;

        const hasChildren =
            selected && children && tags && tags.includes(selected);
        const childTags = hasChildren
            ? Array.isArray(children) ? children : Object.keys(children)
            : null;

        const onSelected = tag => {
            this.setState({
                selected: tag,
                children: map[tag],
            });
            onClick(tag);
        };

        const link = tag => {
            return (
                <a key={tag} onClick={() => onSelected(tag)}>
                    {getDisplayTag(tag)}
                </a>
            );
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
                        onClick={onClick}
                        level={level + 1}
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
        onClick: ownProps.onClick,
        level: ownProps.level || 0,
    })
)(SuggestedTags);
