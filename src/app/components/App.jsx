import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppPropTypes from 'app/utils/AppPropTypes';
import Header from 'app/components/modules/Header';
import * as userActions from 'app/redux/UserReducer';
import classNames from 'classnames';
import ConnectedSidePanel from 'app/components/modules/ConnectedSidePanel';
import CloseButton from 'app/components/elements/CloseButton';
import Dialogs from 'app/components/modules/Dialogs';
import Modals from 'app/components/modules/Modals';
import WelcomePanel from 'app/components/elements/WelcomePanel';
import tt from 'counterpart';
import PageViewsCounter from 'app/components/elements/PageViewsCounter';
import { serverApiRecordEvent } from 'app/utils/ServerApiClient';
import { key_utils } from '@steemit/steem-js/lib/auth/ecc';
import resolveRoute from 'app/ResolveRoute';
import { VIEW_MODE_WHISTLE } from 'shared/constants';

class App extends React.Component {
    constructor(props) {
        super(props);
        // TODO: put both of these and associated toggles into Redux Store.
        this.state = {
            showCallout: true,
            showBanner: false,
        };
        this.listenerActive = null;
    }

    toggleBodyNightmode(nightmodeEnabled) {
        if (nightmodeEnabled) {
            document.body.classList.remove('theme-light');
            document.body.classList.add('theme-dark');
        } else {
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
        }
    }

    componentWillReceiveProps(nextProps) {
        const { nightmodeEnabled } = nextProps;
        this.toggleBodyNightmode(nightmodeEnabled);
    }

    componentWillMount() {
        if (process.env.BROWSER) localStorage.removeItem('autopost'); // July 14 '16 compromise, renamed to autopost2
        this.props.loginUser();
    }

    componentDidMount() {
        const { nightmodeEnabled } = this.props;
        this.toggleBodyNightmode(nightmodeEnabled);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {
            pathname,
            new_visitor,
            nightmodeEnabled,
            showAnnouncement,
        } = this.props;
        const n = nextProps;
        return (
            pathname !== n.pathname ||
            new_visitor !== n.new_visitor ||
            this.state.showBanner !== nextState.showBanner ||
            this.state.showCallout !== nextState.showCallout ||
            nightmodeEnabled !== n.nightmodeEnabled ||
            showAnnouncement !== n.showAnnouncement
        );
    }

    goAd = () => {
        window.open('https://platinum.crypto.com/r/hz2dj9msp8');
    };

    setShowBannerFalse = () => {
        this.setState({ showBanner: false });
    };

