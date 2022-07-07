import { Box } from "@mui/material";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import LoadingIndicator from "../../../common/components/LoadingIndicator";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import { ConnectionQueryContext, ConnectionSetStateContext, ConnectionStateContext } from "../context/ConnectionsContext";
import ProviderParameterInput, { ProviderParameterInputProps } from "./ProviderParameterInput";
import UpdateProviderOptions from "./UpdateProviderOptions";

type MatchParams = {
    ProviderInstanceId: string,
    ViewName: string
}

const ConnectionDetailsSetup = (props: {ProviderInstanceId: string}) => {
    const match = useRouteMatch<MatchParams>()
    const connectionState = React.useContext(ConnectionStateContext)
    const setConnectionState = React.useContext(ConnectionSetStateContext)
    const connectionQuery = React.useContext(ConnectionQueryContext)

    React.useEffect(() => {
        console.log("Here")
        setConnectionState({ type: "SetMode", payload: { mode: "UPDATE" }})
        setConnectionState({ type: "SetProviderInstanceId", payload: { newProviderInstanceId: props.ProviderInstanceId } })
    }, [])


    console.log(connectionState)

    return (
        <ReactQueryWrapper
            isLoading={connectionQuery?.loadProviderDefinitionQuery?.isLoading || connectionQuery?.loadProviderInstanceQuery?.isLoading}
            error={connectionQuery?.loadProviderDefinitionQuery?.error || connectionQuery?.loadProviderInstanceQuery?.error}
            data={connectionQuery?.loadProviderInstanceQuery?.data}
            children={() => {
                if(!!connectionState?.ProviderInformation && !!connectionState?.ProviderDefinitionDetail) {
                    const paramInputProps: ProviderParameterInputProps = {
                        ProviderDefinition: connectionState.ProviderDefinitionDetail,
                        ProviderInstance: connectionState.ProviderInformation,
                        recurrenceInterval: connectionState.RecurrenceInterval,
                        onParameterValueChange: (parameterDefinitionId?: string, parameterValue?: string) => setConnectionState({ type: "SetProviderParameterValue", payload: { parameterDefinitionId: parameterDefinitionId, newValue: parameterValue }}),
                        onProviderInstanceNameChange: (newName?: string) => setConnectionState({ type: "SetProviderInstanceName", payload: { newName: newName }}),
                        onCreate: () => {},
                        onRecurrenceIntervalChange: (interval: number) => setConnectionState({type: 'SetRecurrenceInterval', payload: { recurrenceInterval: interval }})
                    }
                    return (
                        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", 
                            background: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #F8F8F8",
                            backgroundBlendMode: "soft-light, normal",
                            border: "2px solid rgba(255, 255, 255, 0.4)",
                            boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
                            borderRadius: "20px",
                            p: 3
                        }}>
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
    )
}

export default ConnectionDetailsSetup