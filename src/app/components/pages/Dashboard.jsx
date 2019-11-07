/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import tt from 'counterpart';
import { List, OrderedMap } from 'immutable';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import constants from 'app/redux/constants';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import { INTERLEAVE_PROMOTED, TAG_LIST } from 'app/client_config';
import PostsList from 'app/components/cards/PostsList';
import { isFetchingOrRecentlyUpdated } from 'app/utils/StateFunctions';
import Callout from 'app/components/elements/Callout';
import SidebarLinks from 'app/components/elements/SidebarLinks';
import SidebarNewUsers from 'app/components/elements/SidebarNewUsers';
import Notices from 'app/components/elements/Notices';
import { GptUtils } from 'app/utils/GptUtils';
import GptAd from 'app/components/elements/GptAd';
import ReviveAd from 'app/components/elements/ReviveAd';
import ArticleLayoutSelector from 'app/components/modules/ArticleLayoutSelector';
import Topics from './Topics';
import SortOrder from 'app/components/elements/SortOrder';
import { PROMOTED_POST_PAD_SIZE } from 'shared/constants';
import tagHeaderMap from 'app/utils/TagFeedHeaderMap';
import MarkdownViewer from 'app/components/cards/MarkdownViewer';
import SidebarToken from 'app/components/elements/SidebarToken';
import { TradingViewEmbed, widgetType } from 'react-tradingview-embed';
import { TRADING_VIEW_CONFIG, LIQUID_TOKEN_UPPERCASE } from 'app/client_config';
import Info from 'app/components/elements/Info';
import { getDate } from 'app/utils/Date';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

class Dashboard extends React.Component {
    static propTypes = {
        discussions: PropTypes.object,
        accounts: PropTypes.object,
        status: PropTypes.object,
        routeParams: PropTypes.object,
        requestData: PropTypes.func,
        loading: PropTypes.bool,
        username: PropTypes.string,
        blogmode: PropTypes.bool,
        categories: PropTypes.object,
        voteRegenSec: PropTypes.number,
        rewardData: PropTypes.object,
    };

    constructor() {
        super();
        this.state = {};
    }

    render() {
        const { username } = this.props.routeParams;
        const { accounts, /*username,*/ voteRegenSec, rewardData } = this.props;
        const account = accounts.get(username);

        // do not render if account is not loaded or available
        if (!account) return null;

        const tokenStatus = account.has('token_status')
            ? account.get('token_status').toJS()
            : {
                  pending_token: 0,
              };

        const precision = tokenStatus['precision'];
        const totalEarning =
            tokenStatus['earned_token'] / Math.pow(10, precision);
        const votingPower =
            Math.min(
                tokenStatus['voting_power'] +
                    (new Date() - getDate(tokenStatus['last_vote_time'])) *
                        10000 /
                        (1000 * voteRegenSec),
                10000
            ) / 100;
        const resourceCredits = 100.0 * account.get('rc');

        // calculate vote value
        const applyRewardsCurve = r =>
            Math.pow(Math.max(0, r), rewardData.author_curve_exponent) *
            rewardData.reward_pool /
            rewardData.pending_rshares;
        const stakedTokens = tokenStatus['staked_tokens'];
        const rshares = stakedTokens;
        const scotDenom = Math.pow(10, precision);
        const voteValue = Number(
            (applyRewardsCurve(rshares) / scotDenom).toFixed(precision)
        );

        const { nightmodeEnabled } = this.props;

        const layoutClass = this.props.blogmode
            ? ' layout-block'
            : ' layout-list';

        const mqLarge =
            process.env.BROWSER &&
            window.matchMedia('screen and (min-width: 75em)').matches;

        let tvWidgetConfigMarketOverview = TRADING_VIEW_CONFIG.MARKET_OVERVIEW;
        tvWidgetConfigMarketOverview.colorTheme = nightmodeEnabled
            ? 'dark'
            : 'light';

        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
        };

        return (
            <div className={'PostsIndex row' + layoutClass}>
                <article className="articles">
                    <Slider {...settings}>
                        <div>
                            <Info
                                description={tt('g.total_earning')}
                                amount={totalEarning}
                                unit={LIQUID_TOKEN_UPPERCASE}
                                background="#2BB4F2"
                                icon="bank"
                            />
                        </div>
                        <div>
                            <Info
                                description={tt('g.voting_power')}
                                amount={votingPower}
                                unit="%"
                                background="#5F6CBC"
                                icon="flash"
                            />
                        </div>
                        <div>
                            <Info
                                description={tt('g.resource_credits')}
                                amount={resourceCredits}
                                unit="%"
                                background="#29A49A"
                                icon="battery"
                            />
                        </div>
                        <div>
                            <Info
                                description={tt('g.vote_value')}
                                amount={voteValue}
                                unit={LIQUID_TOKEN_UPPERCASE}
                                background="#79919C"
                                icon="dollar"
                            />
                        </div>
                    </Slider>

                    <div>buttons</div>

                    <div>3 columns of posts</div>
                </article>

                <aside className="c-sidebar c-sidebar--left">
                    <div> menus </div>
                </aside>
            </div>
        );
    }
}

module.exports = {
    path: '@:username/dashboard',
    component: connect(
        (state, ownProps) => {
            const scotConfig = state.app.get('scotConfig');

            const rewardData = {
                pending_rshares: scotConfig.getIn(['info', 'pending_rshares']),
                reward_pool: scotConfig.getIn(['info', 'reward_pool']),
                author_curve_exponent: scotConfig.getIn([
                    'config',
                    'author_curve_exponent',
                ]),
            };

            return {
                discussions: state.global.get('discussion_idx'),
                status: state.global.get('status'),
                loading: state.app.get('loading'),
                accounts: state.global.get('accounts'),
                username:
                    state.user.getIn(['current', 'username']) ||
                    state.offchain.get('account'),
                blogmode: state.app.getIn(['user_preferences', 'blogmode']),
                // sortOrder: ownProps.params.order,
                // topic: ownProps.params.category,
                categories: TAG_LIST,
                pinned: state.offchain.get('pinned_posts'),
                maybeLoggedIn: state.user.get('maybeLoggedIn'),
                isBrowser: process.env.BROWSER,
                notices: state.offchain
                    .get('pinned_posts')
                    .get('notices')
                    .toJS(),
                gptEnabled: state.app.getIn(['googleAds', 'gptEnabled']),
                tokenStats: scotConfig.getIn(['config', 'tokenStats']),
                reviveEnabled: state.app.get('reviveEnabled'),
                nightmodeEnabled: state.app.getIn([
                    'user_preferences',
                    'nightmode',
                ]),
                voteRegenSec: scotConfig.getIn(
                    ['config', 'vote_regeneration_seconds'],
                    5 * 24 * 60 * 60
                ),
                rewardData,
            };
        },
        dispatch => {
            return {
                requestData: args =>
                    dispatch(fetchDataSagaActions.requestData(args)),
            };
        }
    )(Dashboard),
};
