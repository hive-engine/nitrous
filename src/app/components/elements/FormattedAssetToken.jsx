import React from 'react';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';

const FormattedAssetToken = ({ balance, stake, delegationsIn, delegationsOut, symbol }) => {
    if (balance && typeof balance === 'string') {
        balance = parsePayoutAmount(balance);
    }
    const bal = formatDecimal(balance);

    let isStake = false;

    if (stake && typeof stake === 'string') {
        stake = parsePayoutAmount(stake);
        isStake = true;
    }
    const stk = formatDecimal(stake);

    if (delegationsIn && typeof delegationsIn === 'string') {
        delegationsIn = parsePayoutAmount(delegationsIn);
    }
    const dIn = formatDecimal(delegationsIn || 0) ;

    if (delegationsOut && typeof delegationsOut === 'string') {
        delegationsOut = parsePayoutAmount(delegationsOut);
    }
    const dOut = formatDecimal(delegationsOut || 0) ; 

    return isStake ? (
        <span className={`FormattedAssetToken`}>
            <span className="prefix"> {symbol}</span>
            <span className="integer">{bal[0]}</span>
            <span className="decimal">{bal[1]}</span>{'('}
            <span className="integer">{stk[0]}</span>
            <span className="decimal">{stk[1]}</span>{', +'}
            <span className="integer">{dIn[0]}</span>
            <span className="decimal">{dIn[1]}</span>{', -'}
            <span className="integer">{dOut[0]}</span>
            <span className="decimal">{dOut[1]}</span>{')'}
        </span>
    ) : (
        <span className={`FormattedAssetToken`}>
            <span className="prefix"> {symbol} </span>
            <span className="integer">{bal[0]}</span>
            <span className="decimal">{bal[1]}</span>
        </span>
    );
};

export default FormattedAssetToken;