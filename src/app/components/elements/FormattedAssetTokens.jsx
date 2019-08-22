import React from 'react';
import PropTypes from 'prop-types';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';
import Tooltip from 'app/components/elements/Tooltip';
import classNames from 'classnames';

const FormattedAssetToken = ({
    item,
    pendingTokens,
    isMyAccount,
    handleClaimTokenRewards,
}) => {
    const tooltip = [];
    const {
        symbol,
        delegationsIn = 0,
        delegationsOut = 0,
        pendingUndelegations = 0,
        pendingUnstake = 0,
    } = item;
    let { balance = 0, stake = 0 } = item;
    let isStake = false;
    if (balance && typeof balance === 'string') {
        balance = formatDecimal(parsePayoutAmount(balance), 3);
        tooltip.push(`Balance: ${balance.join('')}`);
    }
    if (stake && typeof stake === 'string') {
        stake = formatDecimal(parsePayoutAmount(stake), 3);
        isStake = Boolean(parseFloat(stake));
    }
    if (isStake) {
        tooltip.push(`Stake: ${stake.join('')}`);
    }
    if (parseFloat(delegationsOut)) {
        tooltip.push(`DelegationsOut: ${delegationsOut}`);
    }
    if (parseFloat(delegationsIn)) {
        tooltip.push(`DelegationsIn: ${delegationsIn}`);
    }
    if (parseFloat(pendingUndelegations)) {
        tooltip.push(`PendingUndelegations: ${pendingUndelegations}`);
    }
    if (parseFloat(pendingUnstake)) {
        tooltip.push(`PendingUnstake: ${pendingUnstake}`);
    }
    const pendingToken = pendingTokens.find(e => e.symbol === symbol);

    const handleClick = () => {
        if (isMyAccount && pendingToken) {
            handleClaimTokenRewards(symbol);
        }
    };

    return (
        <Tooltip
            className={classNames('label', {
                reward: isMyAccount && pendingToken,
            })}
            t={tooltip.join(', ')}
        >
            <span role="button" tabIndex="0" onClick={handleClick}>
                <span className="integer">{balance[0]}</span>
                {parseFloat(balance[1]) ? (
                    <span className="decimal">{balance[1]}</span>
                ) : null}
                {isStake ? (
                    <span>
                        (<span className="integer">{stake[0]}</span>
                        {parseFloat(stake[1]) ? (
                            <span className="decimal">{stake[1]}</span>
                        ) : null})
                    </span>
                ) : null}{' '}
                <span className="asset">{symbol}</span>
            </span>
        </Tooltip>
    );
};

FormattedAssetToken.propTypes = {
    item: PropTypes.objectOf(PropTypes.shape).isRequired,
    pendingTokens: PropTypes.arrayOf(PropTypes.shape).isRequired,
    isMyAccount: PropTypes.bool,
    handleClaimTokenRewards: PropTypes.func,
};

FormattedAssetToken.defaultProps = {
    isMyAccount: false,
    handleClaimTokenRewards: () => {},
};

const FormattedAssetTokens = ({
    items,
    allTokenStatus,
    isMyAccount,
    handleClaimTokenRewards,
}) => {
    const sortedItems = items.sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
    const pendingTokens = Object.values(allTokenStatus).filter(e =>
        parseFloat(e.pending_token)
    );
    return (
        <div className="UserWallet__balance-tokens">
            {sortedItems &&
                sortedItems.map(item => (
                    <FormattedAssetToken
                        item={item}
                        key={item.symbol}
                        isMyAccount={isMyAccount}
                        pendingTokens={pendingTokens}
                        handleClaimTokenRewards={handleClaimTokenRewards}
                    />
                ))}
        </div>
    );
};

FormattedAssetTokens.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape).isRequired,
    allTokenStatus: PropTypes.objectOf(PropTypes.shape).isRequired,
    isMyAccount: PropTypes.bool,
    handleClaimTokenRewards: PropTypes.func,
};

FormattedAssetTokens.defaultProps = {
    isMyAccount: false,
    handleClaimTokenRewards: () => {},
};

export default FormattedAssetTokens;
