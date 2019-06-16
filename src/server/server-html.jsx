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
    pathname,
}) {
    let page_title = title;
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    http-equiv="Content-Security-Policy"
                    content="default-src 'self' https://tool.steem.world/assets/js/aaa/"
                />
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
                        async
                        src="https://www.googletagservices.com/tag/js/gpt.js"
                    />
                ) : null}
                {gptEnabled ? (
                    <script src="https://staticfiles.steemit.com/prebid2.12.0.js" />
                ) : null}
                {gptEnabled ? (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                // TODO: Move the follow values into config
                                //       a new config file for ads would be good
                                var PREBID_TIMEOUT = 2000;
                                var FAILSAFE_TIMEOUT = 3000;
                                var adUnits = [
                                  {
                                    code: "div-gpt-ad-1551233873698-0",
                                    mediaTypes: {
                                      banner: {
                                        sizes: [728, 90]
                                      }
                                    },
                                    bids: [
                                      {
                                        bidder: "coinzilla",
                                        params: {
                                          placementId: "6425c7b9886e0045972"
                                        }
                                      }
                                    ]
                                  },
                                  {
                                    code: "div-gpt-ad-1554687231046-0",
                                    mediaTypes: {
                                      banner: {
                                        sizes: [160, 600]
                                      }
                                    },
                                    bids: [
                                      {
                                        bidder: "coinzilla",
                                        params: {
                                          placementId: "3575c7b9886e2cb3619"
                                        }
                                      }
                                    ]
                                  }
                                ];
                                const customConfigObject = {
                                  buckets: [
                                    {
                                      precision: 2,
                                      min: 0,
                                      max: 1,
                                      increment: 0.05
                                    },
                                    {
                                      precision: 2,
                                      min: 1,
                                      max: 8,
                                      increment: 0.1
                                    }
                                  ]
                                };
                                const systemCurrency = {
                                  adServerCurrency: "USD",
                                  granularityMultiplier: 1
                                };

                                // Begin GPT Ad Setup
                                var googletag = googletag || {};
                                googletag.cmd = googletag.cmd || [];

                                googletag.cmd.push(function() {
                                  googletag.pubads().disableInitialLoad();
                                  googletag.pubads().setTargeting("edition", ["new-york"]);
                                  googletag.pubads().collapseEmptyDivs(true, true);
                                  googletag.pubads().enableSingleRequest();
                                  googletag.enableServices();
                                });


                                // Begin Prebid Setup
                                var pbjs = pbjs || {};
                                pbjs.que = pbjs.que || [];

                                pbjs.que.push(function() {
                                  console.log('pbjs.que.push(function() {->IN THE SERVER CODE STUFFS');
                                  pbjs.addAdUnits(adUnits);
                                  pbjs.setConfig({
                                    priceGranularity: customConfigObject,
                                    currency: systemCurrency
                                  });
                                  console.log('pbjs.que.push(function() {->BEFOR requestBids');
                                  pbjs.requestBids({
                                    bidsBackHandler: initAdserver,
                                    timeout: PREBID_TIMEOUT
                                  });
                                });
                                var noBids = {}
                                function initAdserver() {
                                  console.log('function initAdserver() {', arguments)
                                  if (arguments.length > 0) {
                                    console.log('Received args @ initAdServer')
                                    noBids = pbjs.getNoBids();
                                    console.log('Result of noBids: ', noBids)
                                  }
                                  // Ensure this runs with our "failsafe" timeout
                                  for (var slotId in noBids) {
                                    var event = new Event('prebidNoBids');
                                    event.slotId = slotId;
                                    window.dispatchEvent(event);
                                    console.log('Eventing a no bid event', event)
                                  }

                                  if (pbjs.initAdserverSet) return;
                                  pbjs.initAdserverSet = true;
                                  googletag.cmd.push(function() {
                                    pbjs.que.push(function() {
                                      console.log('pbjs.que.push(function() {')
                                      pbjs.setTargetingForGPTAsync();
                                      googletag.pubads().refresh();
                                    });
                                  });
                                }

                                // TODO: Do we need to do this twice?
                                setTimeout(function() {
                                  // TODO: Why would we call initAdserver a second time but with no params?
                                  initAdserver();
                                }, FAILSAFE_TIMEOUT);

                                // Begin Globally defining possible bidding ad slots.
                                // TODO: Slot defs need to be moved to config.
                                googletag.cmd.push(function() {
                                  console.log("BiddingAd::componentDidMount::googletag.cmd.push");
                                  googletag
                                    .defineSlot(
                                      "/21784675435/steemit_bottom-of-post/steemit_bottom-of-post_prebid",
                                      [[728, 90]],
                                      "div-gpt-ad-1551233873698-0"
                                    )
                                    .addService(googletag.pubads());
                                  googletag
                                    .defineSlot(
                                      "/21784675435/steemit_left-navigation/steemit_left-navigation_prebid",
                                      [[120, 600], [160, 600]],
                                      "div-gpt-ad-1554687231046-0"
                                    )
                                    .addService(googletag.pubads());
                                  googletag.pubads().enableSingleRequest();
                                  googletag.enableServices();
                                });
                          `,
                        }}
                    />
                ) : null}
                {shouldSeeAds ? (
                    <script
                        async
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                    />
                ) : null}
                {shouldSeeAds ? (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                      (adsbygoogle = window.adsbygoogle || []).push({
                          google_ad_client: "${adClient}",
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
