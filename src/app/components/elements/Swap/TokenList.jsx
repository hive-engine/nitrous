import React, { Component } from 'react';
import tt from 'counterpart';

class TokenList extends Component {
    constructor(props) {
        super(props);
        this.state = {};

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

    selectToken = () => {
        var token = {
            id: 'krwp',
            name: 'KRWP',
        };
    };

    componentDidMount() {
        // test selectToken
        this.selectToken();
    }

    tokenClick = token => {
        console.log('Hello', token);
        this.props.onTokenClick(this.props.parent, token);
    };

    render() {
        const listItems = this.tokens.map((token, i) => (
            <li key={i} data-id={token.id}>
                <button
                    type="button"
                    onClick={() => {
                        this.tokenClick(token);
                    }}
                >
                    <img src={token.ico} />
                    <p className="token-name">
                        <span className="simple">{`${token.name}`}</span>
                        <span className="full">{`${token.fullname}`}</span>
                    </p>
                </button>
            </li>
        ));
        return (
            <div className="token-list">
                <ul>{listItems}</ul>
            </div>
        );
    }
}

export default TokenList;
