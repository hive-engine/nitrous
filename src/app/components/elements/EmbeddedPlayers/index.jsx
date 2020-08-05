import {
    genIframeMd as genDtubeIframeMd,
    validateIframeUrl as validateDtubeIframeUrl,
    normalizeEmbedUrl as normalizeDtubeEmbedUrl,
    embedNode as embedDtubeNode,
    sandboxConfig as sandboxConfigDtube,
} from 'app/components/elements/EmbeddedPlayers/dtube';

import {
    genIframeMd as genTwitchIframeMd,
    validateIframeUrl as validateTwitchIframeUrl,
    normalizeEmbedUrl as normalizeTwitchEmbedUrl,
    embedNode as embedTwitchNode,
    sandboxConfig as sandboxConfigTwitch,
} from 'app/components/elements/EmbeddedPlayers/twitch';

import {
    validateIframeUrl as validateSoundcloudIframeUrl,
    sandboxConfig as sandboxConfigSoundcloud,
} from 'app/components/elements/EmbeddedPlayers/soundcloud';

import {
    genIframeMd as genYoutubeIframeMd,
    validateIframeUrl as validateYoutubeIframeUrl,
    normalizeEmbedUrl as normalizeYoutubeEmbedUrl,
    embedNode as embedYoutubeNode,
    sandboxConfig as sandboxConfigYoutube,
} from 'app/components/elements/EmbeddedPlayers/youtube';

import {
    genIframeMd as genVimeoIframeMd,
    validateIframeUrl as validateVimeoIframeUrl,
    normalizeEmbedUrl as normalizeVimeoEmbedUrl,
    embedNode as embedVimeoNode,
    sandboxConfig as sandboxConfigVimeo,
} from 'app/components/elements/EmbeddedPlayers/vimeo';

import {
    genIframeMd as genThreespeakIframeMd,
    validateIframeUrl as validateThreespeakIframeUrl,
    normalizeEmbedUrl as normalizeThreespeakEmbedUrl,
    embedNode as embedThreeSpeakNode,
    preprocessHtml as preprocess3SpeakHtml,
    sandboxConfig as sandboxConfigThreespeak,
} from 'app/components/elements/EmbeddedPlayers/threespeak';

import {
    genIframeMd as genTwitterIframeMd,
    validateIframeUrl as validateTwitterIframeUrl,
    normalizeEmbedUrl as normalizeTwitterEmbedUrl,
    embedNode as embedTwitterNode,
    preprocessHtml as preprocessTwitterHtml,
    sandboxConfig as sandboxConfigTwitter,
} from 'app/components/elements/EmbeddedPlayers/twitter';

import {
    validateIframeUrl as validateDapplrVideoUrl,
    sandboxConfig as sandboxConfigDapplr,
} from 'app/components/elements/EmbeddedPlayers/dapplr';

// Set only those attributes in `sandboxAttributes`, that are minimally
// required for a given provider.
// When the embedded document has the same origin as the embedding page,
// it is strongly discouraged to use both allow-scripts
// and allow-same-origin, as that lets the embedded document remove
// the sandbox attribute — making it no more secure than not using
// the sandbox attribute at all. Also note that the sandbox attribute
// is unsupported in Internet Explorer 9 and earlier.
// See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe.

const supportedProviders = [
    {
        id: 'dtube',
        validateIframeUrlFn: validateDtubeIframeUrl,
        normalizeEmbedUrlFn: normalizeDtubeEmbedUrl,
        embedNodeFn: embedDtubeNode,
        genIframeMdFn: genDtubeIframeMd,
        ...sandboxConfigDtube,
    },
    {
        id: 'twitch',
        validateIframeUrlFn: validateTwitchIframeUrl,
        normalizeEmbedUrlFn: normalizeTwitchEmbedUrl,
        embedNodeFn: embedTwitchNode,
        genIframeMdFn: genTwitchIframeMd,
        ...sandboxConfigTwitch,
    },
    {
        id: 'soundcloud',
        validateIframeUrlFn: validateSoundcloudIframeUrl,
        normalizeEmbedUrlFn: null,
        embedNodeFn: null,
        genIframeMdFn: null,
        ...sandboxConfigSoundcloud,
    },
    {
        id: 'youtube',
        validateIframeUrlFn: validateYoutubeIframeUrl,
        normalizeEmbedUrlFn: normalizeYoutubeEmbedUrl,
        embedNodeFn: embedYoutubeNode,
        genIframeMdFn: genYoutubeIframeMd,
        ...sandboxConfigYoutube,
    },
    {
        id: 'vimeo',
        validateIframeUrlFn: validateVimeoIframeUrl,
        normalizeEmbedUrlFn: normalizeVimeoEmbedUrl,
        embedNodeFn: embedVimeoNode,
        genIframeMdFn: genVimeoIframeMd,
        ...sandboxConfigVimeo,
    },
    {
        id: 'threespeak',
        validateIframeUrlFn: validateThreespeakIframeUrl,
        normalizeEmbedUrlFn: normalizeThreespeakEmbedUrl,
        embedNodeFn: embedThreeSpeakNode,
        genIframeMdFn: genThreespeakIframeMd,
        ...sandboxConfigThreespeak,
    },
    {
        id: 'twitter',
        validateIframeUrlFn: validateTwitterIframeUrl,
        normalizeEmbedUrlFn: normalizeTwitterEmbedUrl,
        embedNodeFn: embedTwitterNode,
        genIframeMdFn: genTwitterIframeMd,
        ...sandboxConfigTwitter,
    },
    {
        id: 'dapplr',
        validateIframeUrlFn: validateDapplrVideoUrl,
        normalizeEmbedUrlFn: null,
        embedNodeFn: null,
        genIframeMdFn: null,
        ...sandboxConfigDapplr,
    },
];

