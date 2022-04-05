import { useMutation } from "react-query";
import { Fetcher } from "../../../../../generated/apis/api";
import { ActionDefinition } from "../../../../../generated/entities/Entities";
import { ActionTemplatesWithParameters, UpdateActionDefinitionWithTemplate } from "../../../../../generated/interfaces/Interfaces";
import { WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext";
import { BuildActionContextState } from "../../../../../pages/build_action/context/BuildActionContext";
import { makeWorkflowTemplate } from "../../create/util/MakeWorkflowTemplate";


export const useUpdateWorkflow = (mutationName: string, workflowContext: WorkflowContextType, actionContext: BuildActionContextState) => {
    const actionTemplateText = makeWorkflowTemplate(workflowContext)

    return useMutation(
        mutationName,
        (options: {workflowId: string}) => {
            const filter = {
                Id: options.workflowId
            }
            const newActionDefinitionProperties: ActionDefinition = {
                ...actionContext?.actionDefinitionWithTags?.actionDefinition
            }
            const actionTemplateWithParameters: ActionTemplatesWithParameters = {
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
            }

            const payload: UpdateActionDefinitionWithTemplate = {
                filter: filter,
                newProperties: newActionDefinitionProperties,
                ActionTemplateWithParameters: [actionTemplateWithParameters]
            }

            return Fetcher.fetchData('PATCH', '/updateActionDefinitionWithTemplateAndParameters', payload)
        }
    )
}