import React, { Provider } from "react"
import { useMutation, useQuery, UseQueryOptions } from "react-query"
import { Fetcher } from "../../../generated/apis/api"
import { ActionDefinition, ActionParameterDefinition, ActionTemplate, ProviderInstance, TableProperties, Tag } from "../../../generated/entities/Entities"
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces"
import labels from "../../../labels/labels"
import dataManagerInstance, { useRetreiveData } from './../../../data_manager/data_manager'


export interface UseActionDefintionDetail {
    options: UseQueryOptions<ActionDefinitionDetail[], unknown, ActionDefinitionDetail[], (string|undefined)[]>,
    actionDefinitionId?: string
}

const useActionDefinitionDetail = (props: UseActionDefintionDetail) => {
    const { options, actionDefinitionId } = props
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const actionDefinitionDetailQuery = useQuery(
        [labels.entities.ActionDefinition, actionDefinitionId], (context) => {return Fetcher.fetchData("GET", "/getActionDefinitionDetails", {Id: actionDefinitionId})}, 
        {
            ...options,
            enabled: false
        }
    )
    
    return actionDefinitionDetailQuery
}

export default useActionDefinitionDetail;