export default supportedProviders;

/**
 * Allow iFrame in the Markdown if the source URL is allowed
 * @param url
 * @returns { boolean | { providerId: string, sandboxAttributes: string[], useSandbox: boolean, validUrl: string }}
 */
export function validateIframeUrl(url) {
    for (let pi = 0; pi < supportedProviders.length; pi += 1) {
        const provider = supportedProviders[pi];

        const validUrl = provider.validateIframeUrlFn(url);

        if (validUrl !== false) {
            console.log(`Found a valid ${provider.id} iframe URL`);
            return {
                providerId: provider.id,
                sandboxAttributes: provider.sandboxAttributes || [],
                useSandbox: provider.useSandbox,
                validUrl,
            };
        }
    }

    return false;
}

/**
 * Rewrites the embedded URL to a normalized format
 * @param url
 * @returns {boolean|*}
 */
export function normalizeEmbedUrl(url) {
    for (let pi = 0; pi < supportedProviders.length; pi += 1) {
        const provider = supportedProviders[pi];

        if (typeof provider.normalizeEmbedUrlFn === 'function') {
            const validEmbedUrl = provider.normalizeEmbedUrlFn(url);

            if (validEmbedUrl !== false) {
                console.log(`Found a valid ${provider.id} embedded URL`);
                return validEmbedUrl;
            }
        }
    }

    return false;
}

/**
 * Replaces the URL with a custom Markdown for embedded players
 * @param child
 * @param links
 * @param images
 * @returns {*}
 */
export function embedNode(child, links, images) {
    for (let pi = 0; pi < supportedProviders.length; pi += 1) {
        const provider = supportedProviders[pi];

        if (typeof provider.embedNodeFn === 'function') {
            child = provider.embedNodeFn(child, links, images);
        }
    }

    return child;
}

/**
 * Returns the provider config by ID
 * @param id
 * @returns {null|{normalizeEmbedUrlFn, validateIframeUrlFn, id: string, genIframeMdFn, embedNodeFn}|{normalizeEmbedUrlFn, validateIframeUrlFn, id: string, genIframeMdFn, embedNodeFn}|{normalizeEmbedUrlFn: null, validateIframeUrlFn, id: string, genIframeMdFn: null, embedNodeFn: null}|{normalizeEmbedUrlFn, validateIframeUrlFn, id: string, genIframeMdFn, embedNodeFn}|{normalizeEmbedUrlFn, validateIframeUrlFn, id: string, genIframeMdFn, embedNodeFn}}
 */
function getProviderById(id) {
    for (let pi = 0; pi < supportedProviders.length; pi += 1) {
        const provider = supportedProviders[pi];

        if (provider.id === id) {
            return provider;
        }
    }

    return null;
}

/**
 * Returns all providers IDs
 * @returns {(string)[]}
 */
function getProviderIds() {
    return supportedProviders.map(o => {
        return o.id;
    });
}

/**
 * Replaces ~~~ embed: Markdown code to an iframe MD
 * @param section
 * @param idx
 * @param large
 * @returns {null|{markdown: null, section: string}}
 */
export function generateMd(section, idx, large) {
    let markdown = null;
    const supportedProvidersIds = getProviderIds();
    const regexString = `^([A-Za-z0-9\\?\\=\\_\\-\\/\\.]+) (${supportedProvidersIds.join(
        '|'
    )})\\s?(.*?) ~~~`;
    const regex = new RegExp(regexString);
    const match = section.match(regex);

    if (match && match.length >= 3) {
        const id = match[1];
        const type = match[2];
        const metadataString = match[3];
        let metadata;
        if (metadataString.indexOf('metadata:') === -1) {
            metadata = match[3] ? parseInt(match[3]) : 0;
        } else {
            metadata = metadataString.substring(9);
        }

        const w = large ? 640 : 480,
            h = large ? 360 : 270;

        const provider = getProviderById(type);
        if (provider) {
            markdown = provider.genIframeMdFn(idx, id, w, h, metadata);
        } else {
            console.error('MarkdownViewer unknown embed type', type);
        }

        if (match[3]) {
            section = section.substring(
                `${id} ${type} ${metadataString} ~~~`.length
            );
        } else {
            section = section.substring(`${id} ${type} ~~~`.length);
        }

        return {
            section,
            markdown,
        };
    }

    return null;
}

/**
 * Pre-process HTML codes from the Markdown before it gets transformed
 * @param html
 * @returns {*}
 */
export function preprocessHtml(html) {
    html = preprocess3SpeakHtml(html);
    html = preprocessTwitterHtml(html);
    return html;
}
