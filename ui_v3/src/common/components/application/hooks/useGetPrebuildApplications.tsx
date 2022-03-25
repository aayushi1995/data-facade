import { useQuery } from "react-query"
import dataManagerInstance from "../../../../data_manager/data_manager"
import { Fetcher } from "../../../../generated/apis/api"
import { Application } from "../../../../generated/entities/Entities"
import { ApplicationCardViewResponse } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"


export const useGetPrebuiltApplications = (): [ApplicationCardViewResponse[], any, boolean] => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const {data: applications, error: applicationError, isLoading: applicationsLoading} = useQuery(["Applications", "All", "PreBuilt", "CardView"], () => Fetcher.fetchData("GET", "/applicationCardView", { IsVisibleOnUI: true }))

    return [applications||[], applicationError, applicationsLoading]
}