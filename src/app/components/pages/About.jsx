import React from 'react';
import { APP_NAME, APP_URL } from 'app/client_config';
import tt from 'counterpart';

class About extends React.Component {
    render() {
        return (
            <div className="About">
                <section className="AboutMission">
                    <div className="AboutMission__heading-container">
                        <h1 className="AboutMission__heading">LasseCash</h1>
                    </div>
                    <div className="AboutMission__section">
                        <center>
                            <img src="https://cdn.steemitimages.com/DQmcaRjNqTYD1b3w3Bhvg6FZ29fJPAPoSPoR3iiiFdCQiqs/image.png" />
                        </center>
                        <p />
                        <center>
                            <img src="https://cdn.steemitimages.com/DQmZpqLbZppYvkfjczYASmbMUYroVo4Y8JsskX5454EB4Mn/image.png" />
                        </center>
                    </div>
                </section>
            </div>
        );
    }
}

module.exports = {
    path: 'about.html',
    component: About,
};
