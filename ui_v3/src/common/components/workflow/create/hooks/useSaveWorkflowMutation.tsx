// @ts-nocheck

import { useMutation } from "react-query";
import { ActionDefinition, ActionTemplate } from "../../../../../generated/entities/Entities";
import { WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext";
import { v4 as uuidv4 } from 'uuid';
import dataManager from "../../../../../data_manager/data_manager";
import { makeWorkflowTemplate } from "../util/MakeWorkflowTemplate";


interface UseSaveWorkflowProps {
    mutationName: string
}

const useSaveWorkflowMutation = (props: UseSaveWorkflowProps) => {
    
    const saveWorkflow = useMutation(
        props.mutationName,
        (workflowContext: WorkflowContextType) => {
            const definitionId = uuidv4()
            const templateId = uuidv4()
            const actionDefinition: ActionDefinition = {
                Id: definitionId,
                DisplayName: workflowContext.Name,
                Description: workflowContext.Description,
                ActionType: "Workflow",
                UniqueName: workflowContext.Name,
                CreatedBy: workflowContext.Author,
                DefaultActionTemplateId: templateId
            }
            const templateText = makeWorkflowTemplate(workflowContext)
            const workflowTemplate: ActionTemplate = {
                Id: templateId,
                DefinitionId: definitionId,
                Text: templateText,
            }
            const workflowParameters = workflowContext.WorkflowParameters.map(parameter => {
                const parameterDefinition = {
                    ...parameter,
                    ActionDefinitionId: definitionId,
                    TemplateId: workflowTemplate.Id
                }
                return {
                    model: parameterDefinition,
                    tags: []
                }
            })
            const actionProperties = {
                ActionDefinition: {
                    model: actionDefinition,
                    tags: []
                },
                ActionTemplatesWithParameters: [{
                    actionParameterDefinitions: workflowParameters,
                    model: workflowTemplate,
                    tags: []
                }],
                CreateActionDefinitionForm: true
            }

            return dataManager.getInstance.saveData("ActionDefinition", actionProperties)
        },
        {
            onMutate: () => console.log("SAVING")
        }
    )

    return saveWorkflow
}

export default useSaveWorkflowMutation