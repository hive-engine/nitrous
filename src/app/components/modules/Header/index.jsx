import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Icon from 'app/components/elements/Icon';
import resolveRoute from 'app/ResolveRoute';
import tt from 'counterpart';
import { APP_NAME } from 'app/client_config';
import SearchInput from 'app/components/elements/SearchInput';
import IconButton from 'app/components/elements/IconButton';
import DropdownMenu from 'app/components/elements/DropdownMenu';
import * as userActions from 'app/redux/UserReducer';
import * as appActions from 'app/redux/AppReducer';
import Userpic from 'app/components/elements/Userpic';
import { SIGNUP_URL } from 'shared/constants';
import SteemLogo from 'app/components/elements/SteemLogo';
import normalizeProfile from 'app/utils/NormalizeProfile';
import Announcement from 'app/components/elements/Announcement';

class Header extends React.Component {
    static propTypes = {
        current_account_name: PropTypes.string,
        account_meta: PropTypes.object,
        category: PropTypes.string,
        order: PropTypes.string,
        pathname: PropTypes.string,
    };

    constructor() {
        super();
    }

    render() {
        const {
            category,
            order,
            pathname,
            current_account_name,
            username,
            showLogin,
            logout,
            loggedIn,
            vertical,
            nightmodeEnabled,
            toggleNightmode,
            userPath,
            showSidePanel,
            navigate,
            account_meta,
        } = this.props;

        /*Set the document.title on each header render.*/
        const route = resolveRoute(pathname);
        let home_account = false;
        let page_title = route.page;

        let topic = '';
        let page_name = null;
        if (route.page === 'WalletIndex') {
        } else if (route.page == 'Privacy') {
            page_title = tt('navigation.privacy_policy');
        } else if (route.page == 'Tos') {
            page_title = tt('navigation.terms_of_service');
        } else if (route.page == 'ChangePassword') {
            page_title = tt('header_jsx.change_account_password');
        } else if (route.page == 'CreateAccount') {
            page_title = tt('header_jsx.create_account');
        } else if (route.page == 'Approval') {
            page_title = `Account Confirmation`;
        } else if (
            route.page == 'RecoverAccountStep1' ||
            route.page == 'RecoverAccountStep2'
        ) {
            page_title = tt('header_jsx.stolen_account_recovery');
        } else if (route.page === 'UserProfile') {
            let user_name = route.params[0].slice(1);
            const name = account_meta
                ? normalizeProfile(account_meta.toJS()).name
                : null;
            const user_title = name ? `${name} (@${user_name})` : user_name;
            page_title = user_title;
            if (route.params[1] === 'followers') {
                page_title = tt('header_jsx.people_following', {
                    username: user_title,
                });
            }
            if (route.params[1] === 'followed') {
                page_title = tt('header_jsx.people_followed_by', {
                    username: user_title,
                });
            }
            if (route.params[1] === 'curation-rewards') {
                page_title = tt('header_jsx.curation_rewards_by', {
                    username: user_title,
                });
            }
            if (route.params[1] === 'author-rewards') {
                page_title = tt('header_jsx.author_rewards_by', {
                    username: user_title,
                });
            }
            if (route.params[1] === 'recent-replies') {
                page_title = tt('header_jsx.replies_to', {
                    username: user_title,
                });
            }
            // @user/"posts" is deprecated in favor of "comments" as of oct-2016 (#443)
            if (route.params[1] === 'posts' || route.params[1] === 'comments') {
                page_title = tt('header_jsx.comments_by', {
                    username: user_title,
                });
            }
        } else {
            page_name = ''; //page_title = route.page.replace( /([a-z])([A-Z])/g, '$1 $2' ).toLowerCase();
        }

        // Format first letter of all titles and lowercase user name
        if (route.page !== 'UserProfile') {
            page_title =
                page_title.charAt(0).toUpperCase() + page_title.slice(1);
        }

        //TopRightHeader Stuff
        const defaultNavigate = e => {
            if (e.metaKey || e.ctrlKey) {
                // prevent breaking anchor tags
            } else {
                e.preventDefault();
            }
            const a =
                e.target.nodeName.toLowerCase() === 'a'
                    ? e.target
                    : e.target.parentNode;
            browserHistory.push(a.pathname + a.search + a.hash);
        };

        // Since navigate isn't set, defaultNavigate will always be used.
        const nav = navigate || defaultNavigate;

        const wallet_link = `/@${username}/transfers`;
        const account_link = `/@${username}`;
        const reset_password_link = `/@${username}/password`;
        const settings_link = `/@${username}/settings`;

        const user_menu = [
            {
                link: wallet_link,
                icon: 'wallet',
                value: tt('g.wallet'),
            },
            {
                link: '#',
                icon: 'eye',
                onClick: toggleNightmode,
                value: tt('g.toggle_nightmode'),
            },
            {
                link: reset_password_link,
                icon: 'key',
                value: tt('g.change_password'),
            },
            { link: settings_link, icon: 'cog', value: tt('g.settings') },
            loggedIn
                ? {
                      link: '#',
                      icon: 'enter',
                      onClick: logout,
                      value: tt('g.logout'),
                  }
                : { link: '#', onClick: showLogin, value: tt('g.login') },
        ];
        return (
            <header className="Header">
                {this.props.showAnnouncement && (
                    <Announcement onClose={this.props.hideAnnouncement} />
                )}
                <nav className="row Header__nav">
                    <div className="small-5 large-6 columns Header__logotype">
                        {/*LOGO*/}
                        <Link to="/">
                            <SteemLogo />
                        </Link>
                    </div>

                    <div className="small-7 large-6 columns Header__buttons">
                        {/*NOT LOGGED IN SIGN IN AND SIGN UP LINKS*/}
                        {!loggedIn && (
                            <span className="Header__user-signup show-for-medium">
                                <a
                                    className="Header__login-link"
                                    href="/login.html"
                                    onClick={showLogin}
                                >
                                    {tt('g.login')}
                                </a>
                                <a
                                    className="Header__signup-link"
                                    href={SIGNUP_URL}
                                >
                                    {tt('g.sign_up')}
                                </a>
                            </span>
                        )}

                        {/*CUSTOM SEARCH*/}
                        <span className="Header__search--desktop">
                            <SearchInput />
                        </span>
                        <span className="Header__search">
                            <a href="/static/search.html">
                                <IconButton icon="magnifyingGlass" />
                            </a>
                        </span>

                        {/*USER AVATAR */}
                        {loggedIn && (
                            <DropdownMenu
                                className={'Header__usermenu'}
                                items={user_menu}
                                title={username}
                                el="span"
                                selected={tt('g.rewards')}
                                position="left"
                            >
                                <li className={'Header__userpic '}>
                                    <span title={username}>
                                        <Userpic account={username} />
                                    </span>
                                </li>
                            </DropdownMenu>
                        )}
                        {/*HAMBURGER*/}
                        <span
                            onClick={showSidePanel}
                            className="toggle-menu Header__hamburger"
                        >
                            <span className="hamburger" />
                        </span>
                    </div>
                </nav>
            </header>
        );
    }
}

