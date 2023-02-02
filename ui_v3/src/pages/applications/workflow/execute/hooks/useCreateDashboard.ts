
import { useMutation, UseMutationOptions } from "react-query";
import { v4 as uuidv4 } from "uuid";
import { userSettingsSingleton } from "../../../../../data_manager/userSettingsSingleton";
import { Fetcher } from "../../../../../generated/apis/api";
import { Dashboard } from "../../../../../generated/entities/Entities";

interface CreateDashboardProps {
    mutationName: string,
    mutationOptions: UseMutationOptions<Dashboard[], unknown, createDashboardParams, unknown>
}

export interface createDashboardParams {
    dashboardName: string,
    executionId: string,
    flowId?: string
}

const useCreateDashboard = (props: CreateDashboardProps) => {

    return useMutation(
        props.mutationName,
        (options: createDashboardParams) => {
            const userName = userSettingsSingleton.userName
            const createdOn = Date.now()
            const dashboardModel: Dashboard = {
                Id: uuidv4(),
                CreatedBy: userName,
                CreatedOn: createdOn,
                Name: options.dashboardName,
                FlowId: options.flowId
            }
            return Fetcher.fetchData("POST", "/saveDashboardForExecutionId", {entityProperties: dashboardModel, withExecutionId: options.executionId})
        },
        {
            ...props.mutationOptions
        }
    )

}

export default useCreateDashboard
