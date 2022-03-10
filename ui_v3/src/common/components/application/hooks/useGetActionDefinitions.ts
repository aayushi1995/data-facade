import { useQuery } from "react-query"
import dataManagerDefinition from "../../../../data_manager/data_manager"
import { Fetcher } from "../../../../generated/apis/api"
import { Application } from "../../../../generated/entities/Entities"
import { ActionDefinitionCardViewResponse } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"


export const useGetActionDefinitions = (): [ActionDefinitionCardViewResponse[], any, boolean] => {
    const fetchedDataManagerDefinition = dataManagerDefinition.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const {data: applications, error: applicationError, isLoading: applicationsLoading} = useQuery(["ActionDefinition", "CardView"], () => Fetcher.fetchData("GET", "/actionDefinitionCardView", {}))

    return [applications||[], applicationError, applicationsLoading]
}