import React from 'react';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';

const FormattedAssetToken = ({ balance, stake, symbol }) => {
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

    return isStake ? (
        <span className={`FormattedAssetToken`}>
            <span className="prefix"> {symbol} </span>
            <span className="integer">{bal[0]}</span>
            <span className="decimal">{bal[1]}</span>{'('}
            <span className="integer">{stk[0]}</span>
            <span className="decimal">{stk[1]}</span>{')'}
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