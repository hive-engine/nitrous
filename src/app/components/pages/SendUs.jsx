import React from 'react';
import Reveal from '../elements/Reveal';

class SendUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = { show: false };
    }
    render() {
        const handleClose = () => this.setState({ show: false });
        const handleShow = () => this.setState({ show: true });

        return (
            <div>
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h3 className="display-4">
                            Send Us A Letter, Gift Or Mail
                        </h3>
                        <p className="lead">
                            <strong>You may want to send us something.</strong>{' '}
                            <em>We will give your our mailing address</em>.{' '}
                            <strong>
                                We want to receive, for 'receiving is an art'.
                            </strong>
                        </p>
                    </div>
                </div>

                <div className="container growContainer">
                    <div className="ant-collapse">
                        <div className="ant-collapse-item ant-collapse-item-active">
                            <div
                                className="ant-collapse-header"
                                id="headingOne"
                            >
                                Ways to reach us
                            </div>

                            <div className="ant-collapse-content ant-collapse-content-active">
                                <div className="ant-collapse-content-box">
                                    <p>
                                        <strong>
                                            Send mail, parcel or letter to:
                                        </strong>{' '}
                                        Block 6 Lot 36 Yakal Str Villa Carolina
                                        2, Tunasan, Muntinlupa City, Metro
                                        Manila, Philippines (Zip/Postal Code:
                                        1773)
                                    </p>
                                    <p>
                                        <strong>Send email to:</strong>{' '}
                                        comsilbronze4@gmail.com
                                    </p>
                                    <p>
                                        <strong>
                                            Send steem donations to:
                                        </strong>{' '}
                                        @marlians
                                    </p>
                                    <p>
                                        <strong>Send FIAT donations to:</strong>{' '}
                                        comsilbronze4@gmail.com
                                    </p>
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
    path: 'send-us',
    component: SendUs,
};
