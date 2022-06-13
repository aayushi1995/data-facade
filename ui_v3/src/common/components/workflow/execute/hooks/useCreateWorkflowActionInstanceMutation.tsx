import { useMutation } from "react-query"
import { v4 as uuidv4 } from 'uuid'
import { ActionInstance } from "../../../../../generated/entities/Entities"
import { ActionInstanceWithParameters } from "../../../../../generated/interfaces/Interfaces"
import { WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext"
import dataManagerInstance from './../../../../../data_manager/data_manager'
const useCreateWorkflowActioninstanceMutation = (workflowContext: WorkflowContextType, handleOnSuccess: (data: any) => void) => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
    let actionInstanceProvider: string | undefined = undefined
    const workflowInstancesWithParameterInstances = workflowContext.stages[0].Actions.map(action => {
        return {
            ParameterInstances: action.Parameters?.map((childParameterInstance) => {
                const apdId = childParameterInstance.ActionParameterDefinitionId
                const globalParameterInstance = workflowContext.WorkflowParameterInstance?.find(globalParameter => globalParameter.ActionParameterDefinitionId === childParameterInstance.GlobalParameterId)
                if(!!globalParameterInstance?.ProviderInstanceId) {
                    actionInstanceProvider = globalParameterInstance.ProviderInstanceId
                }
                return {
                    ...childParameterInstance,
                    ...globalParameterInstance,
                    ActionParameterDefinitionId: apdId
                }
            }),
            model: {
                Id: action.Id,
                TemplateId: action.TemplateId,
                DefinitionId: action.DefinitionId,
                Name: action.Name,
                DisplayName: action.Name,
                RenderTemplate: true,
                ProviderInstanceId: actionInstanceProvider
            },
            
        } as ActionInstanceWithParameters
    })
    return useMutation(
        "CreateWorkflowInstance",
        (params: {workflowId: string, workflowName: string, recurrenceConfig: {actionInstance: ActionInstance, startDate: Date, slack?: string, email?: string}}) => {
            const actionProperties = {
                entityProperties: {
                    DefinitionId: params.workflowId,
                    DisplayName: params.workflowName,
                    Id: uuidv4(),
                    Name: params.workflowName,
                    ProviderInstanceId: actionInstanceProvider || "5", // TODO: hard coding here, write logic to fix,
                    IsRecurring: params.recurrenceConfig.actionInstance.IsRecurring,
                    RecurrenceIntervalInSecs: params.recurrenceConfig.actionInstance.RecurrenceIntervalInSecs
                } as ActionInstance,
                withWorkflowActionInstances: workflowInstancesWithParameterInstances as ActionInstanceWithParameters[],
                executionScheduledDate: params.recurrenceConfig.actionInstance.IsRecurring ? params.recurrenceConfig.startDate?.getTime()?.toString() : undefined,
                slack: params.recurrenceConfig.slack,
                email: params.recurrenceConfig.email
            }

            return fetchedDataManagerInstance.saveData("ActionInstance", actionProperties)
        }, {
            onSuccess: (data) => {
                console.log("SUCCESS")
                handleOnSuccess(data)
            },
            onMutate: () => {
                console.log("SAVING")
            }
        }
    )
}

export default useCreateWorkflowActioninstanceMutation