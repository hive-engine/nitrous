import React from 'react';
import { connect } from 'react-redux';
import * as workerProposalSystemActions from 'app/redux/WorkerProposalSystemReducer';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import PropTypes from 'prop-types';

class WorkerProposalSystem extends React.Component {
    static propTypes = {
        listProposals: PropTypes.func,
    };
    constructor() {
        super();
        this.listProposals = e => {
            e.preventDefault();
            const { listProposals } = this.props;
            listProposals({
                start: 'mario3',
                order_by: 'by_creator',
                order_direction: 'direction_ascending',
                limit: 5,
                active: 'all',
            });
        };
    }

    render() {
        const { listProposals } = this;
        return (
            <div>
                <div>WorkerProposalSystem page</div>
                <div>
                    <button
                        type="submit"
                        className="button"
                        onClick={listProposals.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

module.exports = {
    path: '/worker_proposal_system',
    component: connect(null, dispatch => ({
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
