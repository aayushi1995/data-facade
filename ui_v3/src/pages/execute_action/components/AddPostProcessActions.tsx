import { Grid } from "@mui/material"
import React from "react"
import { BuildActionContext } from "../../build_action/context/BuildActionContext"
import useAddPostProcessingActions from "../hooks/useAddPostProcessingActions"
import ConfigureSelectedPostProcessingAction from "./ConfigureSelectedPostProcessingAction"
import SelectActionToAdd from "./SelectActionToAdd"
import SelectedActionContainer from "./SelectedActionContainer"



const AddPostProcessingActions =  () => {
    
    const {selectActionProps, selectedActionContainerProps, selectedActionIndex, getConfigureSelectedActionProps} = useAddPostProcessingActions()

    console.log(selectedActionIndex)

    return (
        <Grid container spacing={1}>
            <Grid item sm={12} md={6} lg={3}>
                <SelectedActionContainer {...selectedActionContainerProps}/>
            </Grid>
            <Grid item md={12} lg={9}>
                {selectedActionIndex !== undefined ? (
                    <ConfigureSelectedPostProcessingAction {...getConfigureSelectedActionProps()}/>
                ) : (
                    <SelectActionToAdd {...selectActionProps}/>
                )}
                
            </Grid>

        </Grid>
    )
}

export default AddPostProcessingActions