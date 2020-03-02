import React, { Component } from 'react';
import { browserHistory } from 'react-router';

class SelectedMode extends Component {
    constructor(props) {
        super(props);

        this.modes = [];
        this.modes.push({
            url: '/market#add',
            name: 'Add Liquidity',
        });
        this.modes.push({
            url: '/market#remove',
            name: 'Remove Liquidity',
        });

        this.state = {
            show: false,
        };
    }

    onClickSelect(url) {
        this.props.onClose();
        browserHistory.replace(url);
    }

    componentDidMount() {}

    render() {
        var _show = this.props.show;
        var selected = this.props.selected;

        const listItems = this.modes.map((mode, i) => (
            <li key={i} className={i == selected ? 'active' : ''}>
                <button
                    type="button"
                    className="anchor"
                    onClick={() => {
                        this.onClickSelect(mode.url);
                    }}
                >
                    {mode.name}
                </button>
            </li>
        ));

        return (
            <div className="liquidity-select">
                <ul>{listItems}</ul>
            </div>
        );
    }
}

export default SelectedMode;
