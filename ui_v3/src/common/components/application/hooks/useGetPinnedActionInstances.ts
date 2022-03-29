import { useQuery } from "react-query"
import dataManagerInstance from "../../../../data_manager/data_manager"
import ActionInstanceVisibility from "../../../../enums/ActionInstanceVisibility"
import { Fetcher } from "../../../../generated/apis/api"
import { Application } from "../../../../generated/entities/Entities"
import { ActionInstanceCardViewResponse } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"


export const useGetPinnedActionInstances = () => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const query = useQuery(["ActionInstance", "CardView", ActionInstanceVisibility.CREATED_BY], () => Fetcher.fetchData("GET", "/pinnedActionInstanceCardView", {}))

    return query
}