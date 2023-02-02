import React from "react"
import { useQuery } from "react-query"
import { Fetcher } from "../../../../generated/apis/api"
import { ActionParameterInstance } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"
import { ConfigureSelectedPostProcessingActionProps } from "../components/ConfigureSelectedPostProcessingAction"


const useConfigureSelectedPostProcessingAction = (props: ConfigureSelectedPostProcessingActionProps) => {
    const {handlers: {onParameterValueChange}, sourceActionName, selectedActionDetails, selectedActionIndex: myActionIndex } = props

    const fetchActionDefinitionQuery = useQuery([labels.entities.ActionDefinition, "Detail", {Id: selectedActionDetails.model?.DefinitionId}],
        () => Fetcher.fetchData("GET", "/getActionDefinitionDetails", {Id: selectedActionDetails.model?.DefinitionId})
    )

    const getRows = () => {
        if(!!fetchActionDefinitionQuery?.data?.[0]) {
            const uniqueActionDefinitionDetails = fetchActionDefinitionQuery?.data?.[0]
            return uniqueActionDefinitionDetails.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions?.map(actionParameterDefinition => ({
                ...actionParameterDefinition.model,
                id: actionParameterDefinition.model?.Id!,
                tags: actionParameterDefinition.tags
            })) || []
        }

        return []
    }

    const getProviderInstanceForProviderDefinition = (providerDefinitionId: string) =>  {
        return selectedActionDetails.ParameterInstances?.find?.(pi => pi.ActionParameterDefinitionId === providerDefinitionId)
    }

    const handleParameterChange = (actionParameterInstances: ActionParameterInstance[]) => {
        onParameterValueChange(actionParameterInstances, myActionIndex)
    }

    const changeSourceExecutionId = (event: React.ChangeEvent<HTMLInputElement>, actionParameterDefinitionId: string) => {
        const parameterInstances = selectedActionDetails.ParameterInstances?.map(pi => pi.ActionParameterDefinitionId !== actionParameterDefinitionId ? pi : {
            ...pi,
            TableId: undefined,
            ParameterValue: event.target.checked ? sourceActionName : undefined,
            SourceExecutionId: event.target.checked ? sourceActionName : undefined,
        }) || []

        onParameterValueChange(parameterInstances, myActionIndex)
    }

    return {
        fetchActionDefinitionQuery,
        getRows,
        handleParameterChange,
        getProviderInstanceForProviderDefinition,
        changeSourceExecutionId
    }
}

export default useConfigureSelectedPostProcessingAction