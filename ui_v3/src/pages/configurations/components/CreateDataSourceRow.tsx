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
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LoadingIndicator from '../../../common/components/LoadingIndicator'
import labels from './../../../labels/labels'
import {ReactQueryWrapper} from "../../../common/components/ReactQueryWrapper";
import {ProviderParameterInstance} from "../../../generated/entities/Entities";
import {useCreateDataSource} from "../hooks/useCreateDataSource";

type CreateDataSourceRowType = { selectedId?: string, handleClose?: Function, isUpdate: boolean };

const CreateDataSourceRow = ({selectedId, handleClose= () => {}, isUpdate}:
                                 CreateDataSourceRowType) => {
    const {
        providerHistoryAndParametersQueryData,
        classes,
        Id,
        createAndSyncDialogOpen,
        recurrentState,
        providerDefinitionsQueryData,
        ProviderDefinition,
        dataParameters,
        handleCreateAndSyncDialogOpen,
        handleCreateAndSyncDialogClose,
        mutation,
        handleCreate,
        handleTablesSync,
        handleTablesAndColumnsSync,
        handleRecurrentToggle
    } = useCreateDataSource(selectedId, isUpdate, handleClose);
    const fullWidth = {
        flex: 1,
        display: 'flex',
        width: '100%'
    }
    const providerParameterInstances = isUpdate ? providerHistoryAndParametersQueryData?.data?.[0]?.ProviderParameterInstanceModels : dataParameters;
    return (
        <ReactQueryWrapper {...isUpdate ? providerHistoryAndParametersQueryData : providerDefinitionsQueryData}
                           sx={{
                               minHeight: 400,
                               display: 'flex',
                               justifyContent: 'center',
                               alignItems: 'center'
                           }}
        >
            {() => <Box>
                <Grid container alignItems="flex-start" spacing={2} style={{
                    flexDirection: "column"
                }}>
                    <Grid item sx={fullWidth}>
                        <TextField className={classes.text_field} variant="outlined" label="Instance name" required
                                   defaultValue={providerHistoryAndParametersQueryData?.data?.[0]?.model?.Name}
                                   id={`create-data-source-instance-name${Id}`}/>
                    </Grid>
                    {providerParameterInstances?.filter(
                        (elem: ProviderParameterInstance) => elem.FilledBy === 'User')?.map((elem: ProviderParameterInstance, index: number) => (
                        <Grid item sx={fullWidth}>
                            <TextField className={classes.text_field} variant="outlined" label={elem.ParameterName}
                                       defaultValue={elem.ParameterValue}
                                       required
                                       id={`create-data-source-parameters${Id}-${elem.Id}`}/>
                        </Grid>
                    ))}
                    <Grid container item spacing={2}>
                        <Grid item className={classes.button_margin}>
                            <Button variant="outlined" disableElevation className={classes.create_button}
                                    onClick={handleCreate}>{isUpdate ? labels.CreateDataSourceRow.update
                                : labels.CreateDataSourceRow.create}</Button>
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
            </Box>}
        </ReactQueryWrapper>
    )
}

export default CreateDataSourceRow;