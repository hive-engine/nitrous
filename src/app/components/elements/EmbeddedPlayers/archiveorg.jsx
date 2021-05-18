import React from 'react';

/**
 * Regular expressions for detecting and validating provider URLs
 * @type {{htmlReplacement: RegExp, main: RegExp, sanitize: RegExp}}
 */
const regex = {
    sanitize: /^https:\/\/archive\.org\/embed\/(.*)/i,
    main: /^https:\/\/archive\.org\/details\/(.*)/i,
};
export default regex;

export function getIframeDimensions(...args) {
    // Since we can't tell the difference between video and audio embed players from the URL, lets use the width/height
    // provided by archive.org's iframe HTML code.
    const [large, , width, height] = args;
    if (width && height) {
        return {
            width,
            height,
        };
    }

    return {
        width: large ? 640 : 480,
        height: large ? 360 : 270,
    };
}

/**
 * Configuration for HTML iframe's `sandbox` attribute
 * @type {useSandbox: boolean, sandboxAttributes: string[]}
 */
export const sandboxConfig = {
    useSandbox: false,
    sandboxAttributes: [],
};

/**
 * Check if the iframe code in the post editor is to an allowed URL
 * <iframe src="https://archive.org/embed/namaz-nasil-kilinir" width="640" height="480" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>
 * <iframe src="https://archive.org/embed/geometry_dash_1.9" width="500" height="140" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>
 * @param url
 * @returns {boolean|*}
 */
export function validateIframeUrl(url) {
    const match = url.match(regex.sanitize);

    if (!match || match.length !== 2) {
        return false;
    }

    return 'https://archive.org/embed/' + match[1];
}

/**
 * Rewrites the embedded URL to a normalized format
 * @param url
 * @returns {string|boolean}
 */
export function normalizeEmbedUrl(url) {
    const match = url.match(regex.sanitize);

    if (match && match.length >= 2) {
        return `https://archive.org/embed/${match[1]}`;
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
        id: m[1],
        url: m[0],
        startTime: startTime ? startTime[1] : 0,
        canonical: `https://archive.org/embed/${m[1]}`,
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
        const archiveorg = extractMetadata(data);
        if (!archiveorg) return child;

        child.data = data.replace(
            archiveorg.url,
            `~~~ embed:${archiveorg.id} archiveorg ~~~`
        );

        if (links) {
            links.add(archiveorg.canonical);
        }

        if (links) links.add(archiveorg.canonical);
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
 * @param startTime
 * @returns {*}
 */
export function genIframeMd(idx, id, width, height) {
    const url = `https://archive.org/embed/${id}`;

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
        <div key={`archiveorg-${id}-${idx}`} className="videoWrapper">
            <iframe
                title="Archive.org embedded player"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...iframeProps}
            />
        </div>
    );
}
