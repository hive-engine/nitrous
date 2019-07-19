import React from 'react';
import tt from 'counterpart';
import axios from 'axios';

if (!Date.prototype.toISOString) {
    (function() {
        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }

        Date.prototype.toISOString = function() {
            return (
                this.getUTCFullYear() +
                '-' +
                pad(this.getUTCMonth() + 1) +
                '-' +
                pad(this.getUTCDate()) +
                'T' +
                pad(this.getUTCHours()) +
                ':' +
                pad(this.getUTCMinutes()) +
                ':' +
                pad(this.getUTCSeconds()) +
                '.' +
                (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                'Z'
            );
        };
    })();
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

function getRankDiff(rankDiff) {
    if (rankDiff === 999) {
        return <span className="rank-new">new</span>;
    } else if (rankDiff > 0) {
        return <span className="rank-up">↑ {rankDiff}</span>;
    } else if (rankDiff < 0) {
        return <span className="rank-down">↓ {-rankDiff}</span>;
    } else {
        return <span className="rank-same">—</span>;
    }
}

function getRankingItem(data) {
    return (
        <li className="c-sidebar__list-item" key={data.Rank}>
            {data.Rank}.{' '}
            <a className="c-sidebar__link" href={`/@${data.Username}`}>
                @{data.Username}
            </a>{' '}
            {getRankDiff(data.RankDiff)}
        </li>
    );
}

const SidebarDonationsRender = data => {
    const dailyTopDonorsFiltered = data.Data.filter(e => {
        return e.Type === 'daily_top_donor';
    });

    let dailyTopDonors;

    if (dailyTopDonorsFiltered) {
        dailyTopDonors = (
            <ul className="c-sidebar__list">
                {dailyTopDonorsFiltered.map(e => getRankingItem(e))}
            </ul>
        );
    } else {
        dailyTopDonors = <div>{tt('donation_ranking.no_data')}</div>;
    }

    const dailyTopDoneesFiltered = data.Data.filter(e => {
        return e.Type === 'daily_top_donee';
    });

    let dailyTopDonees;

    if (dailyTopDoneesFiltered) {
        dailyTopDonees = (
            <ul className="c-sidebar__list">
                {dailyTopDoneesFiltered.map(e => getRankingItem(e))}
            </ul>
        );
    } else {
        dailyTopDonees = <div>{tt('donation_ranking.no_data')}</div>;
    }

    return (
        <div className="c-sidebar__module">
            <div className="c-sidebar__header">
                <h3 className="c-sidebar__h3">
                    {tt('donation_ranking.daily_top_donors_title')}
                </h3>
            </div>
            <div className="c-sidebar__content">{dailyTopDonors}</div>
            <br />
            <div className="c-sidebar__header">
                <h3 className="c-sidebar__h3">
                    {tt('donation_ranking.daily_top_donees_title')}
                </h3>
            </div>
            <div className="c-sidebar__content">{dailyTopDonees}</div>
            <br />
            <div className="note">
                * {tt('donation_ranking.note_for_date', { date: data.Date })}
            </div>
        </div>
    );
};

class SidebarDonations extends React.Component {
    async getData() {
        try {
            let sidebarDonations = localStorage.getItem('SidebarDonationsV3');

            if (
                sidebarDonations &&
                JSON.parse(sidebarDonations).Date ===
                    new Date()
                        .addDays(-1)
                        .toISOString()
                        .substr(0, 10)
            ) {
                return JSON.parse(sidebarDonations);
            }

            const response = await axios.get(
                'https://tool.steem.world/AAA/GetDonationRankings'
            );

            sidebarDonations = await response.data;

            if (!sidebarDonations) {
                return null;
            }

            localStorage.setItem(
                'SidebarDonationsV3',
                JSON.stringify(sidebarDonations)
            );

            return sidebarDonations;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    constructor(props) {
        super(props);
        this.state = { data: null };
    }

    componentDidMount() {
        if (!this.state.data) {
            (async () => {
                try {
                    this.setState({ data: await this.getData() });
                } catch (e) {
                    console.log(e);
                }
            })();
        }
    }

    render() {
        return this.state.data ? SidebarDonationsRender(this.state.data) : null;
    }
}

export default SidebarDonations;
