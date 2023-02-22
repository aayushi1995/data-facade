
import { useQuery } from "react-query"
import dataManagerInstance from '@api/dataManager'
import { TableProperties } from "@/generated/entities/Entities"
import labels from "@helpers/labels"


export interface UseTablesProps {
    tableFilter: TableProperties,
    parameterId?: string
    filterForParameterTags?: boolean
    handleOnSucces?: (data: TableProperties[]) => void
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
        },
        {
            onSuccess: (data) => props.handleOnSucces?.(data)
        }
    )

    return {
        tables: (tables as TableProperties[]| undefined),
        loading: isTableLoading, error: (tableError as any)}
}

export default useTables;