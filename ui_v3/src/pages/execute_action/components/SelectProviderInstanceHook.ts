import { useQuery } from "react-query"
import { Fetcher } from "../../../generated/apis/api"
import { ProviderInstance } from "../../../generated/entities/Entities"
import labels from "../../../labels/labels"

export type SelectProviderInstanceHookParams = {
    selectedProviderInstance?: ProviderInstance,
    onProviderInstanceChange?: Function
}


const SelectProviderInstanceHook = (params: SelectProviderInstanceHookParams) => {
    const { selectedProviderInstance, onProviderInstanceChange } = params
    const availableProviderInstanceQuery = useQuery([labels.entities.ProviderInstance, "ActionRun"], () => {
        return Fetcher.fetchData("GET", "/filterProviderInstanceByActionRunnable", {})
    })


    const availableProviderDefinitionQuery = useQuery([labels.entities.ProviderDefinition, "ActionRun"], () => {
        return Fetcher.fetchData("GET", "/filterProviderDefinitionByActionRunnable", {})
    })

    return {
        availableProviderInstanceQuery,
        availableProviderDefinitionQuery,
        selectedProviderInstance,
        onProviderInstanceChange
    }
}

export default SelectProviderInstanceHook;