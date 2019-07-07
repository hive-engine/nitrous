import React from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import axios from 'axios';

const renderData = data => {
    return (
        <div className="callout">
            <h5>{tt('review.other_reviews_for_same_movie')}</h5>
            <ul>
                {data.map((e, index) => (
                    <li key={index}>
                        <a href={e.Url}>{e.Title}</a> -{' '}
                        <a
                            href={'/@' + e.Author}
                            style={{ fontStyle: 'italic' }}
                        >
                            @{e.Author}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

class OtherReviewsOfSameMovie extends React.Component {
    static propTypes = {
        content_body: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        permlink: PropTypes.string.isRequired,
    };

    async getData() {
        try {
            const matches = this.props.content_body.match(
                /https:\/\/www\.themoviedb\.org\/(?:movie|tv)\/[a-zA-Z0-9-]+/g
            );

            if (matches === null) return null;

            const movieUrl = matches[matches.length - 1];

            const response = await axios.get(
                `https://tool.steem.world/AAA/GetSameMovieReviews?author=${
                    this.props.author
                }&permlink=${this.props.permlink}&movieUrl=${movieUrl}`
            );

            if (response.data !== null && response.data.length === 0) {
                return null;
            }

            return response.data;
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
        return this.state.data ? renderData(this.state.data) : null;
    }
}

export default OtherReviewsOfSameMovie;
