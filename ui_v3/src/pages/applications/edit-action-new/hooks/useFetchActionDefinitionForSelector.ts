/*
    Makes use of ActionDefinitionSelector plugin in ActionDefinitionService
*/
import { useQuery } from "react-query"
import dataManagerInstance from "../../../../data_manager/data_manager"
import ActionDefinitionActionType from "../../../../enums/ActionDefinitionActionType"
import { ActionDefinitionSelectorResponse } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"

export type UseFetchActionDefinitionForSelectorParams = {
    typesToFetch?: []
}


function useFetchActionDefinitionForSelector(params: UseFetchActionDefinitionForSelectorParams) {
    const typesToFetch = params?.typesToFetch || [ActionDefinitionActionType.PROFILING]
    return useQuery<ActionDefinitionSelectorResponse[], unknown, ActionDefinitionSelectorResponse[], string[]>(
        [labels.entities.ActionDefinition, "Selector"],
        () => {
            const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
            return fetchedDataManagerInstance.retreiveData(labels.entities.ActionDefinition, {
                filter: {},
                ActionDefinitionSelector: true,
                ActionTypes: typesToFetch
            })
        }
    )
}

export default useFetchActionDefinitionForSelector;