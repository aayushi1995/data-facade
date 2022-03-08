import {useRetreiveData} from "../../../../../data_manager/data_manager";
import labels from "../../../../../labels/labels";
import {useRouteMatch} from "react-router-dom";
import {ProviderType} from "../ConnectionDialogContent";

type ProviderDataType = ProviderType[];
type UseRetrieveData<T> = { isLoading: boolean, error: string, data: T | undefined };

export function useConnectionProviders() {
    const queryData = useRetreiveData(labels.entities.ProviderDefinition, {
        "filter": {
            "ProviderType": "DataSource"
        },
        "withProviderParameterDefinition": true
    }) as UseRetrieveData<ProviderDataType>;
    const match = useRouteMatch<{ Id?: ProviderType['ProviderDefinition']['Id'] }>();
    const selectedProviderId = match.params.Id;
    const defaultPredicate = ({ProviderDefinition: {Id}}: ProviderType) => Id === selectedProviderId;

    const findQueryData = (
        predicate = defaultPredicate
    ) => queryData?.data ? queryData.data.find(
        predicate
    ) : undefined;
    const filterQueryData = (
        predicate = defaultPredicate
    ) => queryData?.data ? queryData.data.filter(
        predicate
    ) : [];

    const currentProvider = findQueryData();
    return {
        queryData,
        findQueryData,
        filterQueryData,
        currentProvider
    };
}