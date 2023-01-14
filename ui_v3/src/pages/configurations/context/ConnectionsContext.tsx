import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { useReducer, useState } from "react";
import { UseMutationResult, useQuery, UseQueryResult } from "react-query";
import { useHistory } from "react-router";
import { v4 as uuidv4 } from 'uuid';
import { DATA_CONNECTIONS_ROUTE } from "../../../common/components/header/data/DataRoutesConfig";
import { Fetcher } from "../../../generated/apis/api";
import { ProviderParameterDefinition, ProviderParameterInstance } from "../../../generated/entities/Entities";
import { ProviderDefinitionDetail, ProviderInformation } from "../../../generated/interfaces/Interfaces";
import labels from "../../../labels/labels";
import { ProviderInstanceConfig } from "../components/ConnectionsDataGrid";
import { useSaveDataSource } from "../hooks/useSaveDataSource";

export type NotificationState = {open: boolean, message?: string, severity?: AlertColor};
export type ConnectionStateMode = "CREATE" | "UPDATE"

export type ConnectionState = {
    mode: ConnectionStateMode,
    ProviderDefinitionDetail?: ProviderDefinitionDetail,
    ProviderInformation?: ProviderInformation,
    RecurrenceInterval?: number
};

export type ConnectionQuery = {
    saveMutation?: UseMutationResult<ProviderInformation, unknown, ConnectionState, unknown>,
    loadProviderInstanceQuery?: UseQueryResult<ProviderInformation, unknown>,
    loadProviderDefinitionQuery?: UseQueryResult<ProviderDefinitionDetail, unknown>
}

export const ConnectionStateContext = React.createContext<ConnectionState>({ mode: "CREATE" })
export const ConnectionQueryContext = React.createContext<ConnectionQuery>({})

export type ConnectionsSetState = (action: SetConnectionStateAction) => void;
export type ConnectionsSetNotificationContextType =  React.Dispatch<React.SetStateAction<NotificationState>>;
export const ConnectionSetStateContext = React.createContext<ConnectionsSetState>((action: SetConnectionStateAction) => null)
export const ConnectionSetNotificationContext = React.createContext<ConnectionsSetNotificationContextType>(value => {})

type SetModeAction = {
    type: "SetMode",
    payload: {
        mode: ConnectionStateMode
    }
}

type SetProviderDefinitionIdAction = {
    type: "SetProviderDefinitionId",
    payload: {
        newProviderDefinitionId: string
    }
}

type SetProviderInstanceIdAction = {
    type: "SetProviderInstanceId",
    payload: {
        newProviderInstanceId: string
    }
}

type SetProviderDefinitionAction = {
    type: "SetProviderDefinition",
    payload: {
        providerDefinition: ProviderDefinitionDetail
    }
}

type SetProviderInstanceAction = {
    type: "SetProviderInstance",
    payload: {
        providerInstance: ProviderInformation
    }
}

type SetProviderInstanceNameAction = {
    type: "SetProviderInstanceName",
    payload: {
        newName?: string
    }
}

type SetProviderParameterValueAction = {
    type: "SetProviderParameterValue",
    payload: {
        newValue?: string,
        parameterDefinitionId?: string
    }
}

type SetRecurrenceInterval = {
    type: "SetRecurrenceInterval",
    payload: {
        recurrenceInterval: number
    }
}

type SetDefaultProviderValue = {
    type: "SetDefaultProviderValue",
    payload: {
        newValue: boolean
    }
}

type SetConnectionStateAction = SetModeAction | 
SetProviderDefinitionIdAction | 
SetProviderInstanceIdAction | 
SetProviderDefinitionAction | 
SetProviderInstanceAction |
SetProviderInstanceNameAction |
SetProviderParameterValueAction |
SetRecurrenceInterval |
SetDefaultProviderValue

