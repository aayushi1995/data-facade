import { Box, Card, Grid } from "@mui/material"
import { Divider } from "@mui/material"
import React from "react"
import { lightShadows } from '../../../../../css/theme/shadows'
import WorkflowActionContainer from "../../../../../pages/applications/workflow/WorkflowActionContainer"
import { SetWorkflowContext, WorkflowActionDefinition, WorkflowContext } from "../../../../../pages/applications/workflow/WorkflowContext"
import SelectAction, { ActionDefinitionToAdd } from "../SelectAction/SelectAction"
import ViewSelectedAction from "../ViewSelectedAction/ViewSelectedAction"


export interface AddActionToWorkflowStageProps {
    stageId: string
}

export const AddActionToWorkflowStage = (props: AddActionToWorkflowStageProps) => {
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const workflowContext = React.useContext(WorkflowContext)
    const selectedAction = workflowContext.currentSelectedAction || {actionId: "", actionIndex: -1}

    const handleSelectAction = (actionId: string, actionIndex: number) => {
        setWorkflowContext({type: 'SET_SELECTED_ACTION', payload: {actionId: actionId, actionIndex: actionIndex}})
    }

    const addActionHandler = (actionDefinition: ActionDefinitionToAdd) => {
        console.log(actionDefinition)
        const newWorkflowAction: WorkflowActionDefinition = {
            DisplayName: actionDefinition.DisplayName,
            Id: actionDefinition.Id,
            DefaultActionTemplateId: actionDefinition.DefaultTemplateId,
            Parameters: actionDefinition.Parameters || [],  
            ActionGroup: actionDefinition.ActionGroup || ""
        }

        setWorkflowContext({type: 'ADD_ACTION', payload: {stageId: props.stageId, Action: newWorkflowAction}})

    }

    const buildActionHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        
    }


    return (
        <Card sx={{display: 'flex', boxShadow: lightShadows[27], background: '#F8F8F8', borderRadius: '10px', width: '100%', height: '100%'}}>
            <Grid container spacing={1} sx={{height: "auto", p: 1}}>
                <Grid item xs={3} sx={{ p: 3}}>
                    <Card sx={{ boxShadow: '-3.88725px -5.83088px 15.549px rgba(255, 255, 255, 0.5), 3.88725px 5.83088px 15.549px rgba(163, 177, 198, 0.5)', height: '100%', maxWidth: '100%', overflowY: 'auto', borderRadius: '20px', background: '#F5F9FF'}}>
                        <WorkflowActionContainer
                            stageId={props.stageId}
                            buildActionHandler={buildActionHandler}
                            fromBuildAction={true}
                            handleSelectAction={handleSelectAction}
                        ></WorkflowActionContainer>
                    </Card>
                </Grid>
                <Grid item xs={9} sx={{overflowY: 'auto'}}>
                    <Box p={1}>
                        {selectedAction.actionIndex === -1 ? (
                            <SelectAction groups={[]} onAddAction={addActionHandler}></SelectAction>
                        ) : (
                            <ViewSelectedAction stageId={props.stageId} actionDefinitionId={selectedAction.actionId} actionDefinitionIndex={selectedAction.actionIndex}/>
                        )}
                        
                    </Box>
                </Grid>
            </Grid>
        </Card>
    )


}