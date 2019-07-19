import * as config from 'config';
import React from 'react';
import { APP_NAME } from 'app/client_config';

export default function ServerHTML({
    body,
    assets,
    locale,
    title,
    meta,
    shouldSeeAds,
    adClient,
    gptEnabled,
    gptBidding,
    fomoId,
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
                    href="/images/favicons/apple-icon-57x57.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="60x60"
                    href="/images/favicons/apple-icon-60x60.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="72x72"
                    href="/images/favicons/apple-icon-72x72.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="76x76"
                    href="/images/favicons/apple-icon-76x76.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="114x114"
                    href="/images/favicons/apple-icon-114x114.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="120x120"
                    href="/images/favicons/apple-icon-120x120.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="144x144"
                    href="/images/favicons/apple-icon-144x144.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="152x152"
                    href="/images/favicons/apple-icon-152x152.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/images/favicons/apple-icon-180x180.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="192x192"
                    href="/images/favicons/android-icon-192x192.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/images/favicons/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="96x96"
                    href="/images/favicons/favicon-96x96.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/images/favicons/favicon-16x16.png"
                />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta
                    name="msapplication-TileImage"
                    content="/images/favicons/ms-icon-144x144.png"
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
                            var freestar = freestar || {};
                            freestar.hitTime = Date.now();
                            freestar.queue = freestar.queue || [];
                            freestar.config = freestar.config || {};
                            freestar.debug =
                            window.location.search.indexOf("fsdebug") === -1 ? false : true; // NICE.
                            freestar.config.enabled_slots = [];

                            !(function(a, b) {
                            var c = b.getElementsByTagName("script")[0],
                              d = b.createElement("script"),
                              e = "https://a.pub.network/steemit-com";
                            (e += freestar.debug ? "/qa/pubfig.min.js" : "/pubfig.min.js"),
                              (d.async = !0),
                              (d.src = e),
                              c.parentNode.insertBefore(d, c);
                            })(window, document);
                        `,
                        }}
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
            </body>
        </html>
    );
}
