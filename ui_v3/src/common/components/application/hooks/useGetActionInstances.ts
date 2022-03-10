import { useQuery } from "react-query"
import dataManagerInstance from "../../../../data_manager/data_manager"
import { Fetcher } from "../../../../generated/apis/api"
import { Application } from "../../../../generated/entities/Entities"
import { ActionInstanceCardViewResponse } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"


export const useGetActionInstances = (): [ActionInstanceCardViewResponse[], any, boolean] => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const {data: applications, error: applicationError, isLoading: applicationsLoading} = useQuery(["ActionInstance", "CardView"], () => Fetcher.fetchData("GET", "/actionInstanceCardView", {}))

    return [applications||[], applicationError, applicationsLoading]
}