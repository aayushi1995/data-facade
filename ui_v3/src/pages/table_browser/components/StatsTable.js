import React from 'react';
import {makeStyles, withStyles} from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const StyledTableCell = withStyles((theme) => ({
    head: {
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);


const useStyles = makeStyles({
    table: {
        minWidth: 200,
    },
});

const StatsTable = (props) => {

    const classes = useStyles();

    return (
        <TableContainer component={Paper} elevation={0}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Stat Name</StyledTableCell>
                        <StyledTableCell>Values</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props?.statsData.map((row) => (
                        <StyledTableRow key={row.stat}>
                            <StyledTableCell>{row.stat}</StyledTableCell>
                            <StyledTableCell>{row.value}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default StatsTable
