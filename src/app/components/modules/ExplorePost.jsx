import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { APP_URL } from 'app/client_config';
import { serverApiRecordEvent } from 'app/utils/ServerApiClient';
import Icon from 'app/components/elements/Icon';
import CopyToClipboard from 'react-copy-to-clipboard';
import tt from 'counterpart';

class ExplorePost extends Component {
    static propTypes = {
        permlink: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            copied: false,
            copiedMD: false,
        };
        this.onCopy = this.onCopy.bind(this);
        this.onCopyMD = this.onCopyMD.bind(this);
    }

    onCopy() {
        this.setState({
            copied: true,
        });
    }

    onCopyMD() {
        this.setState({
            copiedMD: true,
        });
    }

    render() {
        const link = this.props.permlink;
        const title = this.props.title;
        const appLink = APP_URL + link;
        const md = `[${title}](${APP_URL}${link})`;
        let text =
            this.state.copied == true
                ? tt('explorepost_jsx.copied')
                : tt('explorepost_jsx.copy');
        let textMD =
            this.state.copiedMD == true
                ? tt('explorepost_jsx.copied')
                : tt('explorepost_jsx.copy');
        return (
            <span className="ExplorePost">
                <h4>{tt('g.share_this_post')}</h4>
                <hr />
                <div>URL to this post:</div>
                <div className="input-group">
                    <input
                        className="input-group-field share-box"
                        type="text"
                        value={appLink}
                        onChange={e => e.preventDefault()}
                    />
                    <CopyToClipboard
                        text={appLink}
                        onCopy={this.onCopy}
                        className="ExplorePost__copy-button input-group-label"
                    >
                        <span>{text}</span>
                    </CopyToClipboard>
                </div>
                <div>Markdown code for a link to this post:</div>
                <div className="input-group">
                    <input
                        className="input-group-field share-box"
                        type="text"
                        value={md}
                        onChange={e => e.preventDefault()}
                    />
                    <CopyToClipboard
                        text={md}
                        onCopy={this.onCopy}
                        className="ExplorePost__copy-button input-group-label"
                    >
                        <span>{textMD}</span>
                    </CopyToClipboard>
                </div>
            </span>
        );
    }
}

export default connect()(ExplorePost);
