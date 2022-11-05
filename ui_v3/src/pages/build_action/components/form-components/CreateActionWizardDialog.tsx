import { Box, Dialog } from "@mui/material"
import React from "react"
import LoadingIndicator from "../../../../common/components/LoadingIndicator"
import { ActionDefinition } from "../../../../generated/entities/Entities"
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext"
import CreateActionWizard from "../BuildActionWizard"

export interface CreateActionWizardDialogProps {
    applicationId?: string,
    onSuccessfulCreation?: (actionDefinition: ActionDefinition) => void,
    onCancelCreation?: () => void,
    showWizard: boolean,
    onWizardClose?: () => void
}

const CreateActionWizardDialog = (props: CreateActionWizardDialogProps) => {
    const actionContext = React.useContext(BuildActionContext)
    const setActionContext = React.useContext(SetBuildActionContext)

    React.useEffect(() => {
        setActionContext({
            type: "SetMode",
            payload: {
                mode: "CREATE"
            }
        })

        setActionContext({
            type: "SetApplicationId",
            payload: {
                newApplicationId: props.applicationId
            }
        })
    }, [])
     
    return (
        actionContext.mode==="CREATE" ?
            <Box>
                <Dialog open={props.showWizard} fullWidth maxWidth="md" >
                    
                        <CreateActionWizard
                            onSuccessfulCreation={(createdActionDefinition) => {
                                props?.onWizardClose?.()
                                props?.onSuccessfulCreation?.(createdActionDefinition)
                            }}
                            onCancelCreation={() => {
                                props?.onWizardClose?.()
                                props?.onCancelCreation?.()
                            }}
                        />
                </Dialog>
            </Box>
            :
            <LoadingIndicator/>
    )
}

export default CreateActionWizardDialog;