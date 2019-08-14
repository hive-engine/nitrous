import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import { TAG_LIST } from 'app/client_config';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';

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
}));

export default function Movies(props) {
    const classes = useStyles();
    const { movies, type } = props;

    const [values, setValues, expanded, setExpanded] = React.useState({
        genre: -1,
        order: 'created',
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
    }

    const handleSearch = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <form className={classes.root} autoComplete="off">
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <InputLabel ref={inputLabel} htmlFor="outlined-genre">
                            Genre
                        </InputLabel>
                        <Select
                            value={values.genre}
                            onChange={handleChange}
                            input={
                                <OutlinedInput
                                    labelWidth={labelWidth}
                                    name="genre"
                                    id="outlined-genre"
                                />
                            }
                        >
                            <MenuItem value={-1}>
                                <em>All Genres</em>
                            </MenuItem>
                            <MenuItem value={0}>Unknown</MenuItem>
                            <MenuItem value={1}>SF</MenuItem>
                            <MenuItem value={2}>Horror</MenuItem>
                            <MenuItem value={3}>Drama</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <InputLabel ref={inputLabel} htmlFor="outlined-order">
                            Sort by
                        </InputLabel>
                        <Select
                            value={values.order}
                            onChange={handleChange}
                            input={
                                <OutlinedInput
                                    labelWidth={labelWidth}
                                    name="order"
                                    id="outlined-order"
                                />
                            }
                        >
                            <MenuItem value={'created'}>
                                Review Created
                            </MenuItem>
                            <MenuItem value={'release_date'}>
                                Release Date
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
                                                {post.Overview != null
                                                    ? post.Overview.length > 100
                                                      ? post.Overview.substring(
                                                            0,
                                                            100
                                                        ) + ' ...'
                                                      : post.Overview
                                                    : null}
                                            </Typography>
                                            <div>
                                                {post.Genres &&
                                                    JSON.parse(post.Genres).map(
                                                        genre => (
                                                            <Chip
                                                                key={genre.Id}
                                                                size="small"
                                                                label={
                                                                    genre.Name
                                                                }
                                                                className={
                                                                    classes.chip
                                                                }
                                                            />
                                                        )
                                                    )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CardActionArea>
                            </Grid>
                        ))}
                    </Grid>
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
                movies: state.movie.get('movies').toJS(),
            };
        },
        dispatch => {
            return {
                requestData: args =>
                    dispatch(fetchDataSagaActions.requestData(args)),
            };
        }
    )(Movies),
};

Movies.propTypes = {
    discussions: PropTypes.object,
    accounts: PropTypes.object,
    status: PropTypes.object,
    routeParams: PropTypes.object,
    requestData: PropTypes.func,
    loading: PropTypes.bool,
    username: PropTypes.string,
    blogmode: PropTypes.bool,
    type: PropTypes.string,
    categories: PropTypes.object,
    movies: PropTypes.array.isRequired,
};