const reducer = (state: ConnectionState, action: SetConnectionStateAction): ConnectionState => {
    switch(action.type) {
        case "SetMode": {
            return {
                ...state,
                mode: action.payload.mode
            }
        }

        case "SetProviderDefinitionId": {
            return {
                ...state,
                ProviderInformation: {
                    ProviderInstance: {
                        model: {
                            ProviderDefinitionId: action.payload.newProviderDefinitionId
                        }
                    }
                }
            }
        }

        case "SetProviderInstanceId": {
            if(action.payload.newProviderInstanceId !== state.ProviderInformation?.ProviderInstance?.model?.Id) {
                return {
                    ...state,
                    ProviderDefinitionDetail: undefined,
                    ProviderInformation: {
                        ProviderInstance: {
                            model: {
                                Id: action.payload.newProviderInstanceId
                            }
                        }
                    }
                }
            } 
            return state
        }

        case "SetProviderDefinition": {
            return {
                ...state,
                ProviderDefinitionDetail: action.payload.providerDefinition,
                ProviderInformation: {
                    ...state?.ProviderInformation,
                    ProviderParameterInstance: validateParams(action?.payload?.providerDefinition?.ProviderParameterDefinition, state?.ProviderInformation?.ProviderParameterInstance) 
                }
            }
        }

        case "SetProviderInstance": {
            return {
                ...state,
                ProviderDefinitionDetail: undefined,
                ProviderInformation: action.payload.providerInstance
            }
        }

        case "SetProviderInstanceName": {
            return {
                ...state,
                ProviderInformation: {
                    ...state?.ProviderInformation,
                    ProviderInstance: {
                        ...state?.ProviderInformation?.ProviderInstance,
                        model: {
                            ...state?.ProviderInformation?.ProviderInstance?.model,
                            Name: action.payload.newName
                        }
                    }
                }
            }
        }

        case "SetProviderParameterValue": {
            return {
                ...state,
                ProviderInformation: {
                    ...state?.ProviderInformation,
                    ProviderParameterInstance: state?.ProviderInformation?.ProviderParameterInstance?.map(param => param?.ProviderParameterDefinitionId!==action.payload.parameterDefinitionId ? param : ({...param, ParameterValue: action?.payload?.newValue}))
                }
            }
        }

        case "SetRecurrenceInterval": {
            return {
                ...state,
                RecurrenceInterval: action.payload.recurrenceInterval > 0 ? action.payload.recurrenceInterval : undefined
            }
        }

        case "SetDefaultProviderValue": {
            return {
                ...state,
                ProviderInformation: {
                    ...state?.ProviderInformation,
                    ProviderInstance: {
                        ...state?.ProviderInformation?.ProviderInstance,
                        model: {
                            ...state.ProviderInformation?.ProviderInstance?.model,
                            IsDefaultProvider: action.payload.newValue
                        }
                    }
                }
            }
        }

        default: {
            return state
        }
    }
    return state
}

const formDefaultProviderParameterInstance = (paramDef: ProviderParameterDefinition) => {
    const defaultParameter: ProviderParameterInstance = {
        Id: uuidv4(),
        ProviderParameterDefinitionId: paramDef.Id,
        ParameterValue: "",
        ParameterName: paramDef.ParameterName,
        Protected: paramDef.Protected
    }
    return defaultParameter
}

const validateParams = (paramDefinitions?: ProviderParameterDefinition[], paramInstances?: ProviderParameterInstance[]): ProviderParameterInstance[] => {
    if(!!paramDefinitions) {
        const newParamInstances = paramDefinitions.map( paramDef => paramInstances?.find(paramInstance => paramInstance?.ProviderParameterDefinitionId === paramDef?.Id) || formDefaultProviderParameterInstance(paramDef) )
        return newParamInstances || []
    }
    return paramInstances || []
}

export const ProviderInstanceKey = [labels.entities.ProviderInstance, {
    "filter": {},
    "onlyDataSource": true
}];

