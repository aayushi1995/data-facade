import { useMutation, UseMutationOptions, UseMutationResult } from "react-query"
import dataManagerInstance from '../../api/dataManager'
import { getActionExecutionParsedOutput } from "./action_execution_data"
import { ActionExecution, ActionInstance, ActionParameterInstance } from "../../generated/entities/Entities"
import labels from "../../utils/labels"

export interface MutationContext {
    actionInstance: ActionInstance,
    actionParameterInstances: ActionParameterInstance[],
    executionScheduledDate?: string,
    slack?: string,
    email?: string,
    actionExecutionToBeCreatedId?: string
    withActionParameterInstance?:boolean,
    localDb?: boolean
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
            withActionParameterInstance: config.withActionParameterInstance,
            executionScheduledDate: config.executionScheduledDate,
            withExecutionId: config?.actionExecutionToBeCreatedId,
            withLocalDb: config?.localDb
        }), {...asyncOptions})
    
    
    const createActionInstanceSyncMutation = useMutation((config: MutationContext) => fetchedDataManagerInstance.saveData(labels.entities.ActionInstance, {
        entityProperties: config.actionInstance,
        ActionParameterInstanceEntityProperties: config.actionParameterInstances,
        withActionParameterInstance: false,
        SynchronousActionExecution: true
    }), {...syncOptions})
    
    return {
        createActionInstanceAsyncMutation: createActionInstanceAsyncMutation, 
        createActionInstanceSyncMutation: createActionInstanceSyncMutation,
        fetchActionExeuctionParsedOutputMutation: fetchActionExeuctionParsedOutputMutation
    }
}

export default useCreateActionInstance;