/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import SidebarLinks from 'app/components/elements/SidebarLinks';
import SidebarNewUsers from 'app/components/elements/SidebarNewUsers';
import Notices from 'app/components/elements/Notices';
import GptAd from 'app/components/elements/GptAd';
import Topics from './Topics';
import CommunityPane from 'app/components/elements/CommunityPane';
import CommunityPaneMobile from 'app/components/elements/CommunityPaneMobile';
import ReviveAd from 'app/components/elements/ReviveAd';
import SidebarToken from 'app/components/elements/SidebarToken';

class PostsIndexLayout extends React.Component {
    static propTypes = {
        username: PropTypes.string,
        blogmode: PropTypes.bool,
        topics: PropTypes.object,
    };

    componentWillMount() {
        const { subscriptions, getSubscriptions, username } = this.props;
        if (!subscriptions && username) getSubscriptions(username);
    }

    componentDidUpdate(prevProps) {
        const { subscriptions, getSubscriptions, username } = this.props;
        if (!subscriptions && username && username != prevProps.username)
            getSubscriptions(username);
    }

    render() {
        const {
            topics,
            categories,
            max_levels,
            order,
            subscriptions,
            enableAds,
            reviveEnabled,
            community,
            username,
            blogmode,
            isBrowser,
            children,
            scotTokenSymbol,
        } = this.props;

        const mqLarge =
            process.env.BROWSER &&
            window.matchMedia('screen and (min-width: 75em)').matches;

        return (
            <div
                className={
                    'PostsIndex row ' +
                    (blogmode ? 'layout-block' : 'layout-list')
                }
            >
                <article className="articles">{children}</article>

                <aside className="c-sidebar c-sidebar--right">
                    {isBrowser &&
                        !community &&
                        username && (
                            <SidebarLinks
                                username={username}
                                topics={topics}
                                scotTokenSymbol={scotTokenSymbol}
                            />
                        )}
                    <Notices />
                    {this.props.showTokenStats &&
                        this.props.isBrowser &&
                        this.props.tokenStats && (
                            <div>
                                <SidebarToken
                                    scotToken={this.props.tokenStats.getIn([
                                        'scotToken',
                                    ])}
                                    scotTokenCirculating={this.props.tokenStats.getIn(
                                        ['total_token_balance_circulating']
                                    )}
                                    scotTokenBurn={
                                        this.props.tokenStats.getIn([
                                            'token_burn_balance',
                                        ]) || 0
                                    }
                                    scotTokenStaking={this.props.tokenStats.getIn(
                                        ['total_token_balance_staked']
                                    )}
                                    useHive={this.props.hiveEngine}
                                />
                            </div>
                        )}
                    {this.props.showTokenStats &&
                        this.props.isBrowser &&
                        this.props.tokenStats &&
                        this.props.tokenStats.getIn(['scotMinerTokens', 0]) && (
                            <div>
                                <SidebarToken
                                    scotToken={this.props.tokenStats.getIn([
                                        'scotMinerTokens',
                                        0,
                                    ])}
                                    scotTokenCirculating={this.props.tokenStats.getIn(
                                        [
                                            'total_token_miner_balance_circulating',
                                        ]
                                    )}
                                    scotTokenBurn={
                                        this.props.tokenStats.getIn([
                                            'token_burn_miner_balance',
                                            'balance',
                                        ]) || 0
                                    }
                                    scotTokenStaking={this.props.tokenStats.getIn(
                                        ['total_token_miner_balance_staked']
                                    )}
                                    useHive={this.props.hiveEngine}
                                />
                            </div>
                        )}
                    {this.props.showTokenStats &&
                        this.props.isBrowser &&
                        this.props.tokenStats &&
                        this.props.tokenStats.getIn(['scotMinerTokens', 1]) && (
                            <div>
                                <SidebarToken
                                    scotToken={this.props.tokenStats.getIn([
                                        'scotMinerTokens',
                                        1,
                                    ])}
                                    scotTokenCirculating={this.props.tokenStats.getIn(
                                        [
                                            'total_token_mega_miner_balance_circulating',
                                        ]
                                    )}
                                    scotTokenBurn={
                                        this.props.tokenStats.getIn([
                                            'token_burn_mega_miner_balance',
                                        ]) || 0
                                    }
                                    scotTokenStaking={this.props.tokenStats.getIn(
                                        [
                                            'total_token_mega_miner_balance_staked',
                                        ]
                                    )}
                                    useHive={this.props.hiveEngine}
                                />
                            </div>
                        )}
                    {reviveEnabled && mqLarge ? (
                        <div className="sidebar-ad">
                            <ReviveAd adKey="sidebar_right" />
                        </div>
                    ) : null}
                </aside>

                <aside className="c-sidebar c-sidebar--left">
                    <Topics
                        compact={false}
                        username={username}
                        subscriptions={subscriptions}
                        topics={topics}
                        order={order}
                        categories={categories}
                        levels={max_levels}
                    />
                    {reviveEnabled && mqLarge ? (
                        <div className="sidebar-ad">
                            <ReviveAd adKey="sidebar_left" />
                        </div>
                    ) : null}
                </aside>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const hostConfig = state.app.get('hostConfig', Map());
        const scotTokenSymbol = hostConfig.get('LIQUID_TOKEN_UPPERCASE');
        const scotConfig = state.app.get('scotConfig');
        const hiveEngine = hostConfig.get('HIVE_ENGINE');
        const username =
            state.user.getIn(['current', 'username']) ||
            state.offchain.get('account');
        const reviveEnabled = state.app.get('reviveEnabled');
        return {
            blogmode: props.blogmode,
            enableAds: props.enableAds,
            community: state.global.getIn(['community', props.category], null),
            subscriptions: state.global.getIn(
                ['subscriptions', username],
                null
            ),
            topics: state.global.getIn(['topics'], List()),
            isBrowser: process.env.BROWSER,
            username,
            interleavePromoted: hostConfig.get('INTERLEAVE_PROMOTED', false),
            scotTokenSymbol,
            tokenStats: scotConfig.getIn([
                'config',
                'hiveTokenStats',
            ]),
            showTokenStats: hostConfig.get('SHOW_TOKEN_STATS', true),
            hiveEngine,
            reviveEnabled,
        };
    },
    dispatch => ({
        getSubscriptions: account =>
            dispatch(fetchDataSagaActions.getSubscriptions(account)),
    })
)(PostsIndexLayout);
