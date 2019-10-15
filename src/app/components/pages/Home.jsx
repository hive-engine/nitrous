import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';

import RecentMovies from 'app/components/elements/Summary/RecentMovies';
import RecentReviews from 'app/components/elements/Summary/RecentReviews';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    thumbnail: {
        width: '19px',
        maxHeight: '28px',
        marginRight: '5px',
    },
});

export default function Home(props) {
    const classes = useStyles();
    const { locale, summary } = props;

    React.useEffect(() => {}, []);

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.root}>
                <h3>{tt('review.summary.recent_movies')}</h3>
                <RecentMovies
                    type={1}
                    list={summary.RecentMovies}
                    classes={classes}
                />

                <h3>{tt('review.summary.recent_tvs')}</h3>
                <RecentMovies
                    type={2}
                    list={summary.RecentMovies}
                    classes={classes}
                />

                <h3>{tt('review.summary.recent_movie_reviews')}</h3>
                <RecentReviews
                    type={1}
                    list={summary.RecentReviews}
                    classes={classes}
                />

                <h3>{tt('review.summary.recent_tv_reviews')}</h3>
                <RecentReviews
                    type={2}
                    list={summary.RecentReviews}
                    classes={classes}
                />
            </Container>
        </React.Fragment>
    );
}

module.exports = {
    path: 'home',
    component: connect(
        (state, ownProps) => {
            const summary = state.movie.get('summary').toJS();

            return {
                summary,
                locale:
                    state.app.getIn(['user_preferences', 'locale']) ||
                    DEFAULT_LANGUAGE,
            };
        },
        dispatch => ({})
    )(Home),
};

Home.propTypes = {
    locale: PropTypes.string.isRequired,
    summary: PropTypes.object,
};
