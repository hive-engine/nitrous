import * as config from 'config';
import NodeCache from 'node-cache';

import { TOKEN_STATS_EXCLUDE_ACCOUNTS } from 'app/client_config';
import { getScotDataAsync } from 'app/utils/steemApi';
import SSC from '@hive-engine/sscjs';
const ssc = new SSC('https://ha.herpc.dtools.dev');
const hiveSsc = new SSC('https://ha.herpc.dtools.dev');
import { CONFIG_MAP } from 'app/client_config';

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
        this.cache.set(key, {}, (err, success) => {
            console.info('Storing empty Scot Config data...');
            res();
        });
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
        const scotConfig = await getScotDataAsync('config', {});
        const scotInfo = await getScotDataAsync('info', {});
        const scotConfigMap = {};
        let tokenList = [];
        let hiveTokenList = [];
        const minerTokenToToken = {};

        const configTokens = new Set(
            Object.values(CONFIG_MAP).map(c => c['LIQUID_TOKEN_UPPERCASE'])
        );
        scotConfig.forEach(c => {
            if (configTokens.has(c.token)) {
                const scotMinerTokens = c.miner_tokens ? Object.keys(JSON.parse(c.miner_tokens)) : [];

                scotConfigMap[c.token] = c;
                c.hiveTokenStats = {
                    scotToken: c.token,
                    scotMinerTokens,
                    total_token_balance_circulating: 0,
                    token_burn_balance: 0,
                    total_token_balance_staked: 0,
                    total_token_miner_balance_circulating: 0,
                    token_burn_miner_balance: 0,
                    total_token_miner_balance_staked: 0,
                    total_token_mega_miner_balance_circulating: 0,
                    token_burn_mega_miner_balance: 0,
                    total_token_mega_miner_balance_staked: 0,
                };
                hiveTokenList.push(c.token);
                hiveTokenList = hiveTokenList.concat(scotMinerTokens);
                if (scotMinerTokens.length > 0) {
                    minerTokenToToken[scotMinerTokens[0]] = {
                        token: c.token,
                        megaMiner: false,
                    };
                }
                if (scotMinerTokens.length > 1) {
                    minerTokenToToken[scotMinerTokens[1]] = {
                        token: c.token,
                        megaMiner: true,
                    };
                }
            }
        });

        const [
            hiveTotalTokenBalances,
            hiveTokenBurnBalances,
        ] = await Promise.all([
            hiveSsc.find('tokens', 'tokens', {
                symbol: { $in: hiveTokenList },
            }),
            hiveSsc.find('tokens', 'balances', {
                account: { $in: ['null'].concat(TOKEN_STATS_EXCLUDE_ACCOUNTS) },
                symbol: { $in: hiveTokenList },
            }),
        ]);

        const populateTokenBalanceStats = (totalTokenBalances, statsField) => {
            for (const totalTokenBalance of totalTokenBalances) {
                if (minerTokenToToken[totalTokenBalance.symbol]) {
                    const minerTokenInfo =
                        minerTokenToToken[totalTokenBalance.symbol];
                    if (minerTokenInfo.megaMiner) {
                        scotConfigMap[minerTokenInfo.token][
                            statsField
                        ].total_token_mega_miner_balance_circulating =
                            totalTokenBalance.circulatingSupply;
                        scotConfigMap[minerTokenInfo.token][
                            statsField
                        ].total_token_mega_miner_balance_staked =
                            totalTokenBalance.totalStaked;
                    } else {
                        scotConfigMap[minerTokenInfo.token][
                            statsField
                        ].total_token_miner_balance_circulating =
                            totalTokenBalance.circulatingSupply;
                        scotConfigMap[minerTokenInfo.token][
                            statsField
                        ].total_token_miner_balance_staked =
                            totalTokenBalance.totalStaked;
                    }
                } else {
                    scotConfigMap[totalTokenBalance.symbol][
                        statsField
                    ].total_token_balance_circulating =
                        totalTokenBalance.circulatingSupply;
                    scotConfigMap[totalTokenBalance.symbol][
                        statsField
                    ].total_token_balance_staked =
                        totalTokenBalance.totalStaked;
                }
            }
        };
        populateTokenBalanceStats(hiveTotalTokenBalances, 'hiveTokenStats');

        const populateBurnBalanceStats = (tokenBurnBalances, statsField) => {
            for (const tokenBurnBalance of tokenBurnBalances) {
                if (minerTokenToToken[tokenBurnBalance.symbol]) {
                    const minerTokenInfo =
                        minerTokenToToken[tokenBurnBalance.symbol];
                    if (minerTokenInfo.megaMiner) {
                        scotConfigMap[minerTokenInfo.token][
                            statsField
                        ].token_burn_mega_miner_balance =
                            tokenBurnBalance.balance;
                    } else {
                        scotConfigMap[minerTokenInfo.token][
                            statsField
                        ].token_burn_miner_balance =
                            tokenBurnBalance.balance;
                    }
                } else {
                    scotConfigMap[tokenBurnBalance.symbol][
                        statsField
                    ].token_burn_balance =
                        tokenBurnBalance.balance;
                }
            }
        };
        populateBurnBalanceStats(hiveTokenBurnBalances, 'hiveTokenStats');

        this.cache.set(key, { info: scotInfo, config: scotConfigMap });

        console.info('Scot Config refreshed...');
    } catch (err) {
        console.error('Could not fetch Scot Config', err);
    }
};
