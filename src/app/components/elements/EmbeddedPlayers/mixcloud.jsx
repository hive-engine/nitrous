import React from 'react';

/**
 * Regular expressions for detecting and validating provider URLs
 * @type {{htmlReplacement: RegExp, main: RegExp, sanitize: RegExp}}
 */
const regex = {
    main: /https:\/\/www\.mixcloud\.com(\/[^/]+\/[^/]+)/i,
    sanitize: /^https:\/\/www\.mixcloud\.com\/widget\/iframe\/.*?feed=(.*)/i,
};

export default regex;

export function getIframeDimensions() {
    return {
        width: '100%',
        height: '120',
    };
}

/**
 * Configuration for HTML iframe's `sandbox` attribute
 * @type {useSandbox: boolean, sandboxAttributes: string[]}
 */
export const sandboxConfig = {
    useSandbox: true,
    sandboxAttributes: ['allow-scripts', 'allow-same-origin', 'allow-popups'],
};

/**
 * Check if the iframe code in the post editor is to an allowed URL
 * <iframe width="100%" height="120" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2FMagneticMagazine%2Fambient-meditations-vol-21-anane%2F" frameborder="0" ></iframe>
 * @param url
 * @returns {boolean|*}
 */
export function validateIframeUrl(url) {
    const match = url.match(regex.sanitize);

    if (!match || match.length !== 2) {
        return false;
    }

    return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${
        match[1]
    }`;
}

//////

/**
 * Rewrites the embedded URL to a normalized format
 * @param url
 * @returns {string|boolean}
 */
export function normalizeEmbedUrl(url) {
    const match = url.match(regex.contentId);

    if (match && match.length >= 2) {
        return `https://www.mixcloud.com/widget/iframe/?feed=${match[1]}`;
    }

    return false;
}

/**
 * Extract the content ID and other metadata from the URL
 * @param data
 * @returns {null|{id: *, canonical: string, url: *}}
 */
function extractMetadata(data) {
    if (!data) return null;
    const m = data.match(regex.main);
    if (!m || m.length < 2) return null;

    const startTime = m.input.match(/t=(\d+)s?/);

    return {
        id: `${m[1]}/`,
        url: m[0],
        startTime: startTime ? startTime[1] : 0,
        canonical: `https://open.mixcloud.com/playlist/${m[1]}`,
    };
}

/**
 * Replaces the URL with a custom Markdown for embedded players
 * @param child
 * @param links
 * @returns {*}
 */
export function embedNode(child, links /*images*/) {
    try {
        const { data } = child;
        const mixcloud = extractMetadata(data);
        if (!mixcloud) return child;

        child.data = data.replace(
            mixcloud.url,
            `~~~ embed:${mixcloud.id} mixcloud ~~~`
        );

        if (links) links.add(mixcloud.canonical);
        // if(images) images.add(mixcloud.thumbnail) // not available
    } catch (error) {
        console.log(error);
    }
    return child;
}

/**
 * Generates the Markdown/HTML code to override the detected URL with an iFrame
 * @param idx
 * @param id
 * @param width
 * @param height
 * @returns {*}
 */
export function genIframeMd(idx, id) {
    const width = '100%';
    const height = 120;
    const url = `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${
        id
    }`;

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
        <div key={`mixcloud-${id}-${idx}`} className="videoWrapper">
            <iframe
                title="mixcloud embedded player"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...iframeProps}
            />
        </div>
    );
}
