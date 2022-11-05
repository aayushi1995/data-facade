import { useQuery, UseQueryOptions } from 'react-query';
import { TableProperties } from '../../../../../generated/entities/Entities';
import { FilteredColumnsResponse } from '../../../../../generated/interfaces/Interfaces';
import labels from '../../../../../labels/labels';
import dataManagerInstance from './../../../../../data_manager/data_manager'

export interface UseFetchColumnsForTablesProps {
    filters?: undefined | {
        tableFilters?: TableProperties[],
        parameterDefinitionId: string
    },
    queryOptions?: UseQueryOptions<FilteredColumnsResponse[], unknown, FilteredColumnsResponse[],[string, undefined | TableProperties[], string]>
}

const useFetchColumnsForTableAndTags = (params: UseFetchColumnsForTablesProps) => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
    const isEnabled = () => {
        return !!params.filters?.tableFilters && (params?.queryOptions?.enabled===undefined ? true: params?.queryOptions?.enabled)
    }
    
    const query = useQuery(["ColumnList", params.filters?.tableFilters, params.filters?.parameterDefinitionId || "parameterId"],
        () => {
            return fetchedDataManagerInstance.retreiveData!(labels.entities.COLUMN_PROPERTIES, {
                filter: {},
                GetColumnsForMultipleTables: true,
                TableFilters: params.filters?.tableFilters,
                withParameterId: params.filters?.parameterDefinitionId,
                GetColumnsForGivenParameterTags: true
            })
        }, {
            ...params.queryOptions,
            enabled: isEnabled()
        }
    )

    return query;
}

export default useFetchColumnsForTableAndTags;