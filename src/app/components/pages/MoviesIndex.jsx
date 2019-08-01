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
import SidebarDonations from 'app/components/elements/SidebarDonations';
import SidebarLuckyBoxUsers from 'app/components/elements/SidebarLuckyBoxUsers';
import SidebarNewUsers from 'app/components/elements/SidebarNewUsers';
import Notices from 'app/components/elements/Notices';
import { GptUtils } from 'app/utils/GptUtils';
import GptAd from 'app/components/elements/GptAd';
import ArticleLayoutSelector from 'app/components/modules/ArticleLayoutSelector';
import Topics from './Topics';
import SortOrder from 'app/components/elements/SortOrder';
import { PROMOTED_POST_PAD_SIZE } from 'shared/constants';

class MoviesIndex extends React.Component {
    static propTypes = {
        accounts: PropTypes.object,
        status: PropTypes.object,
        routeParams: PropTypes.object,
        requestData: PropTypes.func,
        loading: PropTypes.bool,
        username: PropTypes.string,
        blogmode: PropTypes.bool,
        categories: PropTypes.object,
    };

    static defaultProps = {
        // showSpam: false,
    };

    constructor() {
        super();
        this.state = {};
        //this.loadMore = this.loadMore.bind(this);
        //this.shouldComponentUpdate = shouldComponentUpdate(this, 'MoviesIndex');
    }

    // componentDidUpdate(prevProps) {
    //     if (
    //         window.innerHeight &&
    //         window.innerHeight > 3000 &&
    //         prevProps.discussions !== this.props.discussions
    //     ) {
    //         this.refs.list.fetchIfNeeded();
    //     }
    // }

    render() {
        let {
            category,
            order = constants.DEFAULT_SORT_ORDER,
        } = this.props.routeParams;

        const status = this.props.status
            ? this.props.status.getIn([category || '', order])
            : null;
        const fetching = (status && status.fetching) || this.props.loading;

        let page_title = 'Posts'; // sensible default here?

        const layoutClass = this.props.blogmode
            ? ' layout-block'
            : ' layout-list';

        return (
            <div
                className={
                    'PostsIndex row' +
                    (fetching ? ' fetching' : '') +
                    layoutClass
                }
            >
                <article className="articles">
                    <div className="articles__header row">
                        <div className="small-6 medium-6 large-6 column">
                            <h1 className="articles__h1 show-for-mq-large articles__h1--no-wrap">
                                {page_title}
                            </h1>
                            <span className="hide-for-mq-large articles__header-select">
                                #Topics#
                            </span>
                        </div>
                        <div className="small-6 medium-5 large-5 column hide-for-large articles__header-select">
                            #SortOrder#
                        </div>
                        <div className="medium-1 show-for-mq-medium column">
                            #ArticleLayoutSelector#
                        </div>
                        <hr className="articles__hr" />
                        <div id="posts_list" className="PostsList">
                            #PostsList#
                        </div>
                    </div>
                </article>

                <aside className="c-sidebar c-sidebar--right">
                    {this.props.isBrowser && (
                        <div>
                            {/* <SidebarStats steemPower={123} followers={23} reputation={62} />  */}
                            <SidebarDonations />
                            <SidebarLinks username={this.props.username} />
                        </div>
                    )}
                    <Notices notices={this.props.notices} />
                    {this.props.gptEnabled ? (
                        <div className="sidebar-ad">
                            <GptAd type="Freestar" id="steemit_160x600_Right" />
                        </div>
                    ) : null}
                </aside>

                <aside className="c-sidebar c-sidebar--left">
                    <SidebarLuckyBoxUsers />
                </aside>
            </div>
        );
    }
}

module.exports = {
    path: ':order(/:category)',
    component: connect(
        (state, ownProps) => {
            return {
                status: state.global.get('status'),
                loading: state.app.get('loading'),
                accounts: state.global.get('accounts'),
                username:
                    state.user.getIn(['current', 'username']) ||
                    state.offchain.get('account'),
                blogmode: state.app.getIn(['user_preferences', 'blogmode']),
                sortOrder: ownProps.params.order,
                topic: ownProps.params.category,
                categories: TAG_LIST,
                maybeLoggedIn: state.user.get('maybeLoggedIn'),
                isBrowser: process.env.BROWSER,
                gptEnabled: state.app.getIn(['googleAds', 'gptEnabled']),
            };
        },
        dispatch => {
            return {
                requestData: args =>
                    dispatch(fetchDataSagaActions.requestData(args)),
            };
        }
    )(MoviesIndex),
};
