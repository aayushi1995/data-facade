import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Box, Button, Collapse, Divider, Grid, IconButton, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useContext } from 'react';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import LoadingIndicator from '../../../../common/components/LoadingIndicator';
import AppContext from "../../../../utils/AppContext";
import DataChecksIcon from './../../../assets/images/data_check_icon.png';


const endPoint = require("../../../../common/config/config").FDSEndpoint


const useStyles = makeStyles(() => ({

    box_root: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 40,
        borderColor: '#bdbdbd'

    },
    grid_root: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15
    },
    collapse: {
        color: '#616161',
        fontSize: 30
    },
    link: {
        color: '#616161',
        textDecoration: 'none'
    }

}));


const DataCleanActionsRow = (props) => {
    const appcontext = useContext(AppContext);
    const [click, setClick] = React.useState(false)
    const classes = useStyles();
    const email = appcontext.userEmail
    const token = appcontext.token

    const handleSetClick = (event) => {
        setClick(event)
    }

    const createActionExecutionMutation = useMutation((execution) => {
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "entityName": execution.entityName,
                "actionProperties": {
                    "entityProperties": execution.entityProperties
                }
            })
        }
        let response = fetch(endPoint + "/entity?email=" + email, config).then(res => res.json())
        return response


    })

    const handleCreateActionExecution = () => {

        const actionExecutionProperties = {}
        actionExecutionProperties["Id"] = uuidv4()
        actionExecutionProperties["ExecutionStartedOn"] = parseInt(Date.now() / 1000)
        actionExecutionProperties["Status"] = "Created"
        actionExecutionProperties["InstanceId"] = props.data.ActionInstance.Id

        createActionExecutionMutation.mutate({
            "entityName": "ActionExecution",
            "entityProperties": actionExecutionProperties
        })
    }


    return (

        <Box border={1} className={classes.box_root}>
            <Grid container spacing={0} className={classes.grid_root}>
                <Grid item xs={1} style={{display: 'flex'}} onClick={() => {
                    handleSetClick(!click)
                }}>
                    <IconButton size="small" onClick={() => handleSetClick(!click)}>
                        {click ? <KeyboardArrowDown className={classes.collapse}/> :
                            <KeyboardArrowRight className={classes.collapse}/>}
                    </IconButton>
                    <Divider orientation="vertical" flexItem style={{marginLeft: 5, marginRight: 5}}/>
                    <IconButton disabled style={{color: 'black'}}>
                        <img src={DataChecksIcon} style={{width: 24, height: 24}} alt="Data checks icon"/>
                    </IconButton>
                </Grid>
                <Grid item xs={11} style={{fontSize: 20, paddingLeft: 10, paddingRight: 10}} onClick={() => {
                    handleSetClick(!click)
                }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4} style={{display: 'flex', fontSize: 18, alignItems: 'center'}}>
                            {props.data.ActionInstance.DisplayName}
                        </Grid>
                        <Grid item xs={12} sm={3}
                              style={{color: '#616161', fontSize: 16, alignItems: 'center', display: 'flex'}}>
                            {props.data.ActionInstance.RenderedTemplate}
                        </Grid>

                        <Grid item xs={12} sm={5} style={{display: 'flex', alignItems: 'center'}}>
                            <Grid container spacing={0} style={{
                                display: 'flex',
                                paddingLeft: 10,
                                paddingRight: 10,
                                color: '#616161',
                                alignItems: 'center'
                            }}>
                                <Grid item xs={6} style={{display: 'flex', fontSize: 16, alignItems: 'center'}}>
                                    <span style={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        marginLeft: 5
                                    }}>{props.data.ActionDefinition.RequestType}</span>
                                </Grid>
                                <Grid item xs={6} style={{display: 'flex', fontSize: 16}}>
                                    <span style={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        marginLeft: 5
                                    }}>{props.data.ActionDefinition.UniqueName}</span>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Collapse in={click} timeout="auto" unmountOnExit style={{paddingTop: 20, paddingBottom: 20}}>
                        <Grid item xs={12} style={{marginTop: 20, marginBottom: 20, color: 'dodgerblue'}}>
                            Action Instance Details
                        </Grid>
                        <Grid container spacing={2} style={{display: 'flex'}}>
                            <Grid item>
                                <TextField multiline defaultValue={props.data.ActionInstance.DisplayName}
                                           label="Display Name" variant="outlined" InputProps={{readOnly: 'true'}}/>
                            </Grid>
                            <Grid item>
                                <TextField multiline defaultValue={props.data.ActionInstance.Name} label="Name"
                                           variant="outlined" InputProps={{readOnly: 'true'}}/>
                            </Grid>
                            <Grid item>
                                <TextField multiline defaultValue={props.data.ActionInstance.RenderedTemplate}
                                           label="Rendered Template" variant="outlined"
                                           InputProps={{readOnly: 'true'}}/>
                            </Grid>


                        </Grid>
                        <Grid item xs={12} style={{marginTop: 20, marginBottom: 20, color: 'green'}}>
                            Action Parameter Instance Details
                        </Grid>
                        {props.data.ActionParameterInstance.map((parameterInstance, index) => (
                            <Grid container spacing={2} style={{display: 'flex'}}>
                                <Grid item>
                                    <TextField defaultValue={parameterInstance.ParameterValue} label="Parameter Value"
                                               variant="outlined"/>
                                </Grid>


                            </Grid>
                        ))}
                        <Grid container spacing={2} style={{display: 'flex'}}>
                            <Grid item>
                                <Button variant="outlined" style={{backgroundColor: 'green', color: 'white'}}
                                        onClick={handleCreateActionExecution}>
                                    Execute
                                </Button>
                                {
                                    (createActionExecutionMutation.isLoading || createActionExecutionMutation.isError) ? (
                                        <Grid item style={{
                                            marginLeft: 10,
                                            marginTop: 20,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <LoadingIndicator/>
                                        </Grid>
                                    ) : ((createActionExecutionMutation.isSuccess) ? ((
                                        <Grid item style={{
                                            marginLeft: 10,
                                            marginTop: 20,
                                            display: 'flex',
                                            justifyItems: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: 'green',
                                            letterSpacing: 0.6
                                        }}>
                                            <CheckCircleOutlinedIcon style={{color: 'green'}}/>&nbsp;Execution Created
                                        </Grid>
                                    )) : (<></>))
                                }
                            </Grid>

                        </Grid>

                    </Collapse>
                </Grid>
            </Grid>
        </Box>
    )
}

export default DataCleanActionsRow;