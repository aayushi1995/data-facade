import React from 'react'

import {Box, Grid, Tab, Tabs} from '@material-ui/core'
import {DataGrid} from "@material-ui/data-grid";
import {makeStyles} from "@material-ui/styles";
import {useHistory, useRouteMatch} from 'react-router-dom'

import LoadingIndicator from '../../../common/components/LoadingIndicator'
import NoData from '../../../common/components/NoData'
import {useRetreiveData} from '../../../data_manager/data_manager'


const useStyles = makeStyles(() => ({
    displayRelatedEntities: {
        minHeight: 600,
        width: "100%"
    },
    tabPanelClass: {
        height: "100%"
    }
}));


const SingleTagView = (props) => {
    const clasess = useStyles()
    // Hooks
    const [tagData, setTagData] = React.useState({})
    const match = useRouteMatch();
    const history = useHistory();

    const {isLoading: tagLoading, error: tagError, data: fetchedTagData, isFetched} = useRetreiveData(
        "Tag", {
            "filter": {Name: match.params.tagName}, "SingleTagView": true
        })


    React.useEffect(() => {
        if (fetchedTagData !== undefined) {
            setTagData(fetchedTagData[0] || {})
        }
    }, [fetchedTagData])


    const tabState = match.params.linkedEntityName
    const handleTabChange = (event, newValue) => {
        history.replace(`./${newValue}`)
    }

    if (tagLoading) {
        return (<LoadingIndicator/>)
    } else if (tagError) {
        return (<NoData/>)
    } else {
        return (
            <Grid container>
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <Tabs onChange={handleTabChange} value={tabState}>
                            <Tab label="Tables" value="Tables" {...a11yProps(0)} />
                            <Tab label="Columns" value="Columns" {...a11yProps(1)} />
                            <Tab label="Actions" value="Actions" {...a11yProps(2)} />
                            <Tab label="Parameters" value="Parameters" {...a11yProps(3)} />
                        </Tabs>
                    </Grid>
                    <Grid item xs={12}>
                        <Box className={clasess.displayRelatedEntities}>
                            <TabPanel value={tabState} index="Tables">
                                <LinkedTables data={tagData}/>
                            </TabPanel>
                            <TabPanel value={tabState} index="Columns">
                                <LinkedColumns data={tagData}/>
                            </TabPanel>
                            <TabPanel value={tabState} index="Actions">
                                <LinkedActions data={tagData}/>
                            </TabPanel>
                            <TabPanel value={tabState} index="Parameters">
                                <LinkedActionParameters data={tagData}/>
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12}>

                </Grid>
            </Grid>
        )
    }
}

const LinkedTables = (props) => {
    const data = (props?.data) || {}
    const match = useRouteMatch();
    const history = useHistory();
    const linkedTableData = (data?.Tables) || []
    const columns = [
        {
            field: "UniqueName",
            headerName: "Name",
            description: `Name of the Table`,
            sortable: true,
            flex: 1,
        },
        {
            field: "Owner",
            headerName: "Owner",
            description: `Owner of the Table`,
            sortable: true,
            flex: 1,
        },
        {
            field: "Description",
            headerName: "Description",
            description: `Description of the Table`,
            sortable: true,
            flex: 1,
        },
        {
            field: "ProviderInstanceName",
            headerName: "Provider",
            description: `Data Source`,
            sortable: true,
            flex: 1,
        }
    ]

    const handleCellClick = (params) => {
        if (params.colDef.field === "UniqueName") {
            if (params.row?.UniqueName) {
                history.push(`/tableBrowser/${params.row?.UniqueName}`)
            }
        }
    }

    return <DataGrid
        onSelectionModelChange={(params) => {

        }}
        autoHeight
        autoPageSize
        checkboxSelection
        disableSelectionOnClick
        columns={columns}
        onCellClick={handleCellClick}
        rows={linkedTableData.map(table => {
            return {...table, id: table.Id}
        })}
    />
}

const LinkedColumns = (props) => {
    const data = (props?.data) || {}
    const match = useRouteMatch();
    const history = useHistory();
    const linkedColumnData = (data?.Columns) || []
    const columns = [
        {
            field: "UniqueName",
            headerName: "Column Name",
            description: `Name of the Column`,
            sortable: true,
            flex: 1,
        },
        {
            field: "TableName",
            headerName: "Table Name",
            description: `Name of the Table`,
            sortable: true,
            flex: 1,
        },
        {
            field: "Datatype",
            headerName: "Datatype",
            description: `Datatype of the Column`,
            sortable: true,
            flex: 1,
        }
    ]

    const handleCellClick = (params) => {
        if (params.colDef.field === "UniqueName") {
            if (params.row?.UniqueName && params.row?.TableName) {
                history.push(`/tableBrowser/${params.row?.TableName}/${params.row?.UniqueName}`)
            }
        }
    }

    return <DataGrid
        onSelectionModelChange={(params) => {

        }}
        autoHeight
        autoPageSize
        checkboxSelection
        disableSelectionOnClick
        columns={columns}
        onCellClick={handleCellClick}
        rows={linkedColumnData.map(column => {
            return {...column, id: column.Id}
        })}
    />
}

const LinkedActions = (props) => {
    const data = (props?.data) || {}
    const linkedActionData = (data?.ActionDefinitions) || []

    const columns = [
        {
            field: "DisplayName",
            headerName: "Name",
            description: `Name of the Action`,
            sortable: true,
            flex: 1,
        },
        {
            field: "ActionType",
            headerName: "Action Type",
            description: `Action Type`,
            sortable: true,
            flex: 1,
        },
        {
            field: "PresentationFormat",
            headerName: "Return Format",
            description: `Presentation Format of the Table`,
            sortable: true,
            flex: 1,
        }
    ]

    return <DataGrid
        onSelectionModelChange={(params) => {

        }}
        autoHeight
        autoPageSize
        checkboxSelection
        disableSelectionOnClick
        columns={columns}
        // onCellClick={handleCellClick}
        rows={linkedActionData.map(action => {
            return {...action, id: action.Id}
        })}
    />
}

const LinkedActionParameters = (props) => {
    const data = (props?.data) || {}
    const rawLinkedActionParameterData = (data?.ActionParameterDefinitions) || []
    const linkedActionParameterData = rawLinkedActionParameterData.map(actionParam => {
        return {
            ...actionParam,
            ActionDefinition: undefined,
            ActionDefinitionName: actionParam?.ActionDefinition?.DisplayName,
            ActionDefinitionActionType: actionParam?.ActionDefinition?.ActionType
        }
    })

    const columns = [
        {
            field: "ParameterName",
            headerName: "Name",
            description: `Name of the Parameter`,
            sortable: true,
            flex: 1,
        },
        {
            field: "ActionDefinitionName",
            headerName: "Action Name",
            description: `Name of the Action`,
            sortable: true,
            flex: 1,
        },
        {
            field: "ActionDefinitionActionType",
            headerName: "ActionType",
            description: `Type of Action`,
            sortable: true,
            flex: 1,
        }
    ]

    return <DataGrid
        onSelectionModelChange={(params) => {

        }}
        autoHeight
        autoPageSize
        checkboxSelection
        disableSelectionOnClick
        columns={columns}
        // onCellClick={handleCellClick}
        rows={linkedActionParameterData.map(actionParameter => {
            return {...actionParameter, id: actionParameter.Id}
        })}
    />
}

const TabPanel = (props) => {
    const classes = useStyles()
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            className={classes.tabPanelClass}
        >
            {value === index && (
                <>{children}</>
            )}
        </div>
    );
}

const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default SingleTagView;