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
import DeepDiveActionSelector from "./DeepDiveActionSelector"


export interface DeepDiveProps {
    executionId: string,
    definitionName: string,
    definitionId: string,
    onChildExecutionCreated?: (executionId: string) => void,
    selectedActionId?: string,
    setSelectedActionId: (id: string | undefined) => void,
    parentProviderInstanceId?: string
}

// This compoment enable users to iteratively run all available application from the result of another action.
const DeepDive = (props: DeepDiveProps) => {
    console.log(props)
    const [executionId, setExecutionId] = React.useState<string | undefined>(props.executionId)
    const [dialogState, setDialogState] = React.useState(false)

    const handleDialogOpen = () => {
        setExecutionId(undefined)
        setDialogState(true)
    }

    const handleDialogClose = () => {
        props.setSelectedActionId(undefined)
        setDialogState(false)
    }

    const addActionHandler = (actionDefinition: ActionDefinitionToAdd) => {
        props.setSelectedActionId(actionDefinition.Id)
    }

    const onExecutionCreated = (actionExecutionId: string) => {
        setExecutionId(actionExecutionId)
        props.onChildExecutionCreated?.(actionExecutionId)
        props.setSelectedActionId(undefined)
        setDialogState(false)
    }


    return (
        <React.Fragment>
            <Dialog 
                open={!!props.selectedActionId || dialogState}
                onClick={(e)=>{e.stopPropagation()}}
                maxWidth="md" 
                fullWidth>
                {dialogTitle(handleDialogClose)}
                {
                    !props.selectedActionId && 
                    <DialogContent>
                        {/* <SelectAction groups={[]} onAddAction={addActionHandler}></SelectAction> */}
                        <DeepDiveActionSelector onAddAction={addActionHandler} actionDefinitionId={props.definitionId}/>
                    </DialogContent>
                }
                {/* Execute action on the selected action definition */}
                {
                !!props.selectedActionId && 
                <ExecuteActionContextProvider>
                       <ExecuteActionNew 
                            showOnlyParameters={true} 
                            fromDeepDive={true}
                            fromTestRun={true} 
                            actionDefinitionId={props.selectedActionId} 
                            showActionDescription={true} 
                            redirectToExecution={false} 
                            onExecutionCreate={onExecutionCreated}
                            parentExecutionId={props.executionId}
                            existingParameterInstances={[]}
                            parentProviderInstanceId={props.parentProviderInstanceId}
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
