import React from 'react';
import Icon from 'app/components/elements/Icon';
import AppLogo from 'app/components/elements/AppLogo';
import { APP_ICON } from 'app/client_config';

class NotFound extends React.Component {
    render() {
        return (
            <div>
                <div className="row Header__nav">
                    <div className="small-5 large-4 columns Header__logotype">
                        <a href="/">
                            <AppLogo />
                        </a>
                    </div>
                </div>
                <div className="NotFound float-center">
                    <div>
                        <h4 className="NotFound__header">
                            Sorry! Either this page doesn't exist or you need to be logged in to view it.
                        </h4>
                        <p>
                            Not to worry. You can head back to{' '}
                            <a style={{ fontWeight: 800 }} href="/">
                                our homepage
                            </a>, or check out some great posts.
                        </p>
                        <ul className="NotFound__menu">
                            <li>
                                <a href="/created">new posts</a>
                            </li>
                            <li>
                                <a href="/hot">hot posts</a>
                            </li>
                            <li>
                                <a href="/trending">trending posts</a>
                            </li>
                            <li>
                                <a href="/promoted">promoted posts</a>
                            </li>
                            <li>
                                <a href="/active">active posts</a>
                            </li>
                        </ul>
                        <p>
                            If you need help, please contact Steemleo on <a href="https://discord.gg/KgcVDKQ">Discord</a>, <a href="https://twitter.com/steemleo">Twitter</a> or Telegram (@khaleelkazi).
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: '*',
    component: NotFound,
};
