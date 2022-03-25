import { Box, Card, Grid } from "@mui/material"
import { Divider } from "@mui/material"
import React from "react"
import { lightShadows } from '../../../../../css/theme/shadows'
import WorkflowActionContainer from "../../../../../pages/applications/workflow/WorkflowActionContainer"
import { SetWorkflowContext, WorkflowActionDefinition } from "../../../../../pages/applications/workflow/WorkflowContext"
import SelectAction, { ActionDefinitionToAdd } from "../SelectAction/SelectAction"
import ViewSelectedAction from "../ViewSelectedAction/ViewSelectedAction"


export interface AddActionToWorkflowStageProps {
    stageId: string
}

export const AddActionToWorkflowStage = (props: AddActionToWorkflowStageProps) => {
    const [selectedAction, setSelectedAction] = React.useState({actionId: "", actionIndex: -1})
    const setWorkflowContext = React.useContext(SetWorkflowContext)

    const handleSelectAction = (actionId: string, actionIndex: number) => {
        setSelectedAction({actionId: actionId, actionIndex: actionIndex})
    }

    const addActionHandler = (actionDefinition: ActionDefinitionToAdd) => {
        const newWorkflowAction: WorkflowActionDefinition = {
            DisplayName: actionDefinition.DisplayName,
            Id: actionDefinition.Id,
            DefaultActionTemplateId: actionDefinition.DefaultTemplateId,
            Parameters: [],
            // TODO: Add action group back once it's ready from backend     
            ActionGroup: "Yet to define"
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