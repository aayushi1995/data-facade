import { useQuery } from "react-query"
import { Tag } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"
import dataManagerInstance from './../../../../data_manager/data_manager'

export interface UseFetchAvailableTags {
    tagFilter: Tag
}

const useFetchAvailableTags = (props: UseFetchAvailableTags) => {
    const {tagFilter} = props
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
    const {data, error, isLoading} = useQuery([labels.entities.TAG, tagFilter],
        () => {
            return fetchedDataManagerInstance.retreiveData!(labels.entities.TAG, {
                filter: tagFilter
            })
        },{
            staleTime: 60*1000
        }
    ) 
    return {data, error, isLoading}   
}


export default useFetchAvailableTags;