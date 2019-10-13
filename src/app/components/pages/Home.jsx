import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { APP_ICON } from 'app/client_config';
import SvgImage from 'app/components/elements/SvgImage';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import * as CustomUtil from 'app/utils/CustomUtil';

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

export default function Home(props) {
    const classes = useStyles();
    const { locale } = props;

    React.useEffect(() => {}, []);

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.root} />
        </React.Fragment>
    );
}

module.exports = {
    path: ':type',
    component: connect(
        (state, ownProps) => {
            return {
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
};
