import { type } from "os";
import { WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext";

export type WorkflowTemplate = {
    Id: string,
    DefaultActionTemplateId: string,
    DisplayName: string,
    Parameters?: object,
    stageId: string,
    stageName: string
}

export function makeWorkflowTemplate(workflowContext: WorkflowContextType): string {
    const workflowActionDefinitions: WorkflowTemplate[] = []

    workflowContext.stages.map(stage => {
        const actionsInThisStage = stage.Actions.map(stageAction => {
            var parameters = {}
            stageAction.Parameters.map(parameter => {
                const offset = parameter.SourceExecutionId ? calculateOffset(workflowContext, parameter.SourceExecutionId.stageId) + parameter.SourceExecutionId.actionIndex: 0
                parameters = {
                    ...parameters,
                    [parameter.ActionParameterDefinitionId]: {
                        SourceExecutionId: parameter.SourceExecutionId ? parameter.SourceExecutionId.actionId + offset: undefined,
                        ParameterValue: parameter.ParameterValue,
                        TableId: parameter.TableId,
                        ColumnId: parameter.ColumnId,
                        GlobalParameterId: parameter.GlobalParameterId
                    }
                }
                return parameters
            })
            return {
                Id: stageAction.Id,
                DefaultActionTemplateId: stageAction.DefaultActionTemplateId,
                DisplayName: stageAction.DisplayName,
                ParameterValues: {...parameters},
                stageId: stage.Id,
                stageName: stage.Name
            }
        })
        actionsInThisStage.forEach(stageAction => workflowActionDefinitions.push(stageAction))
    })
    return JSON.stringify(workflowActionDefinitions)
}

function calculateOffset(workflowContext: WorkflowContextType, stageId: string): number {
    var offset = 0
    for(let i = 0; i < workflowContext.stages.length; i++) {
        if(workflowContext.stages[i].Id == stageId) {
            return offset;
        }
        offset += workflowContext.stages[i].Actions.length
    }
    return offset
}