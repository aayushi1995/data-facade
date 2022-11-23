import {
    Box, Grid
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import { DataGrid } from "@mui/x-data-grid";
import React from 'react';


export const useStyles = makeStyles(() => ({
    TablesGrid: {
        width: "100%",
    },
    TablesGridBox: {
        height: 400,
        overflow: 'auto',
        width: '100%'
    }
}))

const SelectTableStep = (props) => {
    const classes = useStyles();
    const [parsedTables, setParsedTables] = React.useState(props.Tables||[])
    // If only one table can be parsed then it is automatically sent to the next step
    React.useEffect(() => {
        if(parsedTables.length === 1) {
            props.nextStep({
                file: parsedTables[0].CsvFile
            })
        }
    }, [parsedTables])
    

    const columns = [
        {
            field: "TableName",
            width: 600,
            headerName: "Sheet Name"
        }
    ]

    const rows = parsedTables.map((parsedTable, index) => {
        return {
            TableName: parsedTable.CsvFile.name.split('.').slice(0, -1).join(''),
            CsvFile: parsedTable.CsvFile,
            id: index
        }
    })

    const options = {
        resizableColumns: true,
        download: false,
        print: false,
        selectableRows: 'none',
        rowsPerPageOptions: [5,10]
    }

    const handleRowClick = (params) => {
        console.log(params)
        props.nextStep({
            file: params.row.CsvFile
        })
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Box className={classes.TablesGridBox}>
                    <DataGrid className={classes.TablesGrid}
                        title={props.tableName || "Not Named"}
                        rows={rows}
                        columns={columns}
                        options={options}
                        onRowClick={handleRowClick}
                    />
                </Box>
            </Grid>
        </Grid>
    )
}

export default SelectTableStep;