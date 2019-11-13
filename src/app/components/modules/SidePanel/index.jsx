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
        roadofrich: [
            {
                value: 'playror',
                label: 'PLAY ROR',
                link: `https://rorsteem.com/`,
            },
            {
                value: 'officialsite',
                label: 'Official Site',
                link: `http://roadofrich.com/`,
            },
        ],
        contactus: [
            {
                value: 'openkakaotalk',
                label: 'Open Kakaotalk',
                link: `https://open.kakao.com/o/gHpYWMkb`,
            },
            {
                value: 'discordchannel',
                label: 'Discord Channel',
                link: `https://discord.gg/vyPHGk6`,
            },
        ],
        richlist: [
            {
                value: 'rorsrich',
                label: 'RORS TOKEN',
                link: `https://steem-engine.rocks/tokens/RORS/richlist`,
            },
            {
                value: 'ivrich',
                label: 'IV TOKEN',
                link: `https://steem-engine.rocks/tokens/IV/richlist`,
            },
        ],
        tradetoken: [
            {
                value: 'rorstoken',
                label: 'RORS TOKEN',
                link: `https://steem-engine.com/?p=market&t=RORS`,
            },
            {
                value: 'ivtoken',
                label: 'IV TOKEN',
                link: `https://steem-engine.com/?p=market&t=IV`,
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
                        <a className="menu-section">Road of rich</a>
                    </li>
                    {sidePanelLinks['roadofrich'].map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">Contact Us</a>
                    </li>
                    {sidePanelLinks['contactus'].map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">RICH RIST</a>
                    </li>
                    {sidePanelLinks['richlist'].map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">Trade Token</a>
                    </li>
                    {sidePanelLinks['tradetoken'].map(makeLink)}
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
