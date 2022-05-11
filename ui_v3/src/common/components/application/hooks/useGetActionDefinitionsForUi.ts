import { useQuery, UseQueryResult } from "react-query";
import { Fetcher } from "../../../../generated/apis/api";
import { ActionDefinition } from "../../../../generated/entities/Entities";
import { ActionDefinitionCardViewResponse } from "../../../../generated/interfaces/Interfaces";
import labels from "../../../../labels/labels";


const useGetActionDefinitionForUi = (props: {filter: ActionDefinition}): UseQueryResult<ActionDefinitionCardViewResponse[], unknown> => {

    return useQuery([labels.entities.ActionDefinition, "AllActions", props.filter], 
        () => Fetcher.fetchData("GET", "/allActionDefinitionCardView", props.filter)
    )
}

export default useGetActionDefinitionForUi