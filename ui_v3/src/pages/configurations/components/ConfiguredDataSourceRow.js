import React from 'react'

import { makeStyles } from '@mui/styles'
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    TextField,
    Typography
} from '@mui/material'
import {useMutation} from 'react-query'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LoadingIndicator from '../../../common/components/LoadingIndicator'
import NoData from '../../../common/components/NoData'
import dataManagerInstance, {useRetreiveData} from './../../../data_manager/data_manager'
import labels from './../../../labels/labels'
import {useHistory, useRouteMatch} from "react-router-dom";


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


const ConfiguredDataSourceRow = () => {

    const classes = useStyles();
    const [click, setClick] = React.useState(false)
    const [recurrentState, setRecurrentState] = React.useState({isSet: false, interval: 86400})
    const [dialogState, setDialogState] = React.useState({open: false})
    const [textFieldState, setTextFieldState] = React.useState({
        "state": []
    })
    const match = useRouteMatch();
    const history = useHistory();
    const Id = match.params.Id;
    const handleRecurrentToggle = () => {
        setRecurrentState((oldState) => {
            return {
                ...oldState,
                isSet: !oldState.isSet
            }
        })
    }

    const handleDialogClose = () => {
        setDialogState(oldState => {
                return {
                    ...oldState,
                    open: false
                }
            }
        )
    }

    const handleDialogOpen = () => {
        setDialogState(oldState => {
                return {
                    ...oldState,
                    open: true
                }
            }
        )
    }

    const {isLoading, error, data} = useRetreiveData(labels.entities.ProviderParameterInstance, {
        "filter": {
            "ProviderInstanceId": Id
        }
    });
    const {
        isLoading: isLoadingProviderInstance,
        error: errorProviderInstance,
        data: dataProviderInstance
    } = useRetreiveData(labels.entities.ProviderInstance, {
        "filter": {
            Id
        },
        "onlyDataSource": true
    })
    const dataProviderInstanceCurrent = dataProviderInstance?.[0];
    React.useEffect(() => {
        if (data !== undefined && dataProviderInstanceCurrent !== undefined) {
            const currTextFieldState = []
            currTextFieldState.push(dataProviderInstanceCurrent.Name)
            data.map((elem, index) => currTextFieldState.push(elem))
            setTextFieldState({
                "state": currTextFieldState

            })
        }
    }, [data, dataProviderInstanceCurrent, dataProviderInstanceCurrent?.Name])


    const handleSetClick = (event) => {
        setClick(event)
    }

    const syncProviderInstance = useMutation((config) => {

        const requestSpecification = dataManagerInstance.getInstance.saveData(labels.entities.ActionInstance, {
            entityProperties: {
                Id: config.providerInstanceId
            },
            ...config.syncDepthConfig,
            ...config.recurrenceConfig
        })

        let response = requestSpecification.then(res => res.json())
        return response
    })

    const updateMutation = useMutation((job) => {

        let response = job.updateRequest.then(res => res.json())
        return response
    })

    const formRecurrenceConfig = () => {
        if (recurrentState.isSet) {
            return {
                recurrent: true,
                Interval: recurrentState.interval
            }
        } else {
            return {}
        }
    }

    const handleTablesSync = () => {
        handleDialogClose()
        syncProviderInstance.mutate(
            {
                providerInstanceId: dataProviderInstanceCurrent.Id,
                syncDepthConfig: {
                    providerSyncAction: true,
                    SyncDepth: "Tables"
                },
                recurrenceConfig: formRecurrenceConfig()
            }
        )
    }

    const handleTablesAndColumnsSync = () => {
        handleDialogClose()
        syncProviderInstance.mutate(
            {
                providerInstanceId: dataProviderInstanceCurrent.Id,
                syncDepthConfig: {
                    providerSyncAction: true,
                    SyncDepth: "TablesAndColumns"
                },
                recurrenceConfig: formRecurrenceConfig()
            }
        )
    }

    const handleUpdate = () => {

        const parameterInstanceProperties = []
        const modifiedOn = Date.now()

        textFieldState.state.forEach((elem, index) => {
            if (index > 0) {
                parameterInstanceProperties.push({
                    "filter": {"Id": elem.Id},
                    "newProperties": {
                        "ModifiedOn": modifiedOn,
                        "ParameterValue": elem.ParameterValue
                    }
                })
            }
        })


        const updateRequest = dataManagerInstance.getInstance.patchData(labels.entities.ProviderInstance, {
            "filter": {
                "Id": dataProviderInstanceCurrent.Id
            },
            "newProperties": {
                "Name": textFieldState.state[0]
            },
            "withProviderParameterInstance": true,
            "ProviderParameterInstanceEntityProperties": parameterInstanceProperties
        })

        updateMutation.mutate({
            "updateRequest": updateRequest
        })
    }

    const handleTextFieldChange = (event, index) => {

        const currState = textFieldState.state
        if (index === 0) currState[0] = event.target.value
        else currState[index].ParameterValue = event.target.value
        setTextFieldState({
            state: currState
        })

    }

    if (isLoading) {
        return (<LoadingIndicator/>)
    } else if (error || !dataProviderInstanceCurrent) {
        return (<NoData/>)
    } else {
        return (
            <>
                <Dialog onClose={handleDialogClose} open={dialogState.open} fullWidth={true}>
                    <DialogTitle id="simple-dialog-title"
                                 style={{background: "#f3f4ed"}}>Sync {dataProviderInstanceCurrent.Name}</DialogTitle>
                    <DialogContent style={{background: "#f3f4ed"}}>
                        <Box mx={1} py={2}>
                            <Grid container spacing={2}>
                                <Grid container item xs={12} spacing={1}>
                                    <Grid item xs={4}>
                                        <Button variant="contained" color="primary" disableElevation
                                                style={{backgroundColor: 'green', margin: 0}} onClick={handleTablesSync}
                                                fullWidth={true}> Sync Tables</Button>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography>Sync Tables Only</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button variant="contained" color="primary" disableElevation
                                                style={{backgroundColor: 'green', margin: 0}}
                                                onClick={handleTablesAndColumnsSync} fullWidth={true}> Sync All</Button>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography>Sync Tables and Columns</Typography>
                                    </Grid>
                                    <Grid container item xs={12}>
                                        <Grid item xs={8}></Grid>
                                        <Grid item xs={4}>
                                            <FormControlLabel
                                                control={<Checkbox
                                                    checked={recurrentState.isSet}
                                                    onChange={handleRecurrentToggle}
                                                />}
                                                label="Daily"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                </Dialog>
                <Box border={1} className={classes.box_root}>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Grid container style={{display: 'flex', alignItems: 'center', paddingTop: 20}} spacing={0}>
                                <Grid item>
                                    <TextField style={{marginLeft: 30, marginRight: 30, marginTop: 20}}
                                               variant="outlined" label="Instance Name"
                                               defaultValue={dataProviderInstanceCurrent.Name} required
                                               onChange={(event) => handleTextFieldChange(event, 0)}/>
                                </Grid>
                                {data.map((elem, index) => (
                                    <Grid item>
                                        <TextField style={{marginLeft: 30, marginRight: 30, marginTop: 20}}
                                                   variant="outlined" label={elem.ParameterName}
                                                   defaultValue={elem.ParameterValue} required
                                                   onChange={(event) => handleTextFieldChange(event, index + 1)}/>
                                    </Grid>
                                ))}

                                <Grid item style={{marginTop: 20}}>
                                    <Button variant="contained" color="primary" disableElevation
                                            style={{backgroundColor: 'green', margin: 0}}
                                            onClick={handleDialogOpen}>Sync</Button>
                                </Grid>
                                {
                                    (syncProviderInstance.isLoading || syncProviderInstance.isError) ? (
                                        <Grid item style={{
                                            marginLeft: 10,
                                            marginTop: 20,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <LoadingIndicator/>
                                        </Grid>
                                    ) : ((syncProviderInstance.isSuccess) ? ((
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
                                            <CheckCircleOutlinedIcon style={{color: 'green'}}/>&nbsp;Sync Started
                                        </Grid>
                                    )) : (<></>))
                                }

                                <Grid item style={{marginTop: 20, marginLeft: 20}}>
                                    <Button variant="contained" color="primary" disableElevation
                                            style={{backgroundColor: 'green', margin: 0}}
                                            onClick={handleUpdate}>Update</Button>
                                </Grid>
                                {
                                    (updateMutation.isLoading || updateMutation.isError) ? (
                                        <Grid item style={{
                                            marginLeft: 10,
                                            marginTop: 20,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <LoadingIndicator/>
                                        </Grid>
                                    ) : ((updateMutation.isSuccess) ? ((
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
                                            <CheckCircleOutlinedIcon style={{color: 'green'}}/>&nbsp;Update Successful
                                        </Grid>
                                    )) : (<></>))
                                }

                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </>
        )
    }
}

export default ConfiguredDataSourceRow