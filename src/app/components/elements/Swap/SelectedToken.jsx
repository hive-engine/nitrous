import React, { Component } from 'react';
import TokenList from 'app/components/elements/Swap/TokenList';

class SelectedToken extends Component {
    constructor(props) {
        super(props);
        this.tokens = this.props.tokens;
        console.log(this.tokens);
        this.state = {
            updated: 0,
        };
    }

    onSearchTokenCallback = e => {
        console.log('swap search', e.target.value);
        var t = this.props.tokens.filter(
            a => a.id.indexOf(e.target.value) != -1
        );
        console.log(t);
        this.tokens = t;
        this.setState({ updated: this.tokens.length });
    };

    componentDidMount() {}

    render() {
        return (
            <div>
                <h2 className="token-title">Select Token</h2>
                <div className="token-search">
                    <form>
                        <p className="srh-icon">
                            <span className="table-cell">
                                <img
                                    src="/images/magnifying-glass.svg"
                                    alt="search"
                                />
                            </span>
                        </p>
                        <input
                            type="text"
                            placeholder="Search Token Name"
                            onChange={this.onSearchTokenCallback}
                        />
                    </form>
                </div>
                <TokenList
                    updated={this.state.updated}
                    parent={this.props.parent}
                    tokens={this.tokens}
                    onTokenClick={this.props.onTokenClick}
                    onClose={this.props.onClose}
                />
            </div>
        );
    }
}

export default SelectedToken;
