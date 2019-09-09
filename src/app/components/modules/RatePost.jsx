import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as globalActions from 'app/redux/GlobalReducer';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import {
    LIQUID_TOKEN_UPPERCASE,
    APP_NAME,
    SCOT_TAG,
    SEARCH_SELECTION_REWARD_AMOUNT,
} from 'app/client_config';
import tt from 'counterpart';
import { Set } from 'immutable';
import { clean_permlink } from 'app/utils/CommentUtil';

class RatePost extends Component {
    static propTypes = {
        category: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        permlink: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            trxError: '',
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.errorCallback = this.errorCallback.bind(this);
    }

    errorCallback(estr) {
        this.setState({ trxError: estr, loading: false });
    }

    onSubmit(e) {
        e.preventDefault();
        const {
            category,
            author,
            permlink,
            body,
            rating,
            onClose,
        } = this.props;
        const { amount } = this.state;
        this.setState({ loading: true });
        console.log('-- RatePost.onSubmit -->');
        this.props.dispatchSubmit({
            category,
            author,
            permlink,
            body,
            rating,
            onClose,
            currentUser: this.props.currentUser,
            errorCallback: this.errorCallback,
        });
    }

    render() {
        const { amount, loading, amountError, trxError } = this.state;
        const { currentUser, rating } = this.props;

        const submitDisabled = !rating;

        return (
            <div className="RatePost row">
                <div className="column small-12">
                    <form onSubmit={this.onSubmit}>
                        <h4>{tt('rate_post_jsx.rate_post')}</h4>
                        <p>
                            {' '}
                            {tt('rate_post_jsx.confirm_rate_post', { rating })}
                        </p>
                        <hr />
                        <p>{tt('rate_post_jsx.rate_post_and_get_vote')}.</p>
                        <br />
                        {loading && (
                            <span>
                                <LoadingIndicator type="circle" />
                                <br />
                            </span>
                        )}
                        {!loading && (
                            <span>
                                {trxError && (
                                    <div className="error">{trxError}</div>
                                )}
                                <button
                                    type="submit"
                                    className="button"
                                    disabled={submitDisabled}
                                >
                                    {tt('g.confirm')}
                                </button>
                            </span>
                        )}
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const currentUser = state.user.getIn(['current']);
        return { ...ownProps, currentUser };
    },

    // mapDispatchToProps
    dispatch => ({
        dispatchSubmit: ({
            category,
            author,
            permlink,
            body,
            rating,
            currentUser,
            onClose,
            errorCallback,
        }) => {
            const username = currentUser.get('username');

            const successCallback = () => {
                onClose();
            };

            const get_metadata = () => {
                // add root category
                const rootCategory = category;
                let allCategories = Set([]);
                if (/^[-a-z\d]+$/.test(rootCategory))
                    allCategories = allCategories.add(rootCategory);

                // Add scot tag
                allCategories = allCategories.add(SCOT_TAG);

                // merge
                const meta = {};
                if (allCategories.size) meta.tags = allCategories.toJS();
                meta.app = `${APP_NAME.toLowerCase()}/0.1`;
                meta.format = 'markdown';
                return meta;
            };

            const rate_template = (username, author, rating, reward) => {
                const message_tag = `\n\n<div message_id=\"rating\" score=\"${
                    rating
                }\" />`;
                return (
                    tt('rate_post_jsx.rating_comment', {
                        username,
                        author,
                        rating,
                        reward,
                        DEBT_TOKEN: LIQUID_TOKEN_UPPERCASE,
                    }) + message_tag
                );
            };

            const __config = {};

            const operation = {
                parent_author: author,
                parent_permlink: permlink,
                author: username,
                permlink: clean_permlink(`re-rating-${author}-${permlink}`), // only one
                // category: '',
                title: '',
                body: rate_template(
                    username,
                    author,
                    rating,
                    SEARCH_SELECTION_REWARD_AMOUNT
                ),
                json_metadata: get_metadata(),
                __config,
            };

            dispatch(
                transactionActions.broadcastOperation({
                    type: 'comment',
                    operation,
                    errorCallback,
                    successCallback,
                })
            );
        },
    })
)(RatePost);
