
import { WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext";

export type WorkflowTemplate = {
    Id: string,
    DefaultActionTemplateId: string,
    DisplayName: string,
    ParameterValues?: object,
    stageId: string,
    stageName: string,
    ReferenceId?: string,
    UpstreamDependencies: number[]
    DownstreamDependencies: number[],
    GlobalParameterDependencies: string[]
}

export function makeWorkflowTemplate(workflowContext: WorkflowContextType): string {
    const workflowActionDefinitions: WorkflowTemplate[] = []
    workflowContext.stages.map(stage => {
        stage.Actions.map((stageAction, index) => {
            var parameters = {}
            const upstreamDependencies: number[] = []
            const parameterDependencies: string[] = []
            stageAction.Parameters.forEach(parameter => {
                const offset = parameter.SourceExecutionId ? calculateOffset(workflowContext, parameter.SourceExecutionId.stageId) + parameter.SourceExecutionId.actionIndex: 0
                if(!!parameter.SourceExecutionId) {
                    upstreamDependencies.push(offset)
                }
                if(!!parameter.GlobalParameterId) {
                    parameterDependencies.push(parameter.GlobalParameterId)
                }
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
            const currentActionIndex = calculateOffset(workflowContext, stage.Id) + index
            upstreamDependencies.forEach(value => {
                workflowActionDefinitions[value].DownstreamDependencies.push(currentActionIndex)
            })
            workflowActionDefinitions.push({
                Id: stageAction.Id,
                DefaultActionTemplateId: stageAction.DefaultActionTemplateId,
                DisplayName: stageAction.DisplayName,
                ParameterValues: {...parameters},
                stageId: stage.Id,
                stageName: stage.Name,
                ReferenceId: stageAction.ReferenceId,
                UpstreamDependencies: upstreamDependencies,
                DownstreamDependencies: [],
                GlobalParameterDependencies: parameterDependencies
            })
        })
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