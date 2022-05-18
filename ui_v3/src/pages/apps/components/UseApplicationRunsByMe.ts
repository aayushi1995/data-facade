import React from "react"
import { useQuery, UseQueryResult } from "react-query"
import { generatePath, useHistory } from "react-router"
import { useCreateExecution } from "../../../common/components/application/hooks/useCreateExecution"
import { ACTION_EXECUTION_ROUTE, WORKFLOW_EXECUTION_ROUTE } from "../../../common/components/header/data/ApplicationRoutesConfig"
import dataManager from "../../../data_manager/data_manager"
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType"
import { ActionExecution, Application } from "../../../generated/entities/Entities"
import { ApplicationRunsByMe } from "../../../generated/interfaces/Interfaces"
import labels from "../../../labels/labels"

export type ApplicationRunsByMeHookParams = {
    application?: Application
}

export type ApplicationRunsByMeHookFields = {
    runs: ActionExecution[],
    displayActionOutput: (executionId?: string) => void,
    displayWorkflowOutput: (executionid?: string) => void,
    reRunWorkflow: (actionInstanceId?: string) => void,
    reRunAction: (actionInstanceId?: string) => void,
    dialogOpen?: boolean,
    closeDialog: () => void,
    selectedActionExecutionIdForDialog?: string
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
    isWorkflow?: boolean
}

const useApplicationRunsByMe = (params: ApplicationRunsByMeHookParams) => {
    const { application } = params
    const history = useHistory()
    const pluginTrigger = "RUNS_BY_ME"
    const fetchedDataManagerInstance = dataManager.getInstance as { retreiveData: Function }
    const fetchDataQuery: UseQueryResult<ApplicationRunsByMe> = useQuery([labels.entities.APPLICATION, pluginTrigger, application?.Id],
        () => fetchedDataManagerInstance.retreiveData(labels.entities.APPLICATION, {
                filter: {
                    Id: application?.Id
                },
                [pluginTrigger]: true
            }).then((data: ApplicationRunsByMe[]) => data[0] ),
        {
            enabled: !!application?.Id
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

    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)
    const [selectedExecutionId, setSelectedExecutionId] = React.useState<string|undefined>()
    React.useEffect(() => {
        if(!!selectedExecutionId) {
            setDialogOpen(true)
        }
    }, [selectedExecutionId])

    const [runs, setRuns] = React.useState<Run[]>([])
    React.useEffect(() => {
        if(!!fetchDataQuery?.data){
            setRuns(formRuns(fetchDataQuery?.data))
        }
    }, [fetchDataQuery?.data])

    const displayActionOutput = (executionId?: string) => {
        if(!!executionId) {
            history.push(generatePath(ACTION_EXECUTION_ROUTE, { ActionExecutionId: executionId}))
        }
    }

    const displayWorkflowOutput = (executionId?: string) => {
        if(!!executionId) {
            const redirectUrl = generatePath(WORKFLOW_EXECUTION_ROUTE, { WorkflowExecutionId: executionId })
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
        runs, 
        displayActionOutput, 
        displayWorkflowOutput, 
        reRunWorkflow, 
        reRunAction,
        dialogOpen: dialogOpen,
        closeDialog: () => setDialogOpen(false),
        selectedActionExecutionIdForDialog: selectedExecutionId
    }
}

export default useApplicationRunsByMe