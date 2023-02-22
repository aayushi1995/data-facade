import React from "react"
import { useQuery } from "react-query"
import { Fetcher } from "../../../../generated/apis/api"
import { ActionParameterInstance } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"
import { ParameterValueProps } from "../components/ParameterValues"


const useParameterValues = (props: ParameterValueProps) => {

    const [actionParameterInstances, setActionParameterInstances] = React.useState<ActionParameterInstance[]>([])
    const {actionDefinitionId, onParameterValueChange, parameterValue} = props

    const fetchActionDefinitionDetail = useQuery([labels.entities.ActionDefinition, "AddReference", "details"], 
        () => Fetcher.fetchData("GET", "/getActionDefinitionDetails", {Id: actionDefinitionId})?.then(data => data?.[0]), {
            enabled: false
        }
    )

    React.useEffect(() => {
        fetchActionDefinitionDetail.refetch()
    }, [actionDefinitionId])

    const getParameterDefinitions = () => {
        return fetchActionDefinitionDetail?.data?.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions?.map(pd => pd.model || {})
    }

    const handleChange = (newParameterInstances: ActionParameterInstance[]) => {
        setActionParameterInstances(newParameterInstances)
    }

    React.useEffect(() => {
        const parameterMappings: Record<string, string> = actionParameterInstances?.filter(api => api.ParameterValue !== undefined)?.reduce((mapping: Record<string, string>, actionParameterInstance) => {
            const apdName = getParameterDefinitions()?.find(apd => apd.Id === actionParameterInstance.ActionParameterDefinitionId)?.ParameterName
            return {
                ...mapping,
                [apdName || "NA"]: actionParameterInstance.ParameterValue!
            }
        }, {})
        onParameterValueChange(parameterMappings)

    }, [actionParameterInstances]) 

    return {
        fetchActionDefinitionDetail,
        getParameterDefinitions,
        actionParameterInstances,
        handleChange

    }

}

export default useParameterValues