import React from 'react';
import { connect } from 'react-redux';
import * as workerProposalSystemActions from 'app/redux/WorkerProposalSystemReducer';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import tt from 'counterpart';
import Icon from 'app/components/elements/Icon';
import FormattedAsset from 'app/components/elements/FormattedAsset';

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
    };
    constructor() {
        super();
        this.state = {
            loading: false,
        };
    }

    componentDidMount() {
        const { listProposals } = this.props;

        listProposals({
            start: 'mario3',
            order_by: 'by_creator',
            order_direction: 'direction_ascending',
            limit: 5,
            active: 'all',
        });
    }

    // TODO: FormattedAsset not enough to calculate precision
    renderTableRow(proposal) {
        console.log(proposal);
        const id = proposal.get('id');
        const votingActive = false;
        return [
            <tr key={`proposal-${id}`}>
                {this.orderedProposalKeys.map(k => (
                    <td key={`${k}-${id}`}>
                        {k === 'daily_pay' ? (
                            <FormattedAsset
                                amount={proposal.get(k).get('amount')}
                                asset="SBD"
                            />
                        ) : (
                            proposal.get(k)
                        )}
                        {k === 'id' && (
                            <Icon
                                name={
                                    votingActive ? 'empty' : 'chevron-up-circle'
                                }
                                className="upvote"
                            />
                        )}
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
                        {this.orderedProposalKeys.map(key => (
                            <td key={key}>
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
            </table>
        );
    }

    render() {
        const { proposals } = this.props;
        const { loading } = this.state;

        // TODO: implement loading indicator
        // if (loading) return <span>Loading...</span>;

        return (
            <div className="WorkerProposalSystem">
                <div className="row">
                    <div className="column">
                        <h2>{tt('worker_proposal_system_jsx.top_wps')}</h2>
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
        })
    )(WorkerProposalSystem),
};
