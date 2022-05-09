import { Box } from "@mui/material";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import LoadingIndicator from "../../../common/components/LoadingIndicator";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import { ConnectionQueryContext, ConnectionSetStateContext, ConnectionStateContext } from "../context/ConnectionsContext";
import ProviderParameterInput, { ProviderParameterInputProps } from "./ProviderParameterInput";
import UpdateProviderOptions from "./UpdateProviderOptions";

type MatchParams = {
    ProviderInstanceId: string
}

export const ConnectionDetails = () => {
    const match = useRouteMatch<MatchParams>()
    const connectionState = React.useContext(ConnectionStateContext)
    const setConnectionState = React.useContext(ConnectionSetStateContext)
    const connectionQuery = React.useContext(ConnectionQueryContext)

    React.useEffect(() => {
        setConnectionState({ type: "SetMode", payload: { mode: "UPDATE" }})
    }, [])

    React.useEffect(() => {
        setConnectionState({ type: "SetProviderInstanceId", payload: { newProviderInstanceId: match.params.ProviderInstanceId } })
    }, [match.params.ProviderInstanceId])

    return (
        <ReactQueryWrapper
            isLoading={connectionQuery?.loadProviderDefinitionQuery?.isLoading}
            error={connectionQuery?.loadProviderDefinitionQuery?.error}
            data={connectionQuery?.loadProviderDefinitionQuery?.data}
            children={() => 
                <ReactQueryWrapper
                    isLoading={connectionQuery?.loadProviderInstanceQuery?.isLoading}
                    error={connectionQuery?.loadProviderInstanceQuery?.error}
                    data={connectionQuery?.loadProviderInstanceQuery?.data}
                    children={() => {
                        if(!!connectionState?.ProviderInformation && !!connectionState?.ProviderDefinitionDetail) {
                            const paramInputProps: ProviderParameterInputProps = {
                                ProviderDefinition: connectionState.ProviderDefinitionDetail,
                                ProviderInstance: connectionState.ProviderInformation,
                                onParameterValueChange: (parameterDefinitionId?: string, parameterValue?: string) => setConnectionState({ type: "SetProviderParameterValue", payload: { parameterDefinitionId: parameterDefinitionId, newValue: parameterValue }}),
                                onProviderInstanceNameChange: (newName?: string) => setConnectionState({ type: "SetProviderInstanceName", payload: { newName: newName }}),
                                onCreate: () => {}
                            }
                            return (
                                <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                                    <Box sx={{ height: "100%" }}>
                                        <ProviderParameterInput {...paramInputProps}/>
                                    </Box>
                                    <Box>
                                        <UpdateProviderOptions/>
                                    </Box>
                                </Box>
                            )
                        } else {
                            return <LoadingIndicator/>
                        }
                    }}
                />
            }
        />
    )
}