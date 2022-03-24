import React from 'react'
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
import {v4 as uuidv4} from 'uuid'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LoadingIndicator from '../../../common/components/LoadingIndicator'
import labels from './../../../labels/labels'
import dataManagerInstance, {useRetreiveData} from './../../../data_manager/data_manager'
import useStyles from './../../../css/configurations/CreateDataSourceRow'
import {useHistory, useRouteMatch} from "react-router-dom";


const CreateDataSourceRow = ({selectedId, handleClose}) => {
    const match = useRouteMatch();
    const history = useHistory();
    const classes = useStyles();
    const [click, setClick] = React.useState(false)
    const Id = match.params.Id;
    const [createAndSyncDialogOpen, setCreateAndSyncDialogOpen] = React.useState(false)
    const [recurrentState, setRecurrentState] = React.useState({isSet: false, interval: 86400})
    const providerInstanceId = uuidv4()
    const {isLoading, error, data} = useRetreiveData(labels.entities.ProviderDefinition, {
        "filter": {
            "ProviderType": "DataSource",
            Id: selectedId || Id
        },
        "withProviderParameterDefinition": true
    });
    const ProviderDefinition = data?.[0]?.ProviderDefinition;
    const dataParameters = data?.[0]?.ProviderParameterDefinition;

    const handleSetClick = (event) => {
        setClick(event)
    }

    const handleCreateAndSyncDialogOpen = () => {
        setCreateAndSyncDialogOpen(true)
    }
    const handleCreateAndSyncDialogClose = () => {
        setCreateAndSyncDialogOpen(false)
    }

    const mutation = useMutation((createInstance) => {
        const config = dataManagerInstance.getInstance.saveData(createInstance.entityName, {
            "entityProperties": createInstance.entityProperties,
            "ProviderParameterInstanceEntityProperties": createInstance.providerParameterInstances,
            "withProviderParameterInstance": true
        })

        let response = config.then(res => res.json())
        return response

    })

    const handleCreate = () => {

        const providerInstance = {
            "Id": providerInstanceId,
            "Name": document.getElementById(`create-data-source-instance-name${Id}`).value,
            "ProviderDefinitionId": Id,
            "CreatedOn": Date.now()
        }

        const providerParameterInstance = []
        dataParameters.filter((elem) => elem.FilledBy === 'User').forEach((elem, index) => {
            providerParameterInstance.push({
                "Id": uuidv4(),
                "ProviderInstanceId": providerInstance.Id,
                "ProviderParameterDefinitionId": elem.Id,
                "ParameterName": elem.ParameterName,
                "ParameterValue": document.getElementById(`create-data-source-parameters${ProviderDefinition.Id}-${elem.Id}`).value,
                "FilledBy": elem.FilledBy,
                "DataType": elem.DataType,
                "CreatedOn": providerInstance.CreatedOn,
                "ModifiedOn": providerInstance.CreatedOn
            })
        })
        mutation.mutate({
            "entityName": labels.entities.ProviderInstance,
            "entityProperties": providerInstance,
            "providerParameterInstances": providerParameterInstance
        }, {
            onSettled: handleClose()
        })
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


        handleCreateAndSyncDialogClose()
        handleCreate()
        console.log(mutation)
        if (mutation.isSuccess) {
            syncProviderInstance.mutate(
                {
                    providerInstanceId: providerInstanceId,
                    syncDepthConfig: {
                        providerSyncAction: true,
                        SyncDepth: "Tables"
                    },
                    recurrenceConfig: formRecurrenceConfig()
                }
            )
        }
    }

    const handleTablesAndColumnsSync = () => {

        handleCreateAndSyncDialogClose()
        handleCreate()
        if (mutation.isSuccess) {
            syncProviderInstance.mutate(
                {
                    providerInstanceId: providerInstanceId,
                    syncDepthConfig: {
                        providerSyncAction: true,
                        SyncDepth: "TablesAndColumns"
                    },
                    recurrenceConfig: formRecurrenceConfig()
                }
            )
        }
    }
    const handleRecurrentToggle = () => {
        setRecurrentState((oldState) => {
            return {
                ...oldState,
                isSet: !oldState.isSet
            }
        })
    }
    if (isLoading) {
        return (<LoadingIndicator/>)
    } else if (error) {
        return (<div>Error</div>)
    }
    return (
        <Box>
            <Grid container alignItems="flex-start" spacing={2} style={{
                flexDirection: "column"
            }}>
                <Grid item>
                    <TextField className={classes.text_field} variant="outlined" label="Instance name" required
                               id={`create-data-source-instance-name${Id}`}/>
                </Grid>
                {dataParameters?.filter((elem) => elem.FilledBy === 'User')?.map((elem, index) => (
                    <Grid item>
                        <TextField className={classes.text_field} variant="outlined" label={elem.ParameterName} required
                                   id={`create-data-source-parameters${Id}-${elem.Id}`}/>
                    </Grid>
                ))}
                <Grid container item spacing={2}>
                    <Grid item className={classes.button_margin}>
                        <Button variant="outlined" disableElevation className={classes.create_button}
                                onClick={handleCreate}>{labels.CreateDataSourceRow.create}</Button>
                    </Grid>
                    {
                        (mutation.isLoading || mutation.isError) ? (
                            <Grid item className={classes.loading_indicator}>
                                <LoadingIndicator/>
                            </Grid>
                        ) : ((mutation.isSuccess) ? ((
                            <Grid item className={classes.success}>
                                <CheckCircleOutlinedIcon
                                    className={classes.check_circle}/>&nbsp;{labels.CreateDataSourceRow.success}
                            </Grid>
                        )) : (<></>))
                    }
                    <Grid item className={classes.button_margin}>
                        <Button variant="outlined" disableElevation className={classes.create_button}
                                onClick={handleCreateAndSyncDialogOpen}>{labels.CreateDataSourceRow.create_and_sync}</Button>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog onClose={handleCreateAndSyncDialogClose} open={createAndSyncDialogOpen} fullWidth={true}>
                <DialogTitle id="simple-dialog-title"
                             style={{background: "#f3f4ed"}}>Sync {ProviderDefinition?.Name}</DialogTitle>
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
                                                checked={recurrentState?.isSet}
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
        </Box>
    )
}

export default CreateDataSourceRow;