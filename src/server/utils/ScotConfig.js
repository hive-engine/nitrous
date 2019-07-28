import * as config from 'config';
import NodeCache from 'node-cache';

import { LIQUID_TOKEN_UPPERCASE, SCOT_DENOM } from 'app/client_config';
import { getScotDataAsync, getSteemPriceInfo } from 'app/utils/steemApi';

import SSC from 'sscjs';
const ssc = new SSC('https://api.steem-engine.com/rpc');

export function ScotConfig() {
    const ttl = config.scot_config_cache.ttl;
    const cache = new NodeCache({
        stdTTL: ttl,
        deleteOnExpire: false,
    });
    const key = config.scot_config_cache.key;
    cache.on('expired', (k, v) => {
        console.log('Cache key expired', k);
        if (key === k) {
            this.refresh();
        }
    });
    this.cache = cache;
    // Store empty data while we wait for the network request to complete
    this.storeEmpty().then(() => this.refresh());
}

ScotConfig.prototype.storeEmpty = function() {
    const key = config.scot_config_cache.key;
    return new Promise((res, rej) => {
        this.cache.set(
            key,
            {
                info: {
                    precision: Math.log10(SCOT_DENOM),
                },
            },
            (err, success) => {
                console.info('Storing empty Scot Config data...');
                res();
            }
        );
    });
};

ScotConfig.prototype.get = async function() {
    return new Promise((res, rej) => {
        const key = config.scot_config_cache.key;
        this.cache.get(key, (err, value) => {
            if (err) {
                console.error('Could not retrieve Scot Config data');
                res({});
                return;
            }
            res(value || {});
        });
    });
};

ScotConfig.prototype.refresh = async function() {
    console.info('Refreshing Scot Config data...');

    const key = config.scot_config_cache.key;
    try {
        const scotConfigs = await getScotDataAsync('config');
        const [scotConfig] = scotConfigs.filter(
            item => item.token === LIQUID_TOKEN_UPPERCASE
        );
        scotConfig.scotTokens = scotConfigs.map(item => ({
            ...item,
            json_metadata_value: item
                ? item.json_metadata_value.split(',')
                : [],
        }));

        const scotInfo = await getScotDataAsync('info', {
            token: LIQUID_TOKEN_UPPERCASE,
        });
        // Use client config info as backup
        if (!scotInfo.precision == null) {
            console.info('Info not found, falling back to client config');
            scotInfo.precision = Math.log10(SCOT_DENOM);
        }

        scotConfig.burn = {};

        scotConfig.burn.scotToken = scotConfig.token;
        scotConfig.burn.scotMinerToken = scotConfig.miner_tokens
            .split(':')[0]
            .replace(/\W/g, '');

        const [
            totalTokenBalance,
            tokenBurnBalance,
            totalTokenMinerBalance,
            tokenMinerBurnBalance,
        ] = await Promise.all([
            ssc.findOne('tokens', 'tokens', {
                symbol: scotConfig.burn.scotToken,
            }),
            ssc.findOne('tokens', 'balances', {
                account: 'null',
                symbol: scotConfig.burn.scotToken,
            }),
            ssc.findOne('tokens', 'tokens', {
                symbol: scotConfig.burn.scotMinerToken,
            }),
            ssc.findOne('tokens', 'balances', {
                account: 'null',
                symbol: scotConfig.burn.scotMinerToken,
            }),
        ]);

        if (totalTokenBalance) {
            scotConfig.burn.total_token_balance = totalTokenBalance;
        }
        if (tokenBurnBalance) {
            scotConfig.burn.token_burn_balance = tokenBurnBalance;
        }
        if (totalTokenMinerBalance) {
            scotConfig.burn.total_token_miner_balances = totalTokenMinerBalance;
        }
        if (tokenMinerBurnBalance) {
            scotConfig.burn.token_miner_burn_balances = tokenMinerBurnBalance;
        }

        const allPrice = await getSteemPriceInfo();
        scotConfig.info = {};
        scotConfig.info.scotToken = scotConfig.token;
        scotConfig.info.sct_to_steemp = allPrice[0].se_token_prices.SCT;
        scotConfig.info.steem_to_dollor = allPrice[0].steem_price;
        scotConfig.info.steem_to_krw = allPrice[1].candles[0].tradePrice;

        this.cache.set(key, { info: scotInfo, config: scotConfig });

        console.info('Scot Config refreshed...');
    } catch (err) {
        console.error('Could not fetch Scot Config', err);
        return this.storeEmpty();
    }
};
