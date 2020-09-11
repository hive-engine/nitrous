import React from 'react';

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
    validateIframeUrl as validateLbryIframeUrl,
    sandboxConfig as sandboxConfigLbry,
} from 'app/components/elements/EmbeddedPlayers/lbry';

import {
    validateIframeUrl as validateWistiaIframeUrl,
    sandboxConfig as sandboxConfigWistia,
    genIframeMd as genWistiaIframeMd,
    normalizeEmbedUrl as normalizeWistiaEmbedUrl,
    embedNode as embedWistiaNode,
} from 'app/components/elements/EmbeddedPlayers/wistia';

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
} from 'app/components/elements/EmbeddedPlayers/twitter';

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
        genIframeMdFn: embedTwitchNode,
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
        id: 'lbry',
        validateIframeUrlFn: validateLbryIframeUrl,
        normalizeEmbedUrlFn: null,
        embedNodeFn: null,
        genIframeMdFn: null,
        ...sandboxConfigLbry,
    },
    {
        id: 'twitter',
        validateIframeUrlFn: validateTwitterIframeUrl,
        normalizeEmbedUrlFn: normalizeTwitterEmbedUrl,
        embedNodeFn: embedTwitterNode,
        genIframeMdFn: genTwitterIframeMd,
    },
	{
        id: 'wistia',
        validateIframeUrlFn: validateWistiaIframeUrl,
        normalizeEmbedUrlFn: normalizeWistiaEmbedUrl,
        embedNodeFn: embedWistiaNode,
        genIframeMdFn: genWistiaIframeMd,
        ...sandboxConfigWistia,
    },

];

export default supportedProviders;

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

export function embedNode(child, links, images) {
    for (let pi = 0; pi < supportedProviders.length; pi += 1) {
        const provider = supportedProviders[pi];

        if (typeof provider.embedNodeFn === 'function') {
            child = provider.embedNodeFn(child, links, images);
        }
    }

    return child;
}

function getProviderById(id) {
    for (let pi = 0; pi < supportedProviders.length; pi += 1) {
        const provider = supportedProviders[pi];

        if (provider.id === id) {
            return provider;
        }
    }

    return null;
}

function getProviderIds() {
    return supportedProviders.map(o => {
        return o.id;
    });
}

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
export function preprocessHtml(html) {
    html = preprocess3SpeakHtml(html);
    html = preprocessTwitterHtml(html);
    return html;
}
