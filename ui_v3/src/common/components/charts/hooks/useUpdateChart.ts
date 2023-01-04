import { useMutation } from "react-query";
import dataManager from "../../../../data_manager/data_manager";
import { Fetcher } from "../../../../generated/apis/api";
import { Chart } from "../../../../generated/entities/Entities";


const useUpdateChart = () => {

    const fetchedDataManager = dataManager.getInstance as {patchData: Function}

    return useMutation("UpdateChart", 
        (params: {filter: Chart, newProperties: Chart, dashboardIds?: string[]}) => {
            return fetchedDataManager.patchData("Chart", {
                filter: params.filter,
                newProperties: params.newProperties,
                "assignChartToDashboard": true,
                "withDashboardIds": params.dashboardIds
            })
        }
    )

}

export default useUpdateChart