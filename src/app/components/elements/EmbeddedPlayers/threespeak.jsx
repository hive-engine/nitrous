import React from 'react';

/**
 * Regular expressions for detecting and validating provider URLs
 * @type {{htmlReplacement: RegExp, main: RegExp, sanitize: RegExp}}
 */
const regex = {
    // eslint-disable-next-line no-useless-escape
    sanitize: /^https:\/\/3speak\.(?:online|co)\/embed\?v=([A-Za-z0-9_\-\/]+)(&.*)?$/,
    // eslint-disable-next-line no-useless-escape
    main: /(?:https?:\/\/(?:(?:3speak\.(?:online|co)\/watch\?v=)|(?:3speak\.(?:online|co)\/embed\?v=)))([A-Za-z0-9_\-\/]+)(&.*)?/i,
    // eslint-disable-next-line no-useless-escape
    htmlReplacement: /<a href="(https?:\/\/3speak\.(?:online|co)\/watch\?v=([A-Za-z0-9_\-\/]+))".*<img.*?><\/a>/i,
    embedShorthand: /~~~ embed:(.*?)\/(.*?) threespeak ~~~/,
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

/**
 * Generates the Markdown/HTML code to override the detected URL with an iFrame
 *
 * @param idx
 * @param threespeakId
 * @param width
 * @param height
 * @returns {*}
 */
export function genIframeMd(idx, threespeakId, width, height) {
    const url = `https://3speak.co/embed?v=${threespeakId}`;

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
        <div key={`threespeak-${threespeakId}-${idx}`} className="videoWrapper">
            <iframe
                title="3Speak embedded player"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...iframeProps}
            />
        </div>
    );
}

/**
 * Check if the iframe code in the post editor is to an allowed URL
 * <iframe src="https://3speak.co/embed?v=threespeak/iaarkpvf"></iframe>
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
        return `https://3speak.co/embed?v=${match[1]}`;
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
        thumbnail: `https://img.3speakcontent.co/${id}/post.png`,
    };
}

/**
 * Replaces the URL with a custom Markdown for embedded players
 * @param child
 * @param links
 * @returns {*}
 */
export function embedNode(child, links, images) {
    try {
        const { data } = child;
        const threespeak = extractMetadata(data);

        if (threespeak) {
            child.data = data.replace(
                threespeak.url,
                `~~~ embed:${threespeak.fullId} threespeak ~~~`
            );

            if (links) {
                links.add(threespeak.canonical);
            }

            if (images) {
                images.add(threespeak.thumbnail);
            }
        } else {
            // Because we are processing 3speak embed player with the preprocessHtml() method below
            // extractMetadata won't be able to extract the thumbnail from the shorthand.
            // So we are handling thumbnail URL extraction differently.
            const match = data.match(regex.embedShorthand);
            if (match && images) {
                const imageUrl = `https://img.3speakcontent.co/${
                    match[2]
                }/post.png`;
                images.add(imageUrl);
            }
        }
    } catch (error) {
        console.log(error);
    }

    return child;
}

/**
 * Pre-process HTML codes from the Markdown before it gets transformed
 * @param child
 * @returns {string}
 */
export function preprocessHtml(child) {
    try {
        if (typeof child === 'string') {
            // If typeof child is a string, this means we are trying to process the HTML
            // to replace the image/anchor tag created by 3Speak dApp
            const threespeak = extractMetadata(child);
            if (threespeak) {
                child = child.replace(
                    regex.htmlReplacement,
                    `~~~ embed:${threespeak.fullId} threespeak ~~~`
                );
            }
        }
    } catch (error) {
        console.log(error);
    }

    return child;
}
