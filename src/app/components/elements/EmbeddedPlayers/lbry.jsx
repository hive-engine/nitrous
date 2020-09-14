const regex = {
    sanitize: /^(https?:)?\/\/lbry.tv\/.*/i,
};

export default regex;
export const sandboxConfig = {
    useSandbox: true,
    sandboxAttributes: ['allow-scripts', 'allow-same-origin', 'allow-popups'],
};

//<iframe id="lbry-iframe" width="560" height="315" src="https://lbry.tv/$/embed/the-one-and-only-ivan-helen-mirren/f872ad523a906cd12e3c947f45ce25e366a5620f" allowfullscreen></iframe>
export function validateIframeUrl(url) {
    const match = url.match(regex.sanitize);
    if (!match || match.length !== 2) {
        return false;
    }
    return `${match[0]}`;
}
