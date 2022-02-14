import React from 'react'

import {Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Tooltip} from '@material-ui/core'
import {DataGrid} from "@material-ui/data-grid";
import {makeStyles} from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import {useHistory, useRouteMatch} from 'react-router-dom'

import LoadingIndicator from '../../../common/components/LoadingIndicator'
import NoData from '../../../common/components/NoData'
import {useRetreiveData} from '../../../data_manager/data_manager'
import UpdateTagDescription from './UpdateTagDescription';
import CreateTag from './CreateTag';
import {PageHeader} from "../../../common/components/header/PageHeader";
import '../../../css/table_browser/TableBrowser.css'
import AddIcon from "@mui/icons-material/Add";
import {CustomToolbar} from "../../../common/components/CustomToolbar";

// Styles
const rowStyle = {};
const cellStyle = {};
const useStyles = makeStyles(() => ({
    columnHeader: cellStyle,
    row: rowStyle,
    cell: cellStyle,
    iconText: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        aspectRatio: 1,
        fontSize: "0.85rem",
        lineHeight: 0.5
    },
    dialogPaper: {
        minWidth: 500
    },
    disabledButton: {
        background: "#classes"
    }
}));


// Component
const AllTagView = (props) => {
    const classes = useStyles()
    // Hooks


    // useState Hooks
    // Stores the list of all the tags
    const [allTags, setAllTags] = React.useState([])
    const [updateTagDescriptionDialogState, setUpdateTagDescriptionDialogState] = React.useState({isDialogOpen: false})
    const [createTagDialogState, setCreateTagDialogState] = React.useState({isDialogOpen: false})

    // Other Hooks
    // Responsible for fetching all the tags
    const {isLoading: allTagLoading, error: allTagError, data: allTagData, isFetched} = useRetreiveData(
        "Tag", {
            "filter": {}, "AllTagView": true
        })
    const match = useRouteMatch();
    const history = useHistory();

    // useEffect Hooks
    // Responsible for setting allTags with allTagData
    React.useEffect(() => {
        if (allTagData !== undefined) {
            setAllTags(allTagData)
        }
    }, [allTagData])


    // Values used for actual rendering
    const columns = [
        {
            field: "Name",
            headerName: "Name",
            description: `Name of the Tag`,
            sortable: true,
            flex: 1,
        },
        {
            field: "TagGroup",
            headerName: "Group",
            description: `Group to which the tag belongs`,
            sortable: true,
            flex: 1,
        },
        {
            field: "Scope",
            headerName: "Scope",
            description: `Scope of the Tag`,
            sortable: true,
            flex: 1,
        },
        {
            field: "Description",
            headerName: "Description",
            description: `Description of the Tag`,
            sortable: true,
            flex: 1,
        },
        {
            field: "ParentTagName",
            headerName: "Parent Tag",
            description: `Name of Parent Tag`,
            sortable: true,
            flex: 1,
        },
        {
            field: "TotalLinkedEntities",
            headerName: "Count",
            description: `Total Count of Linked Entities`,
            sortable: true,
            flex: 1,
        }
    ];

    // Helper Functions
    const handleUpdateTagDescriptionDialogOpen = (tagName, tagDescription) => {
        setUpdateTagDescriptionDialogState(oldState => {
            return {
                ...oldState,
                isDialogOpen: true,
                TagName: tagName,
                TagDescription: tagDescription
            }
        })
    }

    const handleUpdateTagDescriptionDialogClose = () => {
        setUpdateTagDescriptionDialogState(oldState => {
            return {
                ...oldState,
                isDialogOpen: false,
                TagName: undefined,
                TagDescription: undefined
            }
        })
    }

    const handleCreateTagDialogOpen = () => {
        setCreateTagDialogState(oldState => {
            return {
                ...oldState,
                isDialogOpen: true
            }
        })
    }

    const handleCreateTagDialogClose = () => {
        setCreateTagDialogState(oldState => {
            return {
                ...oldState,
                isDialogOpen: false
            }
        })
    }

    const setNewDescription = (tagName, newDescription) => {
        setAllTags(oldTags => {
            return oldTags.map(oldTag => {
                if (oldTag.Name === tagName) {
                    return {
                        ...oldTag,
                        Description: newDescription
                    }
                } else {
                    return oldTag
                }
            })
        })
    }

    const handleCellClick = (params) => {
        if (params.colDef.field === "ParentTagName") {
            if (params.row?.ParentTagName) {
                history.push(`${match.url}/${params.row?.ParentTagName}/view/Tables`)
            }
        } else if (params.colDef.field === "Name") {
            if (params.row?.Name) {
                history.push(`${match.url}/${params.row?.Name}/view/Tables`)
            }
        } else if (params.colDef.field === "Description") {
            handleUpdateTagDescriptionDialogOpen(params.row?.Name, params.row?.Description)
        }
    }

    const createNewTag = () => {
        handleCreateTagDialogOpen()
    }

    if (allTagLoading) {
        return (<LoadingIndicator/>)
    } else if (allTagError) {
        return (<NoData/>)
    } else {
        return (
            <>
                {/* <Snackbar open={notificationState.open} autoHideDuration={4000} onClose={handleNotificationClose}>
                    <Alert onClose={handleNotificationClose} severity={notificationState.severity}>
                        {notificationState.message}
                    </Alert>
                </Snackbar> */}
                <Dialog onClose={handleUpdateTagDescriptionDialogClose}
                        open={updateTagDescriptionDialogState.isDialogOpen} classes={{paper: classes.dialogPaper}}
                        scroll="paper">
                    <DialogTitle style={{marginLeft: "20px", padding: "0px"}}>
                        <Grid container>
                            <Grid container item xs={6} alignItems="center">
                                Update Description
                            </Grid>
                            <Grid container item xs={6} justifyContent="flex-end" alignItems="center">
                                <IconButton aria-label="close" onClick={handleUpdateTagDescriptionDialogClose}>
                                    <CloseIcon/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        <Box>
                            <UpdateTagDescription
                                closeDialog={handleUpdateTagDescriptionDialogClose}
                                {...updateTagDescriptionDialogState}
                                setNewDescription={setNewDescription}
                            />
                        </Box>
                    </DialogContent>
                </Dialog>

                <Dialog onClose={handleCreateTagDialogClose} open={createTagDialogState.isDialogOpen}
                        classes={{paper: classes.dialogPaper}} scroll="paper">
                    <DialogTitle style={{marginLeft: "20px", padding: "0px"}}>
                        <Grid container>
                            <Grid container item xs={6} alignItems="center">
                                Create New Tag
                            </Grid>
                            <Grid container item xs={6} justifyContent="flex-end" alignItems="center">
                                <IconButton aria-label="close" onClick={handleCreateTagDialogClose}>
                                    <CloseIcon/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        <Box>
                            <CreateTag
                                closeDialog={handleCreateTagDialogClose}
                                {...createTagDialogState}
                            />
                        </Box>
                    </DialogContent>
                </Dialog>

                <Grid container>
                    <Grid item xs={12}>
                        <PageHeader path={match.path} url={match.url}/>
                    </Grid>
                    <DataGrid
                        onSelectionModelChange={(params) => {

                        }}
                        components={{
                            Toolbar: CustomToolbar([
                                <Tooltip title="Create New Tag">
                                    <IconButton
                                        color="primary"
                                        aria-label="Create New Tag"
                                        component="span"
                                        onClick={createNewTag}
                                    >
                                        <AddIcon/>
                                    </IconButton></Tooltip>
                            ])
                        }}
                        autoHeight
                        autoPageSize
                        checkboxSelection
                        disableSelectionOnClick
                        columns={columns}
                        onCellClick={handleCellClick}
                        rows={allTags.map(tag => {
                            return {...tag, id: tag.Id}
                        })}
                    />
                </Grid>
            </>
        )
    }
}

export default AllTagView