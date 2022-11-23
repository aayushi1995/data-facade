import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Collapse, Dialog, Divider, Grid, IconButton } from '@mui/material'
import React from 'react'
import { useMutation } from 'react-query'
import { generatePath, Link, useRouteMatch } from 'react-router-dom'
import EditTags from '../../../common/components/EditTags'
import { DATA_COLUMN_VIEW } from '../../../common/components/header/data/DataRoutesConfig'
import CreateActionInstanceFormNew from './../../../common/components/CreateActionInstanceFormNew'
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import NoData from './../../../common/components/NoData'
import useStyles from './../../../css/table_details/ColumnViewRow'
import dataManagerInstance, { useRetreiveData } from './../../../data_manager/data_manager'
import TagScope from './../../../enums/TagScope'
import ColumnIcon from './../../../images/column_icon.png'
import labels from './../../../labels/labels'
import StatsTable from './StatsTable'


const collectColumnLevelStats = (data) => {

    /*
        return stats in format [
        {
            "stat" : "",
            "value" : ""
        },
        {
            "stat" : "",
            "value" : ""
        }]

    */

    const statsData = []

    const findLatestExecution = (executions) => {

        let latestExecution;
        const completedActionExecutions = executions.filter((execution) => execution.Status === 'Completed')
        if (completedActionExecutions.length > 0) {
            latestExecution = completedActionExecutions[0]
            completedActionExecutions.forEach((execution) => {
                if (execution.ExecutionStartedOn > latestExecution.ExecutionStartedOn) latestExecution = JSON.parse(JSON.stringify(execution))
            })
            return latestExecution
        }
    }

    if (data?.ColumnProperties?.Datatype === 'string') {
        data?.Profiling?.ActionEntities?.forEach((ActionEntities) => {
            if (ActionEntities.ActionDefinition.PresentationFormat === 'single_value') {
                ActionEntities.ActionInstances.forEach((instance) => {
                    if (instance.ActionInstance.EnableForReporting !== undefined && instance.ActionInstance.EnableForReporting) {
                        const latestExecution = findLatestExecution(instance.ActionExecutions)
                        if (latestExecution !== undefined) {
                            statsData.push({
                                "stat": instance.ActionInstance.DisplayName,
                                "value": JSON.parse(latestExecution.Output).Value
                            })
                        }
                    }
                })
            } else if (ActionEntities.ActionDefinition.PresentationFormat === 'min_max') {

                ActionEntities.ActionInstances.forEach((instance) => {
                    if (instance.ActionInstance.EnableForReporting !== undefined && instance.ActionInstance.EnableForReporting) {
                        const latestExecution = findLatestExecution(instance.ActionExecutions)
                        if (latestExecution !== undefined) {
                            const MIN = JSON.parse(latestExecution.Output).Value.MIN
                            const MAX = JSON.parse(latestExecution.Output).Value.MAX
                            console.log("min-max", JSON.parse(latestExecution.Output))
                            statsData.push({
                                "stat": instance.ActionInstance.DisplayName,
                                "value": `Min: ${MIN}  Max: ${MAX}`
                            })
                        }
                    }
                })
            }

        })
        return statsData
    } else if (data.ColumnProperties?.Datatype === 'int') {
        data.Profiling.ActionEntities.forEach((ActionEntities) => {
            if (ActionEntities.ActionDefinition.PresentationFormat === 'single_value') {
                ActionEntities.ActionInstances.forEach((instance) => {
                    if (instance.ActionInstance.EnableForReporting !== undefined && instance.ActionInstance.EnableForReporting) {
                        const latestExecution = findLatestExecution(instance.ActionExecutions)
                        if (latestExecution !== undefined) {
                            statsData.push({
                                "stat": instance.ActionInstance.DisplayName,
                                "value": JSON.parse(latestExecution.Output).Value
                            })
                        }
                    }
                })
            } else if (ActionEntities.ActionDefinition.PresentationFormat === 'min_max') {
                ActionEntities.ActionInstances.forEach((instance) => {
                    if (instance.ActionInstance.EnableForReporting !== undefined && instance.ActionInstance.EnableForReporting) {
                        const latestExecution = findLatestExecution(instance.ActionExecutions)
                        if (latestExecution !== undefined) {
                            const MIN = JSON.parse(latestExecution.Output).Value.MIN
                            const MAX = JSON.parse(latestExecution.Output).Value.MAX
                            console.log("min-max", JSON.parse(latestExecution.Output))
                            statsData.push({
                                "stat": instance.ActionInstance.DisplayName,
                                "value": `Min: ${MIN}  Max: ${MAX}`
                            })
                        }
                    }
                })
            }
        })
        return statsData
    } else if (data?.ColumnProperties?.Datatype === 'float') {
        data?.Profiling?.ActionEntities?.forEach((ActionEntities) => {
            if (ActionEntities?.ActionDefinition?.PresentationFormat === 'single_value') {
                ActionEntities?.ActionInstances?.forEach((instance) => {
                    if (instance?.ActionInstance?.EnableForReporting !== undefined && instance?.ActionInstance?.EnableForReporting) {
                        const latestExecution = findLatestExecution(instance?.ActionExecutions)
                        if (latestExecution !== undefined) {
                            statsData.push({
                                "stat": instance?.ActionInstance?.DisplayName,
                                "value": JSON.parse(latestExecution.Output).Value
                            })
                        }
                    }
                })
            } else if (ActionEntities?.ActionDefinition?.PresentationFormat === 'min_max') {
                ActionEntities?.ActionInstances?.forEach((instance) => {
                    if (instance.ActionInstance.EnableForReporting !== undefined && instance.ActionInstance.EnableForReporting) {
                        const latestExecution = findLatestExecution(instance.ActionExecutions)
                        if (latestExecution !== undefined) {
                            const MIN = JSON.parse(latestExecution.Output).Value.MIN
                            const MAX = JSON.parse(latestExecution.Output).Value.MAX
                            console.log("min-max", JSON.parse(latestExecution.Output))
                            statsData.push({
                                "stat": instance.ActionInstance.DisplayName,
                                "value": `Min: ${MIN}  Max: ${MAX}`
                            })
                        }
                    }
                })
            }
        })
        return statsData
    }

}

