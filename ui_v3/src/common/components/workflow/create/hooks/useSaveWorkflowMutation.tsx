// @ts-nocheck

import { useMutation } from "react-query";
import { v4 as uuidv4 } from 'uuid';
import dataManager from "../../../../../data_manager/data_manager";
import ActionDefinitionActionType from "../../../../../enums/ActionDefinitionActionType";
import ActionDefinitionPublishStatus from "../../../../../enums/ActionDefinitionPublishStatus";
import ActionDefinitionVisibility from "../../../../../enums/ActionDefinitionVisibility";
import { ActionDefinition, ActionTemplate } from "../../../../../generated/entities/Entities";
import { WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext";
import { makeWorkflowTemplate } from "../util/MakeWorkflowTemplate";
import { BuildActionContextState } from "./../../../../../pages/build_action/context/BuildActionContext";


interface UseSaveWorkflowProps {
    mutationName: string
    applicationId?: string
}

const useSaveWorkflowMutation = (props: UseSaveWorkflowProps) => {
    const saveWorkflow = useMutation(
        props.mutationName,
        (options: {actionContext?: BuildActionContextState, workflowContext: WorkflowContextType, definitionId: string}) => {
            const {actionContext, workflowContext, definitionId} = options
            const templateId = uuidv4()
            const actionDefinition: ActionDefinition = {
                Id: definitionId,
                DisplayName: actionContext?.actionDefinitionWithTags?.actionDefinition?.UniqueName,
                Description: actionContext?.actionDefinitionWithTags?.actionDefinition?.Description,
                ActionType: ActionDefinitionActionType.WORKFLOW,
                UniqueName: actionContext?.actionDefinitionWithTags?.actionDefinition?.UniqueName,
                CreatedBy: actionContext?.actionDefinitionWithTags?.actionDefinition?.CreatedBy,
                DefaultActionTemplateId: templateId,
                ApplicationId: props.applicationId,
                PublishStatus: ActionDefinitionPublishStatus.READY_TO_USE,
                PinnedToDashboard: actionContext?.actionDefinitionWithTags?.actionDefinition?.PinnedToDashboard,
                Visibility: ActionDefinitionVisibility.CREATED_BY
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