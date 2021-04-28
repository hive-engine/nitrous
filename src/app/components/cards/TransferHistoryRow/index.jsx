import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
// import Icon from 'app/components/elements/Icon';
import Memo from 'app/components/elements/Memo';
import { numberWithCommas } from 'app/utils/StateFunctions';
import tt from 'counterpart';
import GDPRUserList from 'app/utils/GDPRUserList';

function formatScotAmount(quantity) {
    return quantity;
}

const postLink = (socialUrl, author, permlink) => (
    <a href={`${socialUrl}/@${author}/${permlink}`} target="_blank">
        {author}/{permlink}
    </a>
);

class TransferHistoryRow extends React.Component {
    render() {
        const { op, context, scotTokenSymbol, appUrl } = this.props;
        // context -> account perspective

        /*  all transfers involve up to 2 accounts, context and 1 other. */

        let message = '';
        let memo = op.memo;

        let description_start = '';
        let other_account = null;
        let description_end = '';

        if (op.operation && op.operation.startsWith('market')) {
            return null;
        } else if (op.operation === 'tokens_transfer' && op.from === context) {
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
        } else if (op.operation === 'tokens_transfer' && op.to === context) {
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
        } else if (op.operation === 'tokens_stake' && op.from === context) {
            message = (
                <span>
                    {tt(['transferhistoryrow_jsx', 'stake_to'], {
                        amount: `${op.quantity} ${scotTokenSymbol}`,
                    })}
                    {otherAccountLink(op.to)}
                </span>
            );
        } else if (op.operation === 'tokens_stake' && op.to === context) {
            message = (
                <span>
                    {tt(['transferhistoryrow_jsx', 'stake_from'], {
                        amount: `${op.quantity} ${scotTokenSymbol}`,
                    })}
                    {otherAccountLink(op.from)}
                </span>
            );
        } else if (
            op.operation === 'tokens_cancelUnstake' &&
            op.account === context
        ) {
            message = (
                <span>
                    {tt(['transferhistoryrow_jsx', 'cancel_unstake'], {
                        amount: `${op.quantityReturned} ${scotTokenSymbol}`,
                    })}
                </span>
            );
            memo = op.unstakeTxID;
        } else if (
            op.operation === 'tokens_unstakeStart' &&
            op.account === context
        ) {
            message = (
                <span>
                    {tt(['transferhistoryrow_jsx', 'unstake'], {
                        amount: `${op.quantity} ${scotTokenSymbol}`,
                    })}
                </span>
            );
            memo = op.unstakeTxID;
        } else if (op.operation === 'tokens_issue' && op.to === context) {
            message = (
                <span>
                    {tt(['transferhistoryrow_jsx', 'issue_from'], {
                        amount: `${op.quantity} ${scotTokenSymbol}`,
                    })}
                </span>
            );
        } else if (op.type === 'staking_reward') {
            message = (
                <span>
                    {tt(['transferhistoryrow_jsx', 'staking_reward'], {
                        amount: `${formatScotAmount(
                            op.quantity,
                        )} ${scotTokenSymbol}`,
                    })}
                </span>
            );
        } else if (
            op.type === 'author_reward' ||
            op.type === 'curation_reward' ||
            op.type === 'comment_benefactor_reward' ||
            op.type === 'mining_reward'
        ) {
            message = (
                <span>
                    {tt(['transferhistoryrow_jsx', op.type], {
                        amount: `${formatScotAmount(
                            op.quantity,
                        )} ${scotTokenSymbol}`,
                    })}
                    {op.type != 'mining_reward' &&
                        postLink(appUrl, op.author, op.permlink)}
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
                    <Memo text={memo} username={context} />
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
        const scotTokenSymbol = state.app.getIn([
            'hostConfig',
            'LIQUID_TOKEN_UPPERCASE',
        ]);
        return {
            ...ownProps,
            appUrl: state.app.getIn(['hostConfig', 'APP_URL']),
            scotTokenSymbol,
        };
    }
)(TransferHistoryRow);
