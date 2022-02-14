import React from 'react'
import {Box, Button, Collapse, Divider, Grid, IconButton, TextField} from '@material-ui/core'
import {KeyboardArrowDown, KeyboardArrowRight} from '@material-ui/icons'
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import {v4 as uuidv4} from 'uuid';
import {useMutation} from 'react-query'
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import DataChecksIcon from './../../../images/data_check_icon.png'
import './../../../css/quality_checks/QualityChecksRow.css'
import dataManagerInstance from './../../../data_manager/data_manager'

const labels = require('./../../../labels/labels').labels

const QualityChecksRow = (props) => {

    const [click, setClick] = React.useState(false)
    const handleSetClick = (event) => {
        setClick(event)
    }
    /* useQuery mutation to create a new action execution */
    const createActionExecutionMutation = useMutation((execution) => {
        const qualityChecksSave = dataManagerInstance
            .getInstance
            .saveData(
                execution.entityName,
                execution.actionProperties)

        let response = qualityChecksSave.then(res => res.json())
        return response
    })


    /* onClick trigger to create a new action execution */
    const handleCreateActionExecution = () => {
        const actionExecutionProperties = {}
        actionExecutionProperties["Id"] = uuidv4()
        actionExecutionProperties["ExecutionStartedOn"] = parseInt(Date.now() / 1000)
        actionExecutionProperties["Status"] = "Created"
        actionExecutionProperties["InstanceId"] = props.data.ActionInstance.Id

        createActionExecutionMutation.mutate({
            "entityName": labels.entities.ActionExecution,
            "filter": {},
            "actionProperties": {
                "filter": {},
                "entityProperties": actionExecutionProperties
            }
        })
    }

    return (
        <Box className="box_root">
            <Grid container spacing={0} className="grid_root">
                <Grid item xs={1} style={{display: 'flex'}} onClick={() => {
                    handleSetClick(!click)
                }}>
                    <IconButton size="small" onClick={() => handleSetClick(!click)}>
                        {click ? <KeyboardArrowDown className="collapse"/> : <KeyboardArrowRight className="collapse"/>}
                    </IconButton>
                    <Divider orientation="vertical" flexItem className="divider"/>
                    <IconButton disabled>
                        <img src={DataChecksIcon} className="data_checks_icon" alt="Data Checks Icon"/>
                    </IconButton>
                </Grid>
                <Grid item xs={11} onClick={() => {
                    handleSetClick(!click)
                }}>
                    <Grid container spacing={4} className="grid_row">
                        <Grid item xs={12} sm={4} className="instance_name">
                            {props.data.ActionInstance.Name}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            {props.data.ActionInstance.RenderedTemplate}
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            {props.data.ActionDefinition.RequestType}
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            {props.data.ActionDefinition.UniqueName}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Collapse in={click} timeout="auto" unmountOnExit className="collapse">
                        <Grid xs={12} className="collapse_instance_details">
                            {labels.QualityChecksRow.instance_details}
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item>
                                <TextField defaultValue={props.data.ActionInstance.Name}
                                           label={labels.QualityChecksRow.name} variant="outlined"
                                           InputProps={{readOnly: 'true'}}/>
                            </Grid>
                            <Grid item>
                                <TextField defaultValue={props.data.ActionInstance.RenderedTemplate}
                                           label={labels.QualityChecksRow.rendered_template} variant="outlined"
                                           InputProps={{readOnly: 'true'}}/>
                            </Grid>

                        </Grid>
                        <Grid xs={12} className="collapse_parameter_details">
                            {labels.QualityChecksRow.parameter_details}
                        </Grid>
                        {props.data.ActionParameterInstance.map((parameterInstance, index) => (
                            <Grid container spacing={2}>
                                <Grid item>
                                    <TextField defaultValue={parameterInstance.ParameterValue}
                                               label={labels.QualityChecksRow.parameter_value} variant="outlined"/>
                                </Grid>
                            </Grid>
                        ))}
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button variant="outlined" classes={{root: "execute-root", label: "execute-label"}}
                                        onClick={handleCreateActionExecution}>
                                    {labels.QualityChecksRow.execute}
                                </Button>
                                <Grid className="indicator">
                                    {
                                        (createActionExecutionMutation.isLoading || createActionExecutionMutation.isError) ? (
                                            <LoadingIndicator/>
                                        ) : (createActionExecutionMutation.isSuccess) ? (
                                            <><CheckCircleOutlinedIcon
                                                style={{color: 'green'}}/>&nbsp; {labels.QualityChecksRow.execution_created}</>
                                        ) : (<></>)
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        </Box>
    )
}

export default QualityChecksRow