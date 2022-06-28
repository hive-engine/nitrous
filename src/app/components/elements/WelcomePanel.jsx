import React from 'react';
import CloseButton from 'app/components/elements/CloseButton';
import { Link } from 'react-router';
import tt from 'counterpart';
import { HIVE_SIGNUP_URL, SIGNUP_URL } from 'shared/constants';

export default class WelcomePanel extends React.Component {
    constructor(props) {
        super(props);
        this.setShowBannerFalse = props.setShowBannerFalse;
    }

    render() {
        const signup = (
            <a className="button ghost fade-in--5" href={HIVE_SIGNUP_URL}>
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
                    <div className="rows">
                        <div className="large-2 medium-1 show-for-medium" />
                        <div className="text-center welcomeImage small-12 show-for-small-only">
                            <img
                                className="heroImage"
                                width="99%"
                                src={require('app/assets/images/welcome-hero.png')}
                            />
                        </div>
                        <div className="small-12 medium-6 large-5 welcomePitch">
                            <h2 className="fade-in--1 h2txt">
                                A world of free speech and ownership
                                {/*tt('navigation.intro_tagline')*/}
                            </h2>
                            <h4 className="fade-in--3">
                                Welcome to Build-it, a springboard for DIY and
                                craft making lovers. Post, learn, earn.
                            </h4>
                            <div className="flexBtn">
                                {signup} {learn}
                            </div>
                        </div>
                        <div className="text-center welcomeImage medium-4 large-3 show-for-medium">
                            <img
                                className="heroImage heroimg"
                                src={require('app/assets/images/welcome-hero.png')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
