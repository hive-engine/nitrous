import React from 'react';
import CloseButton from 'app/components/elements/CloseButton';
import { Link } from 'react-router';
import tt from 'counterpart';
import { SIGNUP_URL } from 'shared/constants';

export default class WelcomePanel extends React.Component {
    constructor(props) {
        super(props);
        this.setShowBannerFalse = props.setShowBannerFalse;
    }

    render() {
        const signup = (
            <a className="button ghost fade-in--5" href={SIGNUP_URL}>
                {tt('navigation.sign_up')}
            </a>
        );

        const learn = (
            <Link href="/faq.html" className="button ghost fade-in--7">
                {tt('navigation.learn_more')}
            </Link>
        );

        return (
            <div className="welcomeWrapper">
                <div className="welcomeBanner">
                    <CloseButton onClick={this.setShowBannerFalse} />
                    <div className="row">
                        <div className="large-2 medium-1 show-for-medium" />
                        <div className="small-12 medium-6 large-5 welcomePitch">
                            <h2 className="fade-in--1">
                                Get Paid to live in San Diego
                            </h2>
                            <h4 className="fade-in--2">
                                Post and Upvote Articles about San Diego to get
                                your share of the daily rewards pool.
                            </h4>
                            <h4 className="fade-in--3">
                                Buy and sell SAND for EOS, NFTs and Ads that
                                appear on the App. Advertising and investors
                                fund the SAND EOS alcor.exchange liquidity pool.
                                The more locals use our app, the more SAND can
                                be worth. Visit{' '}
                                <a href="https://discord.sandiegocoin.org">
                                    SanDiegoCoin Discord
                                </a>{' '}
                                for a 24/7 local community.
                            </h4>
                        </div>
                        <div className="text-center welcomeImage medium-4 large-3 show-for-medium">
                            <img
                                className="heroImage"
                                src={require('app/assets/images/welcome-hero.png')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
