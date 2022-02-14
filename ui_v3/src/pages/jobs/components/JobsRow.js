import React from 'react'
import {Link} from 'react-router-dom'
import {Box, Checkbox, Collapse, Grid} from '@material-ui/core'
import {useMutation} from 'react-query'
import JobsRowJobDetail from './JobsRowJobDetail'
import labels from './../../../labels/labels'
import useStyles from './../../../css/jobs/JobsRowCss'
import dataManagerInstance from '../../../data_manager/data_manager'
import ActionExecutionStatus from './../../../enums/ActionExecutionStatus.js'

const COLORS = ['#0088FE', '#FF8042', '#00C49F', 'red', '#e08d19', '#03bafc'];

export const formDateOrReturnDefault = (date, defaultValue) => {
    return date === undefined ? defaultValue : new Date(date).toDateString()
}

export const formTimeStampOrReturnDefault = (date, defaultValue) => {
    return date === undefined ? defaultValue : new Date(date).toString()
}


const Created = () => {
    return (
        <div style={{color: COLORS[0]}}>Created</div>
    )
}
const Started = () => {
    return (
        <div style={{color: COLORS[1]}}>Started</div>
    )
}
const Completed = () => {
    return (
        <div style={{color: COLORS[2]}}>Completed</div>
    )
}

const Failed = () => {
    return (
        <div style={{color: COLORS[3]}}>Failed</div>
    )
}

const Scheduled = () => {
    return (
        <div style={{color: COLORS[4]}}>Scheduled</div>
    )
}

const WaitingForUpstream = () => {
    return (
        <div style={{color: COLORS[5]}}>Waiting For Upstream</div>
    )
}

const WorkflowRunning = () => {
    return (
        <div style={{color: COLORS[4]}}>Workflow Running</div>
    )
}

export const getStatusIndicatorComponent = (executionStatus) => {
    if (executionStatus === "Created") {
        return <Created/>
    } else if (executionStatus === "Started") {
        return <Started/>
    } else if (executionStatus === "Completed") {
        return <Completed/>
    } else if (executionStatus === "Scheduled") {
        return <Scheduled/>
    } else if (executionStatus === "WaitingForUpstream") {
        return <WaitingForUpstream/>
    } else if (executionStatus === "WorkflowRunning") {
        return <WorkflowRunning/>
    } else {
        return <Failed/>
    }
}

export function getExecutionTime(row) {
    return row.ExecutionCompletedOn && row.ScheduledTime ?
        `${((row.ExecutionCompletedOn - row.ScheduledTime) / 1000)
            .toFixed(2)}s` : `NA`;
}

const JobsRow = (props) => {
    const classes = useStyles()
    const [click, setClick] = React.useState(false)

    const handleSetClick = (event) => {
        setClick(event)
    }

    const formStatus = () => {
        if (props.ActionExecution.ScheduledTime !== undefined) {
            if (props.ActionExecution.ScheduledTime > new Date().getTime()) {
                return "Scheduled"
            }
        }
        return props.ActionExecution.Status
    }

    const retryJobMutation = useMutation((retryJob) => {

        const retryJobFunc = dataManagerInstance.getInstance.patchData(retryJob.entityName,
            {
                "newProperties": retryJob.newProperties,
                "filter": retryJob.filter
            })

        let response = retryJobFunc.then(res => res.json())
        return response
    })

    const handleRetryJob = (value) => {
        console.log("in retry ", value)
        const div = document.getElementById(`${props.ActionExecution.Id}jobs-page-retry-job`)
        if (value === 'success') {
            div.classList.add(`${classes.rotate}`)  //replace with remove afterwards
        } else {
            div.classList.add(`${classes.rotate}`)
        }

        retryJobMutation.mutate({
            "entityName": labels.entities.ActionExecution,
            "filter": {
                "Id": props.ActionExecution.Id
            },
            "newProperties": {
                "Status": ActionExecutionStatus.CREATED,
                "Id": props.ActionExecution.Id
            }
        })
    }

    const selectedRowColor = {
        background: props.IsSelected ? "#dbf6e9" : "#ffffff"
    }

    const ExecutionStartedOn = formDateOrReturnDefault(props.ActionExecution.ExecutionStartedOn, "NA")


    return (
        <Box border={1} className={classes.box_root} style={selectedRowColor}>
            <Grid container spacing={0} className={classes.grid_root}>
                <Grid item xs={1}>
                    <Checkbox key={props.ActionExecution.Id}
                              onChange={() => props.ToggleSelect(props.ActionExecution.Id)} checked={props.IsSelected}
                              color={"primary"}
                              inputProps={{'aria-label': 'primary checkbox'}}
                    />
                </Grid>
                <Grid item xs={9} onClick={() => {
                    handleSetClick(!click)
                }}>
                    <Grid container spacing={1}>
                        <Grid item xs={5} className={classes.queued_task}>
                            {props.ActionExecution.ActionInstanceName || "Queued Task"}
                        </Grid>
                        <Grid item xs={2} className={classes.queued_task}>
                            {
                                getExecutionTime(props.ActionExecution)
                            }
                        </Grid>
                        <Grid item sm={2} container alignItems="center">
                            {getStatusIndicatorComponent(formStatus())}
                        </Grid>
                        <Grid item sm={2} container alignItems="center" className={classes.started_execution}>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    {ExecutionStartedOn}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sm={1}>
                            {/* <Grid container spacing={0}>
                                {(retryJobMutation.isLoading || retryJobMutation.isError) ? (
                                    <Grid item xs={12} className={classes.cursor_pointer}>
                                        <ReplayIcon style={{color:'green'}} id={`${props.ActionExecution.Id}jobs-page-retry-job`}/>
                                        <span onClick={() => handleRetryJob('loading')}>Re-run</span>
                                    </Grid>
                                ) : (
                                    <Grid item xs={12} className={classes.cursor_pointer} >
                                        <ReplayIcon style={{color:'green'}} id={`${props.ActionExecution.Id}jobs-page-retry-job`}/>
                                        <span  onClick={() => handleRetryJob('success')} >Re-run</span>
                                    </Grid>
                                )}
                            </Grid> */}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={2} container alignItems="center" justify="flex-end">
                    <Link className={classes.link}
                          to={{
                              pathname: '/customizations',
                              state: {
                                  "tabIndex": 3,
                                  "filter": "Action Instance Id",
                                  "search": props.ActionExecution.InstanceId
                              }
                          }}
                    >
                        {labels.JobsRow.show_action_instance}
                    </Link>
                </Grid>

                <Grid item xs={12}>
                    <Collapse in={click} timeout="auto" unmountOnExit className={classes.collapse}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <JobsRowJobDetail ActionExecution={props.ActionExecution}/>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        </Box>
    )

}

function MemoizedJobsRow(props) {
    return React.useMemo(() => {
        return <JobsRow
            ActionExecution={props.ActionExecution}
            ToggleSelect={props.ToggleSelect}
            Index={props.Index}
            IsSelected={props.IsSelected}
        />
    }, [props.ActionExecution, props.ToggleSelect, props.IsSelected, props.Index])
}

export default MemoizedJobsRow