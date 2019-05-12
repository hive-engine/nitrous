import React from 'react';
import Icon from 'app/components/elements/Icon';
import SvgImage from 'app/components/elements/SvgImage';
import { APP_NAME } from 'app/client_config';

export default function MiniHeader() {
    return (
        <header className="Header">
            <div className="Header__top header">
                <div className="expanded row">
                    <div className="columns">
                        <ul className="menu">
                            <li className="Header__top-logo">
                                <a href="/">
                                    <SvgImage
                                        name="weedcash"
                                        width="150px"
                                        height="40px"
                                    />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}
