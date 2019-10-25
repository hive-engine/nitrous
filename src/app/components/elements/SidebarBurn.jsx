import React from 'react';
import tt from 'counterpart';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';

const SidebarBurn = ({
    scotToken,
    scotTokenCirculating,
    scotTokenBurn,
    scotTokenStaking,
    sct_to_steemp,
    steem_to_krw,
    sctm_price,
    received_sctm,
    received_list,
    krwp_balance,
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

    const styleToken = { color: 'rgb(0, 120, 167)' };
    const styleBurn = { color: 'red' };

    const krwpValue = krwp_balance * 1000;
    const sctmValue = sctm_price * steem_to_krw * received_sctm;
    const currRate = sctmValue / krwpValue;
    const gap = krwpValue - sctmValue;
    const maxAmount = krwpValue / (sctm_price * steem_to_krw);
    const swapRate = krwp_balance / maxAmount;

    return (
        <div className="c-sidebar__module">
            <div className="c-sidebar__header" style={styleToken}>
                <h3 className="c-sidebar__h3">{scotToken}</h3>
            </div>
            <div className="c-sidebar__content">
                <ul className="c-sidebar__list-small">
                    <li className="c-sidebar__list-item">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>{tt('g.total')}</div>
                            <div>
                                <span className="integer">{total[0]}</span>
                                <span className="decimal">{total[1]}</span>
                            </div>
                        </div>
                    </li>
                    <li className="c-sidebar__list-item" style={styleBurn}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                {tt('g.burn')}
                                {/* <br /> */}
                                (
                                <span className="integer">{burnRate[0]}</span>
                                <span className="decimal">{burnRate[1]}</span>
                                %)
                            </div>
                            <div>
                                <span className="integer">{burn[0]}</span>
                                <span className="decimal">{burn[1]}</span>
                            </div>
                        </div>
                    </li>
                    <li className="c-sidebar__list-item">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                {tt('g.circulating')}
                                {/* <br /> */}
                                (
                                <span className="integer">
                                    {circulatingRate[0]}
                                </span>
                                <span className="decimal">
                                    {circulatingRate[1]}
                                </span>
                                %)
                            </div>
                            <div>
                                <span className="integer">
                                    {circulating[0]}
                                </span>
                                <span className="decimal">
                                    {circulating[1]}
                                </span>
                            </div>
                        </div>
                    </li>
                    <li className="c-sidebar__list-item">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                {tt('g.staking')}
                                {/* <br /> */}
                                (
                                <span className="integer">
                                    {stakingRate[0]}
                                </span>
                                <span className="decimal">
                                    {stakingRate[1]}
                                </span>
                                %)
                            </div>
                            <div>
                                <span className="integer">{staking[0]}</span>
                                <span className="decimal">{staking[1]}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            {sct_to_steemp && (
                <div>
                    <br />
                    <div className="c-sidebar__header" style={styleToken}>
                        <h3 className="c-sidebar__h3">SWAP(SCTM⇋KRWP)</h3>
                    </div>
                    <div className="c-sidebar__content">
                        <ul className="c-sidebar__list-small">
                            <li className="c-sidebar__list-item">
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>SCTM Price(Steem)</div>
                                    <div>
                                        <span className="decimal">
                                            {parseFloat(sctm_price).toFixed(3)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li className="c-sidebar__list-item">
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>Swap Rate(per 1SCTM)</div>
                                    <div>
                                        <span className="decimal">
                                            {parseFloat(swapRate).toFixed(3)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li className="c-sidebar__list-item">
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>Owned KRWP</div>
                                    <div>
                                        <span className="decimal">
                                            {parseFloat(krwp_balance).toFixed(
                                                3
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li
                                className="c-sidebar__list-item"
                                style={styleBurn}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>Joined SCTM</div>
                                    <div>
                                        <span className="decimal">
                                            {received_sctm.toFixed(3)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li className="c-sidebar__list-item">
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>Max Amount SCTM</div>
                                    <div>
                                        <span className="decimal">
                                            {maxAmount.toFixed(3)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SidebarBurn;
