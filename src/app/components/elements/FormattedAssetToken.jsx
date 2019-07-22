import React from 'react';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';

const FormattedAssetToken = ({
    balance,
    stake,
    delegationsIn,
    delegationsOut,
    reward,
    symbol,
}) => {
    if (balance && typeof balance === 'string') {
        balance = parsePayoutAmount(balance);
    }
    const bal = formatDecimal(balance);

    let isStake = false;
    let isDelegationIn = false;
    let isDelegationOut = false;
    let isReward = false;

    if (stake && typeof stake === 'string') {
        stake = parsePayoutAmount(stake);
        if (stake > 0) isStake = true;
    }
    const stk = formatDecimal(stake);

    if (delegationsIn && typeof delegationsIn === 'string') {
        delegationsIn = parsePayoutAmount(delegationsIn);
        if (delegationsIn > 0) isDelegationIn = true;
    }
    const dIn = formatDecimal(delegationsIn || 0);

    if (delegationsOut && typeof delegationsOut === 'string') {
        delegationsOut = parsePayoutAmount(delegationsOut);
        if (delegationsOut > 0) isDelegationOut = true;
    }
    const dOut = formatDecimal(delegationsOut || 0);

    if (reward > 0) isReward = true;

    const rew = formatDecimal(reward || 0);
    const tokenClassName = isReward
        ? `FormattedAssetTokenReward`
        : `FormattedAssetToken`;

    return isStake || isDelegationIn || isDelegationOut ? (
        <span className={tokenClassName}>
            <span className="prefix">{symbol} </span>
            <span className="integer">{bal[0]}</span>
            <span className="decimal">{bal[1]}</span>
            {isReward && ` + `}
            {isReward && <span className="integer">{rew[0]}</span>}
            {isReward && <span className="decimal">{rew[1]}</span>}
            {'('}
            <span className="integer">{stk[0]}</span>
            <span className="decimal">{stk[1]}</span>
            {', +'}
            <span className="integer">{dIn[0]}</span>
            <span className="decimal">{dIn[1]}</span>
            {', -'}
            <span className="integer">{dOut[0]}</span>
            <span className="decimal">{dOut[1]}</span>
            {')'}
        </span>
    ) : (
        <span className={tokenClassName}>
            <span className="prefix">{symbol} </span>
            <span className="integer">{bal[0]}</span>
            <span className="decimal">{bal[1]}</span>
            {isReward && ` + `}
            {isReward && <span className="integer">{rew[0]}</span>}
            {isReward && <span className="decimal">{rew[1]}</span>}
        </span>
    );
};

export default FormattedAssetToken;
