import * as config from 'config';
import React from 'react';

export default function ServerHTML({
    body,
    assets,
    locale,
    title,
    meta,
    shouldSeeAds,
    adClient,
    gptEnabled,
    gptBannedTags,
    gptBidding,
    fomoId,
    reviveEnabled,
    shouldSeeCookieConsent,
    cookieConsentApiKey,
    hostConfig,
}) {
    let page_title = title;
    const faviconSubfolder = hostConfig['LIQUID_TOKEN_UPPERCASE'].toLowerCase();
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                {meta &&
                    meta.map(m => {
                        if (m.title) {
                            page_title = m.title;
                            return null;
                        }
                        if (m.canonical) return <link key="canonical" rel="canonical" href={m.canonical} />;
                        if (m.name && m.content) return <meta key={m.name} name={m.name} content={m.content} />;
                        if (m.property && m.content)
                            return <meta key={m.property} property={m.property} content={m.content} />;
                        return null;
                    })}
                <link
                    rel="manifest"
                    href={`/static/${faviconSubfolder}/manifest.json`}
                />
                <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
                <link
                    rel="apple-touch-icon"
                    sizes="57x57"
                    href={`/images/favicons/${
                        faviconSubfolder
                    }/apple-icon-57x57.png`}
                />
                <link
                    rel="apple-touch-icon"
                    sizes="60x60"
                    href={`/images/favicons/${
                        faviconSubfolder
                    }/apple-icon-60x60.png`}
                />
                <link
                    rel="apple-touch-icon"
                    sizes="72x72"
                    href={`/images/favicons/${
                        faviconSubfolder
                    }/apple-icon-72x72.png`}
                />
                <link
                    rel="apple-touch-icon"
                    sizes="76x76"
                    href={`/images/favicons/${
                        faviconSubfolder
                    }/apple-icon-76x76.png`}
                />
                <link
                    rel="apple-touch-icon"
                    sizes="114x114"
                    href={`/images/favicons/${
                        faviconSubfolder
                    }/apple-icon-114x114.png`}
                />
                <link
                    rel="apple-touch-icon"
                    sizes="120x120"
                    href={`/images/favicons/${
                        faviconSubfolder
                    }/apple-icon-120x120.png`}
                />
                <link
                    rel="apple-touch-icon"
                    sizes="144x144"
                    href={`/images/favicons/${
                        faviconSubfolder
                    }/apple-icon-144x144.png`}
                />
                <link
                    rel="apple-touch-icon"
                    sizes="152x152"
                    href={`/images/favicons/${
                        faviconSubfolder
                    }/apple-icon-152x152.png`}
                />
                <link
                    href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600"
                    rel="stylesheet"
                    type="text/css"
                />
                <link
                    href="https://fonts.googleapis.com/css?family=Source+Serif+Pro:400,600"
                    rel="stylesheet"
                    type="text/css"
                />
                {assets.style.map((href, idx) => <link href={href} key={idx} rel="stylesheet" type="text/css" />)}
                {gptEnabled ? (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            (function() {
                              var bsa_optimize = document.createElement('script');
                              window.optimize = { queue: [] };
                              bsa_optimize.type = 'text/javascript';
                              bsa_optimize.async = true;
                              bsa_optimize.src = 'https://cdn-s2s.buysellads.net/pub/steemit.js?' + (new Date() - new Date() % 3600000);
                              (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(bsa_optimize);
                            })();
                        `,
                        }}
                    />
                ) : null}
                {gptEnabled ? (
                    <script src="//m.servedby-buysellads.com/monetization.js" type="text/javascript" />
                ) : null}
                {shouldSeeCookieConsent ? (
                    <script
                        id="Cookiebot"
                        src="https://consent.cookiebot.com/uc.js"
                        data-cbid={cookieConsentApiKey}
                        type="text/javascript"
                        async
                    />
                ) : null}
                {hostConfig['GOOGLE_AD_CLIENT'] ? (
                    <script
                        async
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                    />
                ) : null}
                {hostConfig['GOOGLE_AD_CLIENT'] ? (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                      (adsbygoogle = window.adsbygoogle || []).push({
                          google_ad_client: "${hostConfig['GOOGLE_AD_CLIENT']}",
                          enable_page_level_ads: true
                      });
                  `,
                        }}
                    />
                ) : null}
                {fomoId ? (
                    <script
                        async
                        type="text/javascript"
                        src={`https://load.fomo.com/ads/load.js?id=${fomoId}`}
                    />
                ) : null}
                {reviveEnabled ? (
                    <script
                        async
                        src="//servedby.revive-adserver.net/asyncjs.php"
                    />
                ) : null}
                {hostConfig['DISCORD_SERVER'] ? (
                    <script
                        src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3"
                        async
                        defer
                        dangerouslySetInnerHTML={{
                            __html: `
                      new Crate({
                              server: "${hostConfig['DISCORD_SERVER']}",
                              channel: "${hostConfig['DISCORD_CHANNEL']}",
                            });`,
                        }}
                    />
                ) : null}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        window.twttr = (function(d, s, id) {
                            var js, fjs = d.getElementsByTagName(s)[0],
                            t = window.twttr || {};
                            if (d.getElementById(id)) return t;
                            js = d.createElement(s);
                            js.id = id;
                            js.src = "https://platform.twitter.com/widgets.js";
                            fjs.parentNode.insertBefore(js, fjs);

                            t._e = [];
                            t.ready = function(f) {
                            t._e.push(f);
                        };

                            return t;
                        }(document, "script", "twitter-wjs"));
                        `,
                    }}
                />
                <script async src="https://embed.redditmedia.com/widgets/platform.js" charSet="UTF-8" />
                <title>{page_title}</title>
            </head>
            <body>
                {<div id="content" dangerouslySetInnerHTML={{ __html: body }} />}
                {assets.script.map((href, idx) => <script key={idx} src={href} />)}
                {/* gptEnabled ? (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            (function(){
                              if(typeof _bsa !== 'undefined' && _bsa) {
                                _bsa.init('fancybar', 'CE7D653L', 'placement:steemitcom');
                              }
                            })();
                        `,
                        }}
                    />
                      ) : null*/}
            </body>
        </html>
    );
}
