import React from 'react';

/**
 * Regular expressions for detecting and validating provider URLs
 * @type {{htmlReplacement: RegExp, main: RegExp, sanitize: RegExp}}
 */
const regex = {
    // https://travelfeed.io/@tvt3st/prague-to-sarajevo-cool-places-in-europe-europe-prague-zagreb-bosnia-20210420t103208397z
    main: /^(?:https?:)?\/\/travelfeed\.io\/@((.*?)\/(.*))/i,
    sanitize: /^(?:https?:)?\/\/embed\.truvvl\.com\/@((.*?)\/(.*))/i,
};
export default regex;

/**
 * Configuration for HTML iframe's `sandbox` attribute
 * @type {useSandbox: boolean, sandboxAttributes: string[]}
 */
export const sandboxConfig = {
    useSandbox: true,
    sandboxAttributes: ['allow-scripts', 'allow-same-origin', 'allow-popups'],
};

export function getIframeDimensions() {
    return {
        width: '375',
        height: '700',
    };
}

/**
 * Check if the iframe code in the post editor is to an allowed URL
 * <iframe src="https://embed.truvvl.com/@tvt3st/prague-to-sarajevo-cool-places-in-europe-europe-prague-zagreb-bosnia-20210420t103208397z" frameborder="0" height="700" width="375"></iframe>
 * @param url
 * @returns {boolean|*}
 */
export function validateIframeUrl(url) {
    const match = url.match(regex.sanitize);
    if (match) {
        return url;
    }

    return false;
}

/**
 * Rewrites the embedded URL to a normalized format
 * @param url
 * @returns {string|boolean}
 */
export function normalizeEmbedUrl(url) {
    const match = url.match(regex.sanitize);

    if (match && match.length >= 2) {
        return `https://embed.truvvl.com/@${match[1]}`;
    }

    return false;
}

/**
 * Extract the content ID and other metadata from the URL
 * @param data
 * @returns {null|{id: *, canonical: string, url: *}}
 */
export function extractMetadata(data) {
    if (!data) return null;

    const match = data.match(regex.main);
    const url = match ? match[0] : null;
    if (!url) return null;
    const fullId = match[1];
    const id = fullId.split('/').pop();

    return {
        id,
        fullId,
        url,
        canonical: url,
    };
}

/**
 * Replaces the URL with a custom Markdown for embedded players
 * @param child
 * @param links
 * @returns {*}
 */
export function embedNode(child, links) {
    try {
        const { data } = child;
        const truvvl = extractMetadata(data);
        if (!truvvl) return child;

        child.data = data.replace(
            truvvl.url,
            `~~~ embed:${truvvl.fullId} truvvl ~~~`
        );

        if (links) {
            links.add(truvvl.canonical);
        }

        if (links) links.add(truvvl.canonical);
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
export function genIframeMd(idx, id, width, height) {
    const url = `https://embed.truvvl.com/@${id}`;

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
        className: 'truvvl-iframe',
    };
    if (sandbox) {
        iframeProps.sandbox = sandbox;
    }

    return (
        <div key={`truvvl-${id}-${idx}`} className="videoWrapper">
            <iframe
                title="truvvl.com embedded player"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...iframeProps}
            />
        </div>
    );
}
