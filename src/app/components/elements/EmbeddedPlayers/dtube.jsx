import React from 'react';

/**
 * Regular expressions for detecting and validating provider URLs
 * @type {{htmlReplacement: RegExp, main: RegExp, sanitize: RegExp}}
 */
const regex = {
    // eslint-disable-next-line no-useless-escape
    sanitize: /^https:\/\/emb\.d\.tube\/#!\/([a-zA-Z0-9.\-\/]+)$/,
    // eslint-disable-next-line no-useless-escape
    main: /https:\/\/(?:emb\.)?(?:d\.tube\/#!\/(?:v\/)?)([a-zA-Z0-9.\-\/]*)/,
    // eslint-disable-next-line no-useless-escape
    contentId: /(?:d\.tube\/#!\/(?:v\/)?([a-zA-Z0-9.\-\/]*))+/,
};
export default regex;

/**
 * Configuration for HTML iframe's `sandbox` attribute
 * @type {useSandbox: boolean, sandboxAttributes: string[]}
 */
export const sandboxConfig = {
    useSandbox: true,
    sandboxAttributes: ['allow-scripts', 'allow-same-origin'],
};

/**
 * Generates the Markdown/HTML code to override the detected URL with an iFrame
 * @param idx
 * @param threespeakId
 * @param width
 * @param height
 * @returns {*}
 */
export function genIframeMd(idx, dtubeId, width, height) {
    const url = `https://emb.d.tube/#!/${dtubeId}`;

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
        key: idx,
        src: url,
        width,
        height,
        frameBorder: '0',
        allowFullScreen: 'allowFullScreen',
    };
    if (sandbox) {
        iframeProps.sandbox = sandbox;
    }

    return (
        <div key={`dtube-${dtubeId}-${idx}`} className="videoWrapper">
            <iframe
                title="DTube embedded player"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...iframeProps}
            />
        </div>
    );
}

/**
 * Check if the iframe code in the post editor is to an allowed URL
 * <iframe title="DTube embedded player" src="https://emb.d.tube/#!/cyberspacegod/QmfHTqZWQkJ6uqLsca4wgZffGE3To6YVSzazFD3ReS1NcA" width="640" height="360" frameborder="0" allowfullscreen=""></iframe>
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
    const match = url.match(regex.contentId);

    if (match && match.length >= 2) {
        return `https://emb.d.tube/#!/${match[1]}`;
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

    return {
        id: m[1],
        url: m[0],
        canonical: `https://emb.d.tube/#!/${m[1]}`,
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
        const dtube = extractMetadata(data);
        if (!dtube) return child;

        child.data = data.replace(dtube.url, `~~~ embed:${dtube.id} dtube ~~~`);

        if (links) links.add(dtube.canonical);
    } catch (error) {
        console.log(error);
    }

    return child;
}
