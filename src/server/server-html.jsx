import * as config from 'config';
import React from 'react';
import { APP_NAME, FACEBOOK_CONFIG } from 'app/client_config';

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
    pathname,
    reviveEnabled,
    shouldSeeCookieConsent,
    cookieConsentApiKey,
}) {
    let page_title = title;
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta property="fb:app_id" content={FACEBOOK_CONFIG.APP_ID} />
                {meta &&
                    meta.map(m => {
                        if (m.title) {
                            page_title = m.title;
                            return null;
                        }
                        if (m.canonical)
                            return (
                                <link
                                    key="canonical"
                                    rel="canonical"
                                    href={m.canonical}
                                />
                            );
                        if (m.name && m.content)
                            return (
                                <meta
                                    key={m.name}
                                    name={m.name}
                                    content={m.content}
                                />
                            );
                        if (m.property && m.content)
                            return (
                                <meta
                                    key={m.property}
                                    property={m.property}
                                    content={m.content}
                                />
                            );
                        return null;
                    })}
                <link rel="manifest" href="/static/manifest.json" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
                <link
                    rel="apple-touch-icon"
                    sizes="57x57"
                    href="/apple-icon-57x57.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="60x60"
                    href="/apple-icon-60x60.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="72x72"
                    href="/apple-icon-72x72.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="76x76"
                    href="/apple-icon-76x76.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="114x114"
                    href="/apple-icon-114x114.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="120x120"
                    href="/apple-icon-120x120.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="144x144"
                    href="/apple-icon-144x144.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="152x152"
                    href="/apple-icon-152x152.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-icon-180x180.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="192x192"
                    href="/android-icon-192x192.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="96x96"
                    href="/favicon-96x96.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/manifest.json" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta
                    name="msapplication-TileImage"
                    content="/ms-icon-144x144.png"
                />
                <meta name="theme-color" content="#ffffff" />
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
                {assets.style.map((href, idx) => (
                    <link
                        href={href}
                        key={idx}
                        rel="stylesheet"
                        type="text/css"
                    />
                ))}
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
                    <script
                        src="//m.servedby-buysellads.com/monetization.js"
                        type="text/javascript"
                    />
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
                <title>{page_title}</title>
            </head>
            <body>
                {
                    <div
                        id="content"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                }
                {assets.script.map((href, idx) => (
                    <script key={idx} src={href} />
                ))}
                {gptEnabled ? (
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
                ) : null}
            </body>
        </html>
    );
}