export const ConnectionsProvider = ({children}: { children: React.ReactElement }) => {
    const history = useHistory()
    const formDefaultConnectionState: ConnectionState = { mode: "CREATE", ProviderInformation: { ProviderInstance: { model: {}, tags: [] }, ProviderParameterInstance: []} }

    const [connectionState, dispatch] = useReducer(reducer, formDefaultConnectionState);

    const providerInstanceId = connectionState?.ProviderInformation?.ProviderInstance?.model?.Id
    const providerDefinitionId = connectionState?.ProviderInformation?.ProviderInstance?.model?.ProviderDefinitionId
    const syncActionInstanceId = connectionState?.ProviderInformation?.ProviderInstance?.model?.Config ? (JSON.parse(connectionState?.ProviderInformation?.ProviderInstance?.model?.Config) as ProviderInstanceConfig).SyncActionInstanceId : undefined

    
    const setConnectionsState: ConnectionsSetState = (arg: SetConnectionStateAction) => dispatch(arg)

    const [notificationState, setNotificationState] = useState<NotificationState>({open: false});
    const handleNotificationClose = (event: any) => {
        setNotificationState({open: false});
    };
    
    const loadProviderInstance = useQuery(
        [labels.entities.ProviderInstance, "Detail", providerInstanceId], 
        () => Fetcher.fetchData("GET", "/getProviderInstance", { Id: providerInstanceId }).then(data => data?.[0]),
        {
            enabled: false,
            onSuccess: (data) => setConnectionsState({ type: "SetProviderInstance", payload: { providerInstance: data } })
        }
    )

    const loadProviderDefinition = useQuery(
        [labels.entities.ProviderDefinition, "Detail", providerDefinitionId],
        () => Fetcher.fetchData("GET", "/providerDefinitionDetail", { Id: providerDefinitionId }).then(data => data?.[0]),
        {
            enabled: false,
            onSuccess: (data) => setConnectionsState({ type: "SetProviderDefinition", payload: { providerDefinition: data }})
        }
    )

    const getSyncActionInstance = useQuery(
        [labels.entities.ActionInstance, "Sync", syncActionInstanceId],
        () => Fetcher.fetchData("GET", "/getActionInstances", {Id: syncActionInstanceId}).then(data => data?.[0]),
        {
            enabled: false,
            onSuccess: (data) => setConnectionsState({type: "SetRecurrenceInterval", payload: {recurrenceInterval: (data?.RecurrenceIntervalInSecs || 0)/60}})
        }
    )
        
    React.useEffect(() => {
        if(connectionState.mode === "UPDATE" && !!providerInstanceId) {
            loadProviderInstance.refetch()
        }
    }, [providerInstanceId, connectionState.mode])

    React.useEffect(() => {
        if(connectionState.mode === 'UPDATE' && !!syncActionInstanceId) {
            getSyncActionInstance.refetch()
        } else if(connectionState.mode === 'UPDATE' && !syncActionInstanceId) {
            setConnectionsState({type: "SetRecurrenceInterval", payload: {recurrenceInterval: 0}})
        }
    }, [syncActionInstanceId])

    React.useEffect(() => {
        if(!!providerDefinitionId) {
            loadProviderDefinition.refetch()
        }
    }, [providerDefinitionId, connectionState?.ProviderDefinitionDetail])

    const saveMutation = useSaveDataSource({
        options: {
            onSuccess: (data, varibles, context) => {
                if(connectionState.mode === "CREATE"){
                    history.push(DATA_CONNECTIONS_ROUTE)
                } else {
                    loadProviderInstance.refetch()
                }
            }
        },
        mode: connectionState.mode
    })

    const connectionQuery: ConnectionQuery = {
        saveMutation: saveMutation,
        loadProviderInstanceQuery: loadProviderInstance,
        loadProviderDefinitionQuery: loadProviderDefinition
    }

    return (
        <ConnectionQueryContext.Provider value={connectionQuery}>
            <ConnectionStateContext.Provider value={connectionState}>
                <ConnectionSetStateContext.Provider value={setConnectionsState}>
                    <ConnectionSetNotificationContext.Provider value={setNotificationState}>
                        <Snackbar open={notificationState.open} autoHideDuration={4000} onClose={handleNotificationClose}>
                            <Alert onClose={handleNotificationClose} elevation={6} variant="filled" severity={notificationState.severity}>
                                {notificationState.message}
                            </Alert>
                        </Snackbar>
                        {children}
                    </ConnectionSetNotificationContext.Provider>
                </ConnectionSetStateContext.Provider>
            </ConnectionStateContext.Provider>
        </ConnectionQueryContext.Provider>
    )
}