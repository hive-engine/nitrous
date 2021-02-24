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
                label: useHive ? 'Hive Engine' : 'Steem Engine',
                link: `https://${
                    useHive ? 'hive' : 'steem'
                }-engine.com/?p=market&t=${scotTokenSymbol}`,
            },
        ],
        internal_KANDA: [
            {
                value: 'engine',
                label: useHive ? 'Hive Engine' : 'Steem Engine',
                link: `https://${
                    useHive ? 'hive' : 'steem'
                }-engine.com/?p=market&t=${scotTokenSymbol}`,
            },
            {
                value: 'KANDA_Alcordex',
                label: 'Alcor Dex',
                link: 'https://telos.alcor.exchange/markets/KANDA-telokandaone',
            },
            {
                value: 'KANDA_vapaeedex',
                label: 'Vapaee Dex',
                link: 'https://vapaee.io/exchange/trade/kanda.tlos',
            },
        ],
        internal_ASH: [
            {
                value: 'engine',
                label: useHive ? 'Hive Engine' : 'Steem Engine',
                link: `https://${
                    useHive ? 'hive' : 'steem'
                }-engine.com/?p=market&t=${scotTokenSymbol}`,
            },
            {
                value: 'ASH_Richlist',
                label: 'ASH Richlist',
                link: 'https://he.dtools.dev/richlist/ASH',
            },
            {
                value: 'ASH_cryptex24',
                label: 'Cryptex24',
                link: 'https://www.cryptex24.io/registration?ref=cfdb40ad',
            },
            {
                value: 'ASH_richamster',
                label: 'Richamster',
                link: 'https://richamster.com/?referral=h1F5TOeCoLPq',
            },
            {
                value: 'ASH_Leodex',
                label: 'LEO Dex',
                link: 'https://leodex.io/market/ASH',
            },
            {
                value: 'ASH_Tribaldex',
                label: 'Tribal Dex',
                link: 'https://tribaldex.com/exchange/ASH',
            },
        ],
        external: [
            {
                label: tt('navigation.chat'),
                link: 'https://openhive.chat/home',
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
        organizational_DIAMOND: [
            {
                value: 'diamond_guide',
                label: 'Guide to SteemDiamond',
                internal: true,
                link: '/@diamondtoken/guide-to-steemdiamond',
            },
            {
                value: 'diamond_staking',
                label: 'Diamond Staking',
                internal: true,
                link: '/@diamondtoken/diamond-proof-of-stake-is-now-live',
            },
            {
                value: 'diamond_telegram',
                label: 'Telegram',
                link: 'https://t.me/steemdiamond',
            },
            {
                value: 'diamond_richlist',
                label: 'Rich List',
                link: 'https://steem-engine.rocks/tokens/DIAMOND/richlist',
            },
        ],
        organizational_KANDA: [
            {
                value: 'telokanda_site',
                label: 'Telokanda.com',
                link: 'https://telokanda.com',
            },
            {
                value: 'kanda_discord',
                label: 'Discord',
                link: 'https://discord.telokanda.com',
            },
            {
                value: 'kanda_telegram',
                label: 'Telegram',
                link: 'https://t.me/telokanda',
            },
            {
                value: 'telos',
                label: 'Telos',
                link: 'https://app.telos.net',
            },
            {
                value: 'SQRL',
                label: 'SQRL',
                link: 'https://sqrlwallet.io',
            },
            {
                value: 'kanda_challengedapp',
                label: 'Earn More: ChallengeDapp GPS EOS and Kanda for Africa',
                link: 'https://challengedapp.io/',
            },
        ],
        organizational_LIST: [
            {
                value: 'HiveList_Main',
                label: 'Home',
                link: 'https://hivelist.io/classifieds',
            },
            {
                value: 'HiveList_Token',
                label: 'LIST Token',
                link: 'https://hivelist.io/list-token',
            },
            {
                value: 'HiveList_Store',
                label: 'Store',
                link: 'https://hivelist.store',
            },
            {
                value: 'HiveList_Services',
                label: 'Services',
                link: 'https://hivelist.io/services/',
            },
            {
                value: 'HiveList_Discord',
                label: 'Discord',
                link: 'https://discord.gg/ZapSfYj',
            },
        ],
        organizational_HUSTLER: [
            {
                value: 'Hustler_chat',
                label: 'HustlerChat',
                link: 'https://www.hivehustlers.com/hustlerchat/',
            },
            {
                value: 'Hustler_resources',
                label: 'Resource Library',
                link: 'https://www.hivehustlers.com/hustler-resources/',
            },
            {
                value: 'Hustler_tokenecon',
                label: 'Token Economy',
                link: 'https://www.hivehustlers.com/token-economy/',
            },
            {
                value: 'Hustler_hivecommerce',
                label: 'Hivecommerce',
                link: 'https://hivecommerce.org/',
            },
            {
                value: 'Hustler_hivelist',
                label: 'Hivelist',
                link: 'https://hivelist.io',
            },
        ],

        organizational_ASH: [
            {
                value: 'ASH_Team_Ukraine',
                label: 'Team Ukraine',
                link: 'https://www.aeneas.blog/trending/hive-165469',
            },
            {
                value: 'ASH_Team_Ukraine_Chat',
                label: 'Hive UA Telegram Chat',
                link: 'https://t.me/HIVE_UA',
            },
            {
                value: 'ASH_Aeneas_Discord',
                label: 'Aeneas Discord',
                link: 'https://discord.gg/aAGP32v',
            },
            {
                value: 'ASH_Cryptobrewmaster',
                label: 'Cryptobrewmaster',
                link: 'https://cryptobrewmaster.io',
            },
            {
                value: 'ASH_Cryptobrewmaster_Chat',
                label: 'Cryptobrewmaster Chat',
                link: 'https://t.me/cryptobrewmaster',
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
        const useHive = state.app.getIn(['hostConfig', 'HIVE_ENGINE']);
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
