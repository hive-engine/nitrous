import SSC from 'sscjs';
const ssc = new SSC('https://api.steem-engine.com/rpc');
import { api } from '@steemit/steem-js';

async function getScotHolder(symbol, cnt, offset) {
    return new Promise((resolve, reject) => {
        let holders = new Array();
        ssc.find(
            'tokens',
            'balances',
            { symbol: symbol },
            cnt,
            offset,
            [],
            async (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }

                for (const result of results) {
                    holders.push(result);
                }

                if (results.length == cnt) {
                    const holder = await getScotHolder(
                        symbol,
                        cnt,
                        offset + cnt
                    );
                    for (const result of holder) {
                        holders.push(result);
                    }
                }

                resolve(holders);
            }
        );
    });
}

var mainnode = {
    name: 'main_node',
    account: 'sct.jcob',
    tokens: ['KRWP', 'ORG', 'SVC', 'STEEM'],
    liquidity_token: ['KPORG', 'KPSVC', 'KPSTEEM'],
};

var subnode = [
    {
        name: 'kporg',
        account: 'sct.kporg',
        tokens: ['KRWP', 'ORG'],
        liquidity_token: 'KPORG',
    },
    {
        name: 'kpsvc',
        account: 'sct.kpsvc',
        tokens: ['KRWP', 'SVC'],
        liquidity_token: 'KPSVC',
    },
    {
        name: 'kpsteem',
        account: 'sct.kpsteem',
        tokens: ['KRWP', 'STEEM'],
        liquidity_token: 'KPSTEEM',
    },
];

class swapConfig {
    constructor() {
        // fee
        this.swap_fee = 3.0;
        this.nodes = subnode;
        this.mainNode = mainnode;

        this.tokens = [];
        this.tokens.push({
            id: 'krwp',
            name: 'KRWP',
            fullname: '1000 KRW Pegged',
            ico: '/images/tokens/noimage.png',
        });
        this.tokens.push({
            id: 'sct',
            name: 'SCT',
            fullname: 'SteemCoinpan Token',
            ico: '/images/tokens/sct.png',
        });
        this.tokens.push({
            id: 'org',
            name: 'ORG',
            fullname: 'Orange Token',
            ico: '/images/tokens/noimage.png',
        });
        this.tokens.push({
            id: 'svc',
            name: 'SVC',
            fullname: 'Steem Vote Coin',
            ico: '/images/tokens/svc.png',
        });
        this.tokens.push({
            id: 'steem',
            name: 'STEEM',
            fullname: 'Steem',
            ico: '/images/tokens/steem.png',
        });
    }

    getSteemBalance(account) {
        return new Promise((resolve, reject) => {
            api.getAccounts([account], function(err, response) {
                console.log(response[0]);
                if (err) reject(err);
                console.log(response[0].balance);
                var steem_balance = response[0].balance.split(' ')[0];
                console.log(steem_balance);
                resolve(steem_balance);
            });
        });
    }

    getSBDBalance(account) {
        return new Promise((resolve, reject) => {
            api.getAccounts([account], function(err, response) {
                if (err) reject(err);
                resolve(response[0].sbd_balance.split[' '][0]);
            });
        });
    }

    getTokenBalance(account, symbol) {
        if (symbol == 'STEEM') return this.getSteemBalance(account);
        else if (symbol == 'SBD') return this.getSBDBalance(account);
        else {
            return new Promise((resolve, reject) => {
                ssc.findOne(
                    'tokens',
                    'balances',
                    { account, symbol },
                    (err, result) => {
                        if (err) reject(err);
                        // console.log(result)
                        if (result == null) resolve('0.0');
                        else resolve(result.balance);
                    }
                );
            });
        }
    }

    findNode(input_token, output_token) {
        var validNode = null;
        for (const node of this.nodes) {
            var one = node.tokens.find(token => token == input_token);
            var two = node.tokens.find(token => token == output_token);
            if (one != undefined && two != undefined && one != two) {
                validNode = node;
                break;
            }
        }
        return validNode;
    }

    async calculateDepositAmount(input_token, output_token) {
        var validNode = this.findNode(input_token, output_token);
        if (validNode == null) return 0;

        var balance = await Promise.all([
            this.getTokenBalance(validNode.account, input_token),
            this.getTokenBalance(validNode.account, output_token),
            this.getLiquidityTokenAllBalance(
                validNode.liquidity_token,
                validNode.account
            ),
        ]);
        console.log(balance);
        var assume_krwp = 1;
        var rate = assume_krwp / balance[0];
        var exchange_rate = rate * balance[1];

        var liquidity_token_all = balance[2];
        var liquidity_token = rate * liquidity_token_all;

        return {
            node_input_balance: balance[0],
            node_output_balance: balance[1],
            exchange_rate: exchange_rate.toFixed(3),
            liquidity_token: liquidity_token.toFixed(3),
            liquidity_token_all: liquidity_token_all.toFixed(3),
            liquidity_token_symbol: validNode.liquidity_token,
        };
    }

    async calculateExchangeAmount(input_token, output_token, input_amount) {
        var validNode = this.findNode(input_token, output_token);
        if (validNode == null) return 0;
        console.log(validNode);
        var balance = await Promise.all([
            this.getTokenBalance(validNode.account, input_token),
            this.getTokenBalance(validNode.account, output_token),
        ]);
        // input, output balance
        console.log('calculateExchangeAmount', balance);
        var alpha = input_amount / balance[0];
        var rate_fee = (100.0 - this.swap_fee) / 100.0;
        var estimated_output_amount =
            balance[1] * (alpha * rate_fee) / (1 + alpha * rate_fee); // transfer this to user
        return {
            estimaed_output_amount: estimated_output_amount,
            node_output_balance: balance[1],
        };
    }

    async getHolder(symbol) {
        return new Promise(async (resolve, reject) => {
            await getScotHolder(symbol, 500, 0)
                .then(results => {
                    resolve(results);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    async getLiquidityTokenAllBalance(symbol, node_account) {
        var all = await this.getHolder(symbol);
        all = all.filter(one => one.account != node_account);
        var circulated_balance = 0;
        for (const one of all) {
            circulated_balance = circulated_balance + one.balance * 1.0;
        }
        return circulated_balance;
    }
}

export default swapConfig;
