import { useQuery, UseQueryOptions } from 'react-query';
import dataManagerInstance from '../../../../../data_manager/data_manager';
import { ColumnProperties, TableProperties } from '../../../../../generated/entities/Entities';
import labels from '../../../../../labels/labels';

export interface UseFetchColumnsForTablesProps {
    tableFilters?: undefined | TableProperties[],
    queryOptions?: UseQueryOptions<ColumnProperties[], unknown, ColumnProperties[],[string, undefined | TableProperties[]]>
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