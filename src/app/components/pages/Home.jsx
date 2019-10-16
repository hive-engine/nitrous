import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import tt from 'counterpart';

import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import RecentMovies from 'app/components/elements/Summary/RecentMovies';
import RecentReviews from 'app/components/elements/Summary/RecentReviews';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import TvIcon from '@material-ui/icons/Tv';
import RateReviewIcon from '@material-ui/icons/RateReview';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    thumbnail: {
        width: '19px',
        maxHeight: '28px',
        marginRight: '5px',
    },
    link: {
        color: 'red',
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardGrid: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    cardDetails: {
        flex: 1,
    },
    cardDate: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    avatar: {
        margin: theme.spacing(0, 1),
        width: 25,
        height: 25,
    },
}));

export default function Home(props) {
    const classes = useStyles();
    const { locale, summary } = props;

    React.useEffect(() => {}, []);

    const topReviews = [
        {
            Author: 'trueimagine',
            Permlink: 'movie-and-sound-new-world',
            Title: '[Movie & Sound] New World / 신세계',
            CoverImgUrl:
                'https://cdn.steemitimages.com/DQmcMSrFqt6hxYjQ1ZkWxXuvJfiXVZ3tDffbLtR9117UDud/%EC%8B%A020.jpg',
            AddDate: '/Date(1571225601000)/',
        },
        {
            Author: 'keydon',
            Permlink: '2cabrl',
            Title: '살인의 추억 - 현실은 영화보다 더 잔혹하다.',
            CoverImgUrl: 'https://img.youtube.com/vi/uxh9_mrhehw/0.jpg',
            AddDate: '/Date(1571222634000)/',
        },
        {
            Author: 'ria-ppy',
            Permlink: 'svaha-the-sixth-finger-2019',
            Title: '[영화] 사바하 (SVAHA : THE SIXTH FINGER, 2019)',
            CoverImgUrl:
                'https://cdn.steemitimages.com/DQmdWNs77zsW4BMJxMnd2Nu68V5xqcXCqf9QX9MaJw5mfDd/movie_image.jpg',
            AddDate: '/Date(1571219916000)/',
        },
        {
            Author: 'hodolbak-aaa',
            Permlink: 'boxoffice-027-7000-aaa',
            Title:
                '[역대BoxOffice] 관객수를 맞춰라! - #027 (누적당첨금 7000 AAA)',
            CoverImgUrl:
                'https://cdn.steemitimages.com/DQmb76hEP4kQFsjp5HK6NKnQuPqhTbT4Ke6KuoG5XaNAxYH/image.png',
            AddDate: '/Date(1571219298000)/',
        },
    ];

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.root}>
                <h3>
                    <ThumbUpIcon /> {tt('review.summary.featured_reviews')}
                </h3>
                <Grid container spacing={4} className={classes.cardGrid}>
                    {topReviews.map(e => (
                        <Grid
                            item
                            key={e.Author + e.Permlink}
                            xs={6}
                            sm={4}
                            md={3}
                        >
                            <CardActionArea
                                component={Link}
                                to={`/@${e.Author}/${e.Permlink}`}
                            >
                                <Card className={classes.card}>
                                    {e.CoverImgUrl && (
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image={e.CoverImgUrl}
                                        />
                                    )}
                                    <CardContent
                                        className={classes.cardContent}
                                    >
                                        <h5>{e.Title}</h5>
                                        <Typography
                                            className={classes.cardDate}
                                            variant="subtitle1"
                                            color="textSecondary"
                                        >
                                            <Grid container alignItems="center">
                                                <TimeAgoWrapper
                                                    date={e.AddDate}
                                                />
                                                <Avatar
                                                    alt={e.Author}
                                                    src={`https://steemitimages.com/u/${
                                                        e.Author
                                                    }/avatar`}
                                                    className={classes.avatar}
                                                />
                                                @{e.Author}
                                            </Grid>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </CardActionArea>
                        </Grid>
                    ))}
                </Grid>
                <br />
                <h3>
                    <MovieFilterIcon /> {tt('review.summary.recent_movies')}
                </h3>
                <RecentMovies
                    type={1}
                    list={summary.RecentMovies}
                    classes={classes}
                />
                <br />
                <h3>
                    <TvIcon /> {tt('review.summary.recent_tvs')}
                </h3>
                <RecentMovies
                    type={2}
                    list={summary.RecentMovies}
                    classes={classes}
                />
                <br />
                <h3>
                    <RateReviewIcon />{' '}
                    {tt('review.summary.recent_movie_reviews')}
                </h3>
                <RecentReviews
                    type={1}
                    list={summary.RecentReviews}
                    classes={classes}
                />
                <br />
                <h3>
                    <RateReviewIcon /> {tt('review.summary.recent_tv_reviews')}
                </h3>
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
