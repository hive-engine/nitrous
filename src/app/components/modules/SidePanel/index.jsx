import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import * as appActions from 'app/redux/AppReducer';
import CloseButton from 'app/components/elements/CloseButton';
import Icon from 'app/components/elements/Icon';
import { Link } from 'react-router';
import { HIVE_SIGNUP_URL, SIGNUP_URL } from 'shared/constants';

const SidePanel = ({
    alignment,
    visible,
    hideSidePanel,
    username,
    walletUrl,
    scotTokenSymbol,
    useHive,
    toggleNightmode,
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
        const cn = ix === arr.length - 1 ? 'last' : null;
        if (isExternal) {
            return (
                <li key={ix} className={cn}>
                    <a href={i.link} target="_blank" rel="noopener noreferrer">
                        {i.label}&nbsp;<Icon name="extlink" />
                    </a>
                </li>
            );
        }
        if (i.onClick) {
            return (
                <li key={ix} className={cn}>
                    <a onClick={i.onClick}>{i.label}</a>
                </li>
            );
        }
        return (
            <li key={ix} className={cn}>
                <Link to={i.link}>{i.label}</Link>
            </li>
        );
    };

    const sidePanelLinks = {
        internal: [
            {
                value: 'engine',
                label: useHive ? 'Tribaldex' : 'Steem Engine',
                link: useHive
                    ? `https://tribaldex.com/trade/${scotTokenSymbol}`
                    : `https://steem-engine.net/?p=market&t=${scotTokenSymbol}`,
            },
        ],
        external: [
            {
                label: tt('navigation.chat'),
                link: 'https://openhive.chat/home',
            },
        ],
        organizational_BHT: [
            {
                value: 'BHT_gigs',
                label: 'BroadHiveGigs',
                link: 'https://www.broadhivegigs.space',
            },
        ],
        organizational_ALIVE: [
            {
                value: 'ALIVE_about',
                label:
                    'We Are Alive - What Is This Tribe About? - And What To Post Here?',
                link: '/@flaxz/nkugscpq',
                internal: true,
            },
            {
                value: 'ALIVE_discord',
                label: 'Discord',
                link: 'https://discord.gg/qXqv63J',
            },
        ],
        organizational_WEED: [
            {
                value: 'orgsite',
                label: 'About WeedCash',
                link: 'https://weedcash.org/',
            },
            {
                value: 'discord',
                label: 'Discord',
                link: 'https://discord.gg/jMHX3d8',
            },
            {
                value: 'weed_store',
                label: 'WeedCash Store',
                link: 'https://weedcash.store',
            },
        ],
        organizational_LAGO: [
            {
                value: 'lago_orgsite',
                label: 'LagoTube',
                link: 'https://tube.lago.com.gt/',
            },
        ],
        organizational: [],

        legal: [
            {
                label: tt('navigation.privacy_policy'),
                link: '/privacy.html',
            },
            {
                label: tt('navigation.terms_of_service'),
                link: '/tos.html',
            },
        ],

        extras: [
            {
                label: tt('g.sign_in'),
                link: '/login.html',
            },
            {
                label: tt('g.sign_up'),
                link: useHive ? HIVE_SIGNUP_URL : SIGNUP_URL,
            },
            {
                value: 'post',
                label: tt('g.post'),
                link: '/submit.html',
            },
        ],
        extras_WEED: [
            {
                value: 'whitepaper',
                label: 'White Paper',
                internal: true,
                link: '/@coffeebuds/weedcash-network-white-paper',
            },
        ],
    };

    return (
        <div className="SidePanel">
            <div className={(visible ? 'visible ' : '') + alignment}>
                <CloseButton onClick={hideSidePanel} />
                <ul className={`vertical menu ${loggedIn}`}>
                    {sidePanelLinks.extras.map(makeLink)}
                </ul>

                {sidePanelLinks['extras_' + scotTokenSymbol] && (
                    <ul className={'vertical menu'}>
                        {sidePanelLinks['extras_' + scotTokenSymbol].map(
                            makeLink
                        )}
                    </ul>
                )}

                {sidePanelLinks['organizational_' + scotTokenSymbol] && (
                    <ul className="vertical menu">
                        <li>
                            <a className="menu-section">Community</a>
                        </li>
                        {sidePanelLinks[
                            'organizational_' + scotTokenSymbol
                        ].map(makeLink)}
                    </ul>
                )}

                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">Trade {scotTokenSymbol}</a>
                    </li>
                    {(sidePanelLinks['internal_' + scotTokenSymbol]
                        ? sidePanelLinks['internal_' + scotTokenSymbol]
                        : sidePanelLinks['internal']
                    ).map(makeLink)}
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
    scotTokenSymbol: PropTypes.string,
    toggleNightmode: PropTypes.func.isRequired,
};

SidePanel.defaultProps = {
    username: undefined,
};

export default connect(
    (state, ownProps) => {
        const walletUrl = state.app.get('walletUrl');
        const scotTokenSymbol = state.app.getIn([
            'hostConfig',
            'LIQUID_TOKEN_UPPERCASE',
        ]);
        const useHive = state.app.getIn(['hostConfig', 'HIVE_ENGINE'], true);
        return {
            walletUrl,
            scotTokenSymbol,
            useHive,
            ...ownProps,
        };
    },
    dispatch => ({
        toggleNightmode: e => {
            if (e) e.preventDefault();
            dispatch(appActions.toggleNightmode());
        },
    })
)(SidePanel);
