/**
 * Regular expressions for detecting and validating provider URLs
 * @type {{htmlReplacement: RegExp, main: RegExp, sanitize: RegExp}}
 */
const regex = {
    sanitize: /^(https?:)?\/\/[a-z]*\.dapplr.in\/file\/dapplr-videos\/.*/i,
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
 * Check if the iframe code in the post editor is to an allowed URL
 * <iframe src="https://*.dapplr.in/file/dapplr-videos/" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>
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
