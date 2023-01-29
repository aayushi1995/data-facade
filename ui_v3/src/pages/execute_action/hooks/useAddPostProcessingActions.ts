import React from "react"
import { useMutation } from "react-query"
import { Fetcher } from "../../../generated/apis/api"
import { ActionDefinition, ActionParameterInstance } from "../../../generated/entities/Entities"
import { ConfigureSelectedPostProcessingActionProps } from "../components/ConfigureSelectedPostProcessingAction"
import { SelectActionToAddProps } from "../components/SelectActionToAdd"
import { SelectedActionContainerProps } from "../components/SelectedActionContainer"
import { ExecuteActionContext, SetExecuteActionContext } from "../context/ExecuteActionContext"


const useAddPostProcessingActions = () => {

    const executeActionContext = React.useContext(ExecuteActionContext)
    const setExecuteActionContext = React.useContext(SetExecuteActionContext)

    const fetchActionDefinitionDetailsMutation = useMutation("FetchActionDefinitionDetails", 
        (params: {filter: ActionDefinition}) => Fetcher.fetchData("GET", "/getActionDefinitionDetails", params.filter)
    )

    const onActionAdded = (actionId: string) => {
        fetchActionDefinitionDetailsMutation.mutate({filter: {Id: actionId}}, {
            onSuccess: (data, variables, context) => {
                const unqiueActionDefinition = data?.[0]
                if(!!unqiueActionDefinition) {
                    setExecuteActionContext({
                        type: "AddPostProcessingActionDefinition",
                        payload: {
                            actionDetails: unqiueActionDefinition
                        }
                    })
                }
            }
        })
    }

    const getSelectActionToAddProps: () => SelectActionToAddProps = () => {
        return {
            handlers: {
                onActionAddHandler: onActionAdded
            }
        }
    }

    const onClickAction = (actionIndex: number) => {
        setExecuteActionContext({
            type: "SetSelectedPostProcessingActionIndex",
            payload: {
                actionIndex: actionIndex
            }
        })
    }

    const onParameterValueChange = (actionParameterInstances: ActionParameterInstance[], actionIndex: number) => {
        setExecuteActionContext({
            type: "ChangePostProcessingActionParameterInstances",
            payload: {
                actionIndex: actionIndex,
                parameterInstances: actionParameterInstances
            }
        })
    }

    const onNameChange = (newName: string, actionIndex: number) => {
        setExecuteActionContext({
            type: "ChangeNameOfPostProcessingAction",
            payload: {
                actionIndex: actionIndex,
                newName: newName
            }
        })
    }

    const onPostProcessingActionDelete = (actionIndex: number) => {
        setExecuteActionContext({
            type: 'DeltePostProcessingAction',
            payload: {
                actionIndex: actionIndex
            }
        })
    }

    const getSelectedActionContainerProps: () => SelectedActionContainerProps = () => {
        return {
            actions: executeActionContext.postProcessingActions || [],
            selectedActionIndex: executeActionContext.selectedActionIndex,
            handlers: {
                onClickAction: onClickAction,
                onNameChange: onNameChange,
                onActionDelete: onPostProcessingActionDelete
            }
        }
    }

    const getSelectedPreProcessingActionProps: () => ConfigureSelectedPostProcessingActionProps = () => {
        return {
            selectedActionDetails: executeActionContext.postProcessingActions?.[executeActionContext.selectedActionIndex || 0] || {},
            selectedActionIndex: executeActionContext.selectedActionIndex!,
            handlers: {
                onParameterValueChange: onParameterValueChange
            },
            sourceActionName: executeActionContext.ExistingModels.ActionDefinition.DisplayName || "Previous Execution"
        }
    }

    return {
        selectedActionIndex: executeActionContext.selectedActionIndex,
        selectActionProps: getSelectActionToAddProps(),
        selectedActionContainerProps: getSelectedActionContainerProps(),
        getConfigureSelectedActionProps: getSelectedPreProcessingActionProps
    }

}

export default useAddPostProcessingActions