    render() {
        const {
            params,
            children,
            new_visitor,
            nightmodeEnabled,
            viewMode,
            pathname,
            category,
            order,
        } = this.props;

        var Iframe = React.createClass({
            render: function() {
                return (
                    <div>
                        <iframe
                            id="iframe-widget"
                            name="widget"
                            src={this.props.src}
                            width="100%"
                        />
                    </div>
                );
            },
        });

        const whistleView = viewMode === VIEW_MODE_WHISTLE;
        const headerHidden = whistleView;
        const params_keys = Object.keys(params);
        const ip =
            pathname === '/' ||
            (params_keys.length === 2 &&
                params_keys[0] === 'order' &&
                params_keys[1] === 'category');
        const alert = this.props.error;
        let callout = null;
        if (this.state.showCallout && alert) {
            callout = (
                <div className="App__announcement row">
                    <div className="column">
                        <div className={classNames('callout', { alert })}>
                            <CloseButton
                                onClick={() =>
                                    this.setState({ showCallout: false })
                                }
                            />
                            <p>{alert}</p>
                        </div>
                    </div>
                </div>
            );
        } else if (false && ip && this.state.showCallout) {
            callout = (
                <div className="App__announcement row">
                    <div className="column">
                        <div
                            className={classNames(
                                'callout success',
                                { alert },
                                { warning },
                                { success }
                            )}
                        >
                            <CloseButton
                                onClick={() =>
                                    this.setState({ showCallout: false })
                                }
                            />
                            <ul>
                                <li>
                                    /*<a href="https://steemit.com/steemit/@steemitblog/steemit-com-is-now-open-source">
                                        ...STORY TEXT...
                                    </a>*/
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
        if ($STM_Config.read_only_mode && this.state.showCallout) {
            callout = (
                <div className="App__announcement row">
                    <div className="column">
                        <div
                            className={classNames(
                                'callout warning',
                                { alert },
                                { warning },
                                { success }
                            )}
                        >
                            <CloseButton
                                onClick={() =>
                                    this.setState({ showCallout: false })
                                }
                            />
                            <p>{tt('g.read_only_mode')}</p>
                        </div>
                    </div>
                </div>
            );
        }

        const themeClass = nightmodeEnabled ? ' theme-dark' : ' theme-light';

        return (
            <div
                className={classNames('App', themeClass, {
                    'index-page': ip,
                    'whistle-view': whistleView,
                    withAnnouncement: this.props.showAnnouncement,
                })}
                ref="App_root"
            >
                <Iframe
                    id="ticker"
                    scrolling="no"
                    allowtransparency="true"
                    frameborder="0"
                    src="https://s.tradingview.com/embed-widget/ticker-tape/?locale=en#%7B%22symbols%22%3A%5B%7B%22title%22%3A%22S%26P%20500%22%2C%22proName%22%3A%22OANDA%3ASPX500USD%22%7D%2C%7B%22description%22%3A%22Nasdaq%22%2C%22proName%22%3A%22NASDAQ%3ANDAQ%22%7D%2C%7B%22description%22%3A%22Bitcoin%22%2C%22proName%22%3A%22COINBASE%3ABTCUSD%22%7D%2C%7B%22description%22%3A%22Ethereum%22%2C%22proName%22%3A%22COINBASE%3AETHUSD%22%7D%2C%7B%22description%22%3A%22Steem%22%2C%22proName%22%3A%22BITTREX%3ASTEEMUSD%22%7D%2C%7B%22description%22%3A%22SBD%22%2C%22proName%22%3A%22BITTREX%3ASBDUSD%22%7D%2C%7B%22description%22%3A%22Hive%22%2C%22proName%22%3A%22BITTREX%3AHIVEUSD%22%7D%2C%7B%22description%22%3A%22HBD%22%2C%22proName%22%3A%22BITTREX%3AHBDUSD%22%7D%2C%7B%22description%22%3A%22Litecoin%22%2C%22proName%22%3A%22COINBASE%3ALTCUSD%22%7D%2C%7B%22description%22%3A%22Binance%20Coin%22%2C%22proName%22%3A%22BINANCE%3ABNBUSD%22%7D%2C%7B%22description%22%3A%22Basic%20Attention%20Token%22%2C%22proName%22%3A%22BINANCE%3ABATUSD%22%7D%2C%7B%22description%22%3A%22Eos%22%2C%22proName%22%3A%22COINBASE%3AEOSUSD%22%7D%2C%7B%22description%22%3A%22Gold%22%2C%22proName%22%3A%22TVC%3AGOLD%22%7D%2C%7B%22description%22%3A%22Silver%22%2C%22proName%22%3A%22TVC%3ASILVER%22%7D%5D%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22adaptive%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A46%2C%22utm_source%22%3A%22www.steemcoinpan.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22ticker-tape%22%7D"
                    style="box-sizing: border-box; height: 46px; width: 100%;"
                />
                <ConnectedSidePanel alignment="right" />

                {headerHidden ? null : (
                    <Header
                        pathname={pathname}
                        category={category}
                        order={order}
                    />
                )}

                <div className="App__content">
                    {process.env.BROWSER &&
                    ip &&
                    new_visitor &&
                    this.state.showBanner ? (
                        <WelcomePanel
                            setShowBannerFalse={this.setShowBannerFalse}
                        />
                    ) : null}
                    {callout}
                    {children}
                </div>
                <Dialogs />
                <Modals />
                <PageViewsCounter />
            </div>
        );
    }
}

App.propTypes = {
    error: PropTypes.string,
    children: AppPropTypes.Children,
    pathname: PropTypes.string,
    category: PropTypes.string,
    order: PropTypes.string,
    loginUser: PropTypes.func.isRequired,
};

export default connect(
    (state, ownProps) => {
        const current_user = state.user.get('current');
        const current_account_name = current_user
            ? current_user.get('username')
            : state.offchain.get('account');

        return {
            viewMode: state.app.get('viewMode'),
            error: state.app.get('error'),
            new_visitor:
                !state.user.get('current') &&
                !state.offchain.get('user') &&
                !state.offchain.get('account') &&
                state.offchain.get('new_visit'),

            nightmodeEnabled: state.app.getIn([
                'user_preferences',
                'nightmode',
            ]),
            pathname: ownProps.location.pathname,
            order: ownProps.params.order,
            category: ownProps.params.category,
            showAnnouncement: state.user.get('showAnnouncement'),
        };
    },
    dispatch => ({
        loginUser: () => dispatch(userActions.usernamePasswordLogin({})),
    })
)(App);
