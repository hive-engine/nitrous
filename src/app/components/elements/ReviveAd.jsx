import React from 'react';
import { connect } from 'react-redux';
import { REVIVE_ADS, NO_ADS_STAKE_THRESHOLD } from 'app/client_config';

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
    let showAd = true;

    if (tokenBalances) {
        const tokenBalancesJs = tokenBalances.toJS();
        const delegatedStake = tokenBalancesJs.delegationsOut || '0';
        const stakeBalance =
            parseFloat(tokenBalancesJs.stake) + parseFloat(delegatedStake);
        if (stakeBalance >= NO_ADS_STAKE_THRESHOLD) {
            showAd = false;
        }
    }

    const adKey = ownProps.adKey;
    let zoneId = '';
    let reviveId = '';
    if (REVIVE_ADS[adKey]) {
        zoneId = REVIVE_ADS[adKey].zoneId;
        reviveId = REVIVE_ADS[adKey].reviveId;
    } else {
        showAd = false;
    }

    return { ...ownProps, showAd, zoneId, reviveId };
})(ReviveAd);
