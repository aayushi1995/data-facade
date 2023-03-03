import { useMutation, UseMutationOptions, UseMutationResult } from "react-query"
import dataManagerInstance from '@api/dataManager'
import { getActionExecutionParsedOutput } from "@api/action_execution_data"
import { ActionExecution, ActionInstance, ActionParameterInstance } from "@/generated/entities/Entities"
import labels from "@helpers/labels"

export interface MutationContext {
    actionInstance: ActionInstance,
    actionParameterInstances: ActionParameterInstance[],
    executionScheduledDate?: string,
    slack?: string,
    email?: string,
    actionExecutionToBeCreatedId?: string
}

export interface UseCreateActionInstanceParams {
    syncOptions?: UseMutationOptions<ActionExecution[], unknown, MutationContext, unknown>
    asyncOptions?: UseMutationOptions<ActionExecution[], unknown, MutationContext, unknown>
    fetchParsedOutputOptions?: UseMutationOptions<ActionExecution, unknown, ActionExecution, unknown>
}

export interface UseCreateActionInstanceReturn {
    createActionInstanceSyncMutation: UseMutationResult<ActionExecution[], unknown, MutationContext, unknown>,
    createActionInstanceAsyncMutation: UseMutationResult<ActionExecution[], unknown, MutationContext, unknown>,
    fetchActionExeuctionParsedOutputMutation: UseMutationResult<ActionExecution, unknown, ActionExecution, unknown>,
}

const useCreateActionInstance = (params: UseCreateActionInstanceParams): UseCreateActionInstanceReturn => {
    const {syncOptions, asyncOptions, fetchParsedOutputOptions} = params
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}


    const fetchActionExeuctionParsedOutputMutation = useMutation((actionExecutionFilter: ActionExecution) => getActionExecutionParsedOutput(actionExecutionFilter), {...fetchParsedOutputOptions})
    const createActionInstanceAsyncMutation = useMutation((config: MutationContext) => fetchedDataManagerInstance.saveData(labels.entities.ActionInstance, {
            entityProperties: config.actionInstance,
            ActionParameterInstanceEntityProperties: config.actionParameterInstances,
            slack: config.slack,
            email: config.email,
            withActionParameterInstance: true,
            executionScheduledDate: config.executionScheduledDate,
            withExecutionId: config?.actionExecutionToBeCreatedId
        }), {...asyncOptions})
    
    
    const createActionInstanceSyncMutation = useMutation((config: MutationContext) => fetchedDataManagerInstance.saveData(labels.entities.ActionInstance, {
        entityProperties: config.actionInstance,
        ActionParameterInstanceEntityProperties: config.actionParameterInstances,
        withActionParameterInstance: true,
        SynchronousActionExecution: true
    }), {...syncOptions})
    
    return {
        createActionInstanceAsyncMutation: createActionInstanceAsyncMutation, 
        createActionInstanceSyncMutation: createActionInstanceSyncMutation,
        fetchActionExeuctionParsedOutputMutation: fetchActionExeuctionParsedOutputMutation
    }
}

export default useCreateActionInstance;