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
        internal_support: [
            {
                value: 'steemengineblockexplorer',
                label: 'Steem Engine Block Explorer',
                link: `https://steem-engine.rocks/@${
                     username
                }`,
            },
            {
                value: 'richlist',
                label: 'Rich list',
                link: `https://steem-engine.rocks/tokens/${
                     LIQUID_TOKEN_UPPERCASE
                }/richlist`,
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
                value: 'bluepaper',
                label: tt('navigation.bluepaper'),
                link: 'https://steem.io/steem-bluepaper.pdf',
            },
            {
                value: 'smt_whitepaper',
                label: tt('navigation.smt_whitepaper'),
                link: 'https://smt.steem.io/',
            },
            {
                value: 'whitepaper',
                label: tt('navigation.whitepaper'),
                link: 'https://steem.io/SteemWhitePaper.pdf',
            },
            {
                value: 'about',
                label: tt('navigation.about'),
                link: '/about.html',
                internal: true,
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
                        <a className="menu-section">
                            Trade {LIQUID_TOKEN_UPPERCASE}
                        </a>
                    </li>
                    {sidePanelLinks['internal'].map(makeLink)}
                    <li>
                        <a className="menu-section">
                            Support {LIQUID_TOKEN_UPPERCASE}
                        </a>
                    </li>
                    {sidePanelLinks['internal_support'].map(makeLink)}

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
