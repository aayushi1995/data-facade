import React, { Provider } from "react"
import { useQuery } from "react-query"
import { ProviderInstance, TableProperties } from "../../../generated/entities/Entities"
import labels from "../../../labels/labels"
import dataManagerInstance, { useRetreiveData } from '../../../data_manager/data_manager'


export interface UseTablesProps {
    tableFilter: TableProperties
}

const useTables: (props: UseTablesProps) => {tables: TableProperties[]|undefined, loading: boolean, error: any} = (props: UseTablesProps) => {
    const {tableFilter} = props
    // const [loading, setLoading] = React.useState(true)
    // const [error, setError] = React.useState()

    // const providerFilter = {ProviderType: "DataSource"}
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
    
    const {data: tables, isLoading: isTableLoading, error: tableError} = useQuery([labels.entities.TABLE_PROPERTIES, tableFilter], () => {
            return fetchedDataManagerInstance.retreiveData(labels.entities.TABLE_PROPERTIES, {
                    filter: tableFilter
            })
        }
    )
    // const {data: providers, isLoading: isProviderLoading, error: providerError} = useQuery([labels.entities.ProviderInstance, providerFilter], () => {
    //         return fetchedDataManagerInstance.retreiveData(labels.entities.ProviderInstance, {
    //             filter: providerFilter
    //         })
    //     }
    // )

    // React.useEffect(() => {
    //     setLoading(isTableLoading||isProviderLoading)
    // }, [isTableLoading, isProviderLoading])
    
    // React.useEffect(() => {
    //     if(!!tableError){
    //         setError(tableError as any)
    //     }
    //     if(!!providerError){
    //         setError(providerError as any)
    //     }
    // }, [tableError, providerError])

    return {
        tables: (tables as TableProperties[]| undefined),
        loading: isTableLoading, error: (tableError as any)}
}

export default useTables;