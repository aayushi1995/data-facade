import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { ActionDefinition, ColumnProperties, TableProperties } from '../../../../../generated/entities/Entities';
import labels from '../../../../../labels/labels';
import dataManagerInstance, { useRetreiveData } from './../../../../../data_manager/data_manager'

export interface UseFetchColumnsForTablesProps {
    tableFilters?: undefined | TableProperties[],
    queryOptions?: UseQueryOptions<ColumnProperties[], unknown, ColumnProperties[]>
}

const useFetchColumnsForTables = (params: UseFetchColumnsForTablesProps) => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
    const isEnabled = () => {
        return !!params.tableFilters && (params?.queryOptions?.enabled===undefined ? true: params?.queryOptions?.enabled)
    }
    
    const query = useQuery([labels.entities.ColumnProperties, params.tableFilters],
        () => {
            return fetchedDataManagerInstance.retreiveData!(labels.entities.COLUMN_PROPERTIES, {
                filter: {},
                GetColumnsForMultipleTables: true,
                TableFilters: params.tableFilters
            })
        }, {
            ...params.queryOptions,
            enabled: isEnabled()
        }
    )

    return query;
}

export default useFetchColumnsForTables;