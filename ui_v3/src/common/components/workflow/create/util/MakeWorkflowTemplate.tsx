import { type } from "os";
import { WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext";

type WorkflowTemplate = {
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
                        ColumnId: parameter.ColumnId
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
    workflowContext.stages.forEach(stage => {
        if(stage.Id === stageId) {
            return offset;
        }
        offset += stage.Actions.length
    })
    return offset
}