import React from 'react';

/**
 * Regular expressions for detecting and validating provider URLs
 * @type {{htmlReplacement: RegExp, main: RegExp, sanitize: RegExp}}
 */
//<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Calling parents struggling with juggling act of kids &lt; 3yrs + additional needs, + shielding risk parent + demanding jobs? How are you coping? What changes have you made? Advice appreciated! Hubs &amp; I are beyond exhausted!</p>&mdash; Kuldeep Bahia (@missybahia) <a href="https://twitter.com/missybahia/status/1281295770298318849?ref_src=twsrc%5Etfw">July 9, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
const regex = {
    main: /(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*))))/i,
    sanitize: /(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*))))/i,
};

export default regex;

/**
 * Extract the content ID and other metadata from the URL
 * @param data
 * @returns {null|{id: *, canonical: string, url: *}}
 */
export function extractMetadata(data) {
    if (!data) return null;

    const match = data.match(regex.main);
    if (match) {
        const id = match[2];

        return {
            id,
            fullId: id,
            url: null,
            canonical: null,
            thumbnail: null,
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
        return `https://twitter.com/${match[1]}/status/${tweetId}`;
    }

    return false;
}

/**
 * Generates the Markdown/HTML code to override the detected URL with an iFrame
 * @param idx
 * @param threespeakId
 * @param w
 * @param h
 * @returns {*}
 */
export function genIframeMd(idx, twitterId, w, h, metadata) {
    // const parameters = atob(metadata).split('|');
    let parentUrl = $STM_Config.site_domain;
    if (typeof window !== 'undefined') {
        parentUrl = window.location.href;
    }

    return (
        <div key={`twitter-${twitterId}-${idx}`} className="tweetWrapper">
            <iframe
                title="Twitter tweet"
                key={idx}
                src={`https://platform.twitter.com/embed/index.html?dnt=true&embedId=twitter-widget-0&frame=false&hideCard=false&hideThread=false&id=${
                    twitterId
                }&lang=en&origin=${
                    parentUrl
                }&theme=light&widgetsVersion=9066bb2%3A1593540614199&width=550px`}
                width="550"
                height="245"
                frameBorder="0"
                allowFullScreen
            />
        </div>
    );
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
        const twitter = extractMetadata(data);

        if (twitter) {
            child.data = data.replace(
                regex.main,
                `~~~ embed:${twitter.id} twitter ~~~`
            );
        }
    } catch (error) {
        console.log(error);
    }

    return child;
}
