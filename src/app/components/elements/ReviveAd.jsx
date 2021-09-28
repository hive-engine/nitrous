import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

class ReviveAd extends React.Component {
    componentDidMount() {
        const { showAd, reviveId } = this.props;
        if (showAd && typeof reviveAsync !== 'undefined') {
            reviveAsync[reviveId].refresh();
        }
    }

    render() {
        const { showAd, zoneId, reviveId } = this.props;
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
    const noAdsStakeThreshold = state.app.getIn([
        'hostConfig',
        'NO_ADS_STAKE_THRESHOLD',
    ]);
    const reviveAdsConfig = state.app
        .getIn(['hostConfig', 'REVIVE_ADS'], Map())
        .toJS();
    // Do not show if server side.
    let showAd = Boolean(process.env.BROWSER);

    if (tokenBalances) {
        const tokenBalancesJs = tokenBalances.toJS();
        const delegatedStake = tokenBalancesJs.delegationsOut || '0';
        const stakeBalance =
            parseFloat(tokenBalancesJs.stake) + parseFloat(delegatedStake);
        if (stakeBalance >= noAdsStakeThreshold) {
            showAd = false;
        }
    }

    const adKey = ownProps.adKey;
    let zoneId = '';
    let reviveId = '';
    if (reviveAdsConfig[adKey]) {
        zoneId = reviveAdsConfig[adKey].zoneId;
        reviveId = reviveAdsConfig[adKey].reviveId;
    } else {
        showAd = false;
    }

    return { ...ownProps, showAd, zoneId, reviveId };
})(ReviveAd);
