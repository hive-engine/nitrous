import React from 'react';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { FormattedRelative } from 'react-intl';
import Tooltip from 'app/components/elements/Tooltip';
import * as userActions from 'app/redux/UserReducer';

class Delegations extends React.Component {
    constructor(props, context) {
        super(props, context);
        const new_withdraw = props.stakeBalance - props.delegatedStake;
        this.state = {
            broadcasting: false,
            manual_entry: false,
            new_withdraw,
        };
    }

    render() {
        const { account, tokenDelegations } = this.props;

        return (
            <div className="DelegationsModal">
                <div className="row">
                    <h3 className="column">
                        {tt('delegations_jsx.delegations', {
                            fallback: 'Delegations',
                        })}
                    </h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>From</th>
                            <th>To</th>
                            <th className="amount">Amount</th>
                            <th>Symbol</th>
                            <th>Created</th>
                            <th>Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokenDelegations.map((e, i) => (
                            <tr
                                key={String(i)}
                                className={
                                    e.to === account
                                        ? 'delegationsIn'
                                        : 'delegationsOut'
                                }
                            >
                                <td>{e.from}</td>
                                <td>{e.to}</td>
                                <td className="amount">
                                    {parseFloat(e.quantity)}
                                </td>
                                <td>{e.symbol}</td>
                                <td>
                                    <Tooltip
                                        t={new Date(e.created).toLocaleString()}
                                    >
                                        <FormattedRelative value={e.created} />
                                    </Tooltip>
                                </td>
                                <td>
                                    <Tooltip
                                        t={new Date(e.updated).toLocaleString()}
                                    >
                                        <FormattedRelative value={e.updated} />
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        const value = state.user.get('delegations');
        // const accounts = state.global.get('accounts');
        return {
            ...ownProps,
            account: value.get('account'),
            tokenDelegations: value.get('tokenDelegations').toJS(),
        };
    },
    // mapDispatchToProps
    dispatch => ({
        successCallback: () => {
            dispatch(userActions.hideDelegations());
        },
    })
)(Delegations);
