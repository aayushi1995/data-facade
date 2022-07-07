import { Box, Checkbox, FormControlLabel, TextField, Grid, Divider, Typography, Card } from '@mui/material';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import LoadingIndicator from '../../../common/components/LoadingIndicator';
import { ProviderDefinitionDetail, ProviderInformation } from '../../../generated/interfaces/Interfaces';
import { ProviderIcon } from '../../data/components/connections/ConnectionDialogContent';
import { ConnectionQueryContext, ConnectionSetStateContext, ConnectionStateContext } from '../context/ConnectionsContext';

export type ProviderParameterInputProps = { 
    ProviderDefinition?: ProviderDefinitionDetail,
    ProviderInstance?: ProviderInformation,
    onParameterValueChange?: ( parameterDefinitionId?: string, parameterValue?: string ) => void,
    onProviderInstanceNameChange?: ( newName: string ) => void,
    onCreate?: () => void,
    onRecurrenceIntervalChange?: (interval: number) => void,
    recurrenceInterval?: number
};

const ProviderParameterInput = ( props: ProviderParameterInputProps ) => {
    const [showHidden, setShowHidden] = React.useState(false)
    const connectionQueryState = React.useContext(ConnectionQueryContext)
    console.log(props.recurrenceInterval)
    return (
        <Box>
            {connectionQueryState?.loadProviderDefinitionQuery?.isLoading ? (
                <LoadingIndicator/>
            ) : (
                <Grid container sx={{minHeight: '100%'}}>
                    <Grid item xs={5}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box>
                                <TextField sx={{ height: "100%" }} fullWidth variant="outlined" label="Instance name" required value={props?.ProviderInstance?.ProviderInstance?.model?.Name} onChange={(event) => props?.onProviderInstanceNameChange?.(event.target.value)}/>
                            </Box>
                            {props?.ProviderInstance?.ProviderParameterInstance?.map(paramInstance => {
                                const paramDef = props?.ProviderDefinition?.ProviderParameterDefinition?.find(paramDef => paramInstance?.ProviderParameterDefinitionId === paramDef?.Id)
                                const hidden = (paramDef?.Protected || false) && (!showHidden)
                                if(!!paramDef && paramDef?.FilledBy!=="FDS") {
                                    return (
                                        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}>
                                            <Box sx={{ display: "flex", flex: 1 }}>
                                                <TextField sx={{ height: "100%" }} fullWidth variant="outlined" type={hidden ? "password" : undefined} label={paramDef?.ParameterName} value={paramInstance?.ParameterValue} required onChange={(event) => props?.onParameterValueChange?.(paramDef?.Id, event.target.value)}/>
                                            </Box>
                                        </Box>
                                    )
                                } else {
                                    return <></>
                                }
                            })}
                        </Box>
                        <Box>
                            <FormControlLabel label="Show Hidden"
                                control={
                                    <Checkbox checked={showHidden} onChange={(event) => setShowHidden(event.target.checked)}/>
                                }
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Divider flexItem orientation="vertical"/>
                    </Grid>
                        
                    <Grid item xs={5} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                        <TextField value={props.recurrenceInterval} fullWidth sx={{height: '100%'}} label="Recurrence Interval in Minutes" type="number" onChange={(event) => props?.onRecurrenceIntervalChange?.(parseInt(event.target.value))}/>
                    </Grid>
                </Grid>
            )}
            
        </Box>
    )
}

export const ProviderInputConnectionStateWrapper = ({ match }: RouteComponentProps<{ ProviderDefinitionId: string }>) => {
    const connectionState = React.useContext(ConnectionStateContext)
    const setConnectionState = React.useContext(ConnectionSetStateContext)

    React.useEffect(() => {
        setConnectionState({ type: "SetProviderDefinitionId", payload: { newProviderDefinitionId: match.params.ProviderDefinitionId }})
    }, [])


    if(!!connectionState?.ProviderInformation && !!connectionState?.ProviderDefinitionDetail) {
        const paramInputProps: ProviderParameterInputProps = {
            ProviderDefinition: connectionState.ProviderDefinitionDetail,
            ProviderInstance: connectionState.ProviderInformation,
            onParameterValueChange: (parameterDefinitionId?: string, parameterValue?: string) => setConnectionState({ type: "SetProviderParameterValue", payload: { parameterDefinitionId: parameterDefinitionId, newValue: parameterValue }}),
            onProviderInstanceNameChange: (newName?: string) => setConnectionState({ type: "SetProviderInstanceName", payload: { newName: newName }}),
            onCreate: () => {},
            recurrenceInterval: connectionState.RecurrenceInterval,
            onRecurrenceIntervalChange: (recurrenceInterval?: number) => setConnectionState({
                type: 'SetRecurrenceInterval',
                payload: {
                    recurrenceInterval: recurrenceInterval || 0
                }
            })
        }
        return (
            <Card sx={{
                background:
                "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #F8F8F8",
                backgroundBlendMode: "soft-light, normal",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
                borderRadius: "20px",
                m: 2
            }}>
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 1, p: 2}}>
                    <Box sx={{width: '100%', display: 'flex', alignItems: 'center', gap: 1}}>
                        <ProviderIcon providerUniqueName={connectionState.ProviderDefinitionDetail.ProviderDefinition?.UniqueName}/>
                        <Typography variant="heroHeader" sx={{fontSize: 20}}>Connect {connectionState.ProviderDefinitionDetail.ProviderDefinition?.UniqueName}</Typography>
                    </Box>
                    <Box sx={{width: '100%'}}>
                    <ProviderParameterInput {...paramInputProps}/>
                    </Box>
                </Box>
            </Card>
        )
    } else {
        return <></>
    }
}


export default ProviderParameterInput;