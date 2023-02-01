import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle, Grid,
    IconButton
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Papa from 'papaparse';
import React from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DataGrid } from "@mui/x-data-grid";
import { TableHeaderButtonCss } from './CssProperties';

const useStyles = makeStyles(() => ({
    requiredTags: {
        width: "100%",
        height: 200,
        overflow: 'auto',
    },
    displayFileDetail: {
        height: 200,
        overflow: 'auto',
        width: "100%"
    },
    dialog: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid'
    },
    dialogPaper: {
        minWidth: 1200,
        height: "auto",
        overflowY: "hidden"
    },
    columnSchemaDefault: {
        // background: "#DBFCFE"
    },
    columnPropertiesList: {
        height: 600,
        overflow: 'auto',
        width: "100%",
    },
    selectEmpty: {},
    disabledButton: {
        background: "#classes"
    },
    TablePreview: {
        width: "100%",
    },
    TablePreviewBox: {
        height: 600,
        overflow: 'auto',
        width: '100%'
    },
    TableNameTextField: {
        height: 75,
    },
    ColumnSearchTextField: {
        height: 75
    },
    TagDropDown: {
        maxHeight: 75
    }
}))



/**
 * props
 *      selectedFile
 *      callback(columnNames, dataStartsFromRow)
 */
const SelectHeaderRowsButton = (props) => {
    const classes = useStyles();
    const [showDialog, setShowDialog] = React.useState(false)
    return (
        <Grid container>
            <Grid xs={12}>
                <Button sx={{...TableHeaderButtonCss}}  variant="contained"  component="label" onClick={() => {setShowDialog(true)}}>
                    Select Header <ArrowDropDownIcon/>
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Dialog onClose={()=>{setShowDialog(false)}} open={showDialog} fullWidth
                        classes={{paper: classes.dialogPaper}} scroll="paper">
                    <DialogTitle style={{marginLeft: "20px", padding: "0px"}}>
                        <Box px={2}>
                            <Grid container>
                                <Grid container item xs={6} alignItems="center">
                                    Select Header Rows
                                </Grid>
                                <Grid container item xs={6} justifyContent="flex-end" alignItems="center">
                                    <IconButton aria-label="close" onClick={()=>{setShowDialog(false)}}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Box>
                            <SelectHeaderRowsDialogContent closeDialog={()=>{setShowDialog(false)}} {...props}/>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Grid>
        </Grid>
    )
}

const SelectHeaderRowsDialogContent = (props) => {
    const classes = useStyles();
    const [parsedFileData, setParsedFileData] = React.useState()
    const [selectedRows, setSelectedRows] = React.useState()
    const [dataGridProps, setDataGridProps] = React.useState({rows: [], columns: [], checkboxSelection: true})

    const onSelectedRowChange = (selectionModel, additionalDetails) => {
        setSelectedRows(selectionModel)
    }

    React.useEffect(() => {
        if(!!props.selectedFile) {
            Papa.parse(props.selectedFile, {
                dynamicTyping: true,
                skipEmptyLines: true,
                preview: 200,
                complete: (result) => {
                    setParsedFileData(result.data)
                    const columns = result.data[0].map((cellValue, index) => {return {headerName: `Column-${index+1}`, field: `Column-${index+1}`, width: 300}})
                    const rows = result.data.map((dataRows, index) => {
                        const row = {id: index}
                        columns.forEach((columnProps, index) => row[columnProps.field]=dataRows[index])
                        return row;
                    })
                    setDataGridProps(oldProps => {
                        return {
                            ...oldProps,
                            rows: rows,
                            columns: columns,
                            isRowSelectable: () => true,
                            rowsPerPageOptions: [10, 25, 50, 100]
                        }
                    })
                }
            })
        }
    }, [props.selectedFile])

    React.useEffect(() => {
        if(!!dataGridProps?.rows) {
            setSelectedRows(props.headerRows||[])
        }
    }, [dataGridProps.rows])

    const processHeaderRows = () => {
        if(selectedRows.length > 0) {
            const columnNames = selectedRows.reduce((previousValue, currentValue, currentIndex) => {
                const newValue = previousValue.map((colNameTillNow, index) => {
                    return `${colNameTillNow} ${(dataGridProps.rows[currentValue][dataGridProps.columns[index].field])||""}`.trim()
                })
                return newValue
            }, Array(dataGridProps.columns.length).join(".").split("."))
            const dataStartsFromRow = Math.max(...selectedRows)+1
            const data = parsedFileData.slice(dataStartsFromRow)
            props.callback(columnNames, dataStartsFromRow, data, selectedRows)
            props.closeDialog()
        }
    }


    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box className={classes.TablePreviewBox} fullWidth>
                    <DataGrid className={classes.TablePreview}
                        {...dataGridProps}
                        selectionModel={selectedRows}
                        onSelectionModelChange={onSelectedRowChange}
                    />
                </Box> 
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" component="label" onClick={processHeaderRows}
                    classes={{ root: "select-all", disabled: classes.disabledButton }}>
                    Confirm
                </Button>
            </Grid>
        </Grid>
    )
}

export default SelectHeaderRowsButton;