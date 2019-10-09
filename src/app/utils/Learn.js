import React from 'react';
import ReactMarkdown from 'react-markdown';
import { message, Collapse, Button, List } from 'antd';
import * as learnSections from './learnSections';

class Learn extends React.Component {
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
        // for the 'About Learn' style
        const customPanelStyle = {
            marginBottom: 5,
            overflow: 'hidden',
        };

        // style for the different learn sections
        const customCardStyle = {
            marginBottom: '10px',
            marginTop: '10px',
        };

        return (
            <div className="shifted">
                <div className="container">
                    <div className="center" style={{ marginBottom: '50px' }}>
                        <h2 style={{ color: 'purple', textAlign: 'center' }}>
                            GRO.grW
                        </h2>
                        <Collapse defaultActiveKey={['1']}>
                            <Collapse.Panel
                                header="About LEARN"
                                key="1"
                                style={customPanelStyle}
                            >
                                <p>
                                    <ReactMarkdown
                                        source={learnSections.aboutLearn}
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
                                            <LearnVideoEmbed
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
                                                    learnSections.submitAVideo
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
                                            <LearnVideoEmbed
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
                                                    learnSections.writeToUlogs
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
                                            <LearnVideoEmbed
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
                                                    learnSections.fifteenMinuteMentor
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
                                            <LearnVideoEmbed
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
                                                    learnSections.thirtyMinuteSymposium
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
                                            <LearnVideoEmbed
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
                                                source={learnSections.extraClout}
                                            />
                                        </div>
                                        <a>
                                            <Button type="primary">
                                                Click Here
                                            </Button>
                                        </a>
                                    </List.Item>

                                    <List.Item
                                        key="Do You Need Extra Confidence To Make A Life-Changing Move?"
                                        extra={
                                            <LearnVideoEmbed
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
                                                    learnSections.extraConfidence
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
                                            <LearnVideoEmbed
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
                                                    learnSections.hardToExplainAilment
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
                                            <LearnVideoEmbed
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
                                                    learnSections.sendUsSomething
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
                                            <LearnVideoEmbed
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
                                                source={larnSections.inspireUs}
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
