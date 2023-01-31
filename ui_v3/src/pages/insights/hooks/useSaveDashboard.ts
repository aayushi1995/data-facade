import { useMutation, useQuery } from "react-query"
import dataManager from "../../../data_manager/data_manager"
import { Dashboard } from "../../../generated/entities/Entities"
import labels from "../../../labels/labels"



const useSaveDashboard = () => {
    const fetchedDataManager = dataManager.getInstance as {patchData: Function}

    return useMutation("SaveDashbaord",
        (params: {filter: Dashboard, newProperties: Dashboard}) => {
            console.log(params)
            return fetchedDataManager.patchData(labels.entities.Dashboard, {
                filter: params.filter,
                newProperties: params.newProperties
            })
        }
    )
}

export default useSaveDashboard