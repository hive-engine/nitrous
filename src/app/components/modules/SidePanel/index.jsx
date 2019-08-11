import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import { LIQUID_TOKEN_UPPERCASE } from 'app/client_config';
import CloseButton from 'app/components/elements/CloseButton';
import Icon from 'app/components/elements/Icon';
import { Link } from 'react-router';

const SidePanel = ({
    alignment,
    visible,
    hideSidePanel,
    username,
    walletUrl,
}) => {
    if (process.env.BROWSER) {
        visible && document.addEventListener('click', hideSidePanel);
        !visible && document.removeEventListener('click', hideSidePanel);
    }

    const loggedIn =
        username === undefined
            ? 'show-for-small-only'
            : 'SidePanel__hide-signup';

    const makeLink = (i, ix, arr) => {
        // A link is internal if it begins with a slash
        const isExternal = !i.link.match(/^\//) || i.isExternal;
        if (isExternal) {
            const cn = ix === arr.length - 1 ? 'last' : null;
            return (
                <li key={i.value} className={cn}>
                    <a
                        href={i.link}
                        target={i.internal ? null : '_blank'}
                        rel="noopener noreferrer"
                    >
                        {i.label}&nbsp;<Icon name="extlink" />
                    </a>
                </li>
            );
        } else {
            const cn = ix === arr.length - 1 ? 'last' : null;
            return (
                <li key={i.value} className={cn}>
                    <Link to={i.link}>{i.label}</Link>
                </li>
            );
        }
    };

    const sidePanelLinks = {
        internal: [
            {
                value: 'steemengine',
                label: 'Steem Engine',
                link: `https://steem-engine.com/?p=market&t=${
                    LIQUID_TOKEN_UPPERCASE
                }`,
            },
            {
                value: 'freedomx',
                label: 'FreedomEX',
                link: `https://freedomex.io/trading/${
                    LIQUID_TOKEN_UPPERCASE
                }freex`,
            },
        ],
        exchanges: [
            {
                value: 'blocktrades',
                label: 'Blocktrades',
                link: username
                    ? `https://blocktrades.us/?input_coin_type=eth&output_coin_type=steem&receive_address=${
                          username
                      }`
                    : `https://blocktrades.us/?input_coin_type=eth&output_coin_type=steem`,
            },
            {
                value: 'gopax',
                label: 'GOPAX',
                link: 'https://www.gopax.co.kr/exchange/steem-krw/',
            },
        ],
        external: [
            {
                value: 'chat',
                label: tt('navigation.chat'),
                link: 'https://steem.chat/home',
            },
            {
                value: 'jobs',
                label: tt('navigation.jobs'),
                link:
                    'https://recruiting.paylocity.com/recruiting/jobs/List/3288/Steemit-Inc',
            },
            {
                value: 'tools',
                label: tt('navigation.app_center'),
                link: 'https://steemprojects.com/',
            },
            {
                value: 'business',
                label: tt('navigation.business_center'),
                link: 'https://steemeconomy.com/',
            },
            {
                value: 'api_docs',
                label: tt('navigation.api_docs'),
                link: 'https://developers.steem.io/',
            },
        ],
        organizational: [
            {
                value: 'grow',
                label: 'GROW',
                link: '/grow',
                internal: true,
            },
            {
                value: 'faq',
                label: 'FAQ',
                link:
                    '/@surpassinggoogle/announcing-marlians-a-side-project-under-the-teardrops-ecosystem-a-marlians-nitrous-will-be-up-in-the-coming-days',
                internal: true,
            },
            {
                value: 'get_certified',
                label: 'Get Certified',
                link: 'https://discord.gg/usEdeU3',
            },
            {
                value: 'certified_uloggers_list',
                label: 'Certified Uloggers List',
                link: 'https://ulogs.org/discover',
            },
            {
                value: 'discord',
                label: 'Discord',
                link: 'https://discord.gg/QjvDDZd',
            },
            {
                value: 'vote_witness',
                label: 'Vote steemgigs',
                link:
                    'https://app.steemconnect.com/sign/account-witness-vote?witness=steemgigs&approve=1',
            },
        ],
        television: [
            {
                value: 'tv_marlians',
                label: 'Marlians',
                link:
                    'https://www.youtube.com/channel/UCH4tvTSFkjn3KqNQfJVWITQ',
            },
            {
                value: 'tv_uloggers',
                label: 'UloggersTV',
                link:
                    'https://www.youtube.com/channel/UCzI3Rjamg7zSe_o0BwSeIQQ',
            },
            {
                value: 'tv_untalented',
                label: 'UntalentedTV',
                link:
                    'https://www.youtube.com/channel/UCq6ylwOaSG9VDYwZkMr3jMw',
            },
            {
                value: 'tv_teardrops',
                label: 'TeardropsTV',
                link:
                    'https://www.youtube.com/channel/UCnIJlzMZzfrcE0bXabLpXKw',
            },
        ],
        legal: [
            {
                value: 'privacy',
                label: tt('navigation.privacy_policy'),
                link: '/privacy.html',
            },
            {
                value: 'tos',
                label: tt('navigation.terms_of_service'),
                link: '/tos.html',
            },
        ],
        extras: [
            {
                value: 'login',
                label: tt('g.sign_in'),
                link: '/login.html',
            },
            {
                value: 'signup',
                label: tt('g.sign_up'),
                link: 'https://signup.steemit.com',
            },
            {
                value: 'post',
                label: tt('g.post'),
                link: '/submit.html',
            },
        ],
    };

    return (
        <div className="SidePanel">
            <div className={(visible ? 'visible ' : '') + alignment}>
                <CloseButton onClick={hideSidePanel} />
                <ul className={`vertical menu ${loggedIn}`}>
                    {sidePanelLinks['extras'].map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">Community</a>
                    </li>
                    {sidePanelLinks['organizational'].map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">TV(s)</a>
                    </li>
                    {sidePanelLinks['television'].map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">
                            Trade {LIQUID_TOKEN_UPPERCASE}
                        </a>
                    </li>
                    {sidePanelLinks['internal'].map(makeLink)}
                </ul>
            </div>
        </div>
    );
};

SidePanel.propTypes = {
    alignment: PropTypes.oneOf(['left', 'right']).isRequired,
    visible: PropTypes.bool.isRequired,
    hideSidePanel: PropTypes.func.isRequired,
    username: PropTypes.string,
};

SidePanel.defaultProps = {
    username: undefined,
};

export default connect(
    (state, ownProps) => {
        const walletUrl = state.app.get('walletUrl');
        return {
            walletUrl,
            ...ownProps,
        };
    },
    dispatch => ({})
)(SidePanel);
