import * as config from 'config';
import NodeCache from 'node-cache';

import { LIQUID_TOKEN_UPPERCASE, SCOT_DENOM } from 'app/client_config';
import { getScotDataAsync } from 'app/utils/steemApi';

export function ScotConfig() {
    const ttl = config.scot_config_cache.ttl;
    const cache = new NodeCache({
        stdTTL: ttl,
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
        this.cache.set(key, { info: scotInfo, config: scotConfig });
        console.info('Scot Config refreshed...');
    } catch (err) {
        console.error('Could not fetch Scot Config', err);
        return this.storeEmpty();
    }
};
