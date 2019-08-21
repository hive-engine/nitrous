import React from 'react';
import { connect } from 'react-redux';
import { REVIVE_ADS } from 'app/client_config';

class ReviveAd extends React.Component {
    render() {
        const adKey = this.props.adKey;
        const zoneId = REVIVE_ADS[adKey].zoneId;
        const reviveId = REVIVE_ADS[adKey].reviveId;
        return (
            <div className="revive-ad" style={{ width: '100%' }}>
                <ins data-revive-zoneid={zoneId} data-revive-id={reviveId} />
            </div>
        );
    }
}

export default connect((state, ownProps) => {
    return { ...ownProps };
})(ReviveAd);
