import { useQuery } from "react-query"
import dataManagerInstance from "../../../../data_manager/data_manager"
import { Application } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"


export const useGetPrebuiltApplications = (): [Application[], any, boolean] => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const {data: applications, error: applicationError, isLoading: applicationsLoading} = useQuery([labels.entities.APPLICATION, "Pre-built"], 
        () => {
            return fetchedDataManagerInstance.retreiveData!(labels.entities.APPLICATION, {

            })
        }
    )

    return [applications, applicationError, applicationsLoading]
}