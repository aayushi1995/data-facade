import { Box, Grid, TextField } from '@mui/material';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { ProviderDefinitionDetail, ProviderInformation } from '../../../generated/interfaces/Interfaces';
import { ConnectionSetStateContext, ConnectionStateContext } from '../context/ConnectionsContext';

type ProviderParameterInputProps = { 
    ProviderDefinition?: ProviderDefinitionDetail,
    ProviderInstance?: ProviderInformation,
    onParameterValueChange?: ( parameterDefinitionId?: string, parameterValue?: string ) => void,
    onProviderInstanceNameChange?: ( newName: string ) => void,
    onCreate?: () => void
};

const ProviderParameterInput = ( props: ProviderParameterInputProps ) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Grid container spacing={2} sx={{ py: 2 }}>
                <Grid item xs={12}>
                    <TextField sx={{ height: "100%" }} fullWidth variant="outlined" label="Instance name" required value={props?.ProviderInstance?.ProviderInstance?.model?.Name} onChange={(event) => props?.onProviderInstanceNameChange?.(event.target.value)}/>
                </Grid>
                {props?.ProviderInstance?.ProviderParameterInstance?.map(paramInstance => {
                    const paramDef = props?.ProviderDefinition?.ProviderParameterDefinition?.find(paramDef => paramInstance?.ProviderParameterDefinitionId === paramDef?.Id)
                    if(!!paramDef && paramDef?.FilledBy==="User") {
                        return (
                            <Grid item xs={12}>
                                <TextField sx={{ height: "100%" }} fullWidth variant="outlined" label={paramDef?.ParameterName} value={paramInstance?.ParameterValue} required onChange={(event) => props?.onParameterValueChange?.(paramDef?.Id, event.target.value)}/>
                            </Grid>
                        )
                    } else {
                        return <></>
                    }
                })}
            </Grid>
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
            onCreate: () => {}
        }
        return <ProviderParameterInput {...paramInputProps}/>
    } else {
        return <></>
    }
}


export default ProviderParameterInput;