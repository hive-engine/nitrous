import React from 'react';
import EmbeddedGist from './EmbeddedGist';

/**
 * Regular expressions for detecting and validating provider URLs
 * @type {{htmlReplacement: RegExp, main: RegExp, sanitize: RegExp}}
 */
// <script src="https://gist.github.com/huysbs/647a50197b95c4027550a2cc558af6aa.js"></script>
const regex = {
    main: /(https?:\/\/gist\.github\.com\/((.*?)\/(.*)))/i,
    sanitize: /(https:\/\/gist\.github\.com\/((.*?)\/(.*?))\.js)/i,
    htmlReplacement: /<script src="(https:\/\/gist\.github\.com\/((.*?)\/(.*?))\.js)"><\/script>/i,
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
        const url = match[1];
        const fullId = match[2];
        const username = match[3];
        const id = match[4];

        return {
            id,
            fullId,
            url,
            canonical: url,
            thumbnail: null,
            username,
        };
    }

    return null;
}

/**
 * Extract the content ID and other metadata from the URL
 * @param data
 * @returns {null|{id: *, canonical: string, url: *}}
 */
export function extractMetadata(data) {
    if (!data) return null;

    const match = data.match(regex.main);
    if (match) {
        const url = match[1];
        const fullId = match[2];
        const username = match[3];
        const id = match[4];

        return {
            id,
            fullId,
            url,
            canonical: null,
            thumbnail: null,
            username,
        };
    }

    return null;
}

/**
 * Generates the Markdown/HTML code to override the detected URL with an iFrame
 * @param idx
 * @param gistId
 * @param w
 * @param h
 * @param metadata
 * @returns {*}
 */
export function genIframeMd(idx, gistId, w, h, metadata) {
    if (typeof window !== 'undefined') {
        const fullId = Buffer.from(metadata, 'base64').toString();

        return <EmbeddedGist key={fullId} gist={fullId} />;
    }

    return null;
}

/**
 * Replaces the URL with a custom Markdown for embedded players
 * @param child
 * @returns {*}
 */
export function embedNode(child) {
    try {
        const { data } = child;
        const gist = extractMetadata(data);

        if (gist) {
            child.data = data.replace(
                regex.main,
                `~~~ embed:${gist.id} gist metadata:${Buffer.from(gist.fullId).toString('base64')} ~~~`
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
            const gist = extractMetadataFromEmbedCode(child);
            if (gist) {
                child = child.replace(
                    regex.htmlReplacement,
                    `~~~ embed:${gist.id} gist metadata:${Buffer.from(gist.fullId).toString('base64')} ~~~`
                );
            }
        }
    } catch (error) {
        console.log(error);
    }

    return child;
}
