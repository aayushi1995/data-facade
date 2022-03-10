import { useMutation, UseMutationOptions, UseMutationResult } from "react-query"
import { getActionExecutionParsedOutput } from "../../../data_manager/entity_data_handlers/action_execution_data"
import { ActionExecution, ActionInstance, ActionParameterInstance } from "../../../generated/entities/Entities"
import labels from "../../../labels/labels"
import dataManagerInstance, { useRetreiveData } from './../../../data_manager/data_manager'

export interface MutationContext {
    actionInstance: ActionInstance,
    actionParameterInstances: ActionParameterInstance[],
}

export interface UseCreateActionInstanceParams {
    syncOptions?: UseMutationOptions<ActionExecution[], unknown, MutationContext, unknown>
    asyncOptions?: UseMutationOptions<unknown, unknown, MutationContext, unknown>
    fetchParsedOutputOptions?: UseMutationOptions<ActionExecution, unknown, ActionExecution, unknown>
}

export interface UseCreateActionInstanceReturn {
    createActionInstanceSyncMutation: UseMutationResult<ActionExecution[], unknown, MutationContext, unknown>,
    createActionInstanceAsyncMutation: UseMutationResult<unknown, unknown, MutationContext, unknown>,
    fetchActionExeuctionParsedOutputMutation: UseMutationResult<ActionExecution, unknown, ActionExecution, unknown>,
}

const useCreateActionInstance = (params: UseCreateActionInstanceParams): UseCreateActionInstanceReturn => {
    const {syncOptions, asyncOptions, fetchParsedOutputOptions} = params
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}


    const fetchActionExeuctionParsedOutputMutation = useMutation((actionExecutionFilter: ActionExecution) => getActionExecutionParsedOutput(actionExecutionFilter), {...fetchParsedOutputOptions})

    const createActionInstanceAsyncMutation = useMutation((config: MutationContext) => fetchedDataManagerInstance.saveData(labels.entities.ActionInstance, {
        entityProperties: config.actionInstance,
        ActionParameterInstanceEntityProperties: config.actionParameterInstances,
        withActionParameterInstance: true
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