import { Box, Card, Grid, Dialog, DialogTitle, DialogContent, IconButton, Typography } from "@mui/material"
import { Divider } from "@mui/material"
import CloseIcon from "../../../../../../src/images/close.svg"
import React from "react"
import { lightShadows } from '../../../../../css/theme/shadows'
import WorkflowActionContainer from "../../../../../pages/applications/workflow/WorkflowActionContainer"
import { SetWorkflowContext, WorkflowActionDefinition, WorkflowContext } from "../../../../../pages/applications/workflow/WorkflowContext"
import SelectAction, { ActionDefinitionToAdd } from "../SelectAction/SelectAction"
import ViewSelectedAction from "../ViewSelectedAction/ViewSelectedAction"
import { ConfigureParametersContextProvider } from "../../context/ConfigureParametersContext"
import ConfigureActionParameters from "./ConfigureActionParameters"


export interface AddActionToWorkflowStageProps {
    stageId: string
}

export const AddActionToWorkflowStage = (props: AddActionToWorkflowStageProps) => {
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const workflowContext = React.useContext(WorkflowContext)
    const selectedAction = workflowContext.currentSelectedAction || {actionId: "", actionIndex: -1}
    const [configureParametersDialog, setConfigureParameterStateDialog] = React.useState(false)

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
        setConfigureParameterStateDialog(true)

    }

    const buildActionHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        
    }

    const handleConfigureParametersDialogClose = () => {
        setConfigureParameterStateDialog(false)
    }


    return (
        <Card sx={{display: 'flex', boxShadow: lightShadows[27], background: '#F8F8F8', borderRadius: '10px', width: '100%', height: '100%'}}>
            <Dialog open={configureParametersDialog} fullWidth maxWidth="xl" >
                <DialogTitle sx={{display: 'flex', justifyContent: 'center',background: "#66748A", boxShadow: "inset 0px 15px 25px rgba(54, 48, 116, 0.3)"}}>
                    <Grid item xs={6} sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant="heroHeader" sx={{
                            fontFamily: "'SF Pro Text'",
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "18px",
                            lineHeight: "160%",
                            letterSpacing: "0.15px",
                            color: "#F8F8F8"}}
                        >
                            Action Configurator
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{display: 'flex', justifyContent: 'flex-end'}} onClick={handleConfigureParametersDialogClose}>
                        <IconButton aria-label="close" >
                            <img src={CloseIcon} alt="close"/>
                        </IconButton>
                    </Grid>
                    
                </DialogTitle>
                <DialogContent sx={{minHeight: '500px', mt: 2}}>
                    <ConfigureParametersContextProvider>
                        <ConfigureActionParameters handleDialogClose={handleConfigureParametersDialogClose}/>
                    </ConfigureParametersContextProvider>
                </DialogContent>
            </Dialog>
            <Grid container spacing={1} sx={{maxHeight: "700px", p: 1}}>
                <Grid item xs={3} sx={{ p: 3, maxHeight: '600px'}}>
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