import { useMutation, UseMutationOptions } from "react-query"
import dataManager from "../../../data_manager/data_manager"
import { EditWebAppContextType, formRequestFromState } from "../context/EditWebAppContextProvider"


const useSaveWebApp = () => {

    const fetchedDataManager = dataManager.getInstance as {patchData: Function}

    return useMutation(
        "SaveWebApp",
        (params: {state: EditWebAppContextType}) => {
            const request = formRequestFromState(params.state)
            
            return fetchedDataManager.patchData("ActionDefinition", {
                ...request,
                UpdateWebApp: true
            })
        }
    )
}

export default useSaveWebApp