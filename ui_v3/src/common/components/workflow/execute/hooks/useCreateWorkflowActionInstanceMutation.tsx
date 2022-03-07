import React from "react"
import { useMutation } from "react-query"
import { ActionExecution, ActionInstance } from "../../../../../generated/entities/Entities"
import { ActionInstanceWithParameters } from "../../../../../generated/interfaces/Interfaces"
import { WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext"
import dataManagerInstance from './../../../../../data_manager/data_manager'
import { v4 as uuidv4 } from 'uuid';

const useCreateWorkflowActioninstanceMutation = (workflowContext: WorkflowContextType, handleOnSuccess: (data: any) => void) => {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function}

    const workflowInstancesWithParameterInstances = workflowContext.stages[0].Actions.map(action => {
        return {
            model: {
                Id: action.Id,
                TemplateId: action.TemplateId,
                DefinitionId: action.DefinitionId,
                Name: action.Name,
                DisplayName: action.Name,
                RenderTemplate: true
            },
            ParameterInstances: action.Parameters?.map((childParameterInstance) => {
                const apdId = childParameterInstance.ActionParameterDefinitionId
                const globalParameterInstance = workflowContext.WorkflowParameterInstance?.find(globalParameter => globalParameter.ActionParameterDefinitionId === childParameterInstance.GlobalParameterId)
                return {
                    ...childParameterInstance,
                    ...globalParameterInstance,
                    ActionParameterDefinitionId: apdId
                }
            })
        } as ActionInstanceWithParameters
    })

    console.log(workflowInstancesWithParameterInstances)

    return useMutation(
        "CreateWorkflowInstance",
        (params: {workflowId: string, workflowName: string}) => {
            const actionProperties = {
                entityProperties: {
                    DefinitionId: params.workflowId,
                    DisplayName: params.workflowName,
                    Id: uuidv4(),
                    Name: params.workflowName,
                    ProviderInstanceId: "5" // TODO: hard coding here, write logic to fix
                } as ActionInstance,
                withWorkflowActionInstances: workflowInstancesWithParameterInstances as ActionInstanceWithParameters[]
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