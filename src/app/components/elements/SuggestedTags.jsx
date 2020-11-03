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
            children: null,
        };
    }

    render() {
        const { tags, map, onClick } = this.props;
        const { children } = this.state;

        const childTags = children
            ? Array.isArray(children) ? children : Object.keys(children)
            : null;

        const onSelected = tag => {
            this.setState({
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
                <div className="SuggestedTags__horizontal">
                    {tags.map(link)}
                </div>
                {this.state.children ? (
                    <SuggestedTags
                        tags={childTags}
                        map={children}
                        onClick={onClick}
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
    })
)(SuggestedTags);