const ColumnViewRow = (props) => {

    const queryKey = `ColumnStatsDistinctCountQuery${props.data.Id}`

    const [click, setClick] = React.useState(false)
    const [createActionInstanceDialog, setCreateActionInstanceDialog] = React.useState(false)
    const [columnType, setColumnType] = React.useState(props.data.ColumnType)

    const handleColumnTypeChange = (event) => {
        setColumnType(event.target.value)
    }

    const [columnPattern, setColumnPattern] = React.useState(props.data.ColumnPattern)

    const handleColumnPattern = (event) => {
        setColumnPattern(event.target.value)
    }

    const cTypes = [
        {
            "value": "Url",
            "display": "Url"
        },
        {
            "value": "Address",
            "display": "Address"
        },
        {
            "value": "Age",
            "display": "Age"
        },
        {
            "value": "Country",
            "display": "Country"
        }
    ]


    let updateColumnPropertiesMutation = useMutation((updateColumn) => {


        const updateColumnFunc = dataManagerInstance.getInstance.patchData(updateColumn.entityName, {
            "filter": updateColumn.filter,
            "newProperties": updateColumn.newProperties
        })

        let response = updateColumnFunc.then(res => res.json())
        return response
    })

    const handleColumnTypeAndPattern = () => {
        const newProperties = {}
        newProperties["ColumnType"] = columnType
        newProperties["ColumnPattern"] = columnPattern
        const filter = {}
        filter["Id"] = props.data.Id
        updateColumnPropertiesMutation.mutate({
            "entityName": labels.entities.ColumnProperties,
            "newProperties": newProperties,
            "filter": filter
        })
    }

    const classes = useStyles();
    let match = useRouteMatch();

    const handleSetClick = (event) => {
        setClick(event)
    }

    const handleCreateActionInstanceOpen = () => {
        setCreateActionInstanceDialog(true)
    }
    const handleCreateActionInstanceClose = () => {
        setCreateActionInstanceDialog(false)
    }

    useRetreiveData(labels.entities.ColumnProperties, {
        "filter": {
            "Id": props.data.Id
        },
        "withProfilingActions": true
    })

    const {isLoading, error, data} = useRetreiveData(labels.entities.ColumnProperties, {
        "filter": {
            "Id": props.data.Id
        },
        "withProfilingActions": true
    })

    if (isLoading) {
        return (<LoadingIndicator/>)
    } else if (error) {
        return (<NoData/>)
    } else {
        const stats = collectColumnLevelStats(data[0])
        return (
            <Box border={1} className={classes.box_root}>
                <Grid container spacing={0} className={classes.grid_root}>
                    <Grid item xs={1} container onClick={() => {
                        handleSetClick(!click)
                    }}>
                        <IconButton size="small" onClick={() => handleSetClick(!click)}>
                            {click ? <KeyboardArrowDown className={classes.collapse}/> :
                                <KeyboardArrowRight className={classes.collapse}/>}
                        </IconButton>
                        <Divider orientation="vertical" flexItem style={{marginLeft: 5, marginRight: 5}}/>
                        <IconButton disabled style={{color: '#42a5f5'}}>
                            <img src={ColumnIcon} className={classes.column_icon} alt="column icon"/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={10} onClick={() => {
                        handleSetClick(!click)
                    }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={3} container alignItems="center">
                                {props.data.UniqueName}
                            </Grid>
                            <Grid item xs={12} sm={2} className={classes.content}>

                            </Grid>
                            <Grid item xs={12} sm={2} className={classes.content}>
                                {props.data.Datatype}
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button varaint="contained" color="primary" className={classes.link}
                                        onClick={handleCreateActionInstanceOpen}>
                                    Add action
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={1}>
                                {/*<Button varaint="outlined" className={classes.button}  >
                                    Clean
                                </Button>*/}
                            </Grid>


                            <Grid item container xs={12} sm={2}>
                                <Grid container spacing={0}>
                                    <Grid item xs={12} className={classes.show_details}>

                                        <Link to={{
                                            pathname: generatePath(DATA_COLUMN_VIEW, { ...match.params, ColumnName: props.data.UniqueName }),
                                            state: {
                                                "columnId": props.data.Id
                                            }

                                        }}
                                              className={classes.link}
                                              onClick={() => {
                                                  setClick(click)
                                              }}
                                        >
                                            Show Details
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Collapse in={click} timeout="auto" unmountOnExit className={classes.collapse}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <StatsTable statsData={stats}/>
                                </Grid>
                                <Grid container item xs={4}>
                                    <EditTags RelatedEntityId={props.data.Id}
                                              RelatedEntityType={labels.entities.COLUMN_PROPERTIES}
                                              scope={TagScope.COLUMNS} label="Tags" fixedHeight={200}/>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </Grid>
                </Grid>
                {/* Create Action Instance Dialog */}

                <Dialog onClose={handleCreateActionInstanceClose} open={createActionInstanceDialog} fullWidth>
                    <Grid item xs={12} container justify="flex-end">
                        <IconButton aria-label="close" onClick={handleCreateActionInstanceClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                    <CreateActionInstanceFormNew fromTableBrowser={{
                        tableName: props.tableName,
                        columnName: props.data.UniqueName,
                        providerId: props.providerId
                    }} onCloseDialog={handleCreateActionInstanceClose}/>
                </Dialog>
            </Box>
        )
    }
}

export default ColumnViewRow;