import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QRCode from 'react-qr';
import tt from 'counterpart';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import Keys from 'app/components/elements/Keys';
import * as globalActions from 'app/redux/GlobalReducer';

const keyTypes = ['Posting', 'Active', 'Owner', 'Memo'];

class UserKeys extends Component {
    static propTypes = {
        // HTML
        account: PropTypes.object.isRequired,
        // Redux
        isMyAccount: PropTypes.bool.isRequired,
        wifShown: PropTypes.bool,
        setWifShown: PropTypes.func.isRequired,
    };
    constructor() {
        super();
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'UserKeys');
        this.state = {};
        this.onKey = {};
        keyTypes.forEach(key => {
            this.onKey[key] = (wif, pubkey) => {
                this.setState({ [key]: { wif, pubkey } });
            };
        });
    }
    componentWillUpdate(nextProps, nextState) {
        const { wifShown, setWifShown } = nextProps;
        let hasWif = false;
        keyTypes.forEach(key => {
            const keyObj = nextState[key];
            if (keyObj && keyObj.wif) hasWif = true;
        });
        if (wifShown !== hasWif) setWifShown(hasWif);
    }
    render() {
        const { props: { account, isMyAccount } } = this;
        const { onKey } = this;
        let idx = 0;

        // do not render if account is not loaded or available
        if (!account) return null;

        // do not render if state appears to contain only lite account info
        if (!account.has('vesting_shares')) return null;

        const wifQrs = keyTypes.map(key => {
            const keyObj = this.state[key];
            if (!keyObj) return null;
            return (
                <span key={idx++}>
                    <hr />
                    <div className="row">
                        <div className="column small-2">
                            <label>{tt('userkeys_jsx.public')}</label>
                            <QRCode text={keyObj.pubkey} />
                        </div>
                        <div className="column small-8">
                            <label>
                                {tt('userkeys_jsx.public_something_key', {
                                    key,
                                })}
                            </label>
                            <div className="overflow-ellipsis">
                                <code>
                                    <small>{keyObj.pubkey}</small>
                                </code>
                            </div>
                            {keyObj.wif && (
                                <div>
                                    <label>
                                        {tt(
                                            'userkeys_jsx.private_something_key',
                                            { key }
                                        )}
                                    </label>
                                    <div className="overflow-ellipsis">
                                        <code>
                                            <small>{keyObj.wif}</small>
                                        </code>
                                    </div>
                                </div>
                            )}
                        </div>
                        {keyObj.wif && (
                            <div className="column small-2">
                                <label>{tt('userkeys_jsx.private')}</label>
                                <QRCode text={keyObj.wif} />
                            </div>
                        )}
                    </div>
                </span>
            );
        });

        return (
            <div className="UserKeys">
                <div className="UserKeys__intro">
                    <div className="UserKeys__intro-col">
                        <h1>Keys & Permissions</h1>
                        <p className="UserKeys__p">
                            Any password or key is more likely to get
                            compromised the more it is used. That's why Steem
                            uses a hierarchical key system to keep you safe. You
                            are issued with four keys which have different
                            permissions. For example, the Posting Key (which is
                            intended to be used frequently) has a limited set of
                            permissions for social actions that require less
                            security. You'll need to be more careful with your
                            Active Key since it has permissions to perform
                            wallet related actions.
                        </p>
                        <p className="UserKeys__p">
                            Please take note of your Steem Keys listed below.
                            Ideally, use a Password Manager (like 1Password or
                            LastPass) or store an offline copy safely (on a
                            piece of paper or on a file on a USB drive).
                        </p>
                        <h5>Learn more</h5>
                        <a
                            className="UserKeys__link"
                            href="https://steemit.com/steem/@steemitblog/steem-basics-understanding-private-keys-part-1"
                        >
                            Understanding Private Keys Part 1
                        </a>
                    </div>
                    <div className="UserKeys__intro-col">
                        <img
                            className="UserKeys__diagram"
                            src={require('app/assets/images/key-permissions.png')}
                        />
                    </div>
                </div>
                <div className="key">
                    <div className="key__title-container">
                        <h3>Posting Key</h3>
                    </div>
                    <div className="key__content-container">
                        <div className="key__col">
                            <p className="key__description">
                                This key should be used for social networking
                                actions, like posting, commenting and voting.
                                This key has a limited set of permissions and it
                                is not able to be used for monetary actions. So
                                you can't lose money if someone else gets access
                                to this key.
                            </p>
                            <p className="key__description">
                                Use this key to log in to other Steem-powered
                                social networks like Steemit, Busy and eSteem.
                                Store this key safely.
                            </p>
                            <Keys
                                account={account}
                                authType="posting"
                                onKey={onKey.Posting}
                            />
                        </div>
                        <div className="key__col permissions">
                            <h5 className="permissions__h5">
                                Posting Key permissions
                            </h5>
                            <p className="permissions__p">
                                Use your Posting Key to:
                            </p>
                            <ul className="permissions__list">
                                <li className="permissions__li">
                                    Publish a post or comment
                                </li>
                                <li className="permissions__li">
                                    Edit a post or comment
                                </li>
                                <li className="permissions__li">
                                    Upvote or downvote
                                </li>
                                <li className="permissions__li">
                                    Resteem content
                                </li>
                                <li className="permissions__li">
                                    Follow people
                                </li>
                                <li className="permissions__li">
                                    Mute accounts
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="key">
                    <div className="key__title-container">
                        <h3>Active Key</h3>
                    </div>
                    <div className="key__content-container">
                        <div className="key__col">
                            <p className="key__description">
                                This key has additional permissions for more
                                sensitive monetary-related actions, like
                                transferring and exchanging tokens.
                            </p>
                            <p className="key__description">
                                When performing a wallet related action, you may
                                be prompted to authenticate with your Active
                                key. You should only enter your Active Key into
                                apps which you trust because anyone with access
                                to this key can take your tokens. Do yourself a
                                favor and store this key safely to avoid losing
                                tokens in the future.
                            </p>

                            <Keys
                                account={account}
                                authType="active"
                                onKey={onKey.Active}
                            />
                        </div>
                        <div className="key__col permissions">
                            <h5 className="permissions__h5">
                                Active Key permissions
                            </h5>
                            <p className="permissions__p">
                                Use your Active Key to:
                            </p>
                            <ul className="permissions__list">
                                <li className="permissions__li">
                                    Transfer tokens
                                </li>
                                <li className="permissions__li">
                                    Power STEEM up or down
                                </li>
                                <li className="permissions__li">
                                    SBD conversion
                                </li>
                                <li className="permissions__li">
                                    Vote for witnesses
                                </li>
                                <li className="permissions__li">
                                    Place an order on an exchange
                                </li>
                                <li className="permissions__li">
                                    Certain profile changes
                                </li>
                                <li className="permissions__li">
                                    Publish a Witness price feed
                                </li>
                                <li className="permissions__li">
                                    Create a new user
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="key">
                    <div className="key__title-container">
                        <h3>Owner Key</h3>
                    </div>
                    <div className="key__content-container">
                        <div className="key__col">
                            <p className="key__description">
                                {tt(
                                    'userkeys_jsx.the_owner_key_is_required_to_change_other_keys'
                                )}
                                &nbsp;This key has additional permissions to
                                recover your account or change your other keys.
                                It's the most important key and should be
                                securely stored offline.
                            </p>
                            <Keys
                                account={account}
                                authType="owner"
                                onKey={onKey.Owner}
                            />
                        </div>
                        <div className="key__col permissions">
                            <h5 className="permissions__h5">
                                Owner Key permissions
                            </h5>
                            <p className="permissions__p">
                                Use your Owner Key to:
                            </p>
                            <ul className="permissions__list">
                                <li className="permissions__li">
                                    Set Owner and Active keys
                                </li>
                                <li className="permissions__li">
                                    Recover your account
                                </li>
                                <li className="permissions__li">
                                    Decline voting rights
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="key">
                    <div className="key__title-container">
                        <h3>Memo Key</h3>
                    </div>
                    <div className="key__content-container">
                        <div className="key__col">
                            <p className="key__description">
                                The Memo key because it is a bit of an outlier.
                                The only thing the Memo Key can do is encrypt
                                and decrypt private messages that are sent
                                through the blockchain. While this could one day
                                be a powerful feature, today it is not commonly
                                used. If you have received a private message
                                that you would like to decrypt, as always you
                                should use the key with the minimum necessary
                                authorities, which in this case would be the
                                Memo Key.
                            </p>
                            <Keys
                                account={account}
                                authType="memo"
                                onKey={onKey.Memo}
                            />
                        </div>
                        <div className="key__col permissions">
                            <h5 className="permissions__h5">
                                Memo Key permissions
                            </h5>
                            <p className="permissions__p">
                                Use your Memo Key to:
                            </p>
                            <ul className="permissions__list">
                                <li className="permissions__li">
                                    Send an encrypted message
                                </li>
                                <li className="permissions__li">
                                    View an encrypted message
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="public-keys">
                    <div className="public-keys__container">
                        <div className="public-keys__intro">
                            <h3 className="public-keys__h3">Public Keys</h3>
                            <p className="public-keys__description">
                                Each Steem Key has a public and private key to
                                encrypt and decrypt data. Below are your public
                                keys. They are publicly associated with your
                                username and can be used to look up your
                                transactions on the blockchain with a block
                                explorer like{' '}
                                <a href="https://steemd.com">steemd.com</a>.
                                Your public keys are not required for login on
                                Steemit.com and you don't need to store these
                                safely.
                            </p>
                        </div>
                        <div>{wifQrs && <span>{wifQrs}</span>}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const { account } = ownProps;
        const isMyAccount =
            state.user.getIn(['current', 'username'], false) ===
            account.get('name');
        const wifShown = state.global.get('UserKeys_wifShown');

        return { ...ownProps, isMyAccount, wifShown };
    },
    dispatch => ({
        setWifShown: shown => {
            dispatch(globalActions.receiveState({ UserKeys_wifShown: shown }));
        },
    })
)(UserKeys);
