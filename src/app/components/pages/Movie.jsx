import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { actions as movieActions } from 'app/redux/MovieReducer';
import { TAG_LIST, DEFAULT_LANGUAGE } from 'app/client_config';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import * as CustomUtil from 'app/utils/CustomUtil';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

import TextField from '@material-ui/core/TextField';

import Chip from '@material-ui/core/Chip';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: theme.spacing(3),
    },
    formControl: {
        marginRight: theme.spacing(1),
    },
    card: {
        display: 'flex',
    },
    cardCast: {
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
        width: 160,
    },
    cardCastMedia: {
        paddingTop: '90%',
    },
    cardContent: {
        flexGrow: 1,
    },
    avatar: {
        margin: theme.spacing(0, 1),
        width: 25,
        height: 25,
    },
    ratingBox: {
        margin: 0,
    },
    chip: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));

export default function Movie(props) {
    const classes = useStyles();
    const { movie, type, movieType, id, locale, loading, requestMovie } = props;

    const movieDetails = movie.Result ? JSON.parse(movie.Result) : null;
    const crews = CustomUtil.getMovieTopCrews(movieDetails);
    const casts = CustomUtil.getMovieTopCasts(movieDetails);

    if (movieDetails === null && !loading) {
        requestMovie({
            languageCode: locale,
            movieType,
            movieId: id,
        });
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <main className={classes.root}>
                    <div
                        id="movie-detail-frame"
                        style={{
                            backgroundImage: `url(${CustomUtil.getMovieBackdropUrl(
                                movie.BackdropPath
                            )})`,
                        }}
                    >
                        <div className="gradient-bg">
                            <Grid container spacing={3}>
                                {movie.PosterPath && (
                                    <Grid item xs={12} sm={4}>
                                        <img
                                            src={CustomUtil.getMoviePosterUrl(
                                                movie.PosterPath
                                            )}
                                            width="100%"
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12} sm={8}>
                                    <h2 className="movie-title">
                                        {movie.Title}
                                    </h2>
                                    <Typography
                                        className={`${
                                            classes.cardDate
                                        } light-color`}
                                        variant="subtitle1"
                                        color="textSecondary"
                                    >
                                        {CustomUtil.convertUnixTimestampToDate(
                                            movie.ReleaseDate
                                        )}
                                    </Typography>
                                    {movie.Overview}
                                    {movieType === 1 && (
                                        <Typography
                                            className={`${
                                                classes.cardDate
                                            } light-color`}
                                            variant="subtitle1"
                                            color="textSecondary"
                                        >
                                            Runtime:{' '}
                                            {CustomUtil.getRuntimeString(
                                                movieDetails !== null
                                                    ? movieDetails.Runtime
                                                    : null,
                                                locale
                                            )}
                                        </Typography>
                                    )}
                                    <div>
                                        {movie.Genres &&
                                            CustomUtil.getDistinctGenres(
                                                JSON.parse(movie.Genres)
                                            ).map(genre => (
                                                <Chip
                                                    key={genre.Id}
                                                    size="small"
                                                    label={genre.Name}
                                                    className={classes.chip}
                                                />
                                            ))}
                                    </div>
                                    <h4 style={{ marginTop: '50px' }}>
                                        Featured Crew (주요 제작진)
                                    </h4>
                                    <Grid
                                        container
                                        // direction="row"
                                        // justify="flex-start"
                                        // alignItems="flex-start"
                                        spacing={2}
                                    >
                                        {crews &&
                                            crews.map(crew => (
                                                <Grid
                                                    item
                                                    key={crew.CreditId}
                                                    xs={6}
                                                    sm={4}
                                                    md={3}
                                                >
                                                    <b>{crew.Name}</b>
                                                    <br />
                                                    {crew.Job}
                                                </Grid>
                                            ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <h4 style={{ marginTop: '50px' }}>
                        {movieType === 1
                            ? 'Top Billed Cast (주요 출연진)'
                            : 'Series Cast (시리즈 출연진)'}
                    </h4>
                    <Grid container spacing={2} className={classes.cardGrid}>
                        {casts.map(cast => (
                            <Grid item key={cast.CreditId} xs={4} sm={3} md={2}>
                                <Card className={classes.cardCast}>
                                    {cast.ProfilePath && (
                                        <CardMedia
                                            className={classes.cardCastMedia}
                                            image={CustomUtil.getMovieProfileImageUrl(
                                                cast.ProfilePath
                                            )}
                                        />
                                    )}
                                    <CardContent
                                        className={classes.cardContent}
                                    >
                                        <b>{cast.Name}</b>
                                        <br />
                                        {cast.Character || '-'}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <h4 style={{ marginTop: '50px' }}>Reviews</h4>
                    {movie.Posts != null ? (
                        <Grid
                            container
                            spacing={4}
                            className={classes.cardGrid}
                        >
                            {movie.Posts.map(post => (
                                <Grid
                                    item
                                    key={`${post.Author}/${post.Permlink}`}
                                    xs={12}
                                    md={6}
                                >
                                    <CardActionArea
                                        component={Link}
                                        to={`/@${post.Author}/${post.Permlink}`}
                                    >
                                        <Card className={classes.card}>
                                            <div
                                                className={classes.cardDetails}
                                            >
                                                <CardContent>
                                                    <Typography
                                                        component="h2"
                                                        variant="h5"
                                                    >
                                                        {post.Title}
                                                    </Typography>
                                                    <Typography
                                                        className={
                                                            classes.cardDate
                                                        }
                                                        variant="subtitle1"
                                                        color="textSecondary"
                                                    >
                                                        <Grid
                                                            container
                                                            alignItems="center"
                                                        >
                                                            <TimeAgoWrapper
                                                                date={
                                                                    post.AddDate
                                                                }
                                                            />
                                                            <Avatar
                                                                alt={
                                                                    post.Author
                                                                }
                                                                src={`https://steemitimages.com/u/${
                                                                    post.Author
                                                                }/avatar`}
                                                                className={
                                                                    classes.avatar
                                                                }
                                                            />
                                                            @{post.Author}
                                                        </Grid>
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle1"
                                                        paragraph
                                                    >
                                                        {CustomUtil.getSummary(
                                                            post.Summary
                                                        )}
                                                    </Typography>
                                                    <Box
                                                        component="fieldset"
                                                        mb={3}
                                                        borderColor="transparent"
                                                        className={
                                                            classes.ratingBox
                                                        }
                                                    >
                                                        <Rating
                                                            value={post.Rating}
                                                            max={3}
                                                            readOnly
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </div>
                                            {post.CoverImgUrl && (
                                                <Hidden xsDown>
                                                    <CardMedia
                                                        className={
                                                            classes.cardMedia
                                                        }
                                                        image={post.CoverImgUrl}
                                                    />
                                                </Hidden>
                                            )}
                                        </Card>
                                    </CardActionArea>
                                </Grid>
                            ))}
                        </Grid>
                    ) : null}
                </main>
            </Container>
        </React.Fragment>
    );
}

module.exports = {
    path: ':type/:id',
    component: connect(
        (state, ownProps) => {
            const type = CustomUtil.getMovieTypeName(state);
            const movieType = type === 'movie' ? 1 : 2;
            const id = parseInt(ownProps.params.id);
            const movie = state.movie
                .get(CustomUtil.getMovieListName(movieType))
                .toJS()
                .find(o => o.MovieId === id);

            return {
                type,
                movieType,
                id,
                movie,
                loading: state.movie.get('loading'),
                status: state.global.get('status'),
                accounts: state.global.get('accounts'),
                username:
                    state.user.getIn(['current', 'username']) ||
                    state.offchain.get('account'),
                locale:
                    state.app.getIn(['user_preferences', 'locale']) ||
                    DEFAULT_LANGUAGE,
                blogmode: state.app.getIn(['user_preferences', 'blogmode']),
                categories: TAG_LIST,
                maybeLoggedIn: state.user.get('maybeLoggedIn'),
                isBrowser: process.env.BROWSER,
                gptEnabled: state.app.getIn(['googleAds', 'gptEnabled']),
            };
        },
        dispatch => ({
            requestMovie: args => dispatch(movieActions.requestMovie(args)),
        })
    )(Movie),
};

Movie.propTypes = {
    discussions: PropTypes.object,
    accounts: PropTypes.object,
    status: PropTypes.object,
    routeParams: PropTypes.object,
    requestData: PropTypes.func,
    loading: PropTypes.bool,
    username: PropTypes.string,
    blogmode: PropTypes.bool,
    categories: PropTypes.object,
    type: PropTypes.string.isRequired,
    movieType: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    movie: PropTypes.object.isRequired,
};
