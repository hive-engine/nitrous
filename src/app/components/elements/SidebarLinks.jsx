import React from 'react';
import tt from 'counterpart';

const SidebarLinks = ({ username }) => (
    <div className="c-sidebar__module">
        <div className="c-sidebar__header">
            <h3 className="c-sidebar__h3">{tt('g.links')}</h3>
        </div>
        <div className="c-sidebar__content">
            <ul className="c-sidebar__list">
                <li className="c-sidebar__list-item" key="feed">
                    <a className="c-sidebar__link" href={`/@${username}/feed`}>
                        {tt('g.my_feed')}
                    </a>
                </li>

                <li className="c-sidebar__list-item">
                    <a className="c-sidebar__link" href={'/@' + username}>
                        {tt('g.my_blog')}
                    </a>
                </li>
                <li className="c-sidebar__list-item">
                    <a
                        className="c-sidebar__link"
                        href={`/@${username}/transfers`}
                    >
                        {tt('g.my_wallet')}
                    </a>
                </li>

                <li className="c-sidebar__list-item">
                    <a
                        className="c-sidebar__link"
                        href="https://steemit.com/@actnearn"
                    >
                        ActnEarn Steem
                    </a>
                </li>
                <li className="c-sidebar__list-item">
                    <a
                        className="c-sidebar__link"
                        href="https://twitter.com/@actnearn"
                    >
                        ActnEarn Twitter
                    </a>
                </li>
                <li className="c-sidebar__list-item">
                    <a
                        className="c-sidebar__link"
                        href="https://www.facebook.com/Actnearn-2193921334189045/"
                    >
                        ActnEarn Facebook
                    </a>
                </li>
                <li className="c-sidebar__list-item">
                    <a
                        className="c-sidebar__link"
                        href="https://www.linkedin.com/in/actnearn-smt-a9b23916b/"
                    >
                        ActnEarn LinkedIn
                    </a>
                </li>
                <li className="c-sidebar__list-item">
                    <a
                        className="c-sidebar__link"
                        href="https://www.youtube.com/channel/UC2Z1UJbYQGKUApQKbQQt3YQ/featured?view_as=subscriber"
                    >
                        ActnEarn YouTube
                    </a>
                </li>
                <li className="c-sidebar__list-item">
                    <a
                        className="c-sidebar__link"
                        href="https://www.instagram.com/actnearn/?hl=en"
                    >
                        ActnEarn Instagram
                    </a>
                </li>
                <li className="c-sidebar__list-item">
                    <a
                        className="c-sidebar__link"
                        href="https://www.tumblr.com/blog/actandearn"
                    >
                        ActnEarn Tumblr
                    </a>
                </li>
                <li className="c-sidebar__list-item">
                    <a
                        className="c-sidebar__link"
                        href="https://discord.gg/D7cDU5z"
                    >
                        ActnEarn Discord
                    </a>
                </li>
            </ul>
        </div>
    </div>
);

export default SidebarLinks;
