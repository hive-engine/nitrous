import React from 'react';
import { connect } from 'react-redux';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import tt from 'counterpart';
import { FormattedDate, FormattedTime } from 'react-intl';
import Icon from 'app/components/elements/Icon';
import * as transactionActions from 'app/redux/TransactionReducer';
import Pagination from 'app/components/elements/Pagination';

class SteemProposalSystem extends React.Component {
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
        this.state = {
            currentPage: 1,
        };
        this.onPageSelect = this.onPageSelect.bind(this);
    }

    componentDidMount() {
        const { listProposals } = this.props;

        listProposals({
            start: '',
            order_by: 'by_creator',
            order_direction: 'direction_ascending',
            limit: 5,
            active: 'all',
        });
    }

    onPageSelect(newPage) {
        this.setState({ currentPage: newPage });
    }

    formatAsset(amount, precision) {
        return (
            parseFloat(amount) / Math.pow(10, parseFloat(precision))
        ).toFixed(parseInt(precision));
    }

    formatTableDiv(key, value, isOwner = false) {
        switch (key) {
            case 'start_date':
            case 'end_date':
                return [
                    <FormattedDate value={value} key={`date-${value}`} />,
                    <span key={`space-${value}`}>&nbsp;</span>,
                    <FormattedTime value={value} key={`time-${value}`} />,
                ];
            case 'daily_pay':
                const amount = this.formatAsset(
                    value.get('amount'),
                    value.get('precision')
                );
                return `${amount} SBD`;
            case 'permlink':
                return [
                    <a
                        href={value}
                        target="__blank"
                        key={`proposal-extlink-${value}`}
                        title="Perm link"
                    >
                        <Icon name="extlink" className="proposal-extlink" />
                    </a>,
                    <Icon
                        name="chevron-up-circle"
                        className="upvote"
                        key={`vote-icon-${value}`}
                    />,
                    isOwner && (
                        <span key="remove-icon" title="Remove">
                            &#x2716;
                        </span>
                    ),
                ];
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
            limit: 5,
            active,
        });
    }

    renderTableRow(proposal) {
        const id = proposal.get('id');
        const isOwner = proposal.get('creator') === this.props.currentUser;

        return [
            <tr key={`proposal-${id}`}>
                {this.orderedProposalKeys.map(k => (
                    <td key={`${k}-${id}`} className={`${k}-column`}>
                        {this.formatTableDiv(k, proposal.get(k), isOwner)}
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
        const { currentPage } = this.state;
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
                                {tt(`steem_proposal_system_jsx.table.${key}`)}
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
                            <Pagination
                                onSelect={this.onPageSelect}
                                perPage={5}
                                length={13}
                                currentPage={currentPage}
                            />
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
            <div className="SteemProposalSystem">
                <div className="row">
                    <div className="column">
                        <h2>{tt('steem_proposal_system_jsx.top_sps')}</h2>
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
    path: '/steem_proposal_system',
    component: connect(
        state => {
            const user = state.user.get('current');
            return {
                currentUser: user ? user.get('username') : null,
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
    )(SteemProposalSystem),
};
