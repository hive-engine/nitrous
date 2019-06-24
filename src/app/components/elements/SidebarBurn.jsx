import React from 'react';
import tt from 'counterpart';

const SidebarBurn = ({scotToken, scotMinerTokens}) => (
    <div className="c-sidebar__module">
        <div className="c-sidebar__header">
            <h3 className="c-sidebar__h3">{tt('g.burn')}</h3>
        </div>
        <div className="c-sidebar__content">
            <ul className="c-sidebar__list">
                <li className="c-sidebar__list-item" >
                    <a className="c-sidebar__link" >
                        {scotToken}
                    </a>
                </li>

                <li className="c-sidebar__list-item">
                    <a className="c-sidebar__link" >
                        {scotMinerTokens}
                    </a>
                </li>
            </ul>
        </div>
    </div>
);

export default SidebarBurn;
