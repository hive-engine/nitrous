import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import tt from 'counterpart';
import getSlug from 'speakingurl';

import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import * as CustomUtil from 'app/utils/CustomUtil';

export default function RecentReviews(props) {
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
                            {tt('review.summary.created')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {CustomUtil.getRecentReviews(type, list).map(e => (
                        <TableRow key={e.Author + e.Permlink}>
                            <TableCell>
                                <Link to={`/@${e.Author}/${e.Permlink}`}>
                                    {e.CoverImgUrl && (
                                        <img
                                            className={classes.thumbnail}
                                            src={CustomUtil.getPostCoverThumbnailUrl(
                                                e.CoverImgUrl
                                            )}
                                        />
                                    )}
                                    {e.Title}
                                </Link>
                            </TableCell>
                            <TableCell
                                align="right"
                                className="hide-for-small-only"
                            >
                                <TimeAgoWrapper date={e.AddDate} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

RecentReviews.propTypes = {
    type: PropTypes.number.isRequired,
    list: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
};
