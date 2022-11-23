import { useQuery } from "react-query"
import dataManagerDefinition from "../../../../data_manager/data_manager"
import ActionDefinitionVisibility from "../../../../enums/ActionDefinitionVisibility"
import { Fetcher } from "../../../../generated/apis/api"


export const useGetOrgActionDefinitions = () => {
    const fetchedDataManagerDefinition = dataManagerDefinition.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const query = useQuery(["ActionDefinition", "CardView", ActionDefinitionVisibility.ORG], () => Fetcher.fetchData("GET", "/orgActionDefinitionCardView", { IsVisibleOnUI: true }))

    return query
}