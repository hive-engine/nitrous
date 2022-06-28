import React, { Component } from 'react';
import tt from 'counterpart';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';

class Livefeed extends Component {
    state = {
        data: {},
        newt: false,
        buidlprice: '',
    };

    componentDidMount() {
        fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false'
        )
            .then(response => response.json())
            .then(data => {
                const newupdate = data.filter(
                    item =>
                        item.name === 'Bitcoin' || item.symbol === 'btc'
                            ? item
                            : item.name === 'Hive' || item.symbol === 'hive'
                );
                this.setState({
                    data: [
                        newupdate[0].current_price.toLocaleString('en-US'),
                        newupdate[1].current_price.toLocaleString('en-US'),
                    ],
                });
            });

        axios
            .request({
                method: 'POST',
                url: 'https://ha.herpc.dtools.dev/contracts',
                headers: { 'Content-Type': 'application/json' },
                data: {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'findOne',
                    params: {
                        contract: 'market',
                        table: 'metrics',
                        query: { symbol: 'BUIDL' },
                        offset: 0,
                        limit: 1000,
                    },
                },
            })
            .then(response => {
                let buidlToken = response.data.result.lastPrice.toLocaleString(
                    'en-US'
                );
                this.setState({
                    buidlprice: buidlToken,
                });
            })
            .catch(function(error) {
                console.error(error);
            });
    }
    render() {
        const data = this.state.data;
        const btc = data[0];
        const hive = data[1];
        const buidl = this.state.buidlprice;
        return (
            <div>
                <div className="c-sidebar__module">
                    <h5 style={{ color: '#4fa5fc' }}>
                        <b>Live Price Feed</b>
                    </h5>
                    <br />
                    <h5>
                        {' '}
                        <b>{btc} USD</b>
                    </h5>
                    <p>
                        Bitcoin Market Value by{' '}
                        <a href="https://www.coingecko.com/en/coins/bitcoin">
                            @Coingecko
                        </a>
                    </p>
                    <hr />
                    <h5>
                        <b>{hive} USD</b>
                    </h5>
                    <p>
                        Hive Market Value by{' '}
                        <a href="https://www.coingecko.com/en/coins/hive">
                            @Coingecko
                        </a>
                    </p>
                    <hr />
                    <h5>
                        {' '}
                        <b>{buidl} USD</b>
                    </h5>
                    <p>
                        Buldl Market Value by{' '}
                        <a href="https://hive-engine.com/trade/BUIDL">
                            @Hive-Engine
                        </a>
                    </p>
                </div>
            </div>
        );
    }
}

class Announce extends Component {
    state = {
        post: {},
    };
    mediumURL = 'https://v1.nocodeapi.com/buildit/medium/cJLUarxUvmmUhdyT';

    componentDidMount() {
        axios
            .get(this.mediumURL)

            .then(data => {
                // console.log(data.data)
                const res = data.data; //This is an array with the content. No feed, no info about author etc..
                const fdata = res.slice(0, 5);
                this.setState({
                    post: fdata,
                });
            })
            .catch(e => {
                this.setState({ error: e.toJSON() });
                console.log(e);
            });
    }
    render() {
        return (
            this.state.post.length >= 1 && (
                <div>
                    <div className="c-sidebar__module">
                        <h5>
                            <b>Announcements</b>
                        </h5>
                        <br />
                        <p>
                            {this.state.post.length >= 1 &&
                                this.state.post.map(item => (
                                    <div
                                        key={item.link}
                                        className="articles__h2 entry-title announce"
                                    >
                                        <a href={item.link} target="_blank">
                                            {item.title}
                                        </a>
                                        <h6
                                            style={{
                                                color: '#788187',
                                                fontSize: '14px',
                                            }}
                                        >
                                            By {item.author} .{' '}
                                            {moment(moment(item.created).format("YYYY-MM-DD")).fromNow()}{' '}
                                        </h6>{' '}
                                        <br />
                                    </div>
                                ))}
                        </p>
                    </div>
                </div>
            )
        );
    }
}

const BuiditExplore = () => {
    return (
     <div className="c-sidebar__module">
       <h5>
         <b>Explore Build-it ?</b>
       </h5>
        <br />
        <p className='articles__h2 entry-title announce'>
           <Link to="/faq.html">
            Frequently Asked Questions
           </Link></p>
     </div>
    );
}

const SidebarToken = ({
    scotToken,
    scotTokenCirculating,
    scotTokenBurn,
    scotTokenStaking,
    useHive,
}) => {
    if (scotTokenCirculating && typeof scotTokenCirculating === 'string') {
        scotTokenCirculating = parsePayoutAmount(scotTokenCirculating);
    }

    if (scotTokenBurn && typeof scotTokenBurn === 'string') {
        scotTokenBurn = parsePayoutAmount(scotTokenBurn);
    }

    if (scotTokenStaking && typeof scotTokenStaking === 'string') {
        scotTokenStaking = parsePayoutAmount(scotTokenStaking);
    }

    const total = formatDecimal(scotTokenCirculating + scotTokenBurn);
    const circulating = formatDecimal(scotTokenCirculating);
    const circulatingRate = formatDecimal(
        scotTokenCirculating / (scotTokenCirculating + scotTokenBurn) * 100
    );
    const burn = formatDecimal(scotTokenBurn);
    const burnRate = formatDecimal(
        scotTokenBurn / (scotTokenCirculating + scotTokenBurn) * 100
    );
    const staking = formatDecimal(scotTokenStaking);
    const stakingRate = formatDecimal(
        scotTokenStaking / scotTokenCirculating * 100
    );

    return (
        <div>
            <Livefeed />
            <Announce />
            <BuiditExplore />
        </div>
    );
};

export default SidebarToken;
