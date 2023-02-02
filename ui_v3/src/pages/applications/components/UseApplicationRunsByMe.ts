import { useQuery, UseQueryResult } from "react-query"
import { generatePath, useHistory } from "react-router"
import { useCreateExecution } from "../../../common/components/application/hooks/useCreateExecution"
import { ACTION_EXECUTION_ROUTE, WORKFLOW_EXECUTION_ROUTE } from "../../../common/components/route_consts/data/ApplicationRoutesConfig"
import { APPLICATION_ROUTE } from "../../../common/components/route_consts/data/RoutesConfig"
import dataManager from "../../../data_manager/data_manager"
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType"
import { Application } from "../../../generated/entities/Entities"
import { ApplicationRunsByMe } from "../../../generated/interfaces/Interfaces"
import labels from "../../../labels/labels"

export type ApplicationRunsByMeHookParams = {
    application?: Application,
    fetchAll?: boolean
}

export type ApplicationRunsByMeHookFields = {
    fetchDataQuery: UseQueryResult<Run[]>,
    displayActionOutput: (executionId?: string) => void,
    displayWorkflowOutput: (executionid?: string) => void,
    reRunWorkflow: (actionInstanceId?: string) => void,
    reRunAction: (actionInstanceId?: string) => void
}

export type Run = {
    id?: string,
    ActionExecutionId?: string,
    ActionInstanceId?: string,
    ActionDefinitionId?: string,
    ActionDefinitionActionType?: string,
    ActionInstanceName?: string,
    ActionDefinitionName?: string,
    ActionExecutionStartedOn?: number,
    ActionExecutionCompletedOn?: number,
    ActionExecutionStatus?: string,
    isWorkflow?: boolean,
    RanBy?: string
}

const useApplicationRunsByMe = (params: ApplicationRunsByMeHookParams) => {
    const { application } = params
    const history = useHistory()
    const pluginTrigger = "RUNS_BY_ME"
    const fetchedDataManagerInstance = dataManager.getInstance as { retreiveData: Function }
    const fetchDataQuery: UseQueryResult<Run[]> = useQuery([labels.entities.APPLICATION, pluginTrigger, application?.Id],
        () => fetchedDataManagerInstance.retreiveData(labels.entities.APPLICATION, {
                filter: {
                    Id: application?.Id,
                    IsVisibleOnUI: true
                },
                [pluginTrigger]: true
            }).then((data: Run[]) => {
                return data.map(run => ({
                    ...run,
                    id: run.ActionExecutionId
                }))
            }),
        {
            enabled: !!application?.Id || params.fetchAll
        }
    )

    const createWorkflowExecution = useCreateExecution({ 
        mutationOptions: {
            onSuccess: (data) => {
                const createdExecutionId = data[0].Id
                if(!!createdExecutionId) {
                    history.push(generatePath(WORKFLOW_EXECUTION_ROUTE, { WorkflowExecutionId: createdExecutionId}))
                }
            }
        }
    })

    const createActionExecution = useCreateExecution({
        mutationOptions: {
            onSuccess: (data) => {
                const createdExecutionId = data[0].Id
                if(!!createdExecutionId) {
                    history.push(generatePath(ACTION_EXECUTION_ROUTE, { ActionExecutionId: createdExecutionId}))
                }
            }
        }
    })

    const formRuns: (data: ApplicationRunsByMe) => Run[] = (data: ApplicationRunsByMe) => {
        const result: Run[] = data?.ActionExecutions?.map(actionExecution => {
            const actionInstance = data?.ActionInstances?.find(ai => ai?.Id === actionExecution?.InstanceId)
            const actionDefinition = data?.ActionDefinitions?.find(ad => ad?.Id === actionInstance?.DefinitionId)

            return {
                id: actionExecution?.Id,
                ActionExecutionId: actionExecution?.Id,
                ActionInstanceId: actionInstance?.Id,
                ActionDefinitionActionType: actionDefinition?.ActionType,
                ActionDefinitionId: actionDefinition?.Id,
                ActionInstanceName: actionInstance?.DisplayName,
                ActionDefinitionName: actionDefinition?.UniqueName,
                ActionExecutionStartedOn: actionExecution?.ExecutionStartedOn,
                ActionExecutionCompletedOn: actionExecution?.ExecutionCompletedOn,
                ActionExecutionStatus: actionExecution?.Status,
                isWorkflow: actionDefinition?.ActionType === ActionDefinitionActionType?.WORKFLOW
            }
        }) || []

        return result
    }

    const displayActionOutput = (executionId?: string, actionDefinitionId?: string, actionInstanceId?: string) => {
        if(!!executionId) {
            history.push(`${APPLICATION_ROUTE}/execute-action/${actionDefinitionId}?instanceId=${actionInstanceId}&executionId=${executionId}`)
        }
    }

    const displayWorkflowOutput = (executionId?: string, actionDefinitionId?: string, actionInstanceId?: string) => {
        if(!!executionId) {
            // const redirectUrl = generatePath(WORKFLOW_EXECUTION_ROUTE, { WorkflowExecutionId: executionId })
            const redirectUrl = `${APPLICATION_ROUTE}/execute-workflow/${actionDefinitionId}?flowInstance=${actionInstanceId}&flowExecution=${executionId}`
            history.push(redirectUrl)
        }
    }

    const reRunWorkflow = (actionInstanceId?: string) => {
        if(!!actionInstanceId) {
            createWorkflowExecution.mutate({actionInstanceId: actionInstanceId})
        }
    }
    
    const reRunAction = (actionInstanceId?: string) => {
        if(!!actionInstanceId) {
            createActionExecution.mutate({actionInstanceId: actionInstanceId})
        }
    }
    
    return { 
        fetchDataQuery, 
        displayActionOutput, 
        displayWorkflowOutput, 
        reRunWorkflow, 
        reRunAction
    }
}

export default useApplicationRunsByMe