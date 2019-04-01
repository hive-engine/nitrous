import React from 'react';
import { connect } from 'react-redux';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import tt from 'counterpart';
import { FormattedDate, FormattedTime } from 'react-intl';
import Icon from 'app/components/elements/Icon';
import * as transactionActions from 'app/redux/TransactionReducer';
import Pagination from '../elements/Pagination';
import DropdownMenu from '../elements/DropdownMenu';

class SteemProposalSystem extends React.Component {
    pages = new Map();

    filterDropdownItems = [
        {
            value: 'all',
            onClick: () => {
                this.onFilterListProposals('all');
            },
        },
        {
            value: 'active',
            onClick: () => {
                this.onFilterListProposals('active');
            },
        },
        {
            value: 'inactive',
            onClick: () => {
                this.onFilterListProposals('inactive');
            },
        },
        {
            value: 'expired',
            onClick: () => {
                this.onFilterListProposals('expired');
            },
        },
        {
            value: 'votable',
            onClick: () => {
                this.onFilterListProposals('votable');
            },
        },
    ];

    orderedProposalKeys = [
        'id',
        'creator',
        'receiver',
        'start_date',
        'end_date',
        'daily_pay',
        'subject',
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
            last_id: null,
            limit: 11,
            limitPerPage: 10,
            status: 'votable',
            selectedSorter: 'ascending',
        };
        this.onNext = this.onNext.bind(this);
        this.onPrevious = this.onPrevious.bind(this);
    }

    componentWillMount() {
        this.onFilterListProposals('all');
        if (this.props.currentUser) {
            this.getVoterProposals(this.props.currentUser);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { currentUser } = nextProps;

        if (currentUser && currentUser !== this.props.currentUser) {
            this.getVoterProposals(currentUser);
        }
    }

    getVoterProposals(user) {
        this.props.listVoterProposals({
            start: user,
            order_by: 'by_total_votes',
            order_direction: 'direction_descending',
            limit: 1000,
            status: 'all',
        });
    }

    getProposals(
        limit,
        status,
        last_id,
        order_by = 'by_total_votes',
        order_direction = 'direction_descending',
        start = ''
    ) {
        this.props.listProposals({
            start,
            order_by,
            order_direction,
            limit,
            status,
            last_id,
        });
    }

    onFilterListProposals(status) {
        const { limit } = this.state;
        const { last_id } = this.props;
        this.setState({ status, currentPage: 1 });
        this.getProposals(limit, status, null);
        this.setState({ last_id });
    }

    onSortChange(selectedSorter) {
        this.setState({ selectedSorter });
        // apply sorter
    }

    onNext() {
        const { last_id, proposals } = this.props;
        const { currentPage, limit, status } = this.state;
        this.pages.set(currentPage, {
            previous_id: proposals.get(0).get('id'),
            last_id,
        });
        this.getProposals(limit, status, last_id);
        this.setState({ currentPage: currentPage + 1 });
    }

    onPrevious() {
        const { currentPage, limit, status } = this.state;
        if (this.pages.size) {
            const last_id =
                this.pages.get(currentPage - 1)['previous_id'] || null;
            this.getProposals(limit, status, last_id);
            this.pages.delete(currentPage);
            this.setState({ currentPage: currentPage - 1 });
        }
    }

    formatAsset(amount, precision) {
        return (
            parseFloat(amount) / Math.pow(10, parseFloat(precision))
        ).toFixed(parseInt(precision));
    }

    onUpdateProposalVotes(proposal, isVoted) {
        this.props.updateProposalVotes(
            this.props.currentUser,
            [proposal.get('id')],
            !isVoted
        );
    }

    onRemoveProposal(proposal) {
        this.props.removeProposal(this.props.currentUser, [proposal.get('id')]);
        this.pages.clear();
        this.setState({ currentPage: 1 });
    }

    checkVotedProposal(proposalId) {
        const { voterProposals, currentUser } = this.props;
        const proposals = voterProposals.get(currentUser);
        if (proposals && proposals.size) {
            const votedProposals = proposals.filter(
                p => p.get('id') === proposalId
            );
            return votedProposals.size ? true : false;
        }
        return false;
    }

    formatTableDiv(
        key,
        value,
        proposal,
        status,
        isOwner = false,
        isVoted = false
    ) {
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
                const isVotingInProgress =
                    this.props.votesInProgress.indexOf(proposal.get('id')) > -1;

                return [
                    <a
                        href={value}
                        target="__blank"
                        key={`proposal-extlink-${value}`}
                        title="Perm link"
                    >
                        <Icon name="extlink" className="proposal-extlink" />
                    </a>,
                    (status === 'active' || status === 'inactive') && (
                        <a
                            href="javascript:void(0)"
                            onClick={() =>
                                this.onUpdateProposalVotes(proposal, isVoted)
                            }
                        >
                            {
                                <span
                                    className={`Voting__button Voting__button-up ${
                                        isVotingInProgress
                                            ? 'votingUp'
                                            : isVoted
                                              ? 'Voting__button--upvoted'
                                              : ''
                                    }`}
                                >
                                    <Icon
                                        name={`${
                                            isVotingInProgress
                                                ? 'empty'
                                                : 'chevron-up-circle'
                                        }`}
                                        className="upvote"
                                        key={`vote-icon-${value}`}
                                    />
                                </span>
                            }
                        </a>
                    ),
                    isOwner && (
                        <a
                            href="javascript:void(0)"
                            onClick={() => this.onRemoveProposal(proposal)}
                            className="proposal-remove"
                        >
                            <span key={`remove-icon-${value}`} title="Remove">
                                &#x2716;
                            </span>
                        </a>
                    ),
                ];
            default:
                return value;
        }
    }

    renderTableRow(proposal) {
        const id = proposal.get('id');
        const isOwner = proposal.get('creator') === this.props.currentUser;

        return [
            <tr key={`proposal-${id}`}>
                {this.orderedProposalKeys.map(k => (
                    <td
                        key={`${k}-${id}`}
                        className={`${k}-column`}
                        data-label={tt(`steem_proposal_system_jsx.table.${k}`)}
                    >
                        {this.formatTableDiv(
                            k,
                            proposal.get(k),
                            proposal,
                            proposal.get('status'),
                            isOwner,
                            this.checkVotedProposal(id)
                        )}
                    </td>
                ))}
            </tr>,
            <tr key="2" className="proposal-subject-row">
                <td key={`subject-${id}`} colSpan="8">
                    {proposal.get('subject')}
                </td>
            </tr>,
        ];
    }

    renderProposalTable(proposals) {
        const { currentPage, status, limitPerPage } = this.state;
        const { last_id } = this.props;
        const proposalsArr = proposals.toArray();

        const nextAvailable = proposalsArr.length === limitPerPage && !!last_id;
        const previousAvailable = currentPage > 1 && this.pages.size;

        return (
            <table>
                <thead>
                    <tr className="proposals-filter-header">
                        <td colSpan="8">
                            <div className="proposals-filter-wrapper">
                                <div className="dropdowns">
                                    <DropdownMenu
                                        items={this.filterDropdownItems}
                                        el="div"
                                        key="proposals-filter"
                                        selected={status}
                                    >
                                        <span>Status: {status}</span>
                                    </DropdownMenu>
                                </div>
                                <div className="pagination">
                                    <span>
                                        {tt(
                                            'steem_proposal_system_jsx.votes_update_info'
                                        )}
                                    </span>
                                    <Pagination
                                        nextAvailable={nextAvailable}
                                        previousAvailable={previousAvailable}
                                        onNextPage={this.onNext}
                                        onPreviousPage={this.onPrevious}
                                    />
                                </div>
                            </div>
                        </td>
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
                        <td colSpan="8" className="proposals-filter-header">
                            <div className="proposals-filter-wrapper">
                                <div className="dropdowns" />
                                <Pagination
                                    nextAvailable={nextAvailable}
                                    previousAvailable={previousAvailable}
                                    onNextPage={this.onNext}
                                    onPreviousPage={this.onPrevious}
                                />
                            </div>
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
                        {this.renderProposalTable(proposals)}
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: 'steem_proposal_system',
    component: connect(
        state => {
            const user = state.user.get('current');
            const currentUser = user && user.get('username');
            const proposals = state.global.get('proposals', List());
            const last = proposals.size - 1;
            const last_id =
                (proposals.size && proposals.get(last).get('id')) || null;
            const newProposals =
                proposals.size > 10 ? proposals.delete(last) : proposals;
            const voterProposals = state.global.get('voterProposals', List());
            const votesInProgress = state.global.get(
                `transaction_proposal_vote_active_${currentUser}`,
                List()
            );
            return {
                currentUser,
                proposals: newProposals,
                voterProposals,
                last_id,
                votesInProgress,
            };
        },
        dispatch => ({
            updateProposalVotes: (voter, proposal_ids, approve) => {
                dispatch(
                    transactionActions.broadcastOperation({
                        type: 'update_proposal_votes',
                        operation: { voter, proposal_ids, approve },
                        confirm: null,
                        successCallback: () => {
                            dispatch(
                                fetchDataSagaActions.listVoterProposals({
                                    start: voter,
                                    order_by: 'by_total_votes',
                                    order_direction: 'direction_descending',
                                    limit: 1000,
                                    status: 'all',
                                })
                            );
                        },
                    })
                );
            },
            removeProposal: (proposal_owner, proposal_ids) => {
                dispatch(
                    transactionActions.broadcastOperation({
                        type: 'remove_proposal',
                        operation: { proposal_owner, proposal_ids },
                        confirm: tt(
                            'steem_proposal_system_jsx.confirm_remove_proposal_description'
                        ),
                        successCallback: () => {
                            dispatch(
                                fetchDataSagaActions.listProposals({
                                    start: '',
                                    order_by: 'by_total_votes',
                                    order_direction: 'direction_descending',
                                    limit: 11,
                                    status: 'all',
                                    last_id: null,
                                })
                            );
                        },
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
