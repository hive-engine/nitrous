/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';

const { string, number } = PropTypes;

/** Lots of iframes in a post can be very slow.  This component only inserts the iframe when it is actually needed. */
class YoutubePreview extends React.Component {
    static propTypes = {
        youTubeId: string.isRequired,
        width: number,
        height: number,
        startTime: number,
        dataParams: string,
    };

    static defaultProps = {
        width: 640,
        height: 360,
        startTime: 0,
    };

    constructor() {
        super();
        this.state = {};
    }

    shouldComponentUpdate = shouldComponentUpdate(this, 'YoutubePreview');

    onPlay = () => {
        this.setState({ play: true });
    };

    render() {
        const { youTubeId, width, height, startTime, dataParams } = this.props;
        const { play } = this.state;

        if (!play) {
            // mqdefault.jpg (medium quality version, 320px × 180px)
            // hqdefault.jpg (high quality version, 480px × 360px
            // sddefault.jpg (standard definition version, 640px × 480px)
            const thumbnail =
                width <= 320
                    ? 'mqdefault.jpg'
                    : width <= 480
                    ? 'hqdefault.jpg'
                    : '0.jpg';
            const previewLink = `https://img.youtube.com/vi/${youTubeId}/${thumbnail}`;

            return (
                <div
                    className="videoWrapper youtube"
                    onClick={this.onPlay}
                    style={{
                        backgroundImage: 'url(' + previewLink + ')',
                        height: `${height}px`,
                    }}
                    role="button"
                    tabIndex={0}
                >
                    <div className="play" />
                </div>
            );
        }
        const autoPlaySrc = `https://www.youtube.com/embed/${youTubeId}?autoplay=1&autohide=1&${dataParams}&start=${startTime}`;

        return (
            <div className="videoWrapper">
                <iframe
                    width={width}
                    height={height}
                    src={autoPlaySrc}
                    frameBorder="0"
                    allowFullScreen="true"
                    title="Youtube video player"
                />
            </div>
        );
    }
}

import { connect } from 'react-redux';

export default connect((state, ownProps) => {
    const appUrl = state.app.getIn(['hostConfig', 'APP_URL']);
    const dataParams = `enablejsapi=0&rel=0&origin=${appUrl}`;
    return {
        dataParams,
        ...ownProps,
    };
})(YoutubePreview);
