import React, { Provider } from "react"
import { useQuery } from "react-query"
import { ProviderInstance, TableProperties } from "../../../generated/entities/Entities"
import labels from "../../../labels/labels"
import dataManagerInstance, { useRetreiveData } from '../../../data_manager/data_manager'


export interface UseTablesProps {
    tableFilter: TableProperties,
    parameterId?: string
    filterForParameterTags?: boolean
}

const useTables: (props: UseTablesProps) => {tables: TableProperties[]|undefined, loading: boolean, error: any} = (props: UseTablesProps) => {
    const {tableFilter, parameterId, filterForParameterTags} = props
    // const [loading, setLoading] = React.useState(true)
    // const [error, setError] = React.useState()

    // const providerFilter = {ProviderType: "DataSource"}
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
    
    const {data: tables, isLoading: isTableLoading, error: tableError} = useQuery([labels.entities.TABLE_PROPERTIES, tableFilter], () => {
            return fetchedDataManagerInstance.retreiveData(labels.entities.TABLE_PROPERTIES, {
                    filter: tableFilter,
                    FilterForParameterTags: filterForParameterTags || false,
                    withParameterId: parameterId
            })
        }
    )

    return {
        tables: (tables as TableProperties[]| undefined),
        loading: isTableLoading, error: (tableError as any)}
}

export default useTables;