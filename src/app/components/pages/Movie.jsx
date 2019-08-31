import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import { TAG_LIST } from 'app/client_config';
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
        // height: '100%',
        display: 'flex',
        // flexDirection: 'column',
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
    const { movie, type, id } = props;

    //const movieDetails = JSON.parse(movie.Result);

    const [values, setValues] = React.useState({});

    function handleChange(event) {
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    }

    const handleSearch = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <main className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <img src={movie.PosterPath} width="100%" />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <h3>
                                <b>{movie.Title}</b>
                            </h3>
                            <Typography
                                className={classes.cardDate}
                                variant="subtitle1"
                                color="textSecondary"
                            >
                                {CustomUtil.convertUnixTimestampToDate(
                                    movie.ReleaseDate
                                )}
                            </Typography>
                            {movie.Overview}
                            {/* <p>
                                Runtime:{' '}
                                {CustomUtil.getRuntimeString(
                                    movieDetails.Runtime
                                )}
                            </p> */}
                            {/* <div>
                                {movieDetails.Genres &&
                                    movieDetails.Genres.map(genre => (
                                        <Chip
                                            key={genre.Id}
                                            size="small"
                                            label={genre.Name}
                                            className={classes.chip}
                                        />
                                    ))}
                            </div> */}
                        </Grid>
                    </Grid>
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
                                        component="a"
                                        href={`/@${post.Author}/${
                                            post.Permlink
                                        }`}
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
                                            <Hidden xsDown>
                                                <CardMedia
                                                    className={
                                                        classes.cardMedia
                                                    }
                                                    image={post.CoverImgUrl}
                                                />
                                            </Hidden>
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
            const id = parseInt(ownProps.params.id);
            const movie = state.movie
                .get('movies')
                .toJS()
                .find(o => o.MovieId === id);

            return {
                id,
                movie,
                status: state.global.get('status'),
                loading: state.app.get('loading'),
                accounts: state.global.get('accounts'),
                username:
                    state.user.getIn(['current', 'username']) ||
                    state.offchain.get('account'),
                blogmode: state.app.getIn(['user_preferences', 'blogmode']),
                type: ownProps.params.type,
                categories: TAG_LIST,
                maybeLoggedIn: state.user.get('maybeLoggedIn'),
                isBrowser: process.env.BROWSER,
                gptEnabled: state.app.getIn(['googleAds', 'gptEnabled']),
            };
        },
        dispatch => {
            return {
                requestData: args =>
                    dispatch(fetchDataSagaActions.requestData(args)),
            };
        }
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
    type: PropTypes.string,
    id: PropTypes.number,
    categories: PropTypes.object,
    movie: PropTypes.object.isRequired,
};
