import PropTypes from 'prop-types';
import React, { Component } from 'react';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import { connect } from 'react-redux';
import * as userActions from 'app/redux/UserReducer';
import tt from 'counterpart';
import * as globalActions from 'app/redux/GlobalReducer';
import QRCode from 'react-qr';

/** Display a public key.  Offer to show a private key, but only if it matches the provided public key */
class ShowKey extends Component {
    static propTypes = {
        // HTML props
        pubkey: PropTypes.string.isRequired,
        authType: PropTypes.string.isRequired,
        accountName: PropTypes.string.isRequired,
        showLogin: PropTypes.func.isRequired,
        privateKey: PropTypes.object,
        onKey: PropTypes.func,
    };

    constructor() {
        super();
        this.state = {};
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'ShowKey');
        this.showLogin = () => {
            const { showLogin, accountName, authType } = this.props;
            showLogin({ username: accountName });
        };
        this.showLogin = this.showLogin.bind(this);
    }

    componentWillMount() {
        this.setWif(this.props, this.state);
        this.setOnKey(this.props, this.state);
    }
    componentWillReceiveProps(nextProps) {
        this.setWif(nextProps);
    }
    componentWillUpdate(nextProps, nextState) {
        this.setOnKey(nextProps, nextState);
    }

    setWif(props) {
        const { privateKey, pubkey } = props;
        if (privateKey && pubkey === privateKey.toPublicKey().toString()) {
            const wif = privateKey.toWif();
            this.setState({ wif });

            const { onKey, pubkey } = this.props;
            if (onKey) onKey(wif, pubkey);
        } else {
            this.setState({ wif: undefined });
        }
    }

    setOnKey(nextProps, nextState) {
        const { wif } = nextState;
        const { onKey, pubkey } = nextProps;
        if (onKey) onKey(wif, pubkey);
    }
    showQr = () => {
        const { wif } = this.state;
        this.props.showQRKey({
            type: this.props.authType,
            text: wif ? wif : this.props.pubkey,
            isPrivate: !!wif,
        });
    };

    render() {
        const { showLogin, props: { pubkey, authType } } = this;
        const { wif } = this.state;

        const qrIcon = (
            <div
                style={{
                    display: 'inline-block',
                    paddingRight: 10,
                    cursor: 'pointer',
                }}
                onClick={this.showQr}
            >
                <img
                    src={require('app/assets/images/qrcode.png')}
                    height="32"
                    width="32"
                />
            </div>
        );

        return (
            <div className="ShowKey">
                <div className="row key__public">
                    <div className="column">
                        <br />
                        <h5>Public {this.props.authTypeName} Key</h5>
                        {qrIcon}
                        <span>{pubkey}</span>
                    </div>
                </div>
                <br />
                <div className="row key__private">
                    <div className="key__private-title">
                        <h5>Your Private {this.props.authTypeName} Key</h5>
                    </div>

                    <div className="key__private-container">
                        <div className="key__private-input">
                            <input
                                className="key__input"
                                type="text"
                                value={wif ? wif : '•'.repeat(44)}
                                readOnly
                            />
                        </div>
                        <div className="key__reveal">
                            {wif ? (
                                <QRCode text={wif} />
                            ) : (
                                <a
                                    onClick={showLogin}
                                    className="hollow button"
                                >
                                    Reveal
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => ownProps,
    dispatch => ({
        showLogin: ({ username, authType }) => {
            dispatch(
                userActions.showLogin({ loginDefault: { username, authType } })
            );
        },
        showQRKey: ({ type, isPrivate, text }) => {
            dispatch(
                globalActions.showDialog({
                    name: 'qr_key',
                    params: { type, isPrivate, text },
                })
            );
        },
    })
)(ShowKey);
