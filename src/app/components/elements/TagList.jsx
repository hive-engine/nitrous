import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

function getDisplayTag(tag, hiveTag, appName) {
    return tag === hiveTag ? appName : ` #${tag} `;
}

import { normalizeTags } from 'app/utils/StateFunctions';

class TagList extends Component {
    render() {
        const { post, hiveTag, appName } = this.props;
        const category = post.get('category');

        const link = tag => {
            if (tag == category) return null;
            return (
                <Link to={`/trending/${tag}`} key={tag}>
                    {getDisplayTag(tag, hiveTag, appName)}
                </Link>
            );
        };

        return (
            <div className="TagList__horizontal">
                {normalizeTags(post.get('json_metadata'), category).map(link)}
            </div>
        );
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => ({
        post: ownProps.post,
        hiveTag: ownProps.hiveTag,
        appName: ownProps.appName,
    })
)(TagList);
