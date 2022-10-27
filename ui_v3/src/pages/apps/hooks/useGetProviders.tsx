import { useQuery, UseQueryOptions } from "react-query";
import dataManager from "../../../data_manager/data_manager";
import { ProviderDefinition, ProviderInstance } from "../../../generated/entities/Entities";
import labels from "../../../labels/labels";


interface UseGetProviderProps {
    filter: ProviderInstance,
    queryOptions?: UseQueryOptions<unknown, unknown, ProviderInstance[], [string, ProviderInstance]>
}

const useGetProviders = (props: UseGetProviderProps) => {

    const fetchedDataManagerInstance = dataManager.getInstance as {retreiveData: Function}
    return useQuery([labels.entities.ProviderInstance, props.filter], 
        () => fetchedDataManagerInstance.retreiveData(
            labels.entities.ProviderInstance,
            {
                filter: props.filter
            }
        ),
        {
            ...props.queryOptions
        }
    )
}

export default useGetProviders