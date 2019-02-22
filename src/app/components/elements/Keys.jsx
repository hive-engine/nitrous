/* eslint react/prop-types: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import ShowKey from 'app/components/elements/ShowKey';
import tt from 'counterpart';

class Keys extends Component {
    static propTypes = {
        account: PropTypes.object.isRequired, // immutable Map
        authType: PropTypes.oneOf(['posting', 'active', 'owner', 'memo']),
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.authType !== nextProps.authType ||
            this.props.account !== nextProps.account
        );
    }

    render() {
        const { props: { account, authType, privateKeys, onKey } } = this;

        // normalize public auths as simple lists of keys
        const pubkeys =
            authType === 'memo'
                ? List([account.get('memo_key')])
                : account.getIn([authType, 'key_auths']).map(a => a.get(0));

        const tt_auth_type = {
            owner: tt('g.owner'),
            active: tt('g.active'),
            posting: tt('g.posting'),
            memo: tt('g.memo'),
        }[authType.toLowerCase()];

        let idx = 0;
        const auths = pubkeys.map(pubkey => (
            <div key={idx++} className="row">
                <div className="column small-12">
                    <ShowKey
                        pubkey={pubkey}
                        privateKey={privateKeys.get(authType + '_private')}
                        authType={authType}
                        authTypeName={tt_auth_type}
                        accountName={account.get('name')}
                        onKey={onKey}
                    />
                </div>
            </div>
        ));

        return (
            <span>
                <div className="row">
                    <div>{auths}</div>
                </div>
            </span>
        );
    }
}

export default connect((state, ownProps) => {
    return {
        ...ownProps,
        privateKeys: state.user.getIn(['current', 'private_keys'], Map()),
    };
})(Keys);
