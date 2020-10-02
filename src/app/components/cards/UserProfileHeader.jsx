/* eslint react/prop-types: 0 */
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Icon from 'app/components/elements/Icon';
import Follow from 'app/components/elements/Follow';
import Tooltip from 'app/components/elements/Tooltip';
import DateJoinWrapper from 'app/components/elements/DateJoinWrapper';
import tt from 'counterpart';
import Userpic from 'app/components/elements/Userpic';
import { affiliationFromStake } from 'app/utils/AffiliationMap';
import { proxifyImageUrl } from 'app/utils/ProxifyUrl';
import SanitizedLink from 'app/components/elements/SanitizedLink';
import { numberWithCommas } from 'app/utils/StateFunctions';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import DropdownMenu from 'app/components/elements/DropdownMenu';
import { actions as fetchActions } from 'app/redux/FetchDataSaga';

class UserProfileHeader extends React.Component {
    componentWillMount() {
        const { stakedAccounts, getStakedAccounts } = this.props;
        if (!stakedAccounts) {
            getStakedAccounts();
        }
    }

    render() {
        const {
            current_user,
            accountname,
            profile,
            tribeCommunityTitle,
            scotTokenSymbol,
            preferHive,
            disableBlacklist,
            stakedAccounts,
        } = this.props;
        const isMyAccount = current_user === accountname;

        const { name, location, about, website, cover_image } = profile
            ? profile.getIn(['metadata', 'profile']).toJS()
            : {};
        const website_label = website
            ? website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
            : null;

        let cover_image_style = {};
        if (cover_image) {
            cover_image_style = {
                backgroundImage:
                    'url(' +
                    proxifyImageUrl(cover_image, preferHive, '2048x512') +
                    ')',
            };
        }

        const _lists = profile.get('blacklists').toJS();
        const blacklists = !disableBlacklist &&
            _lists.length > 0 && (
                <DropdownMenu
                    title="Blacklisted on:"
                    className="UserProfile__blacklists"
                    items={_lists.map(list => {
                        return { value: list };
                    })}
                    el="div"
                >
                    <span className="account_warn">({_lists.length})</span>
                </DropdownMenu>
            );

        const affiliation = tribeCommunityTitle
            ? tribeCommunityTitle
            : affiliationFromStake(
                  scotTokenSymbol,
                  accountname,
                  stakedAccounts ? stakedAccounts.get(accountname) : 0
              );
        return (
            <div className="UserProfile__banner row expanded">
                <div className="column" style={cover_image_style}>
                    <div style={{ position: 'relative' }}>
                        <div className="UserProfile__buttons hide-for-small-only">
                            <Follow
                                follower={current_user}
                                following={accountname}
                            />
                        </div>
                    </div>
                    <h1>
                        <Userpic
                            account={accountname}
                            hive={preferHive}
                            hideIfDefault
                        />
                        {name || accountname} {blacklists}
                        {affiliation ? (
                            <span className="affiliation">{affiliation}</span>
                        ) : null}
                    </h1>

                    <div>
                        {about && <p className="UserProfile__bio">{about}</p>}
                        <div className="UserProfile__stats">
                            <span>
                                <Link to={`/@${accountname}/followers`}>
                                    {tt('user_profile.follower_count', {
                                        count: profile.getIn(
                                            ['stats', 'followers'],
                                            0
                                        ),
                                    })}
                                </Link>
                            </span>
                            <span>
                                <Link to={`/@${accountname}`}>
                                    {tt('user_profile.post_count', {
                                        count: profile.get('post_count', 0),
                                    })}
                                </Link>
                            </span>
                            <span>
                                <Link to={`/@${accountname}/followed`}>
                                    {tt('user_profile.followed_count', {
                                        count: profile.getIn(
                                            ['stats', 'following'],
                                            0
                                        ),
                                    })}
                                </Link>
                            </span>
                        </div>

                        <p className="UserProfile__info">
                            {location && (
                                <span>
                                    <Icon name="location" /> {location}
                                </span>
                            )}
                            {website && (
                                <span>
                                    <Icon name="link" />{' '}
                                    <SanitizedLink
                                        url={website}
                                        text={website_label}
                                    />
                                </span>
                            )}
                            <Icon name="calendar" />{' '}
                            <DateJoinWrapper date={profile.get('created')} />
                        </p>
                    </div>
                    <div className="UserProfile__buttons_mobile show-for-small-only">
                        <Follow
                            follower={current_user}
                            following={accountname}
                            what="blog"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    (state, props) => {
        const current_user = state.user.getIn(['current', 'username']);
        const accountname = props.accountname;

        const COMMUNITY_CATEGORY = state.app.getIn([
            'hostConfig',
            'COMMUNITY_CATEGORY',
        ]);
        const tribeCommunityTitle = state.global.getIn([
            'community',
            COMMUNITY_CATEGORY,
            'team',
            accountname,
            'title',
        ]);
        const scotTokenSymbol = state.app.getIn([
            'hostConfig',
            'LIQUID_TOKEN_UPPERCASE',
        ]);
        const disableBlacklist = state.app.getIn([
            'hostConfig',
            'DISABLE_BLACKLIST',
        ]);
        const preferHive = state.app.getIn(['hostConfig', 'PREFER_HIVE']);
        return {
            current_user,
            accountname,
            profile: props.profile,
            tribeCommunityTitle,
            scotTokenSymbol,
            preferHive,
            disableBlacklist,
            stakedAccounts: state.global.get('stakedAccounts'),
        };
    },
    dispatch => ({
        getStakedAccounts: () => {
            dispatch(fetchActions.getStakedAccounts());
        },
    })
)(UserProfileHeader);
