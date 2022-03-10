import { AppBar, Box, IconButton, Toolbar, Button, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { ActionDefinition } from "../../../../../generated/entities/Entities";
import BuildActionForm from "../../../../../pages/build_action/components/BuildActionForm";
import { BuildActionContextProvider, SetBuildActionContext } from "../../../../../pages/build_action/context/BuildActionContext";
import React from "react";

interface BuildActionFromWorkflow {
    handleDialogClose: (actionDefinition?: ActionDefinition) => void
}

const BuildActionFromWorkflow = (props: BuildActionFromWorkflow) => {
    const setBuildActionState = React.useContext(SetBuildActionContext)

    const handleClose = (actionDefinition?: ActionDefinition) => {
        console.log(actionDefinition)
        props.handleDialogClose(actionDefinition)
    }
    React.useEffect(() => {
        setBuildActionState({type: 'SetSuccessCallbackFunction', payload: {cb: handleClose}})
    }, [props])

    return (
        <Box>
           <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="close"
                    onClick={() => {
                        console.log('here')
                        props.handleDialogClose()
                    }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
                        Build Workflow Action
                    </Typography>
                </Toolbar>
            </AppBar> 
            <Box sx={{mt: 3}}>
                <BuildActionForm/>
            </Box>
        </Box>
    )
}


export default BuildActionFromWorkflow