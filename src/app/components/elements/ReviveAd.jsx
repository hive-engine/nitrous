import React from 'react';
import { connect } from 'react-redux';
import { REVIVE_ADS, NO_ADS_STAKE_THRESHOLD } from 'app/client_config';

class ReviveAd extends React.Component {
    shouldComponentUpdate(np, ns) {
        return np.showAd !== this.props.showAd;
    }

    render() {
        const adKey = this.props.adKey;
        const showAd = this.props.showAd;
        const zoneId = REVIVE_ADS[adKey].zoneId;
        const reviveId = REVIVE_ADS[adKey].reviveId;
        return showAd ? (
            <div className="revive-ad" style={{ width: '100%' }}>
                <ins data-revive-zoneid={zoneId} data-revive-id={reviveId} />
            </div>
        ) : null;
    }
}

export default connect((state, ownProps) => {
    const current_account = state.user.get('current');
    const tokenBalances = current_account
        ? current_account.get('token_balances')
        : null;
    let showAd = !current_account || !tokenBalances;

    if (tokenBalances) {
        const tokenBalancesJs = tokenBalances.toJS();
        const delegatedStake = tokenBalancesJs.delegationsOut || '0';
        const stakeBalance =
            parseFloat(tokenBalancesJs.stake) + parseFloat(delegatedStake);
        showAd = stakeBalance < NO_ADS_STAKE_THRESHOLD;
    }
    return { ...ownProps, showAd };
})(ReviveAd);
