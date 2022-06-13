import { useQuery } from 'react-query'
import { Fetcher } from '../../../../../generated/apis/api'
import { ActionDefinitionDetail, ActionInstanceWithParameters } from '../../../../../generated/interfaces/Interfaces'
import labels from '../../../../../labels/labels'


export const useGetWorkflowDetails = (workflowId: string, options: {enabled: boolean, onSuccess: (data: ActionDefinitionDetail[]) => void}): [ActionDefinitionDetail[] | undefined, any, boolean] => {

    const {data: workflowTemplate, error: workflowTemplateError, isLoading: workflowTemplateLoading} = useQuery([],
        () => {
            return Fetcher.fetchData('GET', '/getActionDefinitionDetails', {Id: workflowId})
        },
        {
            enabled: options.enabled,
            onSuccess: (data) => options.onSuccess(data)
        },
    )
    return [workflowTemplate , workflowTemplateError, workflowTemplateLoading]
}

export const useGetWorkflowChildInstances = (workflowId: string, options: {enabled: boolean, onSuccess: (data: ActionInstanceWithParameters[]) => void}): [ActionInstanceWithParameters[], any, boolean] => {
    const {data: workflowActionInstances, error: workflowInstancesError, isLoading: workflowInstancesLoading} = useQuery([labels.entities.ActionInstance, "Workflow", workflowId],
        () => {
            return Fetcher.fetchData('GET', '/getWorkflowActionInstances', {Id: workflowId})
        },
        {
            enabled: options.enabled,
            onSuccess: (data) => options.onSuccess(data)
        }
    )
    return  [workflowActionInstances || [], workflowInstancesError, workflowInstancesLoading]
}

