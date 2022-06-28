import React from 'react';

/**
 * Regular expressions for detecting and validating provider URLs
 * @type {{htmlReplacement: RegExp, main: RegExp, sanitize: RegExp}}
 */
const regex = {
    sanitize: /^https:\/\/bandcamp\.com\/EmbeddedPlayer\/(album=.*)/i,
};
export default regex;

/**
 * Configuration for HTML iframe's `sandbox` attribute
 * @type {useSandbox: boolean, sandboxAttributes: string[]}
 */
export const sandboxConfig = {
    useSandbox: false,
    sandboxAttributes: [],
};

export function getIframeDimensions(...args) {
    const [, idOrUrl] = args;
    const baseHeight = 120;
    const tracklistHeight = 155;
    const largeArtworkHeight = 580;
    const hasLargeArtwork = idOrUrl.indexOf('artwork=large') !== -1;
    const tracklistEnabled = idOrUrl.indexOf('tracklist=true') !== -1;

    let height = baseHeight;

    if (hasLargeArtwork) {
        height += largeArtworkHeight;
    }

    if (tracklistEnabled) {
        height += tracklistHeight;
        if (hasLargeArtwork) {
            height += baseHeight;
        }
    }

    return {
        width: 700,
        height,
    };
}

/**
 * Check if the iframe code in the post editor is to an allowed URL
 * <iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/album=1820259073/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/artwork=small/transparent=true/" seamless><a href="https://bluetech.bandcamp.com/album/tomorrow">Tomorrow by Steve Roach</a></iframe>
 * <iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/album=1820259073/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/artwork=small/track=266656541/transparent=true/" seamless><a href="https://bluetech.bandcamp.com/album/tomorrow">Tomorrow by Steve Roach</a></iframe>
 * @param url
 * @returns {boolean|*}
 */
export function validateIframeUrl(url) {
    const match = url.match(regex.sanitize);

    if (!match || match.length !== 2) {
        return false;
    }

    return 'https://bandcamp.com/EmbeddedPlayer/' + match[1];
}

/**
 * Rewrites the embedded URL to a normalized format
 * @param url
 * @returns {string|boolean}
 */
export function normalizeEmbedUrl(url) {
    const match = url.match(regex.sanitize);

    if (match && match.length >= 2) {
        return `https://bandcamp.com/EmbeddedPlayer/${match[1]}`;
    }

    return false;
}

/**
 * Replaces the URL with a custom Markdown for embedded players
 * @param child
 * @param links
 * @returns {*}
 */
export function embedNode(child) {
    return child;
}

/**
 * Generates the Markdown/HTML code to override the detected URL with an iFrame
 * @param idx
 * @param id
 * @param width
 * @param height
 * @param startTime
 * @returns {*}
 */
export function genIframeMd(idx, id, width, height) {
    const url = `https://bandcamp.com/EmbeddedPlayer/${id}`;

    let sandbox = sandboxConfig.useSandbox;
    if (sandbox) {
        if (
            Object.prototype.hasOwnProperty.call(
                sandboxConfig,
                'sandboxAttributes'
            )
        ) {
            sandbox = sandboxConfig.sandboxAttributes.join(' ');
        }
    }
    const iframeProps = {
        src: url,
        width,
        height,
        frameBorder: '0',
        webkitallowfullscreen: 'webkitallowfullscreen',
        mozallowfullscreen: 'mozallowfullscreen',
        allowFullScreen: 'allowFullScreen',
    };
    if (sandbox) {
        iframeProps.sandbox = sandbox;
    }

    return (
        <div key={`bandcamp-${id}-${idx}`} className="videoWrapper">
            <iframe
                title="bandcamp.com embedded player"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...iframeProps}
            />
        </div>
    );
}
