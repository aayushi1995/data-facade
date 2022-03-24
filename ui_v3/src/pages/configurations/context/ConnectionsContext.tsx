import React, {useCallback, useMemo, useReducer, useState} from "react";
import {useRetreiveData} from "../../../data_manager/data_manager";
import labels from "../../../labels/labels";
import {Alert, Snackbar} from "@mui/material";
import {AlertColor} from "@mui/material";
import { useQuery, UseQueryResult} from "react-query";
import {Fetcher} from "../../../generated/apis/api";
import {ProviderInstanceDetails} from "../../../generated/interfaces/Interfaces";
import * as CustomInterface from "../../../generated/interfaces/Interfaces";

export type NotificationType = {open: boolean, message?: string, severity?: AlertColor};
export type ConnectionsType = {
    selectedConnectionId?: string,
    providerInstanceDetailsQueryData?: UseQueryResult<ProviderInstanceDetails[]>,
    providerHistoryAndParametersQueryData?:  UseQueryResult<CustomInterface.ProviderRunsHistoryAndParameters[] | undefined>
};
export const ConnectionsContext = React.createContext<ConnectionsType>(
    {}
)
export type ConnectionsSetContextType = (newState: ConnectionsType) => null;
export type ConnectionsSetNotificationContextType =  React.Dispatch<React.SetStateAction<NotificationType>>;
export const ConnectionsSetContext = React.createContext<ConnectionsSetContextType>(
    (newState: ConnectionsType) => null
)
export const ConnectionsSetNotificationContext = React.createContext<ConnectionsSetNotificationContextType>(value => {})

const initialState: ConnectionsType = {};
type ConnectionsAction = { type: string, payload: ConnectionsType };
const reducer = (state: ConnectionsType, action: ConnectionsAction) => {
    return {...state, ...action.payload};
}
export const ProviderInstanceKey = [labels.entities.ProviderInstance, {
    "filter": {},
    "onlyDataSource": true
}];
export const ConnectionsProvider = ({children}: { children: React.ReactElement }) => {
    const [connectionsUserState, dispatch] = useReducer(reducer, initialState);

    const setConnectionsState: ConnectionsSetContextType = (arg) => {
        dispatch({type: 'SET_SELECTED_CARD_ID', payload: arg});
        return null;
    }
    const [notificationState, setNotificationState] = useState<NotificationType>({open: false});
    const handleNotificationClose = (event: any) => {
        setNotificationState({open: false});
    };

    const providerInstanceDetailsQueryData = useQuery(["ProviderInstanceDetails"], ()=>{
            return Fetcher.fetchData('GET', '/getProviderInstanceDetails', {});
    });

    const selectedConnection = useMemo(()=>{
        return providerInstanceDetailsQueryData.data?.find((connection)=>connection?.model?.Id === connectionsUserState.selectedConnectionId);
    }, [connectionsUserState.selectedConnectionId]);

    const providerHistoryAndParametersQueryData = useQuery(["getProviderHistoryAndParameters", selectedConnection?.model?.Id], ()=>{
        return selectedConnection?.model? Fetcher.fetchData('GET', '/getProviderHistoryAndParameters', selectedConnection.model): undefined;
    }, {enabled: !!selectedConnection});

    const connectionsState = {
        selectedConnectionId: connectionsUserState.selectedConnectionId,
        providerInstanceDetailsQueryData,
        providerHistoryAndParametersQueryData
    };

    return <ConnectionsContext.Provider value={connectionsState}>
        <ConnectionsSetContext.Provider value={setConnectionsState}>
            <ConnectionsSetNotificationContext.Provider value={setNotificationState}>
                <Snackbar open={notificationState.open} autoHideDuration={4000} onClose={handleNotificationClose}>
                    <Alert onClose={handleNotificationClose} elevation={6} variant="filled" severity={notificationState.severity}>
                        {notificationState.message}
                    </Alert>
                </Snackbar>
                {children}
            </ConnectionsSetNotificationContext.Provider>
        </ConnectionsSetContext.Provider>
    </ConnectionsContext.Provider>
}