import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { actions as movieActions } from 'app/redux/MovieReducer';
import { TAG_LIST, DEFAULT_LANGUAGE } from 'app/client_config';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';

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
import * as CustomUtil from 'app/utils/CustomUtil';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
    },
    formControl: {
        marginRight: theme.spacing(1),
        minWidth: '90px',
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
    chip: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    button: {
        width: '100%',
    },
}));

let isMoviesLoadingTried = false;

export default function Movies(props) {
    const classes = useStyles();
    const {
        movies,
        type,
        movieType,
        locale,
        loading,
        hasNextList,
        requestMovies,
        updateMovies,
    } = props;

    const genres = tt(`genre.${type}`);

    const initState = {
        languageCode: locale,
        movieType,
        lastMovieId: 0,
        genreId: -1,
        sortBy: 'release_date',
    };

    const [values, setValues] = React.useState(initState);

    const isMoviesUndefined = typeof movies === 'undefined';

    if (isMoviesUndefined && !isMoviesLoadingTried) {
        isMoviesLoadingTried = true;
        // https://stackoverflow.com/questions/26556436/react-after-render-code#comment57775173_26559473
        setTimeout(() => requestMovies(initState));
    }

    const lastMovieId =
        isMoviesUndefined || movies.length === 0
            ? 0
            : movies[movies.length - 1].MovieId;

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    function handleChange(event) {
        const newValues = {
            ...values,
            [event.target.name]: event.target.value,
        };

        setValues(newValues);
        updateMovies(newValues);
    }

    function setGenre(e, genreId) {
        e.stopPropagation();

        const newValues = {
            ...values,
            ['genreId']: genreId,
        };

        setValues(newValues);
        updateMovies(newValues);
    }

    const handleSearch = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.root}>
                <form autoComplete="off">
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <InputLabel
                            ref={inputLabel}
                            htmlFor="outlined-genre-id"
                        >
                            Genre
                        </InputLabel>
                        <Select
                            value={values.genreId}
                            onChange={handleChange}
                            input={
                                <OutlinedInput
                                    labelWidth={labelWidth}
                                    name="genreId"
                                    id="outlined-genre-id"
                                />
                            }
                        >
                            {genres.map(genre => (
                                <MenuItem value={genre.id} key={genre.id}>
                                    {genre.id >= 0 ? (
                                        genre.name
                                    ) : (
                                        <em>{genre.name}</em>
                                    )}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <InputLabel ref={inputLabel} htmlFor="outlined-sort-by">
                            Sort by
                        </InputLabel>
                        <Select
                            value={values.sortBy}
                            onChange={handleChange}
                            input={
                                <OutlinedInput
                                    labelWidth={labelWidth}
                                    name="sortBy"
                                    id="outlined-sort-by"
                                />
                            }
                        >
                            <MenuItem value={'release_date'}>
                                Release Date
                            </MenuItem>
                            <MenuItem value={'created'}>
                                Review Created
                            </MenuItem>
                        </Select>
                    </FormControl>
                    {/* <TextField
                        id="search-title"
                        name="title"
                        label="Search Title"
                        className={classes.formControl}
                        onChange={handleSearch('title')}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    /> */}
                </form>
                {isMoviesUndefined ? (
                    <LoadingIndicator
                        style={{ marginBottom: '2rem' }}
                        type="circle"
                    />
                ) : movies.length > 0 ? (
                    <main style={{ width: '100%' }}>
                        <Grid
                            container
                            spacing={4}
                            className={classes.cardGrid}
                        >
                            {movies.map(movie => (
                                <Grid
                                    item
                                    key={movie.MovieId}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                >
                                    <CardActionArea
                                        component={Link}
                                        to={`/${type}/${movie.MovieId}`}
                                    >
                                        <Card className={classes.card}>
                                            {movie.PosterPath && (
                                                <CardMedia
                                                    className={
                                                        classes.cardMedia
                                                    }
                                                    image={CustomUtil.getMoviePosterUrl(
                                                        movie.PosterPath
                                                    )}
                                                />
                                            )}
                                            <CardContent
                                                className={classes.cardContent}
                                            >
                                                <Typography
                                                    gutterBottom
                                                    variant="h5"
                                                    component="h2"
                                                >
                                                    {movie.Title}
                                                </Typography>
                                                <Typography
                                                    className={classes.cardDate}
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    {CustomUtil.convertUnixTimestampToDate(
                                                        movie.ReleaseDate
                                                    )}
                                                </Typography>
                                                <Typography>
                                                    {CustomUtil.getSummary(
                                                        movie.Overview
                                                    )}
                                                </Typography>
                                                <div>
                                                    {movie.Genres &&
                                                        CustomUtil.getDistinctGenres(
                                                            JSON.parse(
                                                                movie.Genres
                                                            )
                                                        ).map(genre => (
                                                            <Chip
                                                                key={genre.Id}
                                                                size="small"
                                                                label={
                                                                    genre.Name
                                                                }
                                                                className={
                                                                    classes.chip
                                                                }
                                                                // onClick={e =>
                                                                //     setGenre(
                                                                //         e,
                                                                //         genre.Id
                                                                //     )
                                                                // }
                                                            />
                                                        ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CardActionArea>
                                </Grid>
                            ))}
                        </Grid>
                        <center>
                            {hasNextList ? (
                                loading ? (
                                    <LoadingIndicator
                                        style={{ marginBottom: '2rem' }}
                                        type="circle"
                                    />
                                ) : (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        className={classes.button}
                                        onClick={() => {
                                            requestMovies({
                                                languageCode: locale,
                                                movieType,
                                                genreId: values.genreId,
                                                lastMovieId,
                                                sortBy: values.sortBy,
                                            });
                                        }}
                                    >
                                        LOAD MORE MOVIES
                                    </Button>
                                )
                            ) : null}
                        </center>
                    </main>
                ) : (
                    <main style={{ width: '100%', marginTop: '20px' }}>
                        <h4>No result was found in these options.</h4>
                    </main>
                )}
            </Container>
        </React.Fragment>
    );
}

module.exports = {
    path: ':type',
    component: connect(
        (state, ownProps) => {
            let type = state.app.get('location').pathname.substring(1);
            if (type !== 'movie' && type !== 'tv') {
                type = 'movie';
            }

            const movieType = type === 'movie' ? 1 : 2;

            let movies = state.movie.get(
                CustomUtil.getMovieListName(movieType)
            );

            if (movies) {
                movies = movies.toJS();
            }

            return {
                type,
                movieType,
                movies,
                hasNextList:
                    state.movie.get(
                        CustomUtil.getNextListConditionName(movieType)
                    ) || false,
                loading: state.movie.get('loading') || false,
                status: state.global.get('status'),
                accounts: state.global.get('accounts'),
                username:
                    state.user.getIn(['current', 'username']) ||
                    state.offchain.get('account'),
                blogmode: state.app.getIn(['user_preferences', 'blogmode']),
                maybeLoggedIn: state.user.get('maybeLoggedIn'),
                isBrowser: process.env.BROWSER,
                gptEnabled: state.app.getIn(['googleAds', 'gptEnabled']),
                locale:
                    state.app.getIn(['user_preferences', 'locale']) ||
                    DEFAULT_LANGUAGE,
            };
        },
        dispatch => ({
            requestMovies: args => dispatch(movieActions.requestMovies(args)),
            updateMovies: args => dispatch(movieActions.updateMovies(args)),
        })
    )(Movies),
};

Movies.propTypes = {
    accounts: PropTypes.object,
    status: PropTypes.object,
    routeParams: PropTypes.object,
    requestMovies: PropTypes.func.isRequired,
    updateMovies: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    username: PropTypes.string,
    blogmode: PropTypes.bool,
    type: PropTypes.string.isRequired,
    movieType: PropTypes.number.isRequired,
    locale: PropTypes.string.isRequired,
    movies: PropTypes.array,
    hasNextList: PropTypes.bool.isRequired,
};
