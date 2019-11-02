import * as config from 'config';
import NodeCache from 'node-cache';

import { LIQUID_TOKEN_UPPERCASE, SCOT_DENOM } from 'app/client_config';
import { getScotDataAsync, getSteemPriceInfo } from 'app/utils/steemApi';
import {
    getConfig,
    getThumbupReceiveTopList,
    getThumbupSendTopList,
    getBadgeList,
    getTagList,
    getSctmPrice,
    getReceivedSctm,
} from 'app/utils/SctApi';

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

        // sidebar thumbsup summary
        scotConfig.thumbsup = {};
        scotConfig.info = {};

        const date = new Date();
        const year = date.getFullYear();
        const mon = (date.getMonth() + 1 + '').padStart(2, '0');

        const [
            totalTokenBalance,
            tokenBurnBalance,
            totalTokenMinerBalance,
            tokenMinerBurnBalance,
            thumbsUpReceiveList,
            thumbsUpSendList,
            badgeList,
            tagList,
            allPrice,
            sctmburnBalance,
            sctmPrice,
            receivedSCTM,
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
            getThumbupReceiveTopList(year + mon),
            getThumbupSendTopList(year + mon),
            getBadgeList(),
            getTagList(),
            getSteemPriceInfo(),
            ssc.findOne('tokens', 'balances', {
                account: 'sctm.burn',
                symbol: 'KRWP',
            }),
            getSctmPrice(),
            getReceivedSctm(),
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
        if (thumbsUpReceiveList) {
            scotConfig.thumbsup.receiveList = thumbsUpReceiveList.data[0];
        }
        if (thumbsUpSendList) {
            scotConfig.thumbsup.sendList = thumbsUpSendList.data[0];
        }
        if (tagList) {
            scotConfig.info.tagList = tagList.data[0];
        }
        if (badgeList) {
            scotConfig.info.affiliation = badgeList.data;
        }
        if (allPrice) {
            scotConfig.info.scotToken = scotConfig.token;
            scotConfig.info.sct_to_steemp = allPrice.find(
                data => data.symbol === 'SCT'
            ).price_average;
            scotConfig.info.steem_to_dollor = allPrice.find(
                data => data.symbol === 'STEEM'
            ).price_average;
            scotConfig.info.steem_to_krw = allPrice.find(
                data => data.symbol === 'STEEM_KRW'
            ).price_average;

            scotConfig.info.sbd_to_dollar = allPrice.find(
                data => data.symbol === 'SBD'
            ).price_average;
            scotConfig.info.sctm_to_steem = allPrice.find(
                data => data.symbol === 'SCTM'
            ).price_average;
            scotConfig.info.krwp_to_steem = allPrice.find(
                data => data.symbol === 'KRWP'
            ).price_average;

            scotConfig.info.sctm_price = sctmPrice.data.sctmprice;
            scotConfig.info.received_sctm = receivedSCTM.data.amount;
            scotConfig.info.received_list = receivedSCTM.data.list;
            scotConfig.info.krwp_balance = sctmburnBalance.balance;
        }

        // get SCT thumbup config
        scotConfig.thumbupConfig = await getConfig();

        this.cache.set(key, { info: scotInfo, config: scotConfig });

        console.info('Scot Config refreshed...');
    } catch (err) {
        console.error('Could not fetch Scot Config', err);
        return this.storeEmpty();
    }
};
