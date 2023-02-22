import { useQuery, UseQueryOptions } from "react-query"
import { Fetcher } from "@/generated/apis/api"
import { ActionDefinitionDetail } from "@/generated/interfaces/Interfaces"
import labels from "@/helpers/labels"


export interface UseActionDefintionDetail {
    options: UseQueryOptions<ActionDefinitionDetail[], unknown, ActionDefinitionDetail[], (string|undefined)[]>,
    actionDefinitionId?: string
}

const useActionDefinitionDetail = (props: UseActionDefintionDetail) => {
    const { options, actionDefinitionId } = props
    const actionDefinitionDetailQuery = useQuery(
        [labels.entities.ActionDefinition, "Detail", actionDefinitionId], (context) => {return Fetcher.fetchData("GET", "/getActionDefinitionDetails", {Id: actionDefinitionId})}, 
        {
            ...options
        }
    )    
    return actionDefinitionDetailQuery
}

export default useActionDefinitionDetail;