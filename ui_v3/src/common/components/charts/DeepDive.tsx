// Create a component named DeepDiveCompoment that take an action execution id as a prop and display the following: It'll open up a diaglog with an option to select any action definition from the drop down list of action definitions. Then it'll create an action execution corresponding to the selected action definition. 

import { ActionDefinitionToAdd } from "../../../pages/applications/workflow/create/SelectAction/SelectAction"


// Create a compoment that can select any action definition from the drop down list of action definitions.

import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@mui/material"
import React from "react"

import CloseIcon from '@mui/icons-material/Close'
import ExecuteActionNew from "../../../pages/applications/execute_action/components/ExecuteAction"
import { ExecuteActionContextProvider } from "../../../pages/applications/execute_action/context/ExecuteActionContext"
import DeepDiveActionSelector from "./DeepDiveActionSelector"


export interface DeepDiveProps {
    executionId: string,
    definitionName?: string,
    definitionId: string,
    onChildExecutionCreated?: (executionId: string) => void,
    selectedActionId?: string,
    setSelectedActionId: (id: string | undefined) => void,
    parentProviderInstanceId?: string,
    buttonElement?: JSX.Element
}

// This compoment enable users to iteratively run all available application from the result of another action.
const DeepDive = (props: DeepDiveProps) => {
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
            <Box onClick={handleDialogOpen}>
            {!!props.buttonElement ? (props.buttonElement) : <Button 
                variant="outlined" 
                color='success' 
                sx={{ borderRadius: "5px" }} 
                fullWidth>
                Deep Dive
            </Button>}
            </Box>
            
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
