import * as config from 'config';
import NodeCache from 'node-cache';

import { LIQUID_TOKEN_UPPERCASE, SCOT_DENOM } from 'app/client_config';
import { getScotDataAsync } from 'app/utils/steemApi';

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
        const scotConfig = await getScotDataAsync('config', {
            token: LIQUID_TOKEN_UPPERCASE,
        });
        const scotInfo = await getScotDataAsync('info', {
            token: LIQUID_TOKEN_UPPERCASE,
        });
        // Use client config info as backup
        if (!scotInfo.precision == null) {
            console.info('Info not found, falling back to client config');
            scotInfo.precision = Math.log10(SCOT_DENOM);
        }

        scotConfig.tokenStats = {};

        scotConfig.tokenStats.scotToken = scotConfig.token;
        scotConfig.tokenStats.scotMinerTokens = Object.keys(
            JSON.parse(scotConfig.miner_tokens)
        );

        const [
            totalTokenBalance,
            tokenBurnBalance,
            totalTokenMinerBalance,
            tokenMinerBurnBalance,
            totalTokenMegaMinerBalance,
            tokenMegaMinerBurnBalance,
        ] = await Promise.all([
            ssc.findOne('tokens', 'tokens', {
                symbol: scotConfig.tokenStats.scotToken,
            }),
            ssc.findOne('tokens', 'balances', {
                account: 'null',
                symbol: scotConfig.tokenStats.scotToken,
            }),
            scotConfig.tokenStats.scotMinerTokens.length > 0
                ? ssc.findOne('tokens', 'tokens', {
                      symbol: scotConfig.tokenStats.scotMinerTokens[0],
                  })
                : Promise.resolve(null),
            scotConfig.tokenStats.scotMinerTokens.length > 0
                ? ssc.findOne('tokens', 'balances', {
                      account: 'null',
                      symbol: scotConfig.tokenStats.scotMinerTokens[0],
                  })
                : Promise.resolve(null),
            scotConfig.tokenStats.scotMinerTokens.length > 1
                ? ssc.findOne('tokens', 'tokens', {
                      symbol: scotConfig.tokenStats.scotMinerTokens[1],
                  })
                : Promise.resolve(null),
            scotConfig.tokenStats.scotMinerTokens.length > 1
                ? ssc.findOne('tokens', 'balances', {
                      account: 'null',
                      symbol: scotConfig.tokenStats.scotMinerTokens[1],
                  })
                : Promise.resolve(null),
        ]);

        if (totalTokenBalance) {
            scotConfig.tokenStats.total_token_balance = totalTokenBalance;
        }
        if (tokenBurnBalance) {
            scotConfig.tokenStats.token_burn_balance = tokenBurnBalance;
        }
        if (totalTokenMinerBalance) {
            scotConfig.tokenStats.total_token_miner_balance = totalTokenMinerBalance;
        }
        if (tokenMinerBurnBalance) {
            scotConfig.tokenStats.token_miner_burn_balance = tokenMinerBurnBalance;
        }
        if (totalTokenMegaMinerBalance) {
            scotConfig.tokenStats.total_token_mega_miner_balance = totalTokenMegaMinerBalance;
        }
        if (totalTokenMegaMinerBalance) {
            scotConfig.tokenStats.token_mega_miner_burn_balance = tokenMegaMinerBurnBalance;
        }
        this.cache.set(key, { info: scotInfo, config: scotConfig });

        console.info('Scot Config refreshed...');
    } catch (err) {
        console.error('Could not fetch Scot Config', err);
        return this.storeEmpty();
    }
};
