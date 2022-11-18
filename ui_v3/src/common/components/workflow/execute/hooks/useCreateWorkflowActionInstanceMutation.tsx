import { useMutation } from "react-query"
import { v4 as uuidv4 } from 'uuid'
import { userSettingsSingleton } from "../../../../../data_manager/userSettingsSingleton"
import { ActionInstance } from "../../../../../generated/entities/Entities"
import { ActionInstanceWithParameters } from "../../../../../generated/interfaces/Interfaces"
import { WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext"
import dataManagerInstance from './../../../../../data_manager/data_manager'
const useCreateWorkflowActioninstanceMutation = (workflowContext: WorkflowContextType, handleOnSuccess: (data: any) => void) => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}
    let actionInstanceProvider: string | undefined = workflowContext.SelectedProviderInstance?.Id
    const oldIdToNewIdMap: Record<string, string> = {}
    const workflowInstancesWithParameterInstances = workflowContext.stages[0].Actions.map(action => {
        const actionInstanceId = uuidv4()
        oldIdToNewIdMap[action.Id] = actionInstanceId
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
                    ActionParameterDefinitionId: apdId,
                    Id: uuidv4(),
                    ActionInstanceId: actionInstanceId,
                    SourceExecutionId: oldIdToNewIdMap[childParameterInstance.SourceExecutionId as unknown as string]
                }
            }),
            model: {
                Id: actionInstanceId,
                TemplateId: action.TemplateId,
                DefinitionId: action.DefinitionId,
                Name: action.Name,
                DisplayName: action.Name,
                RenderTemplate: true,
                ProviderInstanceId: actionInstanceProvider,
                ResultTableName: action.ResultTableName,
                ResultSchemaName: action.ResultSchemaName,
                Config: action.ReferenceId
            },
            
        } as ActionInstanceWithParameters
    })
    return useMutation(
        "CreateWorkflowInstance",
        (params: {workflowId: string, workflowName: string, recurrenceConfig: {actionInstance: ActionInstance, startDate: Date, slack?: string, email?: string}}) => {
            const actionInstanceId = uuidv4()
            const actionProperties = {
                entityProperties: {
                    DefinitionId: params.workflowId,
                    DisplayName: params.workflowName,
                    Id: actionInstanceId,
                    Name: params.workflowName,
                    ProviderInstanceId: actionInstanceProvider || "5", // TODO: hard coding here, write logic to fix,
                    IsRecurring: params.recurrenceConfig.actionInstance.IsRecurring,
                    RecurrenceIntervalInSecs: params.recurrenceConfig.actionInstance.RecurrenceIntervalInSecs,
                    CreatedBy: userSettingsSingleton.userEmail
                } as ActionInstance,
                ActionParameterInstanceEntityProperties: workflowContext.WorkflowParameterInstance?.map(pi => ({...pi, ActionInstanceId: actionInstanceId, Id: uuidv4()})),
                withWorkflowActionInstances: workflowInstancesWithParameterInstances as ActionInstanceWithParameters[],
                executionScheduledDate: params.recurrenceConfig.actionInstance.IsRecurring ? params.recurrenceConfig.startDate?.getTime()?.toString() : undefined,
                slack: params.recurrenceConfig.slack,
                email: params.recurrenceConfig.email,
                withActionParameterInstance: true
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