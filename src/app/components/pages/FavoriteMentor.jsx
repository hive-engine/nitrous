import React from 'react';
import Reveal from '../elements/Reveal';

class FavoriteMentor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { show: false };
    }
    render() {
        const handleClose = () => this.setState({ show: false });
        const handleShow = () => this.setState({ show: true });

        return (
            <div>
                <Reveal
                    children={
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Buying Details</h5>
                                <hr />
                                <p className="card-text">
                                    To avail of this experience, simply send the
                                    specified MARLIANS amount to the user whose
                                    service you wish to utilise, with the memo{' '}
                                    <q> favorite mentor </q>. If you don't have
                                    the specified MARLIANS amount, you can use
                                    the button below to access the market to buy
                                    MARLIANS. If you have any questions or
                                    concerns, all Mentors are available on our
                                    Discord to help with your queries.
                                </p>
                                <hr />
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={e => handleClose()}
                                >
                                    Cancel
                                </button>
                                <a
                                    href="https://steem-engine.com/?p=market&t=MARLIANS"
                                    target="_blank"
                                >
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                    >
                                        Go To Market
                                    </button>
                                </a>
                            </div>
                        </div>
                    }
                    onHide={e => handleClose()}
                    show={this.state.show}
                />
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h3 className="display-4">
                            15 Mins Session With Your Favorite Mentor
                        </h3>
                        <p className="lead">
                            Many times, we rigamarole for years seeking that
                            'ever-missing piece of the puzzle'; sometimes a
                            simple conversation with 'a brother' can turn 'years
                            of rigmarole' into '15 mins of
                            straight-to-the-point'. Check out our growing list
                            of hand-picked mentors under various niches and
                            'book a moment'. Rest assured, each profile in our
                            catalog is a 'certified' user.
                        </p>
                    </div>
                </div>

                <div className="container cardContainer">
                    <div className="center">
                        <h3>Favorite Mentors</h3>
                        <div className="broproCards">
                            <div className="bro-card-wrapper">
                                <div className="bro-card">
                                    <a
                                        href="https://steemgigs.org/@surpassinggoogle"
                                        className="mx-auto"
                                    >
                                        <img
                                            src="https://steemitimages.com/u/surpassinggoogle/avatar"
                                            className="card-img-top rounded-circle mx-auto"
                                            alt="..."
                                            style={{ width: '9rem' }}
                                        />
                                    </a>
                                    <a href="https://steemgigs.org/@surpassinggoogle">
                                        <h3 className="card-title">
                                            surpassinggoogle
                                        </h3>
                                    </a>
                                    <p>
                                        I will provide a 30 min chat session
                                        (audio or video) about community/project
                                        development and general success.
                                    </p>
                                    <h6>Starting at 100 MARLIANS</h6>
                                    <button
                                        type="button"
                                        className="btn btn-light mx-auto"
                                        onClick={handleShow}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                            <div className="bro-card-wrapper">
                                <div className="bro-card">
                                    <a
                                        href="https://steemgigs.org/@tobias-g"
                                        className="mx-auto"
                                    >
                                        <img
                                            src="https://steemitimages.com/u/tobias-g/avatar"
                                            className="card-img-top rounded-circle mx-auto"
                                            alt="..."
                                            style={{ width: '9rem' }}
                                        />
                                    </a>
                                    <a href="https://steemgigs.org/@tobias-g">
                                        <h3 className="card-title">tobias-g</h3>
                                    </a>
                                    <p>
                                        I provide a 30 min chat session (audio)
                                        to help you design your application UI
                                        and provide you guidance surrounding
                                        developing your steem front end.
                                    </p>
                                    <h6>Starting at 500 MARLIANS</h6>
                                    <button
                                        type="button"
                                        className="btn btn-light mx-auto"
                                        onClick={handleShow}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                            <div className="bro-card-wrapper">
                                <div className="bro-card">
                                    <a
                                        href="https://steemgigs.org/@ankarlie"
                                        className="mx-auto"
                                    >
                                        <img
                                            src="https://steemitimages.com/u/ankarlie/avatar"
                                            className="card-img-top rounded-circle mx-auto"
                                            alt="..."
                                            style={{ width: '9rem' }}
                                        />
                                    </a>
                                    <a href="https://steemgigs.org/@ankarlie">
                                        <h3 className="card-title">ankarlie</h3>
                                    </a>
                                    <p>
                                        I will provide a 30 min chat session
                                        teaching you about viable crypto
                                        investments. We will cover trading,
                                        blockchain, free/paid investments, etc.
                                    </p>
                                    <h6>Starting at 100 MARLIANS</h6>
                                    <button
                                        type="button"
                                        className="btn btn-light mx-auto"
                                        onClick={handleShow}
                                    >
                                        Buy Now
                                    </button>
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
    path: 'favorite-mentor',
    component: FavoriteMentor,
};
