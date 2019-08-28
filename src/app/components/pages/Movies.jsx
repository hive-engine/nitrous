import React from 'react';
import PropTypes from 'prop-types';
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
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
    },
    formControl: {
        marginRight: theme.spacing(1),
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

export default function Movies(props) {
    const classes = useStyles();
    const {
        movies,
        type,
        locale,
        loading,
        requestMovies,
        updateMovies,
    } = props;

    const movieType = type === 'movie' ? 1 : 2;
    const lastMovieId =
        movies.length === 0 ? 0 : movies[movies.length - 1].MovieId;

    const [values, setValues, expanded, setExpanded] = React.useState({
        genreId: -1,
        sortBy: 'release_date',
    });

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    function handleChange(event) {
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));

        updateMovies({
            languageCode: locale,
            movieType,
            genreId: values.genreId,
            lastMovieId,
            sortBy: values.sortBy,
        });
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
                            <MenuItem value={-1}>
                                <em>All Genres</em>
                            </MenuItem>
                            <MenuItem value={28}>Action</MenuItem>
                            <MenuItem value={12}>Adventure</MenuItem>
                            <MenuItem value={16}>Animation</MenuItem>
                            <MenuItem value={35}>Comedy</MenuItem>
                            <MenuItem value={80}>Crime</MenuItem>
                            <MenuItem value={99}>Documentary</MenuItem>
                            <MenuItem value={18}>Drama</MenuItem>
                            <MenuItem value={10751}>Family</MenuItem>
                            <MenuItem value={14}>Fantasy</MenuItem>
                            <MenuItem value={36}>History</MenuItem>
                            <MenuItem value={27}>Horror</MenuItem>
                            <MenuItem value={10402}>Music</MenuItem>
                            <MenuItem value={9648}>Mystery</MenuItem>
                            <MenuItem value={10749}>Romance</MenuItem>
                            <MenuItem value={878}>Science Fiction</MenuItem>
                            <MenuItem value={53}>Thriller</MenuItem>
                            <MenuItem value={10770}>TV Movie</MenuItem>
                            <MenuItem value={10752}>War</MenuItem>
                            <MenuItem value={37}>Western</MenuItem>
                            {/* <MenuItem value={28}>Action</MenuItem>
                            <MenuItem value={10759}>Action &amp; Adventure</MenuItem>
                            <MenuItem value={12}>Adventure</MenuItem>
                            <MenuItem value={16}>Animation</MenuItem>
                            <MenuItem value={35}>Comedy</MenuItem>
                            <MenuItem value={80}>Crime</MenuItem>
                            <MenuItem value={99}>Documentary</MenuItem>
                            <MenuItem value={18}>Drama</MenuItem>
                            <MenuItem value={10751}>Family</MenuItem>
                            <MenuItem value={14}>Fantasy</MenuItem>
                            <MenuItem value={27}>Horror</MenuItem>
                            <MenuItem value={9648}>Mystery</MenuItem>
                            <MenuItem value={10764}>Reality</MenuItem>
                            <MenuItem value={10749}>Romance</MenuItem>
                            <MenuItem value={10765}>Sci-Fi &amp; Fantasy</MenuItem>
                            <MenuItem value={53}>Thriller</MenuItem>
                            <MenuItem value={10768}>War &amp; Politics</MenuItem>
                            <MenuItem value={37}>Western</MenuItem> */}
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
                    <TextField
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
                    />
                </form>
                <main>
                    <Grid container spacing={4} className={classes.cardGrid}>
                        {movies.map(post => (
                            <Grid item key={post.MovieId} xs={12} sm={6} md={4}>
                                <CardActionArea
                                    component="a"
                                    href={`/${type}/${post.MovieId}`}
                                >
                                    <Card className={classes.card}>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image={post.PosterPath}
                                        />
                                        <CardContent
                                            className={classes.cardContent}
                                        >
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="h2"
                                            >
                                                {post.Title}
                                            </Typography>
                                            <Typography
                                                className={classes.cardDate}
                                                variant="subtitle1"
                                                color="textSecondary"
                                            >
                                                {CustomUtil.convertUnixTimestampToDate(
                                                    post.ReleaseDate
                                                )}
                                            </Typography>
                                            <Typography>
                                                {CustomUtil.getSummary(
                                                    post.Overview
                                                )}
                                            </Typography>
                                            <div>
                                                {post.Genres &&
                                                    CustomUtil.getDistinctGenres(
                                                        JSON.parse(post.Genres)
                                                    ).map(genre => (
                                                        <Chip
                                                            key={genre.Id}
                                                            size="small"
                                                            label={genre.Name}
                                                            className={
                                                                classes.chip
                                                            }
                                                        />
                                                    ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CardActionArea>
                            </Grid>
                        ))}
                    </Grid>
                    {loading ? (
                        <center>
                            <LoadingIndicator
                                style={{ marginBottom: '2rem' }}
                                type="circle"
                            />
                        </center>
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
                    )}
                </main>
            </Container>
        </React.Fragment>
    );
}

module.exports = {
    path: ':type',
    component: connect(
        (state, ownProps) => {
            return {
                status: state.global.get('status'),
                loading: state.movie.get('loading'),
                accounts: state.global.get('accounts'),
                username:
                    state.user.getIn(['current', 'username']) ||
                    state.offchain.get('account'),
                blogmode: state.app.getIn(['user_preferences', 'blogmode']),
                type: ownProps.params.type,
                maybeLoggedIn: state.user.get('maybeLoggedIn'),
                isBrowser: process.env.BROWSER,
                gptEnabled: state.app.getIn(['googleAds', 'gptEnabled']),
                locale:
                    state.app.getIn(['user_preferences', 'locale']) ||
                    DEFAULT_LANGUAGE,
                movies: state.movie.get('movies').toJS(),
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
    loading: PropTypes.bool,
    username: PropTypes.string,
    blogmode: PropTypes.bool,
    type: PropTypes.string,
    locale: PropTypes.string.isRequired,
    movies: PropTypes.array.isRequired,
};
