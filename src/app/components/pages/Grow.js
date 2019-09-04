import React from 'react';
import ReactMarkdown from 'react-markdown';
import { message, Collapse, Button, List } from 'antd';
import GrowVideoEmbed from './GrowVideoEmbed';
import * as growSections from './growSections';
//import './bootstrap.scss';

class Grow extends React.Component {
    constructor(props) {
        super(props);
        // bind the component's methods so that it can be called within render() using this.displayComingSoon()
        this.displayComingSoon = this.displayComingSoon.bind(this);
    }

    /*
   * Display a coming soon message when user clicks on any "Click Here" button
   */
    displayComingSoon = () => {
        message.success('Coming soon!', 3);
    };

    render() {
        // for the 'About Ulog' style
        const customPanelStyle = {
            marginBottom: 5,
            overflow: 'hidden',
        };

        // style for the different grow sections
        const customCardStyle = {
            marginBottom: '10px',
            marginTop: '10px',
        };

        return (
            <div className="container growContainer">
                <h2 style={{ color: 'black', textAlign: 'center' }}>GROW</h2>

                <div className="ant-collapse">
                    <div className="ant-collapse-item ant-collapse-item-active">
                        <div className="ant-collapse-header" id="headingOne">
                            About GROW
                        </div>

                        <div className="ant-collapse-content ant-collapse-content-active">
                            <div className="ant-collapse-content-box">
                                <ReactMarkdown
                                    source={growSections.aboutGrow}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ant-collapse">
                    <div className="ant-collapse-item ant-collapse-item-active">
                        <div className="ant-collapse-header">
                            Let Us Help Fix Matters
                        </div>

                        <div className="ant-collapse-content ant-collapse-content-active">
                            <div className="ant-collapse-content-box">
                                <div className="ant-list ant-list-vertical ant-list-lg ant-list-split">
                                    <div className="ant-list-item">
                                        <div className="ant-list-item-extra-wrap">
                                            <div className="ant-list-item-main">
                                                <div className="ant-list-item-content ant-list-item-content-single">
                                                    <h3>
                                                        Submit A Video To One Of
                                                        Our TV(s)
                                                    </h3>
                                                    <div className="antContent">
                                                        <ReactMarkdown
                                                            source={
                                                                growSections.submitAVideo
                                                            }
                                                        />
                                                    </div>
                                                    <a
                                                        className="ant-btn ant-btn-primary"
                                                        href="#"
                                                    >
                                                        <span>Click Here</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="ant-list-item-extra">
                                                <div
                                                    role="presentation"
                                                    className="VideoEmbed"
                                                >
                                                    <GrowVideoEmbed
                                                        key="embed"
                                                        embed={{
                                                            provider_name:
                                                                'YouTube',
                                                            thumbnail:
                                                                'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                            embed:
                                                                '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ant-list-item">
                                        <div className="ant-list-item-extra-wrap">
                                            <div className="ant-list-item-main">
                                                <div className="ant-list-item-content ant-list-item-content-single">
                                                    <h3>Write To Ulogs.org</h3>
                                                    <div className="antContent">
                                                        <ReactMarkdown
                                                            source={
                                                                growSections.writeToUlogs
                                                            }
                                                        />
                                                    </div>
                                                    <a
                                                        className="ant-btn ant-btn-primary"
                                                        href="#"
                                                    >
                                                        <span>Click Here</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="ant-list-item-extra">
                                                <div
                                                    role="presentation"
                                                    className="VideoEmbed"
                                                >
                                                    <GrowVideoEmbed
                                                        key="embed"
                                                        embed={{
                                                            provider_name:
                                                                'YouTube',
                                                            thumbnail:
                                                                'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                            embed:
                                                                '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ant-list-item">
                                        <div className="ant-list-item-extra-wrap">
                                            <div className="ant-list-item-main">
                                                <div className="ant-list-item-content ant-list-item-content-single">
                                                    <h3>
                                                        15 Mins Session With
                                                        Your Favorite Mentor
                                                    </h3>
                                                    <div className="antContent">
                                                        <ReactMarkdown
                                                            source={
                                                                growSections.fifteenMinuteMentor
                                                            }
                                                        />
                                                    </div>
                                                    <a
                                                        className="ant-btn ant-btn-primary"
                                                        href="/favorite-mentor"
                                                    >
                                                        <span>Click Here</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="ant-list-item-extra">
                                                <div
                                                    role="presentation"
                                                    className="VideoEmbed"
                                                >
                                                    <GrowVideoEmbed
                                                        key="embed"
                                                        embed={{
                                                            provider_name:
                                                                'YouTube',
                                                            thumbnail:
                                                                'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                            embed:
                                                                '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ant-list-item">
                                        <div className="ant-list-item-extra-wrap">
                                            <div className="ant-list-item-main">
                                                <div className="ant-list-item-content ant-list-item-content-single">
                                                    <h3>
                                                        Apply To Give A 30 Mins
                                                        Symposium About Your
                                                        Project On A Popular
                                                        Steem Community
                                                    </h3>
                                                    <div className="antContent">
                                                        <ReactMarkdown
                                                            source={
                                                                growSections.thirtyMinuteSymposium
                                                            }
                                                        />
                                                    </div>
                                                    <a
                                                        className="ant-btn ant-btn-primary"
                                                        href="#"
                                                    >
                                                        <span>Click Here</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="ant-list-item-extra">
                                                <div
                                                    role="presentation"
                                                    className="VideoEmbed"
                                                >
                                                    <GrowVideoEmbed
                                                        key="embed"
                                                        embed={{
                                                            provider_name:
                                                                'YouTube',
                                                            thumbnail:
                                                                'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                            embed:
                                                                '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ant-list-item">
                                        <div className="ant-list-item-extra-wrap">
                                            <div className="ant-list-item-main">
                                                <div className="ant-list-item-content ant-list-item-content-single">
                                                    <h3>
                                                        How About Extra Clout On
                                                        Steem Or Outside Steem
                                                    </h3>
                                                    <div className="antContent">
                                                        <ReactMarkdown
                                                            source={
                                                                growSections.extraClout
                                                            }
                                                        />
                                                    </div>
                                                    <a
                                                        className="ant-btn ant-btn-primary"
                                                        href="#"
                                                    >
                                                        <span>Click Here</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="ant-list-item-extra">
                                                <div
                                                    role="presentation"
                                                    className="VideoEmbed"
                                                >
                                                    <GrowVideoEmbed
                                                        key="embed"
                                                        embed={{
                                                            provider_name:
                                                                'YouTube',
                                                            thumbnail:
                                                                'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                            embed:
                                                                '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ant-list-item">
                                        <div className="ant-list-item-extra-wrap">
                                            <div className="ant-list-item-main">
                                                <div className="ant-list-item-content ant-list-item-content-single">
                                                    <h3>
                                                        Do You Need Extra
                                                        Confidence To Make A
                                                        Life-Changing Move?
                                                    </h3>
                                                    <div className="antContent">
                                                        <ReactMarkdown
                                                            source={
                                                                growSections.extraConfidence
                                                            }
                                                        />
                                                    </div>
                                                    <a
                                                        className="ant-btn ant-btn-primary"
                                                        href="#"
                                                    >
                                                        <span>Click Here</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="ant-list-item-extra">
                                                <div
                                                    role="presentation"
                                                    className="VideoEmbed"
                                                >
                                                    <GrowVideoEmbed
                                                        key="embed"
                                                        embed={{
                                                            provider_name:
                                                                'YouTube',
                                                            thumbnail:
                                                                'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                            embed:
                                                                '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ant-list-item">
                                        <div className="ant-list-item-extra-wrap">
                                            <div className="ant-list-item-main">
                                                <div className="ant-list-item-content ant-list-item-content-single">
                                                    <h3>
                                                        Are You Dealing With
                                                        Hard-To-Explain Ailment
                                                        e.g Depression?
                                                    </h3>
                                                    <div className="antContent">
                                                        <ReactMarkdown
                                                            source={
                                                                growSections.hardToExplainAilment
                                                            }
                                                        />
                                                    </div>
                                                    <a
                                                        className="ant-btn ant-btn-primary"
                                                        href="#"
                                                    >
                                                        <span>Click Here</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="ant-list-item-extra">
                                                <div
                                                    role="presentation"
                                                    className="VideoEmbed"
                                                >
                                                    <GrowVideoEmbed
                                                        key="embed"
                                                        embed={{
                                                            provider_name:
                                                                'YouTube',
                                                            thumbnail:
                                                                'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                            embed:
                                                                '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ant-list-item">
                                        <div className="ant-list-item-extra-wrap">
                                            <div className="ant-list-item-main">
                                                <div className="ant-list-item-content ant-list-item-content-single">
                                                    <h3>
                                                        Send Us A Letter, Gift
                                                        Or Mail
                                                    </h3>
                                                    <div className="antContent">
                                                        <ReactMarkdown
                                                            source={
                                                                growSections.sendUsSomething
                                                            }
                                                        />
                                                    </div>
                                                    <a
                                                        className="ant-btn ant-btn-primary"
                                                        href="#"
                                                    >
                                                        <span>Click Here</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="ant-list-item-extra">
                                                <div
                                                    role="presentation"
                                                    className="VideoEmbed"
                                                >
                                                    <GrowVideoEmbed
                                                        key="embed"
                                                        embed={{
                                                            provider_name:
                                                                'YouTube',
                                                            thumbnail:
                                                                'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                            embed:
                                                                '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ant-list-item">
                                        <div className="ant-list-item-extra-wrap">
                                            <div className="ant-list-item-main">
                                                <div className="ant-list-item-content ant-list-item-content-single">
                                                    <h3>Inspire Us</h3>
                                                    <div className="antContent">
                                                        <ReactMarkdown
                                                            source={
                                                                growSections.inspireUs
                                                            }
                                                        />
                                                    </div>
                                                    <a
                                                        className="ant-btn ant-btn-primary"
                                                        href="#"
                                                    >
                                                        <span>Click Here</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="ant-list-item-extra">
                                                <div
                                                    role="presentation"
                                                    className="VideoEmbed"
                                                >
                                                    <GrowVideoEmbed
                                                        key="embed"
                                                        embed={{
                                                            provider_name:
                                                                'YouTube',
                                                            thumbnail:
                                                                'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                            embed:
                                                                '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: 'grow',
    component: Grow,
};
