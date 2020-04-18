import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
        this.Hiveblocks = this.Hiveblocks.bind(this);
        this.Hivedb = this.Hivedb.bind(this);
        this.Peakd = this.Peakd.bind(this);
    }

    Hiveblocks() {
        serverApiRecordEvent('HiveblocksView', this.props.permlink);
    }

    Hivedb() {
        serverApiRecordEvent('HivedbView', this.props.permlink);
    }

    Peakd() {
        serverApiRecordEvent('PeakdView', this.props.permlink);
    }

    Esteem() {
        serverApiRecordEvent('EsteemView', this.props.permlink);
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
        const hiveblocks = 'https://hiveblocks.com' + link;
        const hivedb = 'https://hive-db.com' + link;
        const peakd = 'https://peakd.com' + link;
        const esteem = 'https://esteem.app' + link;
        const hiveblog = 'https://hive.blog' + link;
        const hiveblogMd = '[' + title + '](https://hive.blog' + link + ')';
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
                        value={hiveblog}
                        onChange={e => e.preventDefault()}
                    />
                    <CopyToClipboard
                        text={hiveblog}
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
                        value={hiveblogMd}
                        onChange={e => e.preventDefault()}
                    />
                    <CopyToClipboard
                        text={hiveblogMd}
                        onCopy={this.onCopyMD}
                        className="ExplorePost__copy-button input-group-label"
                    >
                        <span>{textMD}</span>
                    </CopyToClipboard>
                </div>
                <h5>{tt('explorepost_jsx.alternative_sources')}</h5>
                <ul>
                    <li>
                        <a
                            href={hiveblocks}
                            onClick={this.Hiveblocks}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            hiveblocks.com <Icon name="extlink" />
                        </a>
                    </li>
                    <li>
                        <a
                            href={hivedb}
                            onClick={this.Hivedb}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            hive-db.com <Icon name="extlink" />
                        </a>
                    </li>
                    <li>
                        <a
                            href={peakd}
                            onClick={this.Peakd}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            peakd.com <Icon name="extlink" />
                        </a>
                    </li>
                    <li>
                        <a
                            href={esteem}
                            onClick={this.Esteem}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            esteem.app <Icon name="extlink" />
                        </a>
                    </li>
                </ul>
            </span>
        );
    }
}

export default connect()(ExplorePost);
