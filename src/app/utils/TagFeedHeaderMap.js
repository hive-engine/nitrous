const map = {
    // default
    '':
        "<!DOCTYPE html>
        <html>
        <body>

        <div class="tradingview-widget-container">
            <div class="tradingview-widget-container__widget"></div>
            <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com" rel="noopener" target="_blank">           <span class="blue-text">Ticker Tape</span></a> by TradingView</div>
            <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js" async>
            {
            "symbols": [
             {
                "title": "S&P 500",
                "proName": "OANDA:SPX500USD"
             },
             {
                "title": "Nasdaq 100",
                "proName": "OANDA:NAS100USD"
             },
             {
                "title": "EUR/USD",
                "proName": "FX_IDC:EURUSD"
             },
             {
                "title": "BTC/USD",
                "proName": "BITSTAMP:BTCUSD"
             },
             {
                "title": "ETH/USD",
                "proName": "BITSTAMP:ETHUSD"
             }
           ],
           "colorTheme": "light",
           "isTransparent": false,
           "displayMode": "adaptive",
           "locale": "en"
        }
           </script>
        </div>

</body>
</html>",

    trending:
        "trending test 2",
    hot:
        "hot test",
};

export default map;
