import React from 'react'
import {
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'


const useStyles = makeStyles(() => ({
    displayFileDetail: {
        height: 200,
        overflow: 'auto',
        width: "100%"
    }
}))


const DisplaySelectedFilesDetail = (props) => {
    const classes = useStyles();
    if (props.selectedFile === undefined) {
        return (
            <>No file selected</>
        )
    }

    return (
        <Grid container spacing={2} className={classes.displayFileDetail}>
            <Grid item xs={12}>
                <Box mx={1} py={0}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Filename</TableCell>
                                <TableCell>{props.selectedFile.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Filetype</TableCell>
                                <TableCell>{props.selectedFile.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Size In Bytes</TableCell>
                                <TableCell>{props.selectedFile.size}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Grid>
        </Grid>
    )
}

export default DisplaySelectedFilesDetail;