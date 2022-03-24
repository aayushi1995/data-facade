import React from 'react'
import {Box, Dialog, DialogTitle, Grid, IconButton, Tooltip} from '@mui/material'
import dataManagerInstance, {useRetreiveData} from '../../../../data_manager/data_manager'
import AddIcon from "@mui/icons-material/Add";
import {PageHeader} from "../../../../common/components/header/PageHeader";
import {useHistory, useRouteMatch} from 'react-router-dom'
import LoadingIndicator from '../../../../common/components/LoadingIndicator';
import NoData from '../../../../common/components/NoData'
import {makeStyles} from "@mui/styles";
import {DataGrid} from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';
import CreateTag from '../../../tag/components/CreateTag'
import {CustomToolbar} from "../../../../common/components/CustomToolbar";


const {default: TagGroups} = require("../../../../enums/TagGroups")

const useStyles = makeStyles(() => ({
    disabledButton: {
        background: "#classes"
    },
    dialogPaper: {
        minWidth: 500
    },
}));

const columnFields = [
    {
        field: "Name",
        headerName: "Customer Name",
        description: `Name of the Tag`,
        sortable: true,
        flex: 1
    },
    {
        field: "LinkedSubsidiaries",
        headerName: "Subsidiaries",
        sortable: false,
        flex: 1
    },
    {
        field: "CreatedBy",
        headerName: "Created By",
        description: "Customer Created By",
        sortable: true,
        flex: 1,
    },
    {
        field: "Description",
        headerName: "Description",
        sortable: true,
        editable: true,
        flex: 1
    },
    {
        field: "CountOfLinkedTableProperties",
        headerName: "Number of Data Sets",
        sortable: true,
        flex: 1,
    },

]

const AutoBookCustomers = () => {
    const [customers, setCustomerData] = React.useState([])
    const [openCustomerDialog, setCustomerDialog] = React.useState(false)
    const classes = useStyles()
    const history = useHistory()

    const {isLoading: customerLoading, data: customerData, isError: customerDataError} = useRetreiveData(
        "Tag", {
            filter: {"TagGroup": TagGroups.CUSTOMER_NAME},
            "AllTagView": true,
            "withSubsidiary": true
        }
    )
    const match = useRouteMatch();

    React.useEffect(() => {
        console.log(customerData)
        setCustomerData(customerData)
    }, [customerData])

    const handleOpenDialog = () => {
        setCustomerDialog(true)
    }

    const handleCustomerNameChange = (change) => {
        console.log(change)
        const filter = {"Id": change?.id}
        const newProperties = {[change?.field]: change?.value}
        const actionproperties = {filter: filter, newProperties: newProperties}
        dataManagerInstance.getInstance.patchData("Tag", actionproperties)
        // data
    }

    const handleDialogClose = () => {
        setCustomerDialog(false)
    }

    const handleCellClick = (click) => {
        console.log(click)
        if (click.colDef?.field !== "Description") {
            history.push(`${match.url}/${click?.row?.Name}`)
        }
    }

    if (customerLoading) {
        return (
            <LoadingIndicator></LoadingIndicator>
        )
    } else if (customerData) {
        return (
            <Grid container spacing={0}>
                <Dialog open={openCustomerDialog} onClose={handleDialogClose} classes={{paper: classes.dialogPaper}}
                        scroll="paper">
                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <IconButton aria-label="close" onClick={handleDialogClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                    <DialogTitle>Create Customer</DialogTitle>
                    <Box ml={2} mb={2}>
                        <CreateTag closeDialog={handleDialogClose} TagGroup={"CustomerName"}></CreateTag>
                    </Box>
                </Dialog>
                <Grid item xs = {12}>
                    <PageHeader pageHeading={"Customer List"} path={match.path} url={match.url} isApplication={true}></PageHeader>
                </Grid>
                <DataGrid
                    autoHeight
                    disableSelectionOnClick
                    autoPageSize
                    checkboxSelection
                    columns={columnFields}
                    components={{
                        Toolbar: CustomToolbar([
                            <Tooltip title="Add Customer">
                                <IconButton
                                    color="primary"
                                    aria-label="Add Customer"
                                    component="span"
                                    onClick={handleOpenDialog}
                                >
                                    <AddIcon/>
                                </IconButton></Tooltip>
                        ])
                    }}
                    rows={customerData.map(customer => {
                        return {
                            ...customer,
                            id: customer.Id,
                            LinkedSubsidiaries: customer.LinkedSubsidiaries.map(subsidiary => {
                                return subsidiary.Name
                            })
                        }
                    })}
                    onCellEditCommit={handleCustomerNameChange}
                    onCellClick={handleCellClick}
                />
            </Grid>
        )
    } else {
        <NoData/>
    }
}


export default AutoBookCustomers