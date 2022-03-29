import { useQuery } from "react-query"
import dataManagerInstance from "../../../../data_manager/data_manager"
import { Fetcher } from "../../../../generated/apis/api"
import { Application } from "../../../../generated/entities/Entities"
import { ApplicationCardViewResponse } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"


export const useGetPrebuiltApplications = () => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const query = useQuery(["Applications", "All", "PreBuilt", "CardView"], () => Fetcher.fetchData("GET", "/applicationCardView", { IsVisibleOnUI: true }))

    return query
}