import React from 'react';
import { connect } from 'react-redux';
import * as workerProposalSystemActions from 'app/redux/WorkerProposalSystemReducer';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';

class WorkerProposalSystem extends React.Component {
    render() {
        return <div>WorkerProposalSystem page</div>;
    }
}

module.exports = {
    path: '/worker_proposal_system',
    component: connect(dispatch => ({
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
    }))(WorkerProposalSystem),
};
