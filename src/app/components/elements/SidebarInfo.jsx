import React from 'react';
import tt from 'counterpart';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';

const ShowPriceToken = props => {
    return (
        <li className="c-sidebar__list-item">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div>{props.symbol}</div>
                <div>
                    <span>{props.price_steem.toFixed(3) + ' STEEM'}</span>
                </div>
            </div>
        </li>
    );
};

const SidebarInfo = ({
    rors_to_steemp,
    iv_to_steemp,
    ivm_to_steemp,
    steem_to_dollor,
    steem_to_krw,
}) => {
    const styleToken = { color: '#D2AE63' };
    const styleModule = { padding: '0.5em 1em' };
    const steem_price = formatDecimal(steem_to_dollor, 4);
    const rors_price = formatDecimal(rors_to_steemp * steem_to_dollor, 4);
    const rors_price_with_krw = formatDecimal(rors_to_steemp * steem_to_krw);
    const iv_price = formatDecimal(iv_to_steemp * steem_to_dollor, 4);
    const iv_price_with_krw = formatDecimal(iv_to_steemp * steem_to_krw);
    const ivm_price = formatDecimal(ivm_to_steemp * steem_to_dollor, 4);
    const ivm_price_with_krw = formatDecimal(ivm_to_steemp * steem_to_krw);
    const locale = tt.getLocale();

    return (
        <div className="c-sidebar__module" style={styleModule}>
            <div className="c-sidebar__header" style={styleToken}>
                <h3 className="c-sidebar__h3">Steem Inventory Info</h3>
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
                            <div>{'STEEM'}</div>
                            <div>
                                {locale === 'ko' && (
                                    <span className="integer">
                                        {steem_to_krw + tt('g.krw') + ' ('}
                                    </span>
                                )}
                                <span>{'$'}</span>
                                <span className="integer">
                                    {steem_price[0]}
                                </span>
                                <span className="decimal">
                                    {steem_price[1]}
                                </span>
                                {locale === 'ko' && <span>{')'}</span>}
                            </div>
                        </div>
                    </li>
                    <ShowPriceToken
                        symbol={'RORS'}
                        price_steem={rors_to_steemp}
                    />

                    <li className="c-sidebar__list-item">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>{''}</div>
                            <div>
                                {locale === 'ko' && (
                                    <span className="integer">
                                        {rors_price_with_krw[0] +
                                            tt('g.krw') +
                                            ' ('}
                                    </span>
                                )}
                                <span>{'$'}</span>
                                <span className="integer">{rors_price[0]}</span>
                                <span className="decimal">{rors_price[1]}</span>
                                {locale === 'ko' && <span>{')'}</span>}
                            </div>
                        </div>
                    </li>
                    <ShowPriceToken symbol={'IV'} price_steem={iv_to_steemp} />

                    <li className="c-sidebar__list-item">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>{''}</div>
                            <div>
                                {locale === 'ko' && (
                                    <span className="integer">
                                        {iv_price_with_krw[0] +
                                            tt('g.krw') +
                                            ' ('}
                                    </span>
                                )}
                                <span>{'$'}</span>
                                <span className="integer">{iv_price[0]}</span>
                                <span className="decimal">{iv_price[1]}</span>
                                {locale === 'ko' && <span>{')'}</span>}
                            </div>
                        </div>
                    </li>
                    <ShowPriceToken
                        symbol={'IVM'}
                        price_steem={ivm_to_steemp}
                    />

                    <li className="c-sidebar__list-item">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>{''}</div>
                            <div>
                                {locale === 'ko' && (
                                    <span className="integer">
                                        {ivm_price_with_krw[0] +
                                            tt('g.krw') +
                                            ' ('}
                                    </span>
                                )}
                                <span>{'$'}</span>
                                <span className="integer">{ivm_price[0]}</span>
                                <span className="decimal">{ivm_price[1]}</span>
                                {locale === 'ko' && <span>{')'}</span>}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SidebarInfo;
