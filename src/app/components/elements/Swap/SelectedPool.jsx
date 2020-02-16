import React, { Component } from 'react';
import tt from 'counterpart';
import Reveal from 'app/components/elements/Reveal';
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

        const listItems = this.modes.map((mode, i) => (
            <li key={i}>
                <button>
                    <p className="token-name">
                        <a className="simple" href={`/beta/${mode.url}`}>
                            {mode.name}
                        </a>
                    </p>
                </button>
            </li>
        ));

        return (
            <Reveal show={_show} isSwapModal={true} onHide={this.closeModal}>
                <CloseButton onClick={this.closeModal} />
                <div className="token-list">
                    <ul>{listItems}</ul>
                </div>
            </Reveal>
        );
    }
}

export default SelectedMode;
