import { useMutation } from "react-query";
import { Fetcher } from "../../../../../generated/apis/api";
import { ActionDefinition } from "../../../../../generated/entities/Entities";
import { ActionTemplatesWithParameters, UpdateActionDefinitionWithTemplate } from "../../../../../generated/interfaces/Interfaces";
import { WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext";
import { makeWorkflowTemplate } from "../../create/util/MakeWorkflowTemplate";


export const useUpdateWorkflow = (mutationName: string, workflowContext: WorkflowContextType) => {
    const actionTemplateText = makeWorkflowTemplate(workflowContext)

    return useMutation(
        mutationName,
        (options: {workflowId: string}) => {
            const filter = {
                Id: options.workflowId
            }
            const newActionDefinitionProperties = {
                ...workflowContext,
                DisplayName: workflowContext.Name,
                UniqueName: workflowContext.Name,
                UpdatedOn: undefined,
                
            } as ActionDefinition
            const actionTemplateWithParameters = {
                model: {
                   Id: workflowContext.Template?.Id,
                   Text: actionTemplateText
                },
                tags: [],
                actionParameterDefinitions: workflowContext.WorkflowParameters.map(parameter => {
                    return {
                        model: parameter,
                        tags: []
                    }
                })
            } as ActionTemplatesWithParameters

            const payload: UpdateActionDefinitionWithTemplate = {
                filter: filter,
                newProperties: newActionDefinitionProperties,
                ActionTemplateWithParameters: [actionTemplateWithParameters]
            }

            return Fetcher.fetchData('PATCH', '/updateActionDefinitionWithTemplateAndParameters', payload)
        }
    )
}