import React from 'react';

/**
 * Regular expressions for detecting and validating provider URLs
 * @type {{htmlReplacement: RegExp, main: RegExp, sanitize: RegExp}}
 */
const regex = {
    sanitize: /^(https?:)?\/\/player\.twitch\.tv\/\?(channel|video)=([A-Za-z0-9]+)/i,
    main: /https?:\/\/(?:www.)?twitch\.tv\/(?:(videos)\/)?([a-zA-Z0-9][\w]{3,24})/i,
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

function getParentDomain() {
    let parentDomain = $STM_Config.site_domain;
    if (typeof window !== 'undefined') {
        parentDomain = window.location.hostname;
    }

    return parentDomain;
}

/**
 * Check if the iframe code in the post editor is to an allowed URL
 * <iframe src="https://player.twitch.tv/?channel=tfue" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>
 * @param url
 * @returns {boolean|*}
 */
export function validateIframeUrl(url) {
    const match = url.match(regex.sanitize);

    if (match) {
        return `https://player.twitch.tv/?${match[2]}=${
            match[3]
        }&parent=${getParentDomain()}`;
    }

    return false;
}

/**
 * Rewrites the embedded URL to a normalized format
 * @param url
 * @returns {string|boolean}
 */
export function normalizeEmbedUrl(url) {
    const match = url.match(regex.main);

    if (match && match.length >= 3) {
        if (match[1] === undefined) {
            return `https://player.twitch.tv/?autoplay=false&channel=${
                match[2]
            }&parent=${getParentDomain()}`;
        }

        return `https://player.twitch.tv/?autoplay=false&video=${
            match[1]
        }&parent=${getParentDomain()}`;
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

    if (!m || m.length < 3) return null;

    return {
        id: m[1] === `videos` ? `?video=${m[2]}` : `?channel=${m[2]}`,
        url: m[0],
        canonical:
            m[1] === `videos`
                ? `https://player.twitch.tv/?video=${
                      m[2]
                  }&parent=${getParentDomain()}`
                : `https://player.twitch.tv/?channel=${
                      m[2]
                  }&parent=${getParentDomain()}`,
    };
}

export function embedNode(child, links /*images*/) {
    try {
        const { data } = child;
        const twitch = extractMetadata(data);
        if (!twitch) return child;

        child.data = data.replace(
            twitch.url,
            `~~~ embed:${twitch.id} twitch ~~~`
        );

        if (links) links.add(twitch.canonical);
    } catch (error) {
        console.error(error);
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
    const url = `https://player.twitch.tv/${id}?parent=${getParentDomain()}`;

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
        allowFullScreen: 'allowFullScreen',
    };
    if (sandbox) {
        iframeProps.sandbox = sandbox;
    }

    return (
        <div key={`twitch-${id}-${idx}`} className="videoWrapper">
            <iframe
                title="Twitch embedded player"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...iframeProps}
            />
        </div>
    );
}
