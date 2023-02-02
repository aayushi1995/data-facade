import { useQuery, UseQueryOptions } from "react-query"
import dataManagerInstance from '../../../../data_manager/data_manager'
import { Fetcher } from "../../../../generated/apis/api"
import { ActionDefinitionDetail } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"


export interface UseActionDefintionDetail {
    options: UseQueryOptions<ActionDefinitionDetail[], unknown, ActionDefinitionDetail[], (string|undefined)[]>,
    actionDefinitionId?: string
}

const useActionDefinitionDetail = (props: UseActionDefintionDetail) => {
    const { options, actionDefinitionId } = props
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
    const actionDefinitionDetailQuery = useQuery(
        [labels.entities.ActionDefinition, "Detail", actionDefinitionId], (context) => {return Fetcher.fetchData("GET", "/getActionDefinitionDetails", {Id: actionDefinitionId})}, 
        {
            ...options
        }
    )
    
    return actionDefinitionDetailQuery
}

export default useActionDefinitionDetail;