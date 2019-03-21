import React from 'react';
import * as workerProposalSystemActions from 'app/redux/WorkerProposalSystemReducer';

class WorkerProposalSystem extends React.Component {
    render() {
        return <div>WorkerProposalSystem page</div>;
    }
}

module.exports = {
    path: '/worker_proposal_system',
    component: connect(dispatch => {
        return {
            updateProposalVote: (voter, proposal_ids, approve) => {
                dispatch(
                    workerProposalSystemActions.updateOperation({
                        type: 'updat_proposal_operation',
                        operation: { voter: voter, proposal_ids, approve },
                    })
                );
            },
            removeProposal: (proposal_owner, proposal_ids) => {
                dispatch(
                    workerProposalSystemActions.updateOperation({
                        type: 'remove_proposal',
                        operation: {
                            proposal_owner: proposal_owner,
                            proposal_ids,
                        },
                    })
                );
            },
        };
    })(WorkerProposalSystem),
};
