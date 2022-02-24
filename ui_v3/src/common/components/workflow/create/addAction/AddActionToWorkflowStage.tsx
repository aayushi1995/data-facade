import { Box, Card } from "@material-ui/core"
import { Divider } from "@mui/material"
import React from "react"
import { lightShadows } from '../../../../../css/theme/shadows'
import ActionDefinitionTemplateType from "../../../../../enums/ActionDefinitionTemplateType"
import WorkflowActionContainer from "../../../../../pages/applications/workflow/WorkflowActionContainer"
import { SetWorkflowContext, WorkflowContext, WorkflowActionDefinition, WorkflowAction } from "../../../../../pages/applications/workflow/WorkflowContext"
import NoData from "../../../NoData"
import { ActionCardProps } from "../../../workflow-action/ActionCard"
import SelectAction, { ActionDefinitionToAdd } from "../SelectAction/SelectAction"


export interface AddActionToWorkflowStageProps {
    stageId: string
}

export const AddActionToWorkflowStage = (props: AddActionToWorkflowStageProps) => {
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const stageDetails = workflowContext.stages.filter(stage => stage.Id === props.stageId)?.[0]

    const handleDeleteAction = (actionId: string, actionIndex: number) => {
        const payload = {
            stageId: props.stageId,
            actionId: actionId,
            actionIndex: actionIndex
        }

        setWorkflowContext({type: 'DELETE_ACTION', payload: payload})

    }

    const stageActions = stageDetails?.Actions?.map((action, index) => {
        return {
            index: index,
            actionId: action.Id,
            actionName: action.DisplayName,
            actionGroup: action.ActionGroup,
            displayRowsEffected: false,
            deleteButtonAction: handleDeleteAction
        }
    })
    
    

    const onActionListChange = (actions: ActionCardProps[]) => {
        const newWorkflowActions = actions.map(actionDefinition => {
            return {
                DisplayName: actionDefinition.actionName,
                Id: actionDefinition.actionId,
                DefaultTemplateId: 'defaultTemplateId',
                Parameters: [],
                ActionGroup: 'Data Cleansing'
            }
        })

        setWorkflowContext({type: 'REORDER_ACTION', payload: {stageId: props.stageId, newActions: newWorkflowActions}})
    }

    const addActionHandler = (actionDefinition: ActionDefinitionToAdd) => {
        const newWorkflowAction: WorkflowActionDefinition = {
            DisplayName: actionDefinition.DisplayName,
            Id: actionDefinition.Id,
            DefaultTemplateId: 'defaultTemplateId',
            Parameters: [],
            ActionGroup: 'Data Cleansing'
        }

        setWorkflowContext({type: 'ADD_ACTION', payload: {stageId: props.stageId, Action: newWorkflowAction}})

    }

    const buildActionHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        
    }


    if(stageDetails) {
        return (
            <Card sx={{display: 'flex', boxShadow: lightShadows[27], background: '#F8F8F8', borderRadius: '10px', width: '100%', height: '100%'}}>
                <Box sx={{flex: 0.25, p: 3}}>
                    <Card sx={{ background: '#FFFFFF', boxShadow: lightShadows[26], height: '100%', borderRadius: '10px', overflowY: 'auto'}}>
                        <WorkflowActionContainer
                            stageId={props.stageId}
                            stageName={stageDetails.Name}
                            Actions={stageActions}
                            onActionListChange={onActionListChange}
                            buildActionHandler={buildActionHandler}
                            fromBuildAction={true}
                        ></WorkflowActionContainer>
                    </Card>
                </Box>
                <Divider/>
                <Box sx={{flex: 1, p: 1}}>
                    <SelectAction groups={[]} onAddAction={addActionHandler}></SelectAction>
                </Box>

            </Card>
        )
    } else {
        return <NoData/>
    }

}