import React from "react"
import { useQuery } from "react-query"
import dataManager from "../../../../data_manager/data_manager"
import { ActionDefinition, ActionDefinitionColumns } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"
import { BuildActionContext, SetBuildActionContext } from "../../build_action_old/context/BuildActionContext"


const useDeepDiveSideMenu = () => {

    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const fetchAllActionsNameAndId = useQuery(
        [labels.entities.ActionDefinition, "DeepDive"],
        () => {
            const fetchedDataManager = dataManager.getInstance as {retreiveData: Function}
            const columnsToRetrieve: {UniqueName: ActionDefinitionColumns}[] = [{UniqueName: "Id"}, {UniqueName: "DisplayName"}, {UniqueName: "UniqueName"}]
            const filter: ActionDefinition = {IsVisibleOnUI: true}
            return fetchedDataManager.retreiveData(labels.entities.ActionDefinition, {
                filter: filter,
                columnsToRetrieve: columnsToRetrieve
            }) as ActionDefinition[]
        }, {
            staleTime: 1000*60
        }
    )

    const addDeepDiveActions = () => {
        setBuildActionContext({
            type: 'AddDeepDiveAction',
            payload: {}
        })
    }

    const addActionToDeepOptions = (index: number, actionId: string, displayName: string) => {
        setBuildActionContext({
            type: "ChangeActionIdForDeepDive",
            payload: {
                index: index,
                id: actionId
            }
        })

        if(buildActionContext.deepDiveConfig[index]?.DisplayName === undefined) {
            setBuildActionContext({
                type: "ChangeNameForDeepDiveAction",
                payload: {
                    name: displayName,
                    index: index
                }
            })
        }
    }

    const getActionValue = (actionId: string) => {
        if(!!fetchAllActionsNameAndId.data) {
            return fetchAllActionsNameAndId.data.find(action => action.Id === actionId)
        }
    }

    const addNameToDeepDiveOptions = (index: number, displayName: string) => {
        setBuildActionContext({
            type: "ChangeNameForDeepDiveAction",
            payload: {
                name: displayName,
                index: index
            }
        })
    }

    const getDeepDiveOptions = () => {
        return buildActionContext.deepDiveConfig
    }

    const removeDeepDiveAction = (index: number) => {
        setBuildActionContext({
            type: "RemoveDeepDiveAction",
            payload: {
                index: index
            }
        })
    }

    return {
        addDeepDiveActions,
        addActionToDeepOptions,
        addNameToDeepDiveOptions,
        getDeepDiveOptions,
        fetchAllActionsNameAndId,
        getActionValue,
        removeDeepDiveAction
    }

}

export default useDeepDiveSideMenu