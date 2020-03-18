import React from 'react';
import tt from 'counterpart';
import { SIGNUP_URL } from 'shared/constants';

const SidebarNewUsers = () => (
    <div className="c-sidebar__module">
        <div className="c-sidebar__header">
            <h3 className="c-sidebar__h3">New to Hive?</h3>
        </div>
        <div className="c-sidebar__content">
            <ul className="c-sidebar__list">
                <li className="c-sidebar__list-item">
                    <a className="c-sidebar__link" href="/welcome">
                        Welcome Guide
                    </a>
                </li>
                {/*
                <li className="c-sidebar__list-item">
                    <a className="c-sidebar__link" href="/faq.html">
                        FAQs
                    </a>
                </li>
                <li className="c-sidebar__list-item">
                    <a className="c-sidebar__link" href="/@steemitblog">
                        {tt('g.read_offical_blog')}
                    </a>
                </li>
                */}
                <li className="c-sidebar__list-item">
                    <a
                        className="c-sidebar__link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://hive.io/hive-whitepaper.pdf"
                    >
                        Whitepaper
                    </a>
                </li>
            </ul>
        </div>
    </div>
);

export default SidebarNewUsers;