export { Header as _Header_ };

const mapStateToProps = (state, ownProps) => {
    // SSR code split.
    if (!process.env.BROWSER) {
        return {
            username: null,
            loggedIn: false,
        };
    }

    let user_profile;
    const route = resolveRoute(ownProps.pathname);
    if (route.page === 'UserProfile') {
        user_profile = state.global.getIn([
            'accounts',
            route.params[0].slice(1),
        ]);
    }

    // TODO: Cleanup
    const userPath = state.routing.locationBeforeTransitions.pathname;
    const username = state.user.getIn(['current', 'username']);
    const loggedIn = !!username;
    const current_account_name = username
        ? username
        : state.offchain.get('account');

    return {
        username,
        loggedIn,
        userPath,
        nightmodeEnabled: state.user.getIn(['user_preferences', 'nightmode']),
        account_meta: user_profile,
        current_account_name,
        showAnnouncement: state.user.get('showAnnouncement'),
        ...ownProps,
    };
};

const mapDispatchToProps = dispatch => ({
    showLogin: e => {
        if (e) e.preventDefault();
        dispatch(userActions.showLogin({ type: 'basic' }));
    },
    logout: e => {
        if (e) e.preventDefault();
        dispatch(userActions.logout({ type: 'default' }));
    },
    toggleNightmode: e => {
        if (e) e.preventDefault();
        dispatch(appActions.toggleNightmode());
    },
    showSidePanel: () => {
        dispatch(userActions.showSidePanel());
    },
    hideSidePanel: () => {
        dispatch(userActions.hideSidePanel());
    },
    hideAnnouncement: () => dispatch(userActions.hideAnnouncement()),
});

const connectedHeader = connect(mapStateToProps, mapDispatchToProps)(Header);

export default connectedHeader;
