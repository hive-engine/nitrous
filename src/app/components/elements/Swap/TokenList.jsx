import React, { Component } from 'react';
import tt from 'counterpart';

class TokenList extends Component {
    constructor(props) {
        super(props);
        // this.tokens = this.props.tokens;
        this.state = {};
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
        this.props.onClose();
    };

    render() {
        console.log(this.props.updated);
        const listItems = this.props.tokens.map((token, i) => (
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
