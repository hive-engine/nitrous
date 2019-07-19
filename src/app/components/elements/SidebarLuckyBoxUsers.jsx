import React from 'react';
import tt from 'counterpart';
import axios from 'axios';

function getItem(data, index) {
    return (
        <li
            className="c-sidebar__list-item"
            key={index}
            style={{ display: 'flex' }}
        >
            <div className="truncate" style={{ flex: 6 }}>
                <a className="c-sidebar__link" href={`/@${data.Username}`}>
                    @{data.Username}
                </a>
            </div>
            <div
                className="truncate"
                style={{ flex: 4, textAlign: 'right', color: '#aaa' }}
            >
                {data.Amount} {data.Symbol}
            </div>
        </li>
    );
}

const renderData = data => {
    const winnersFiltered = data.filter(e => {
        return e.Type === 'winner';
    });

    let winners;

    if (winnersFiltered) {
        winners = (
            <ul className="c-sidebar__list">
                {winnersFiltered.map((e, index) => getItem(e, index))}
            </ul>
        );
    } else {
        winners = <div>{tt('luckybox.sidebar_no_data')}</div>;
    }

    const losersFiltered = data.filter(e => {
        return e.Type === 'loser';
    });

    let losers;

    if (losersFiltered) {
        losers = (
            <ul className="c-sidebar__list">
                {losersFiltered.map((e, index) => getItem(e, index))}
            </ul>
        );
    } else {
        losers = <div>{tt('luckybox.sidebar_no_data')}</div>;
    }

    return (
        <div className="c-sidebar__module c-sidebar__luckybox">
            <div className="c-sidebar__header">
                <h3 className="c-sidebar__h3">
                    {tt('luckybox.sidebar_winners_title')}
                </h3>
            </div>
            <div className="c-sidebar__content">{winners}</div>
            <br />
            <div className="c-sidebar__header">
                <h3 className="c-sidebar__h3">
                    {tt('luckybox.sidebar_losers_title')}
                </h3>
            </div>
            <div className="c-sidebar__content">{losers}</div>
            <br />
            <div className="note">* {tt('luckybox.sidebar_note')}</div>
        </div>
    );
};

class SidebarLuckyBoxUsers extends React.Component {
    async getData() {
        try {
            const response = await axios.get(
                'https://tool.steem.world/assets/json/aaa/luckybox-users.json'
            );

            return response.data;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    constructor(props) {
        super(props);
        this.state = { data: null };
    }

    componentDidMount() {
        if (!this.state.data) {
            (async () => {
                try {
                    this.setState({ data: await this.getData() });
                } catch (e) {
                    console.log(e);
                }
            })();
        }
    }

    render() {
        return this.state.data ? renderData(this.state.data) : null;
    }
}

export default SidebarLuckyBoxUsers;
