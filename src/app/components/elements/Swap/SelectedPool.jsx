import React, { Component } from 'react';
import tt from 'counterpart';
import Reveal from 'app/components/elements/Swap/SelectedReveal';
import CloseButton from 'app/components/elements/CloseButton';

class SelectedMode extends Component {
    constructor(props) {
        super(props);

        this.modes = [];
        this.modes.push({
            url: 'faq.html',
            name: 'Add Liquidity',
        });
        this.modes.push({
            url: 'about.html',
            name: 'Remove Liquidity',
        });

        this.state = {
            show: false,
        };
    }

    componentDidMount() {}

    render() {
        var _show = this.props.show;
        var selected = this.props.selected;

        const listItems = this.modes.map((mode, i) => (
            <li key={i} className={i == selected ? 'active' : ''}>
                <a className="anchor" href={`/${mode.url}`}>
                    {mode.name}
                </a>
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
