import React from 'react';
import ReactMarkdown from 'react-markdown';
import { message, Collapse, Button, List } from 'antd';
import GrowVideoEmbed from './GrowVideoEmbed';
import * as growSections from './growSections';

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
            <div className="shifted">
                <div className="container">
                    <div className="center" style={{ marginBottom: '50px' }}>
                        <h2 style={{ color: 'purple', textAlign: 'center' }}>
                            GROW
                        </h2>
                        <Collapse defaultActiveKey={['1']}>
                            <Collapse.Panel
                                header="About GROW"
                                key="1"
                                style={customPanelStyle}
                            >
                                <p>
                                    <ReactMarkdown
                                        source={growSections.aboutGrow}
                                    />
                                </p>
                            </Collapse.Panel>
                        </Collapse>

                        <Collapse defaultActiveKey={['1']}>
                            <Collapse.Panel
                                showArrow={false}
                                header="Let Us Help Fix Matters"
                                key="1"
                            >
                                <List itemLayout="vertical" size="large">
                                    <List.Item
                                        key="Submit A Video To One Of Our TV(s)"
                                        extra={
                                            <GrowVideoEmbed
                                                key="embed"
                                                embed={{
                                                    provider_name: 'YouTube',
                                                    thumbnail:
                                                        'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                    embed:
                                                        '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                }}
                                            />
                                        }
                                    >
                                        <h3>
                                            Submit A Video To One Of Our TV(s)
                                        </h3>
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.submitAVideo
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={this.displayComingSoon}
                                        >
                                            Click Here
                                        </Button>
                                    </List.Item>

                                    <List.Item
                                        key="Write To Ulogs.org"
                                        extra={
                                            <GrowVideoEmbed
                                                key="embed"
                                                embed={{
                                                    provider_name: 'YouTube',
                                                    thumbnail:
                                                        'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                    embed:
                                                        '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                }}
                                            />
                                        }
                                    >
                                        <h3>Write To Ulogs.org</h3>
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.writeToUlogs
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={this.displayComingSoon}
                                        >
                                            Click Here
                                        </Button>
                                    </List.Item>

                                    <List.Item
                                        key="15 Mins Session With Your Favorite Mentor"
                                        extra={
                                            <GrowVideoEmbed
                                                key="embed"
                                                embed={{
                                                    provider_name: 'YouTube',
                                                    thumbnail:
                                                        'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                    embed:
                                                        '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                }}
                                            />
                                        }
                                    >
                                        <h3>
                                            15 Mins Session With Your Favorite
                                            Mentor
                                        </h3>
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.fifteenMinuteMentor
                                                }
                                            />
                                        </div>
                                        <a href="/favorite-mentor">
                                            <Button type="primary">
                                                Click Here
                                            </Button>
                                        </a>
                                    </List.Item>

                                    <List.Item
                                        key="Apply To Give A 30 Mins Symposium About Your Project On A Popular Steem Community"
                                        extra={
                                            <GrowVideoEmbed
                                                key="embed"
                                                embed={{
                                                    provider_name: 'YouTube',
                                                    thumbnail:
                                                        'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                    embed:
                                                        '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                }}
                                            />
                                        }
                                    >
                                        <h3>
                                            Apply To Give A 30 Mins Symposium
                                            About Your Project On A Popular
                                            Steem Community
                                        </h3>
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.thirtyMinuteSymposium
                                                }
                                            />
                                        </div>
                                        <a href="/popular-community">
                                            <Button type="primary">
                                                Click Here
                                            </Button>
                                        </a>
                                    </List.Item>

                                    <List.Item
                                        key="How About Extra Clout On Steem Or Outside Steem"
                                        extra={
                                            <GrowVideoEmbed
                                                key="embed"
                                                embed={{
                                                    provider_name: 'YouTube',
                                                    thumbnail:
                                                        'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                    embed:
                                                        '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                }}
                                            />
                                        }
                                    >
                                        <h3>
                                            How About Extra Clout On Steem Or
                                            Outside Steem
                                        </h3>
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={growSections.extraClout}
                                            />
                                        </div>
                                        <a href="/extra-clout">
                                            <Button type="primary">
                                                Click Here
                                            </Button>
                                        </a>
                                    </List.Item>

                                    <List.Item
                                        key="Do You Need Extra Confidence To Make A Life-Changing Move?"
                                        extra={
                                            <GrowVideoEmbed
                                                key="embed"
                                                embed={{
                                                    provider_name: 'YouTube',
                                                    thumbnail:
                                                        'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                    embed:
                                                        '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                }}
                                            />
                                        }
                                    >
                                        <h3>
                                            Do You Need Extra Confidence To Make
                                            A Life-Changing Move?
                                        </h3>
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.extraConfidence
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={this.displayComingSoon}
                                        >
                                            Click Here
                                        </Button>
                                    </List.Item>

                                    <List.Item
                                        key="Are You Dealing With Hard-To-Explain Ailment e.g Depression?"
                                        extra={
                                            <GrowVideoEmbed
                                                key="embed"
                                                embed={{
                                                    provider_name: 'YouTube',
                                                    thumbnail:
                                                        'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                    embed:
                                                        '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                }}
                                            />
                                        }
                                    >
                                        <h3>
                                            Are You Dealing With Hard-To-Explain
                                            Ailment e.g Depression?
                                        </h3>
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.hardToExplainAilment
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={this.displayComingSoon}
                                        >
                                            Click Here
                                        </Button>
                                    </List.Item>

                                    <List.Item
                                        key="Send Us A Letter, Gift Or Mail"
                                        extra={
                                            <GrowVideoEmbed
                                                key="embed"
                                                embed={{
                                                    provider_name: 'YouTube',
                                                    thumbnail:
                                                        'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                    embed:
                                                        '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                }}
                                            />
                                        }
                                    >
                                        <h3>Send Us A Letter, Gift Or Mail</h3>
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.sendUsSomething
                                                }
                                            />
                                        </div>
                                        <a>
                                            <Button type="primary">
                                                Click Here
                                            </Button>
                                        </a>
                                    </List.Item>

                                    <List.Item
                                        key="Inspire Us"
                                        extra={
                                            <GrowVideoEmbed
                                                key="embed"
                                                embed={{
                                                    provider_name: 'YouTube',
                                                    thumbnail:
                                                        'https://steemitimages.com/360x203/https://img.youtube.com/vi/kKZ1CixLG2s/0.jpg',
                                                    embed:
                                                        '<iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>',
                                                }}
                                            />
                                        }
                                    >
                                        <h3>Inspire Us</h3>
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={growSections.inspireUs}
                                            />
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={this.displayComingSoon}
                                        >
                                            Click Here
                                        </Button>
                                    </List.Item>
                                </List>
                            </Collapse.Panel>
                        </Collapse>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: 'about.html',
    component: About,
};
