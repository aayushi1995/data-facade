// Create a component named DeepDiveCompoment that take an action execution id as a prop and display the following: It'll open up a diaglog with an option to select any action definition from the drop down list of action definitions. Then it'll create an action execution corresponding to the selected action definition. 

import SelectAction, { ActionDefinitionToAdd } from "../workflow/create/SelectAction/SelectAction"
import SelectFromAllActions from "../workflow/create/SelectFromAllActions"


// Create a compoment that can select any action definition from the drop down list of action definitions.

import { Dialog, DialogTitle, DialogContent, Typography, Box, TextField, Grid, IconButton } from "@mui/material"
import { Button } from "@mui/material"
import React from "react"
import { useHistory } from "react-router"

import { Dashboard } from "../../../generated/entities/Entities"
import LoadingIndicator from "../LoadingIndicator"
import ExecuteActionNew from "../../../pages/execute_action/components/ExecuteAction"
import { ExecuteActionContextProvider } from "../../../pages/execute_action/context/ExecuteActionContext"
import { ActionExecutionDetails } from "../../../pages/apps/components/ActionExecutionHomePage"
import CloseIcon from '@mui/icons-material/Close';


export interface DeepDiveProps {
    executionId: string,
    definitionName: string,
    onChildExecutionCreated: (executionId: string) => void,
}

// This compoment enable users to iteratively run all available application from the result of another action.
const DeepDive = (props: DeepDiveProps) => {
    const [openDialog, setOpenDialog] = React.useState(false)
    const [executionId, setExecutionId] = React.useState<string | undefined>(props.executionId)
    const [selecedAction, setSelecedAction] = React.useState()

    const handleDialogOpen = () => {
        setOpenDialog(true)
        setExecutionId(undefined)
        setSelecedAction(undefined)
    }

    const handleDialogClose = () => {
        setOpenDialog(false)
    }

    const addActionHandler = (actionDefinition: ActionDefinitionToAdd) => {
        setSelecedAction(actionDefinition)
    }

    const onExecutionCreated = (actionExecutionId: string) => {
        setExecutionId(actionExecutionId)
        props.onChildExecutionCreated(actionExecutionId)
        setOpenDialog(false)
    }

    return (
        <React.Fragment>
            <Dialog 
                open={openDialog}
                onClick={(e)=>{e.stopPropagation()}}
                maxWidth="md" 
                fullWidth>
                {dialogTitle(handleDialogClose)}
                {
                    !selecedAction && 
                    <DialogContent>
                        <SelectAction groups={[]} onAddAction={addActionHandler}></SelectAction>
                    </DialogContent>
                }
                {/* Execute action on the selected action definition */}
                {
                selecedAction && 
                <ExecuteActionContextProvider>
                       <ExecuteActionNew 
                            showOnlyParameters={true} 
                            fromDeepDive={true}
                            fromTestRun={true} 
                            actionDefinitionId={selecedAction.Id} 
                            showActionDescription={true} 
                            redirectToExecution={false} 
                            onExecutionCreate={onExecutionCreated}
                            parentExecutionId={props.executionId}
                            existingParameterInstances={[]}
                   />
                </ExecuteActionContextProvider>
                }
            </Dialog>
            <Button 
                variant="outlined" 
                color='success' 
                sx={{ borderRadius: "5px" }} 
                onClick={handleDialogOpen} 
                fullWidth>
                Deep Dive
            </Button>
        </React.Fragment>
    )

    function dialogTitle(handleDialogClose: () => void) {
        return <DialogTitle>
            <Grid container>
                <Grid item xs={6}>
                    <Typography variant="heroMeta" sx={{ fontSize: '20px' }}>
                        Deep Dive
                    </Typography>
                </Grid>
                <Grid item xs={6} justifyContent='flex-end'>
                    <IconButton onClick={handleDialogClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </DialogTitle>
    }
}

export default DeepDive
