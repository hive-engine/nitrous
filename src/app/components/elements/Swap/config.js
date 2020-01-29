var mainnode = {
    name: 'main_node',
    account: 'sct.jcob',
    tokens: ['KRWP', 'ORG', 'SVC'],
    liqudity_token: ['HABIT'],
};

var subnode = [
    {
        name: 'kporg',
        account: 'sct.kporg',
        tokens: ['KRWP', 'ORG'],
        liqudity_token: 'HABIT',
    },
    {
        name: 'kpsvc',
        account: 'sct.kpsvc',
        tokens: ['KRWP', 'SVC'],
        liqudity_token: 'HABIT1',
    },
];

class swapConfig {
    constructor() {
        // 선택할 수 있는 input token
        this.input_token_list = [
            'SCT',
            'SCTM',
            'KRWP',
            'SBD',
            'STEEM',
            'ORG',
            'SVC',
            'DEC',
        ];
        // 선택할 수 있는 output token
        this.output_token_list = [
            'SCT',
            'SCTM',
            'KRWP',
            'SBD',
            'STEEM',
            'ORG',
            'SVC',
            'DEC',
        ];
        // fee
        this.swap_fee = 3.0;
        this.nodes = subnode;
        this.mainNode = mainnode;
    }

    findNode(input_token, output_token) {}

    calculateExchangeRate(input_token, output_token) {}
}

export default swapConfig;
