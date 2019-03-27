import React from 'react';
import { connect } from 'react-redux';
import * as workerProposalSystemActions from 'app/redux/WorkerProposalSystemReducer';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import tt from 'counterpart';
import { FormattedDate, FormattedTime } from 'react-intl';
import Icon from 'app/components/elements/Icon';
import * as transactionActions from 'app/redux/TransactionReducer';
import Pagination from 'app/components/elements/Pagination';

class WorkerProposalSystem extends React.Component {
    orderedProposalKeys = [
        'id',
        'creator',
        'receiver',
        'start_date',
        'end_date',
        'daily_pay',
        'total_votes',
        'permlink',
    ];
    static propTypes = {
        listProposals: PropTypes.func,
        listVoterProposals: PropTypes.func,
        removeProposal: PropTypes.func,
        updateProposalVotes: PropTypes.func,
    };
    constructor() {
        super();
    }

    componentDidMount() {
        const { listProposals } = this.props;

        listProposals({
            start: '',
            order_by: 'by_creator',
            order_direction: 'direction_ascending',
            limit: 100,
            active: 'all',
        });
    }

    formatAsset(amount, precision) {
        return (
            parseFloat(amount) / Math.pow(10, parseFloat(precision))
        ).toFixed(parseInt(precision));
    }

    formatTableDiv(key, value) {
        switch (key) {
            case 'id':
                return [
                    <Icon
                        name={'chevron-up-circle'}
                        className="upvote"
                        key={`vote-icon-${value}`}
                    />,
                    value,
                ];
            case 'start_date':
            case 'end_date':
                return [
                    <FormattedDate value={value} />,
                    <span>&nbsp;</span>,
                    <FormattedTime value={value} />,
                ];
            case 'daily_pay':
                const amount = this.formatAsset(
                    value.get('amount'),
                    value.get('precision')
                );
                return `${amount} SBD`;
            case 'permlink':
                return (
                    <a href={value} target="__blank">
                        <Icon name={'extlink'} className="proposal-extlink" />
                    </a>
                );
            default:
                return value;
        }
    }

    onFilterListProposals(active) {
        const { listProposals } = this.props;
        listProposals({
            start: '',
            order_by: 'by_creator',
            order_direction: 'direction_ascending',
            limit: 100,
            active,
        });
    }

    // TODO: FormattedAsset not enough to calculate precision
    renderTableRow(proposal) {
        const id = proposal.get('id');

        return [
            <tr key={`proposal-${id}`}>
                {this.orderedProposalKeys.map(k => (
                    <td key={`${k}-${id}`} className={`${k}-column`}>
                        {this.formatTableDiv(k, proposal.get(k))}
                    </td>
                ))}
            </tr>,
            <tr key="2">
                <td key={`subject-${id}`} colSpan="8">
                    {proposal.get('subject')}
                </td>
            </tr>,
        ];
    }

    renderProposalTable(proposals) {
        const proposalsArr = proposals.toArray();

        return (
            <table>
                <thead>
                    <tr>
                        <td colSpan="8">Filter, Sorter</td>
                    </tr>
                    <tr>
                        {this.orderedProposalKeys.map(key => (
                            <td key={key} className={`${key}-table-header`}>
                                {tt(`worker_proposal_system_jsx.table.${key}`)}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {proposalsArr.map(proposal =>
                        this.renderTableRow(proposal)
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="8">
                            <Pagination />
                        </td>
                    </tr>
                </tfoot>
            </table>
        );
    }

    render() {
        const { proposals } = this.props;

        // TODO: implement loading indicator
        // if (loading) return <span>Loading...</span>;

        return (
            <div className="WorkerProposalSystem">
                <div className="row">
                    <div className="column">
                        <h2>{tt('worker_proposal_system_jsx.top_wps')}</h2>
                        <button
                            onClick={() => this.onFilterListProposals('active')}
                            className="button"
                        >
                            Active
                        </button>
                        <button
                            onClick={() =>
                                this.onFilterListProposals('inactive')
                            }
                            className="button"
                        >
                            Inactive
                        </button>
                        <button
                            onClick={() => this.onFilterListProposals('all')}
                            className="button"
                        >
                            All
                        </button>
                        {proposals.size ? (
                            this.renderProposalTable(proposals)
                        ) : (
                            <span>There is no proposal to show</span>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: '/worker_proposal_system',
    component: connect(
        state => {
            return {
                proposals: state.global.get('proposals', List()),
            };
        },
        dispatch => ({
            updateProposalVotes: (voter, proposal_ids, approve) => {
                dispatch(
                    transactionActions.broadcastOperation({
                        type: 'update_proposal_votes',
                        operation: { voter, proposal_ids, approve },
                    })
                );
            },
            removeProposal: (proposal_owner, proposal_ids) => {
                dispatch(
                    transactionActions.broadcastOperation({
                        type: 'remove_proposal',
                        operation: { proposal_owner, proposal_ids },
                    })
                );
            },
            listProposals: payload =>
                new Promise((resolve, reject) => {
                    dispatch(
                        fetchDataSagaActions.listProposals({
                            ...payload,
                            resolve,
                            reject,
                        })
                    );
                }),
            listVoterProposals: payload =>
                new Promise((resolve, reject) => {
                    dispatch(
                        fetchDataSagaActions.listVoterProposals({
                            ...payload,
                            resolve,
                            reject,
                        })
                    );
                }),
        })
    )(WorkerProposalSystem),
};
