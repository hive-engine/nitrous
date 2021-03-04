import React from 'react';

/**
 * Regular expressions for detecting and validating provider URLs
 * @type {{htmlReplacement: RegExp, main: RegExp, sanitize: RegExp}}
 */
/*
<blockquote class="reddit-card" data-card-created="1614855336"><a href="https://www.reddit.com/r/CryptoCurrency/comments/lxcmup/to_all_the_small_hodlers_keeping_your_coins_at_an/">To all the small hodlers, keeping your coins at an exchange might be the best thing for you</a> from <a href="http://www.reddit.com/r/CryptoCurrency">r/CryptoCurrency</a></blockquote>
<script async src="//embed.redditmedia.com/widgets/platform.js" charset="UTF-8"></script>
 */
const regex = {
    main: /(?:https?:\/\/www\.reddit\.com\/r\/((.*?)\/comments\/.*?\/.*(?:(?:\/\w+)+|\/?))$)/i,
    sanitize: /(?:https?:\/\/www\.reddit\.com\/r\/((.*?)\/comments\/.*?\/.*(?:(?:\/\w+)+|\/?))$)/i,
    htmlReplacement: /<blockquote class="reddit-card" data-card-created="([0-9]*?)"[^>]*?><a href="(https:\/\/www\.reddit\.com\/r\/(.*?))">(.*)?<\/a> from <a href=".*?">r\/(.*?)<\/a><\/blockquote>\n<script.*<\/script>/i,
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

/**
 * Extract the content ID and other metadata from the URL
 * @param data
 * @returns {null|{id: *, canonical: string, url: *}}
 */
export function extractMetadataFromEmbedCode(data) {
    if (!data) return null;

    const match = data.match(regex.htmlReplacement);
    if (match) {
        const date = match[1];
        const url = match[2];
        const fullId = match[3];
        const description = match[4];
        const group = match[5];
        const id = fullId;

        return {
            id,
            fullId,
            url,
            canonical: url,
            thumbnail: null,
            date,
            group,
            description,
        };
    }

    return null;
}

/**
 * Extract the content ID and other metadata from the URL
 * @param data
 * @returns {null|{id: *, canonical: string, url: *}}
 */
// https://www.reddit.com/r/CryptoCurrency/comments/lxcmup/to_all_the_small_hodlers_keeping_your_coins_at_an/
export function extractMetadata(data) {
    if (!data) return null;

    const match = data.match(regex.main);
    if (match) {
        const url = match[0];
        const fullId = match[1];
        const group = match[2];
        const id = fullId;

        return {
            id,
            fullId,
            url,
            canonical: null,
            thumbnail: null,
            group,
        };
    }

    return null;
}

/**
 * Check if the iframe code in the post editor is to an allowed URL
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
    const match = url.match(regex.main);

    if (match && match.length >= 2) {
        const tweetId = match[2].split('?').shift();
        return `https://www.reddit.com/${match[1]}/status/${tweetId}`;
    }

    return false;
}

function generateRedditCode(metadata) {
    let redditCode = '';
    if (metadata) {
        let [date, group, url, description] = Buffer.from(metadata, 'base64')
            .toString()
            .split('|');

        // Sanitizing input
        date = date.replace(/[^0-9]/gi, '');
        group = group.replace(/(<([^>]+)>)/gi, '');
        url = url.replace(/(<([^>]+)>)/gi, '');
        description = description.replace(/(<([^>]+)>)/gi, '');
        if (description === '') {
            description = url;
        }

        redditCode =
            `<blockquote class="reddit-card" data-created="${date}">` +
            `<a href="${url}">${description}</a>` +
            `from <a href="http://www.reddit.com/r/${group}">r/${group}</a></blockquote>`;
    }

    return {
        __html: redditCode,
    };
}

/**
 * Generates the Markdown/HTML code to override the detected URL with an iFrame
 * @param idx
 * @param redditId
 * @param w
 * @param h
 * @returns {*}
 */
export function genIframeMd(idx, redditId, w, h, metadata) {
    if (typeof window !== 'undefined') {
        return (
            <div
                key={`reddit-${redditId}-${idx}`}
                className="tweetWrapper"
                dangerouslySetInnerHTML={generateRedditCode(metadata)}
            />
        );
    }

    return null;
}

/**
 * Replaces the URL with a custom Markdown for embedded players
 * @param child
 * @param links
 * @returns {*}
 */
export function embedNode(child) {
    try {
        const { data } = child;
        const reddit = extractMetadata(data);

        if (reddit) {
            const metadata = `|${reddit.group}|${reddit.url}|`;
            child.data = data.replace(
                regex.main,
                `~~~ embed:${reddit.id} reddit metadata:${Buffer.from(metadata).toString('base64')} ~~~`
            );
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
            const reddit = extractMetadataFromEmbedCode(child);
            if (reddit) {
                const metadata = `${reddit.date}|${reddit.group}|${reddit.url}|${reddit.description}`;
                child = child.replace(
                    regex.htmlReplacement,
                    `~~~ embed:${reddit.id} reddit metadata:${Buffer.from(metadata).toString('base64')} ~~~`
                );
            }
        }
    } catch (error) {
        console.log(error);
    }

    return child;
}
