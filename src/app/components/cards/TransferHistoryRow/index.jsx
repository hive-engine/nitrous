import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
// import Icon from 'app/components/elements/Icon';
import Memo from 'app/components/elements/Memo';
import { numberWithCommas, vestsToSp } from 'app/utils/StateFunctions';
import tt from 'counterpart';
import GDPRUserList from 'app/utils/GDPRUserList';

class TransferHistoryRow extends React.Component {
    render() {
        const { op, context, scotTokenSymbol } = this.props;
        // context -> account perspective

        /*  all transfers involve up to 2 accounts, context and 1 other. */

        let message = '';

        let description_start = '';
        let other_account = null;
        let description_end = '';

        if (op.from === context) {
            message = (
                <span>
                    {tt(
                        [
                            'transferhistoryrow_jsx',
                            'transfer',
                            'from_self',
                            'not_savings',
                        ],
                        { amount: `${op.quantity} ${scotTokenSymbol}` }
                    )}
                    {otherAccountLink(op.to)}
                </span>
            );
        } else if (op.to === context) {
            message = (
                <span>
                    {tt(
                        [
                            'transferhistoryrow_jsx',
                            'transfer',
                            'to_self',
                            'not_savings',
                        ],
                        { amount: `${op.quantity} ${scotTokenSymbol}` }
                    )}
                    {otherAccountLink(op.from)}
                </span>
            );
        } else {
            message = JSON.stringify({ ...op }, null, 2);
        }
        return (
            <tr key={op[0]} className="Trans">
                <td>
                    <TimeAgoWrapper date={op.timestamp} />
                </td>
                <td
                    className="TransferHistoryRow__text"
                    style={{ maxWidth: '40rem' }}
                >
                    {message}
                </td>
                <td
                    className="show-for-medium"
                    style={{ maxWidth: '40rem', wordWrap: 'break-word' }}
                >
                    <Memo text={op.memo} username={context} />
                </td>
            </tr>
        );
    }
}

const otherAccountLink = username =>
    GDPRUserList.includes(username) ? (
        <span>{username}</span>
    ) : (
        <Link to={`/@${username}`}>{username}</Link>
    );

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        return {
            ...ownProps,
            scotTokenSymbol: state.app.getIn([
                'hostConfig',
                'LIQUID_TOKEN_UPPERCASE',
            ]),
        };
    }
)(TransferHistoryRow);
