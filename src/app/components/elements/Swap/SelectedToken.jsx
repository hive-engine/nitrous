import React, { Component } from 'react';
import TokenList from 'app/components/elements/Swap/TokenList';

class SelectedToken extends Component {
    constructor(props) {
        super(props);
    }

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
                        <input type="text" placeholder="Search Token Name" />
                    </form>
                </div>
                <TokenList
                    parent={this.props.parent}
                    tokens={this.props.tokens}
                    onTokenClick={this.props.onTokenClick}
                    onClose={this.props.onClose}
                />
            </div>
        );
    }
}

export default SelectedToken;
