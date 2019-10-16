import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import tt from 'counterpart';
import getSlug from 'speakingurl';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import * as CustomUtil from 'app/utils/CustomUtil';

export default function RecentMovies(props) {
    const { type, list, classes } = props;

    return (
        <Paper>
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>{tt('review.summary.title')}</TableCell>
                        <TableCell
                            nowrap="true"
                            align="right"
                            className="hide-for-small-only"
                        >
                            {tt('review.option.release_date')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {CustomUtil.getRecentMovies(type, list).map(e => (
                        <TableRow key={e.Id}>
                            <TableCell>
                                <Link
                                    to={`/${CustomUtil.getMovieTypeName(
                                        e.Type
                                    )}/${getSlug(e.Id + ' ' + e.Title)}`}
                                >
                                    {e.PosterPath && (
                                        <img
                                            className={classes.thumbnail}
                                            src={CustomUtil.getMoviePosterThumbnailUrl(
                                                e.PosterPath
                                            )}
                                        />
                                    )}
                                    {e.Title}
                                </Link>
                            </TableCell>
                            <TableCell
                                nowrap="true"
                                align="right"
                                className="hide-for-small-only"
                            >
                                {CustomUtil.convertUnixTimestampToDate(
                                    e.ReleaseDate
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

RecentMovies.propTypes = {
    type: PropTypes.number.isRequired,
    list: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
};
