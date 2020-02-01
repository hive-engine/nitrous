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
            ico: '/images/tokens/noimage.png',
        });
        this.tokens.push({
            id: 'sct',
            name: 'SCT',
            ico: '/images/tokens/sct.png',
        });
        this.tokens.push({
            id: 'org',
            name: 'ORG',
            ico: '/images/tokens/noimage.png',
        });
        this.tokens.push({
            id: 'svc',
            name: 'SVC',
            ico: '/images/tokens/svc.png',
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
                    <img width={'24px'} src={token.ico} />
                    <span>{` ${token.name}`}</span>
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
