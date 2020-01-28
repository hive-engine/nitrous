import React, { Component } from 'react';
import tt from 'counterpart';

class TokenList extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.tokens = [];
        this.tokens.push({ id: 'krwp', name: 'KRWP' });
        this.tokens.push({ id: 'sct', name: 'SCT' });
        this.tokens.push({ id: 'org', name: 'ORG' });
        this.tokens.push({ id: 'svc', name: 'SVC' });
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
                    {token.name}
                </button>
            </li>
        ));
        return (
            <div>
                <ul>{listItems}</ul>
            </div>
        );
    }
}

export default TokenList;
