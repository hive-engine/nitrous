import * as config from 'config';
import NodeCache from 'node-cache';

import {
    LIQUID_TOKEN_UPPERCASE,
    SCOT_DENOM,
    TOKEN_STATS_EXCLUDE_ACCOUNTS,
    HIVE_ENGINE,
} from 'app/client_config';
import { getScotDataAsync } from 'app/utils/steemApi';
import SSC from 'sscjs';
const ssc = new SSC('https://api.steem-engine.com/rpc');
const hiveSsc = new SSC('https://api.hive-engine.com/rpc');

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

        const tokenList = [scotConfig.tokenStats.scotToken].concat(
            scotConfig.tokenStats.scotMinerTokens
        );

        const engineApi = HIVE_ENGINE ? hiveSsc : ssc;
        const [totalTokenBalances, tokenBalances] = await Promise.all([
            engineApi.find('tokens', 'tokens', {
                symbol: { $in: tokenList },
            }),
            engineApi.find('tokens', 'balances', {
                account: { $in: ['null'].concat(TOKEN_STATS_EXCLUDE_ACCOUNTS) },
                symbol: { $in: tokenList },
            }),
        ]);

        let circulating = 0;
        let burn = 0;
        let staking = 0;
        let circulatingMiner = 0;
        let burnMiner = 0;
        let stakingMiner = 0;
        let circulatingMegaMiner = 0;
        let burnMegaMiner = 0;
        let stakingMegaMiner = 0;
        for (const totalTokenBalance of totalTokenBalances) {
            if (
                totalTokenBalance['symbol'] == scotConfig.tokenStats.scotToken
            ) {
                scotConfig.tokenStats.total_token_balance = totalTokenBalance;
                circulating += parseFloat(totalTokenBalance.circulatingSupply);
                staking += parseFloat(totalTokenBalance.totalStaked);
            } else if (
                totalTokenBalance['symbol'] ==
                scotConfig.tokenStats.scotMinerTokens[0]
            ) {
                scotConfig.tokenStats.total_token_miner_balance = totalTokenBalance;
                circulatingMiner += parseFloat(
                    totalTokenBalance.circulatingSupply
                );
                stakingMiner += parseFloat(totalTokenBalance.totalStaked);
            } else if (
                totalTokenBalance['symbol'] ==
                scotConfig.tokenStats.scotMinerTokens[1]
            ) {
                scotConfig.tokenStats.total_token_mega_miner_balance = totalTokenBalance;
                circulatingMegaMiner += parseFloat(
                    totalTokenBalance.circulatingSupply
                );
                stakingMegaMiner += parseFloat(totalTokenBalance.totalStaked);
            }
        }
        for (const tokenBalance of tokenBalances) {
            if (tokenBalance['symbol'] == scotConfig.tokenStats.scotToken) {
                if (tokenBalance['account'] === 'null') {
                    scotConfig.tokenStats.token_burn_balance = tokenBalance;
                    burn += parseFloat(tokenBalance.balance);
                } else {
                    circulating -= parseFloat(tokenBalance.balance);
                    circulating -= parseFloat(tokenBalance.stake);
                    staking -= parseFloat(tokenBalance.stake);
                }
            } else if (
                tokenBalance['symbol'] ==
                scotConfig.tokenStats.scotMinerTokens[0]
            ) {
                if (tokenBalance['account'] === 'null') {
                    scotConfig.tokenStats.token_miner_burn_balance = tokenBalance;
                    burnMiner += parseFloat(tokenBalance.balance);
                } else {
                    circulatingMiner -= parseFloat(tokenBalance.balance);
                    circulatingMiner -= parseFloat(tokenBalance.stake);
                    stakingMiner -= parseFloat(tokenBalance.stake);
                }
            } else if (
                tokenBalance['symbol'] ==
                scotConfig.tokenStats.scotMinerTokens[1]
            ) {
                if (tokenBalance['account'] === 'null') {
                    scotConfig.tokenStats.token_mega_miner_burn_balance = tokenBalance;
                    burnMegaMiner += parseFloat(tokenBalance.balance);
                } else {
                    circulatingMegaMiner -= parseFloat(tokenBalance.balance);
                    circulatingMegaMiner -= parseFloat(tokenBalance.stake);
                    stakingMegaMiner -= parseFloat(tokenBalance.stake);
                }
            }
        }

        if (scotConfig.tokenStats.total_token_balance) {
            scotConfig.tokenStats.total_token_balance.circulatingSupply = circulating.toFixed(
                scotConfig.tokenStats.total_token_balance.precision
            );
            scotConfig.tokenStats.total_token_balance.totalStaked = staking.toFixed(
                scotConfig.tokenStats.total_token_balance.precision
            );
        }
        if (scotConfig.tokenStats.token_burn_balance) {
            scotConfig.tokenStats.token_burn_balance.balance = burn.toFixed(
                scotConfig.tokenStats.total_token_balance.precision
            );
        }

        if (scotConfig.tokenStats.total_token_miner_balance) {
            scotConfig.tokenStats.total_token_miner_balance.circulatingSupply = circulatingMiner.toFixed(
                scotConfig.tokenStats.total_token_miner_balance.precision
            );
            scotConfig.tokenStats.total_token_miner_balance.totalStaked = stakingMiner.toFixed(
                scotConfig.tokenStats.total_token_miner_balance.precision
            );
        }
        if (scotConfig.tokenStats.token_miner_burn_balance) {
            scotConfig.tokenStats.token_miner_burn_balance.balance = burnMiner.toFixed(
                scotConfig.tokenStats.total_token_miner_balance.precision
            );
        }

        if (scotConfig.tokenStats.total_token_mega_miner_balance) {
            scotConfig.tokenStats.total_token_mega_miner_balance.circulatingSupply = circulatingMegaMiner.toFixed(
                scotConfig.tokenStats.total_token_mega_miner_balance.precision
            );
            scotConfig.tokenStats.total_token_mega_miner_balance.totalStaked = stakingMegaMiner.toFixed(
                scotConfig.tokenStats.total_token_mega_miner_balance.precision
            );
        }
        if (scotConfig.tokenStats.token_mega_miner_burn_balance) {
            scotConfig.tokenStats.token_mega_miner_burn_balance.balance = burnMegaMiner.toFixed(
                scotConfig.tokenStats.total_token_mega_miner_balance.precision
            );
        }

        this.cache.set(key, { info: scotInfo, config: scotConfig });
        console.info('Scot Config refreshed...');
    } catch (err) {
        console.error('Could not fetch Scot Config', err);
        return this.storeEmpty();
    }
};
