import { useMutation } from "react-query"
import dataManager from "../../../data_manager/data_manager"
import { Dashboard } from "../../../generated/entities/Entities"
import labels from "../../../labels/labels"


const useRefreshDashboard = () => {

    const fetchedDataManager = dataManager.getInstance as {retreiveData: Function}

    return useMutation("RefreshDashboard", 
        (config: {filter: Dashboard}) => fetchedDataManager.retreiveData(labels.entities.Dashboard, {
            filter: config.filter,
            TriggerDashboardReRun: true
        })
    )

}

export default useRefreshDashboard