import React from "react";
import { useMutation } from "react-query";
import { useRouteMatch } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import useStyles from "../../../css/configurations/CreateDataSourceRow";
import dataManagerInstance, { useRetreiveData } from "../../../data_manager/data_manager";
import { ProviderParameterInstance } from "../../../generated/entities/Entities";
import labels from "../../../labels/labels";
import { ConnectionsContext } from "../context/ConnectionsContext";

export function useCreateDataSource(selectedId: string | undefined, isUpdate: boolean, handleClose: Function | undefined) {
    const match = useRouteMatch();
    const {providerHistoryAndParametersQueryData} = React.useContext(ConnectionsContext);
    const classes = useStyles();
    // @ts-ignore
    const Id = match.params.Id;
    const [createAndSyncDialogOpen, setCreateAndSyncDialogOpen] = React.useState(false)
    const [recurrentState, setRecurrentState] = React.useState({isSet: false, interval: 86400})
    const providerInstanceId = uuidv4()
    const providerDefinitionsQueryData = useRetreiveData(labels.entities.ProviderDefinition, {
        "filter": {
            "ProviderType": "DataSource",
            Id: selectedId || Id
        },
        "withProviderParameterDefinition": true
    }, {enabled: !isUpdate});
    const {isLoading, error, data} = providerDefinitionsQueryData
    const ProviderDefinition = data?.[0]?.ProviderDefinition;
    const dataParameters = data?.[0]?.ProviderParameterDefinition;

    const handleCreateAndSyncDialogOpen = () => {
        setCreateAndSyncDialogOpen(true)
    }
    const handleCreateAndSyncDialogClose = () => {
        setCreateAndSyncDialogOpen(false)
    }

    const mutation = useMutation((createInstance: {
        entityName?: string,
        entityProperties: { Id: string, Name: string, ProviderDefinitionId: any, CreatedOn: number },
        ProviderParameterInstanceEntityProperties?: any,
        providerParameterInstances: ProviderParameterInstance[]
    }) => {
        // @ts-ignore
        return dataManagerInstance.getInstance.saveData(createInstance.entityName, {
            "entityProperties": createInstance.entityProperties,
            "ProviderParameterInstanceEntityProperties": createInstance.providerParameterInstances,
            "withProviderParameterInstance": true
        });
    })

    const handleCreate = () => {
        const textFieldNameEl = document.getElementById(`create-data-source-instance-name${Id}`) as HTMLInputElement;
        const providerInstance = {
            "Id": providerInstanceId,
            "Name": textFieldNameEl?.value ?? '',
            "ProviderDefinitionId": Id,
            "CreatedOn": Date.now()
        }

        const providerParameterInstance:
            ProviderParameterInstance[] = []
        dataParameters.filter((elem: ProviderParameterInstance) => elem.FilledBy === 'User')
            .forEach((elem: ProviderParameterInstance) => {
                const textFieldParametersEl = document.getElementById(
                    `create-data-source-parameters${ProviderDefinition.Id}-${elem.Id}`
                ) as HTMLInputElement;
                providerParameterInstance.push({
                    "Id": uuidv4(),
                    "ProviderInstanceId": providerInstance.Id,
                    "ProviderParameterDefinitionId": elem.Id,
                    "ParameterName": elem.ParameterName,
                    "ParameterValue": textFieldParametersEl?.value ?? '',
                    "FilledBy": elem.FilledBy,
                    // @ts-ignore
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
            onSettled: () => handleClose?.()
        })
    }
    const syncProviderInstance = useMutation((config: {
        providerInstanceId: string,
        syncDepthConfig: any,
        recurrenceConfig: any
    }) => {
        // @ts-ignore
        return dataManagerInstance.getInstance.saveData(labels.entities.ActionInstance, {
            entityProperties: {
                Id: config.providerInstanceId
            },
            ...config.syncDepthConfig,
            ...config.recurrenceConfig
        });
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
    return {
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
    };
}