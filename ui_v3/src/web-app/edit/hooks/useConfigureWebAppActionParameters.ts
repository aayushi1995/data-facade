import React from "react";
import { useQuery } from "react-query";
import { Fetcher } from "../../../generated/apis/api";
import { ActionParameterDefinition } from "../../../generated/entities/Entities";
import labels from "../../../labels/labels";
import { getDefaultTemplateParameters } from "../../../pages/execute_action/util";
import { WebAppActionDefition } from "../context/EditWebAppContextProvider";


const useConfigureWebAppActionParameters = ({action}: {action: WebAppActionDefition}) => {
    
    const fetchActionDetailsQuery = useQuery([labels.entities.ActionDefinition, "ConfigureParameters", {Id: action.ActionDefinition.Id}],
        () => {
            return Fetcher.fetchData('GET', '/getActionDefinitionDetails', {Id: action.ActionDefinition.Id})
        }
    )
    const [activeParameterIndex, setActiveParameterIndex] = React.useState(0)

    const changeParameterIndex = (index: number) => {
        setActiveParameterIndex(index)
    }

    const parameters = (!!fetchActionDetailsQuery?.data?.[0]) ? getDefaultTemplateParameters(fetchActionDetailsQuery?.data?.[0]) : []

    const findParameterReferenceInAction = (parameter: ActionParameterDefinition) => {
        Object.entries(action.ParameterMappings).find(([parameterId, parameterValue]) => parameterId === parameter.Id)
    }

    return {
        fetchActionDetailsQuery,
        activeParameterIndex,
        changeParameterIndex,
        parameters,
        findParameterReferenceInAction
    }
}

export default useConfigureWebAppActionParameters