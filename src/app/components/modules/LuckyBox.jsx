import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import tt from 'counterpart';
import axios from 'axios';

class LuckyBox extends Component {
    static propTypes = {
        uuid: PropTypes.string.isRequired,
        locale: PropTypes.string.isRequired,
        hideLuckyBoxIcon: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            trxError: '',
            trxSuccess: '',
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.errorCallback = this.errorCallback.bind(this);
        this.callLuckyBox = this.callLuckyBox.bind(this);
    }

    errorCallback(estr) {
        this.setState({ trxError: estr, loading: false });
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({ loading: true });
        this.callLuckyBox(this.props.uuid, this.props.locale);
    }

    async callLuckyBox(uuid, locale) {
        try {
            const response = await axios.post(
                'https://tool.steem.world/AAA/GetLuckyBox',
                {
                    uuid,
                    locale,
                }
            );

            if (!response || !response.data) return;

            this.setState({
                loading: false,
            });

            if (response.data.Result === 0) {
                this.props.hideLuckyBoxIcon();
                this.setState({
                    trxSuccess: response.data.Message,
                });
            } else {
                this.setState({
                    trxError: response.data.Message,
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const { loading, trxError, trxSuccess } = this.state;
        const { currentUser } = this.props;

        return (
            <div className="row">
                <div className="column small-12">
                    <form
                        onSubmit={this.onSubmit}
                        onChange={() => this.setState({ trxError: '' })}
                    >
                        <h4>{tt('luckybox.popup_title')}</h4>
                        <p>
                            {tt('luckybox.popup_message1')}
                            <br />
                            {tt('luckybox.popup_message2')}
                        </p>
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
                                {trxSuccess && (
                                    <div className="success">{trxSuccess}</div>
                                )}
                                {!trxSuccess && (
                                    <button type="submit" className="button">
                                        {tt('luckybox.popup_button')}
                                    </button>
                                )}
                            </span>
                        )}
                    </form>
                </div>
            </div>
        );
    }
}

export default connect((state, ownProps) => {
    const currentUser = state.user.getIn(['current']);
    return { ...ownProps, currentUser };
})(LuckyBox);
