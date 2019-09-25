import React from 'react';
import tt from 'counterpart';

const adStyle = {
    width: '200px',
    height: '200px',
    border: '0',
    padding: '0', 
    overflow:'hidden'
};

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
                    <a className="c-sidebar__link" href={'//reggaetube.io/#!/c/' + username}>
                        My tube
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
            </ul>
        </div>
        <div>
            <iframe data-aa="1247599" src="//ad.a-ads.com/1247599?size=200x200" scrolling="no" style={adStyle} allowtransparency="true"></iframe>
        </div>
    </div>
);

export default SidebarLinks;
