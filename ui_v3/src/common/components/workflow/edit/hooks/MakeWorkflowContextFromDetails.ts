import { v4 as uuidv4 } from "uuid"
import { ActionDefinition, ActionParameterDefinition, ActionTemplate } from "../../../../../generated/entities/Entities"
import { WorkflowTemplateType } from "../../../../../pages/applications/workflow/EditWorkflowHomePage"
import { UpstreamAction, WorkflowActionDefinition, WorkflowContextType } from "../../../../../pages/applications/workflow/WorkflowContext"
import { assignIndex } from "../../../../../pages/build_action/context/BuildActionContext"


interface MakeWorkflowContextPropsFromDetailsProps {
    workflowTemplateModel: ActionTemplate,
    workflowParameters: ActionParameterDefinition[],
    workflowDefinition: ActionDefinition,
    newIds?: boolean,
    applicationId?: string,
    createdBy?: string
}

const MakeWorkflowContextFromDetail = (props: MakeWorkflowContextPropsFromDetailsProps) => {

    const {workflowDefinition, workflowParameters, workflowTemplateModel, newIds, applicationId} = props
    const workflowTemplate = workflowTemplateModel.Text || "{}"

    const workflowContextObject: WorkflowContextType = {
        mode: "EDIT",
        stages: [],
        Name: workflowDefinition?.DisplayName || "",
        WorkflowParameters: assignIndex(workflowParameters),
        Description: workflowDefinition?.Description || "",
        Author: props.createdBy || workflowDefinition?.CreatedBy || "",
        draggingAllowed: true,
        ApplicationId: applicationId || workflowDefinition?.ApplicationId,
        Template: workflowTemplateModel,
        PinnedToDashboard: workflowDefinition.PinnedToDashboard,
        PublishStatus: workflowDefinition.PublishStatus,
        ActionGroup: workflowDefinition.ActionGroup,
        UpdatedOn: workflowDefinition.UpdatedOn,
        CreatedOn: workflowDefinition.CreatedOn
    }
    const workflowActions = JSON.parse(workflowTemplate) as WorkflowTemplateType[]
    let upstreamMapping: {[key: string]: UpstreamAction} = {}
    for(let i = 0; i < workflowActions.length; i++) {
        const currentStageId = workflowActions[i].stageId
        const currentStageName = workflowActions[i].stageName
        const stageActions: WorkflowActionDefinition[] = []
        let stageIndex = 0;
        while(i < workflowActions.length && workflowActions[i].stageId === currentStageId) {
            const idWithIndex: string = workflowActions[i].Id + i
            // mapping to upstream actions using workflow template
            upstreamMapping[idWithIndex] = {
                actionId: workflowActions[i].Id,
                actionIndex: stageIndex,
                stageId: currentStageId,
                stageName: currentStageName,
                actionName: workflowActions[i].DisplayName
            }
            const parameterMappings = workflowActions[i].ParameterValues
            const parameters = Object.entries(parameterMappings).map(([parameterDefinitionId, parameterInstance]) => {
                const actionParameter = {
                    ...parameterInstance,
                    ActionParameterDefinitionId: parameterDefinitionId,
                    userInputRequired: parameterInstance.GlobalParameterId ? "Yes" : "No",
                    SourceExecutionId: upstreamMapping[parameterInstance?.SourceExecutionId]
                }
                return actionParameter
            })
            stageActions.push({
                Id: workflowActions[i].Id,
                ActionGroup: "Yet to define", // TODO: Remove Hard Coding after introduction of groups
                DisplayName: workflowActions[i].DisplayName,
                DefaultActionTemplateId: workflowActions[i].DefaultActionTemplateId,
                Parameters: parameters
            })  
            stageIndex++;
            i++;
        }
        workflowContextObject.stages.push({
            Id: currentStageId,
            Name: currentStageName,
            Actions: stageActions
        })
        i--;
        stageIndex++;
    }
    if(workflowContextObject.stages.length === 0) {
        workflowContextObject.stages.push({
            Name: "Stage 1",
            Id: uuidv4(),
            Actions: []
        })
    }
    
    return workflowContextObject

}

export default MakeWorkflowContextFromDetail