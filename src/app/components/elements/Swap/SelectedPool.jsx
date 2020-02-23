import React, { Component } from 'react';
import tt from 'counterpart';
import Reveal from 'app/components/elements/Swap/SelectedReveal';
import CloseButton from 'app/components/elements/CloseButton';

class SelectedMode extends Component {
    constructor(props) {
        super(props);

        this.modes = [];
        this.modes.push({
            url: 'add-liquidity',
            name: 'Add Liquidity',
        });
        this.modes.push({
            url: 'remove-liquidity',
            name: 'Remove Liquidity',
        });

        this.state = {
            show: false,
        };
    }

    componentDidMount() {}

    modeClick = (token, i) => {
        this.closeModal(token, i);
    };

    closeModal = (token, i) => {
        this.props.onHideSelcected(token, i);
    };
    render() {
        var _show = this.props.show;
        var selected = this.props.selected;

        const listItems = this.modes.map((mode, i) => (
            <li key={i} className={i == selected ? 'active' : ''}>
                <a className="anchor" href={`/beta/${mode.url}`}>
                    {mode.name}
                </a>
            </li>
        ));

        return (
            <Reveal show={_show} onHide={this.closeModal}>
                <div className="liquidity-select">
                    <ul>{listItems}</ul>
                </div>
            </Reveal>
        );
    }
}

export default SelectedMode;
