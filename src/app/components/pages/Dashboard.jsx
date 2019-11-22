/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { INTERLEAVE_PROMOTED, TAG_LIST } from 'app/client_config';
import SidebarMenu from 'app/components/elements/SidebarMenu';
import { LIQUID_TOKEN_UPPERCASE } from 'app/client_config';
import Info from 'app/components/elements/Info';
import { getDate } from 'app/utils/Date';
import Slider from 'react-slick';
import PostPanel from 'app/components/modules/PostPanel';
import NativeSelect from 'app/components/elements/NativeSelect';

class Dashboard extends React.Component {
    static propTypes = {
        discussions: PropTypes.object,
        accounts: PropTypes.object,
        status: PropTypes.object,
        routeParams: PropTypes.object,
        // requestData: PropTypes.func,
        loading: PropTypes.bool,
        username: PropTypes.string,
        blogmode: PropTypes.bool,
        categories: PropTypes.object,
        voteRegenSec: PropTypes.number,
        rewardData: PropTypes.object,
    };

    constructor() {
        super();
        this.state = {
            panel: 'feed',
        };
    }

    render() {
        const { account_name } = this.props.routeParams;
        const { accounts, voteRegenSec, rewardData, username } = this.props;
        const account = accounts.get(account_name);

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
        const oppositeTheme = nightmodeEnabled ? 'theme-light' : 'theme-dark';

        const layoutClass = this.props.blogmode
            ? ' layout-block'
            : ' layout-list';

        const mqLarge =
            !process.env.BROWSER ||
            window.matchMedia('screen and (min-width: 75em)').matches;

        const infoSlidesToShow = mqLarge ? 4 : 1;
        const settings1 = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: infoSlidesToShow,
            slidesToScroll: 1,
        };
        const buttonSlidesToShow = mqLarge ? 2 : 1;
        const settings2 = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: buttonSlidesToShow,
            slidesToScroll: 1,
        };

        const handleChange = option => {
            this.setState({ panel: option.value });
        };

        const panelOptions = [
            {
                value: 'feed',
                label:
                    account_name === username
                        ? tt('posts_index.my_feed')
                        : tt('posts_index.accountnames_feed', {
                              account_name,
                          }),
                link: '#feed',
            },
            {
                value: 'blog',
                label:
                    account_name === username
                        ? tt('g.my_blog')
                        : tt('posts_panel_jsx.accountnames_blog', {
                              account_name,
                          }),
                link: '#blog',
            },
            {
                value: 'vote',
                label: tt('g.recommended'),
                link: '#vote',
            },
        ];

        return (
            <div className={'Dashboard row' + layoutClass}>
                <article className="articles">
                    <div>
                        <Slider {...settings1}>
                            <div>
                                <Info
                                    description={tt('g.lifetime_earning')}
                                    amount={totalEarning}
                                    unit={LIQUID_TOKEN_UPPERCASE}
                                    background="#000000"
                                    icon="bank"
                                />
                            </div>
                            <div>
                                <Info
                                    description={tt('g.voting_power')}
                                    amount={votingPower}
                                    unit="%"
                                    background="#003c61"
                                    icon="flash"
                                />
                            </div>
                            <div>
                                <Info
                                    description={tt('g.resource_credits')}
                                    amount={resourceCredits}
                                    unit="%"
                                    background="#009c82"
                                    icon="battery"
                                />
                            </div>
                            <div>
                                <Info
                                    description={tt('g.vote_value')}
                                    amount={voteValue}
                                    unit={LIQUID_TOKEN_UPPERCASE}
                                    background="#b0571c"
                                    icon="dollar"
                                />
                            </div>
                        </Slider>
                    </div>
                    <div className="buttons">
                        <Slider {...settings2}>
                            <div>
                                <a
                                    href="https://dex.steemleo.com"
                                    target="_blank"
                                    className="dex"
                                >
                                    {tt('g.steemleo_dex')}
                                </a>
                            </div>
                            <div>
                                <a
                                    href={`/@${account_name}/transfers`}
                                    target="_blank"
                                    className="wallet"
                                >
                                    {tt('g.wallet')}
                                </a>
                            </div>
                        </Slider>
                    </div>
                    {mqLarge ? (
                        <div className="row posts">
                            <div className="column">
                                <PostPanel
                                    account={account_name}
                                    category="vote"
                                />
                            </div>
                            <div className="column">
                                <PostPanel
                                    account={account_name}
                                    category="feed"
                                />
                            </div>
                            <div className="column">
                                <PostPanel
                                    account={account_name}
                                    category="blog"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="row posts-selector">
                            <NativeSelect
                                currentlySelected={this.state.panel}
                                options={panelOptions}
                                onChange={handleChange}
                            />
                            <div>
                                <PostPanel
                                    account={account_name}
                                    category={this.state.panel}
                                />
                            </div>
                        </div>
                    )}
                </article>

                <aside className="c-sidebar c-sidebar--left">
                    <div className={`avatar ${oppositeTheme}`}>
                        <img
                            src={`https://steemitimages.com/u/${
                                account_name
                            }/avatar`}
                        />
                    </div>
                    <SidebarMenu
                        username={account_name}
                        className={oppositeTheme}
                    />
                </aside>
            </div>
        );
    }
}

module.exports = {
    path: '@:account_name/dashboard',
    component: connect((state, ownProps) => {
        const scotConfig = state.app.get('scotConfig');

        const rewardData = {
            pending_rshares: scotConfig.getIn(['info', 'pending_rshares']),
            reward_pool: scotConfig.getIn(['info', 'reward_pool']),
            author_curve_exponent: scotConfig.getIn([
                'config',
                'author_curve_exponent',
            ]),
        };

        const content = state.global.get('content');

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
            content,
        };
    })(Dashboard),
};
