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
        // for the 'About Leo' style
        const customPanelStyle = {
            marginBottom: 5,
            overflow: 'hidden',
        };

        // style for the different sections
        const customCardStyle = {
            marginBottom: '10px',
            marginTop: '10px',
        };

        return (
            <div className="container">
                <h2 style={{ color: 'orange', textAlign: 'center' }}>LEARN</h2>
                <div className="accordion" id="accordionExample">
                    <div className="card">
                        <div className="card-header" id="headingOne">
                            <h2 className="mb-0">
                                <button
                                    className="btn btn-link"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#collapseOne"
                                    aria-expanded="true"
                                    aria-controls="collapseOne"
                                >
                                    About LEARN
                                </button>
                            </h2>
                        </div>

                        <div
                            id="collapseOne"
                            className="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordionExample"
                        >
                            <div className="card-body">
                                <ReactMarkdown
                                    source={learnSections.aboutLearn}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion" id="accordionExample2">
                    <div className="card">
                        <div className="card-header" id="headingOne">
                            <h2 className="mb-0">
                                <button
                                    className="btn btn-link"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#collapseOne"
                                    aria-expanded="true"
                                    aria-controls="collapseOne"
                                >
                                    Learn Blockchain
                                </button>
                            </h2>
                        </div>

                        <div
                            id="collapseOne"
                            className="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordionExample"
                        >
                            <div className="card-body">
                                <h3>Header 3</h3>
                                <div className="row no-gutters">
                                    <div className="col-md-8">
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    learnSections.submitAVideo
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
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
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="card-body">
                                <h3>Write To Ulogs.org</h3>
                                <div className="row no-gutters">
                                    <div className="col-md-8">
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.writeToUlogs
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
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
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <div className="card-body">
                                <h3>
                                    15 Mins Session With Your Favorite Mentor
                                </h3>
                                <div className="row no-gutters">
                                    <div className="col-md-8">
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.fifteenMinuteMentor
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
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
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <div className="card-body">
                                <h3>
                                    Apply To Give A 30 Mins Symposium About Your
                                    Project On A Popular Steem Community
                                </h3>
                                <div className="row no-gutters">
                                    <div className="col-md-8">
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.thirtyMinuteSymposium
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
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
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <div className="card-body">
                                <h3>
                                    How About Extra Clout On Steem Or Outside
                                    Steem
                                </h3>
                                <div className="row no-gutters">
                                    <div className="col-md-8">
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={growSections.extraClout}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
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
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <div className="card-body">
                                <h3>
                                    Do You Need Extra Confidence To Make A
                                    Life-Changing Move?
                                </h3>
                                <div className="row no-gutters">
                                    <div className="col-md-8">
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.extraConfidence
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
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
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <div className="card-body">
                                <h3>
                                    Are You Dealing With Hard-To-Explain Ailment
                                    e.g Depression?
                                </h3>
                                <div className="row no-gutters">
                                    <div className="col-md-8">
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.hardToExplainAilment
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
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
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <div className="card-body">
                                <h3>Send Us A Letter, Gift Or Mail</h3>
                                <div className="row no-gutters">
                                    <div className="col-md-8">
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={
                                                    growSections.sendUsSomething
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
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
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <div className="card-body">
                                <h3>Inspire Us</h3>
                                <div className="row no-gutters">
                                    <div className="col-md-8">
                                        <div style={customCardStyle}>
                                            <ReactMarkdown
                                                source={growSections.inspireUs}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
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
    path: 'learn',
    component: Learn,
};
