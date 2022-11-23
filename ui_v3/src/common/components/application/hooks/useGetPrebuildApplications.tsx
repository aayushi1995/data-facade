import { useQuery } from "react-query"
import dataManagerInstance from "../../../../data_manager/data_manager"
import { Fetcher } from "../../../../generated/apis/api"
import { ApplicationCardViewResponse } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"


export const useGetPrebuiltApplications = () => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const query = useQuery(["Applications", "All", "PreBuilt", "CardView"], () => Fetcher.fetchData("GET", "/applicationCardView", { IsVisibleOnUI: true }))

    return query
}

export const useApplicationWithInstallationStatusQuery = () => {
    return useQuery<ApplicationCardViewResponse[], unknown, ApplicationCardViewResponse[], string[]>(
        [labels.entities.APPLICATION, "All", "InstallationStatus"],
        () => {
            const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
            return fetchedDataManagerInstance.retreiveData(labels.entities.APPLICATION, {
                filter: {},
                ApplicationWithInstallationStatus: true,
                ApplicationCardView: true
            })
        }
    )
}