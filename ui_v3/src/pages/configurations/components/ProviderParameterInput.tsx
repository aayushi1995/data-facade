import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { ProviderDefinitionDetail, ProviderInformation } from '../../../generated/interfaces/Interfaces';
import { ConnectionSetStateContext, ConnectionStateContext } from '../context/ConnectionsContext';

export type ProviderParameterInputProps = { 
    ProviderDefinition?: ProviderDefinitionDetail,
    ProviderInstance?: ProviderInformation,
    onParameterValueChange?: ( parameterDefinitionId?: string, parameterValue?: string ) => void,
    onProviderInstanceNameChange?: ( newName: string ) => void,
    onCreate?: () => void
};

const ProviderParameterInput = ( props: ProviderParameterInputProps ) => {
    const [showHidden, setShowHidden] = React.useState(false)

    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                    <TextField sx={{ height: "100%" }} fullWidth variant="outlined" label="Instance name" required value={props?.ProviderInstance?.ProviderInstance?.model?.Name} onChange={(event) => props?.onProviderInstanceNameChange?.(event.target.value)}/>
                </Box>
                {props?.ProviderInstance?.ProviderParameterInstance?.map(paramInstance => {
                    const paramDef = props?.ProviderDefinition?.ProviderParameterDefinition?.find(paramDef => paramInstance?.ProviderParameterDefinitionId === paramDef?.Id)
                    const hidden = (paramDef?.Protected || false) && (!showHidden)
                    if(!!paramDef) {
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