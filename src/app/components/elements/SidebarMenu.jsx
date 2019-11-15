import React from 'react';
import tt from 'counterpart';
import Icon from 'app/components/elements/Icon';

const SidebarMenu = ({ username, className }) => (
    <div
        className={`c-sidebar__module ${className}`}
        style={{ border: '0 solid #fff' }}
    >
        <div className="c-sidebar__header">
            <h3 className="c-sidebar__h3">
                {tt('sidebar_menu_jsx.publishing')}
            </h3>
        </div>
        <div className="c-sidebar__content">
            <ul className="c-sidebar__list">
                <li className="c-sidebar__list-item">
                    <a className="c-sidebar__link" href="/submit.html">
                        <Icon name="pencil2" size="1x" />
                        {tt('sidebar_menu_jsx.create_a_post')}
                    </a>
                </li>
            </ul>
        </div>

        <hr className="c-siderbar__hr" />

        <div className="c-sidebar__header">
            <h3 className="c-sidebar__h3">
                {tt('sidebar_menu_jsx.exploring')}
            </h3>
        </div>
        <div className="c-sidebar__content">
            <ul className="c-sidebar__list">
                <li className="c-sidebar__list-item">
                    <a className="c-sidebar__link" href="/">
                        <Icon name="home" size="1x" />
                        {tt('sidebar_menu_jsx.home')}
                    </a>
                </li>

                <li className="c-sidebar__list-item">
                    <a className="c-sidebar__link" href="/trending">
                        <Icon name="trending" size="1x" />
                        {tt('sidebar_menu_jsx.trending')}
                    </a>
                </li>

                <li className="c-sidebar__list-item">
                    <a className="c-sidebar__link" href="/tags">
                        <Icon name="tag" size="1x" />
                        {tt('sidebar_menu_jsx.tags')}
                    </a>
                </li>
            </ul>
        </div>

        <hr className="c-siderbar__hr" />

        <div className="c-sidebar__header">
            <h3 className="c-sidebar__h3">
                {tt('sidebar_menu_jsx.tools')}
            </h3>
        </div>
        <div className="c-sidebar__content">
            <ul className="c-sidebar__list">
                <li className="c-sidebar__list-item">
                    <a className="c-sidebar__link" href="https://dex.steemleo.com">
                        <Icon name="home" size="1x" />
                        {tt('sidebar_menu_jsx.leodex')}
                    </a>
                </li>

                <li className="c-sidebar__list-item">
                    <a className="c-sidebar__link" href="https://steemworld.org">
                        <Icon name="trending" size="1x" />
                        {tt('sidebar_menu_jsx.steemworld')}
                    </a>
                </li>

                <li className="c-sidebar__list-item">
                    <a className="c-sidebar__link" href="https://steem-engine.rocks/tokens/LEO/richlist">
                        <Icon name="tag" size="1x" />
                        {tt('sidebar_menu_jsx.stakeholders')}
                    </a>
                </li>
            </ul>
        </div>
    </div>
);

export default SidebarMenu;
