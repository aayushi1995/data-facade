import { useMutation, UseMutationOptions } from "react-query"
import dataManagerInstance from "../../../../data_manager/data_manager"
import { Dashboard } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"



interface CreteDashboardProps {
    mutatationOptions?: UseMutationOptions<unknown, unknown, Dashboard, unknown>
}

const useCreateDashboard = (props: CreteDashboardProps) => {
    const fetchedDataManager = dataManagerInstance.getInstance as {saveData: Function}

    return useMutation(
        "SaveDashboard",
        (model: Dashboard) => fetchedDataManager.saveData(labels.entities.Dashboard, {
            entityProperties: {
                ...model
            }
        }),{
            ...props.mutatationOptions
        })
    
}

export default useCreateDashboard