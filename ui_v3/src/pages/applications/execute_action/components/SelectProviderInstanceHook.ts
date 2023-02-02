import { useQuery } from "react-query"
import { Fetcher } from "../../../../generated/apis/api"
import labels from "../../../../labels/labels"

export type SelectProviderInstanceHookParams = {
}


const SelectProviderInstanceHook = () => {
    const availableProviderInstanceQuery = useQuery([labels.entities.ProviderInstance, "ActionRun"], () => {
        return Fetcher.fetchData("GET", "/filterProviderInstanceByActionRunnable", {})
    })


    const availableProviderDefinitionQuery = useQuery([labels.entities.ProviderDefinition, "ActionRun"], () => {
        return Fetcher.fetchData("GET", "/filterProviderDefinitionByActionRunnable", {})
    })

    return {
        availableProviderInstanceQuery,
        availableProviderDefinitionQuery
    }
}

export default SelectProviderInstanceHook;