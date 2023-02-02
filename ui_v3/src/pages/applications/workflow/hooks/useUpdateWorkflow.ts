import { useMutation } from "react-query";
import dataManager from "../../../../data_manager/data_manager";
import ActionDefinitionActionType from "../../../../enums/ActionDefinitionActionType";
import labels from "../../../../labels/labels";
import { BuildActionContextState } from "../../build_action_old/context/BuildActionContext";
import { ActionDefinitionFormPayload } from "../../build_action_old/hooks/useActionDefinitionFormCreate";
import { WorkflowContextType } from "../context/WorkflowContext";
import { makeWorkflowTemplate } from "../create/util/MakeWorkflowTemplate";


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