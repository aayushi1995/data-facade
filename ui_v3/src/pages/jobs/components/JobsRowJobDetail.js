import {
    Box,
    Checkbox,
    FormControlLabel,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React from 'react';
import { useRouteMatch } from "react-router-dom";
import { useRetreiveData } from './../../../data_manager/data_manager';
import labels from './../../../labels/labels';


const getOrElse = (data, key, defaultValue) => {
    if (data === undefined) {
        return defaultValue
    } else {
        return data[key] || defaultValue
    }
}

const extractHeadOfResponse = (response) => {
    if (response.length > 0) {
        return response[0]
    } else {
        return {}
    }
}

const prettyJson = (json) => {
    return json
}

const formDateOrReturnDefault = (date, defaultValue) => {
    return date === undefined ? defaultValue : new Date(date).toDateString()
}

export const formTimeStampOrReturnDefault = (date, defaultValue) => {
    return date === undefined ? defaultValue : new Date(date).toString()
}

const JobsRowJobDetail = (props) => {
    const match = useRouteMatch()
    const actionExecutionId = match.params.actionExecutionId || props.actionExecutionId || props.ActionExecution.Id;
    console.log(actionExecutionId)
    const {isLoading, error, data: JobBaseData} = useRetreiveData(labels.entities.JobBase, {
        "filter": {
            "RelatedEntityUniqueId": actionExecutionId
        },
        "filterConnectionDetails": true
    })
    const {
        isLoading: isActionExecutionLoading,
        error: ActionExecutionError,
        data
    } = useRetreiveData(labels.entities.ActionExecution, {
        "filter": {
            Id: actionExecutionId
        }
    });
    const ActionExecutionData = data?.[0];
    const formStatus = () => {
        if (ActionExecutionData?.ScheduledTime !== undefined) {
            if (ActionExecutionData?.ScheduledTime > new Date().getTime()) {
                return "Scheduled"
            }
        }
        return ActionExecutionData?.Status
    }

    const [showDevData, setShowDevData] = React.useState(props.showDevData || false);
    const [displayData, setDisplayData] = React.useState({
        JobBase: {
            Input: "Fetching...",
        },
        ActionExecution: {
            ActionInstanceRenderedTemplate: getOrElse(ActionExecutionData, "ActionInstanceRenderedTemplate", "Rendering Template..."),
            ScheduledTime: formDateOrReturnDefault(getOrElse(ActionExecutionData, "ScheduledTime", undefined), "Not a Scheduled Job"),
            RetryCount: getOrElse(ActionExecutionData, "RetryCount", "NA"),
            Status: formStatus(),
            ExecutionStartedOn: formTimeStampOrReturnDefault(getOrElse(ActionExecutionData, "ExecutionStartedOn", undefined), "NA"),
            ExecutionCompletedOn: formTimeStampOrReturnDefault(getOrElse(ActionExecutionData, "ExecutionCompletedOn", undefined), "NA"),
        },
        ActionInstance: {
            RenderedTemplate: "Fetching..."
        }
    })
    const [devDisplayData, setDevDisplayData] = React.useState({
        JobBase: {
            Id: "Fetching...",
            CreatedOn: "Fetching...",
            QueuedOn: "Fetching...",
            StartedExecutingOn: "Fetching...",
            CompletedOn: "Fetching...",
            Duration: "Fetching...",
            Output: "Fetching...",
            ContextInformation: "Fetching..."
        },
        ActionExecution: {
            Id: getOrElse(ActionExecutionData, "Id", "NA"),
            TableId: getOrElse(ActionExecutionData, "TableId", "NA"),
            InstanceId: getOrElse(ActionExecutionData, "InstanceId", "NA"),
            Output: getOrElse(ActionExecutionData, "Output", "NA"),
            Config: getOrElse(ActionExecutionData, "Config", "NA"),
            ActionInstanceRenderedTemplate: getOrElse(ActionExecutionData, "ActionInstanceRenderedTemplate", "NA"),
            Logs: getOrElse(ActionExecutionData, "ExecutionLogs", "NA")
        },
        ActionInstance: {
            Id: getOrElse(ActionExecutionData, "InstanceId", "NA")
        }
    })

    React.useEffect(() => {
        if (JobBaseData !== undefined) {
            const JobBase = extractHeadOfResponse(JobBaseData)
            setDisplayData({
                ...displayData,
                JobBase: {
                    ...displayData.JobBase,
                    Input: getOrElse(JobBase, "Input", "NA"),
                }
            })
            setDevDisplayData({
                ...devDisplayData,
                JobBase: {
                    ...devDisplayData.JobBase,
                    Id: getOrElse(JobBase, "Id", "NA"),
                    CreatedOn: formTimeStampOrReturnDefault(getOrElse(JobBase, "CreatedOn", undefined), "NA"),
                    QueuedOn: formTimeStampOrReturnDefault(getOrElse(JobBase, "QueuedOn", undefined), "NA"),
                    StartedExecutingOn: formTimeStampOrReturnDefault(getOrElse(JobBase, "StartedExecutingOn", undefined), "NA"),
                    CompletedOn: formTimeStampOrReturnDefault(getOrElse(JobBase, "CompletedOn", undefined), "NA"),
                    Duration: getOrElse(JobBase, "Duration", "NA"),
                    Output: getOrElse(JobBase, "Output", "NA"),
                    ContextInformation: getOrElse(JobBase, "ContextInformation", "NA")
                }
            })
        }
    }, [isLoading, error])

    React.useEffect(() => {
        if (!isActionExecutionLoading) {
            setDisplayData({
                ...displayData,
                ActionExecution: {
                    ActionInstanceRenderedTemplate: getOrElse(ActionExecutionData, "ActionInstanceRenderedTemplate", "Rendering Template..."),
                    ScheduledTime: formDateOrReturnDefault(getOrElse(ActionExecutionData, "ScheduledTime", undefined), "Not a Scheduled Job"),
                    RetryCount: getOrElse(ActionExecutionData, "RetryCount", "NA"),
                    Status: formStatus(),
                    ExecutionStartedOn: formTimeStampOrReturnDefault(getOrElse(ActionExecutionData, "ExecutionStartedOn", undefined), "NA"),
                    ExecutionCompletedOn: formTimeStampOrReturnDefault(getOrElse(ActionExecutionData, "ExecutionCompletedOn", undefined), "NA"),
                },
                ActionInstance: {
                    RenderedTemplate: "Fetching..."
                }
            })
            setDevDisplayData({
                ...devDisplayData,
                ActionExecution: {
                    Id: getOrElse(ActionExecutionData, "Id", "NA"),
                    TableId: getOrElse(ActionExecutionData, "TableId", "NA"),
                    InstanceId: getOrElse(ActionExecutionData, "InstanceId", "NA"),
                    Output: getOrElse(ActionExecutionData, "Output", "NA"),
                    Config: getOrElse(ActionExecutionData, "Config", "NA"),
                    ActionInstanceRenderedTemplate: getOrElse(ActionExecutionData, "ActionInstanceRenderedTemplate", "NA"),
                    ExecutionLogs: getOrElse(ActionExecutionData, "ExecutionLogs", "NA")
                },
                ActionInstance: {
                    Id: getOrElse(ActionExecutionData, "InstanceId", "NA")
                }
            })
        }
    }, [isActionExecutionLoading])

    return (
        <>
            <Grid container>
                <Grid item xs={6}>
                    <DisplayData {...displayData}/>
                </Grid>
                <Grid container item xs={6} style={{display: "flex"}}>
                    <Grid item xs={9}/>
                    <Grid item xs={3}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={showDevData}
                                onChange={() => {
                                    setShowDevData(!showDevData)
                                }}
                            />}
                            label="Show Dev Data"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {(showDevData ? <DevDisplayData {...devDisplayData}/> : <></>)}
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

const DisplayData = (props) => {
    const ActionExecution = props.ActionExecution || {};
    // TODO: For some reason contents of Template Executed are not rendered properly
    return (
        <Box px={5}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>{labels.JobsRowJobDetail.template_executed}</TableCell>
                        <TableCell>
                            <TextField
                                id="outlined-multiline-static"
                                label="Executed Template"
                                multiline
                                minRows={3}
                                maxRows={10}
                                value={props.JobBase.Input.charAt(0) == '{' ? JSON.parse(props.JobBase.Input)?.script : props.JobBase.Input}
                                variant="outlined"
                                InputProps={{readOnly: true}}
                                fullWidth
                                rowsMax="20"
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>{labels.JobsRowJobDetail.retry_count}</TableCell>
                        <TableCell>{ActionExecution.RetryCount}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>{labels.JobsRowJobDetail.scheduled_time}</TableCell>
                        <TableCell>{ActionExecution.ScheduledTime}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>{labels.JobsRowJobDetail.started_on}</TableCell>
                        <TableCell>{ActionExecution.ExecutionStartedOn}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>{labels.JobsRowJobDetail.completed_on}</TableCell>
                        <TableCell>{ActionExecution.ExecutionCompletedOn}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    )
}

const DevDisplayData = (props) => {
    const ActionExecution = props.ActionExecution;
    return (
        <Box pr={0}>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography>
                        {labels.JobsRowJobDetail.action_instance_dev_data}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.id}</TableCell>
                                <TableCell>{ActionExecution.InstanceId}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{"Rendered Template"}</TableCell>
                                <TableCell>{ActionExecution.ActionInstanceRenderedTemplate}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        {labels.JobsRowJobDetail.execution_dev_data}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.id}</TableCell>
                                <TableCell>{ActionExecution.Id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.table_id}</TableCell>
                                <TableCell>{ActionExecution.TableId}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.instance_id}</TableCell>
                                <TableCell>{ActionExecution.InstanceId}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.output}</TableCell>
                                <TableCell>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Output"
                                        multiline
                                        rows={4}
                                        value={ActionExecution.Output.charAt(0) === '{' ? JSON.parse(ActionExecution.Output)?.Message : ActionExecution.Output}
                                        variant="outlined"
                                        InputProps={{readOnly: true}}
                                        fullWidth
                                        rowsMax="10"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Config</TableCell>
                                <TableCell>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Config"
                                        multiline
                                        rows={4}
                                        defaultValue={prettyJson(ActionExecution.Config)}
                                        variant="outlined"
                                        InputProps={{readOnly: true}}
                                        fullWidth
                                        rowsMax="10"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Execution Logs</TableCell>
                                <TableCell>
                                    <TextField
                                        defaultValue={ActionExecution.ExecutionLogs}
                                        InputProps={{readOnly: true}}
                                        fullWidth
                                        rowsMax="10"
                                        label="Logs"
                                        multiline
                                        rows={4}
                                    ></TextField>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        {labels.JobsRowJobDetail.dev_data}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.Id}</TableCell>
                                <TableCell>{props.JobBase.Id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.created_on}</TableCell>
                                <TableCell>{props.JobBase.CreatedOn}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.queued_on}</TableCell>
                                <TableCell>{props.JobBase.QueuedOn}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.started_executing_on}</TableCell>
                                <TableCell>{props.JobBase.StartedExecutingOn}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.completed_on}</TableCell>
                                <TableCell>{props.JobBase.CompletedOn}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.duration}</TableCell>
                                <TableCell>{props.JobBase.Duration}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.output}</TableCell>
                                <TableCell>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Output"
                                        multiline
                                        rows={4}
                                        defaultValue={prettyJson(props.JobBase.Output)}
                                        variant="outlined"
                                        InputProps={{readOnly: true}}
                                        fullWidth
                                        rowsMax="10"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>{labels.JobsRowJobDetail.context_information}</TableCell>
                                <TableCell>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Context Information"
                                        multiline
                                        rows={4}
                                        defaultValue={prettyJson(props.JobBase.ContextInformation)}
                                        variant="outlined"
                                        InputProps={{readOnly: true}}
                                        fullWidth
                                        rowsMax="10"
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </Box>
    )
}

export default JobsRowJobDetail