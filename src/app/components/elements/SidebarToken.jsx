import React from 'react';
import tt from 'counterpart';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';

const SidebarToken = ({
    scotToken,
    scotTokenCirculating,
    scotTokenBurn,
    scotTokenStaking,
}) => {
    if (scotTokenCirculating && typeof scotTokenCirculating === 'string') {
        scotTokenCirculating = parsePayoutAmount(scotTokenCirculating);
    }

    if (scotTokenBurn && typeof scotTokenBurn === 'string') {
        scotTokenBurn = parsePayoutAmount(scotTokenBurn);
    }

    if (scotTokenStaking && typeof scotTokenStaking === 'string') {
        scotTokenStaking = parsePayoutAmount(scotTokenStaking);
    }

    const total = formatDecimal(scotTokenCirculating + scotTokenBurn);
    const circulating = formatDecimal(scotTokenCirculating);
    const circulatingRate = formatDecimal(
        scotTokenCirculating / (scotTokenCirculating + scotTokenBurn) * 100
    );
    const burn = formatDecimal(scotTokenBurn);
    const burnRate = formatDecimal(
        scotTokenBurn / (scotTokenCirculating + scotTokenBurn) * 100
    );
    const staking = formatDecimal(scotTokenStaking);
    const stakingRate = formatDecimal(
        scotTokenStaking / scotTokenCirculating * 100
    );

    const styleToken = { color: 'rgb(242, 167, 26)' };
    const styleBurn = { color: 'red' };

    return (
        <div className="c-sidebar__module">
            <div className="c-sidebar__header" style={styleToken}>
                <h3 className="c-sidebar__h3">{scotToken}</h3>
            </div>
            <div className="c-sidebar__content">
                <ul className="c-sidebar__list">
                    <li className="c-sidebar__list-item">
                        {tt('g.total')} <br />
                        {'> '}
                        <span className="integer">{total[0]}</span>
                        <span className="decimal">{total[1]}</span>
                    </li>
                    <li className="c-sidebar__list-item">
                        {tt('g.circulating')} (
                        <span className="integer">{circulatingRate[0]}</span>
                        <span className="decimal">{circulatingRate[1]}</span>
                        %) <br />
                        {'> '}
                        <span className="integer">{circulating[0]}</span>
                        <span className="decimal">{circulating[1]}</span>
                    </li>
                    <li className="c-sidebar__list-item" style={styleBurn}>
                        {tt('g.burn')} (
                        <span className="integer">{burnRate[0]}</span>
                        <span className="decimal">{burnRate[1]}</span>
                        %) <br />
                        {'> '}
                        <span className="integer">{burn[0]}</span>
                        <span className="decimal">{burn[1]}</span>
                    </li>
                    <li className="c-sidebar__list-item">
                        {tt('g.staking')} (
                        <span className="integer">{stakingRate[0]}</span>
                        <span className="decimal">{stakingRate[1]}</span>
                        %) <br />
                        {'> '}
                        <span className="integer">{staking[0]}</span>
                        <span className="decimal">{staking[1]}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SidebarToken;
