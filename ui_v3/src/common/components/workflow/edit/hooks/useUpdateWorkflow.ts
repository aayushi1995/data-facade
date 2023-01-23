import { useMutation } from "react-query";
import dataManager from "../../../../../data_manager/data_manager";
import ActionDefinitionActionType from "../../../../../enums/ActionDefinitionActionType";
import labels from "../../../../../labels/labels";
import { WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext";
import { BuildActionContextState } from "../../../../../pages/build_action/context/BuildActionContext";
import { ActionDefinitionFormPayload } from "../../../../../pages/build_action/hooks/useActionDefinitionFormCreate";
import { makeWorkflowTemplate } from "../../create/util/MakeWorkflowTemplate";


export const useUpdateWorkflow = (mutationName: string, workflowContext: WorkflowContextType, actionContext: BuildActionContextState) => {
    
    const fetchedDataManagerInstance = dataManager.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function, patchData: Function}

    const formWorkflowConfig = () => {
        return JSON.stringify(workflowContext.TestInstance || {})
    }

    return useMutation(
        mutationName,
        (options: {workflowId: string}) => {
            const actionTemplateText = makeWorkflowTemplate(workflowContext)
            const updatedWorkflow: ActionDefinitionFormPayload = {
                ActionDefinition: {
                    model: {...actionContext?.actionDefinitionWithTags?.actionDefinition, Id: options.workflowId, Config: formWorkflowConfig(), ActionType: ActionDefinitionActionType.WORKFLOW},
                    tags: []
                },
                ActionTemplatesWithParameters: [
                    {
                        model: {
                           ...workflowContext.Template,
                           Text: actionTemplateText,
                        },
                        tags: [],
                        actionParameterDefinitions: workflowContext.WorkflowParameters.map(parameter => {
                            return {
                                model: {
                                    ...parameter,
                                    ActionDefinitionId: options.workflowId,
                                    TemplateId: workflowContext.Template?.Id
                                },
                                tags: []
                            }
                        })
                    }
                ]
            }

            const payload = {
                UpdatedAction: updatedWorkflow,
                ActionDefinitionForm: true
            }

            return fetchedDataManagerInstance.patchData(labels.entities.ActionDefinition, {
                ...payload
            })
        }
    )
}