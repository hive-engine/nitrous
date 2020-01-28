import React, { Component } from 'react';
import tt from 'counterpart';

class TokenList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    selectToken = () => {
        var token = {
            name: 'KRWP',
        };
        this.props.selectedCallback(token);
    };

    componentDidMount() {
        // test selectToken
        // this.selectToken()
    }

    render() {
        return <div>{'Hello'}</div>;
    }
}

export default TokenList;
