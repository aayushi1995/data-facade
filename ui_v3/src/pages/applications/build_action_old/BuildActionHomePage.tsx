import { Box } from "@mui/material";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import ApplicationID from "../../../enums/ApplicationID";
import { ActionDefinition } from "../../../generated/entities/Entities";
import CreateActionWizardDialog from "./components/form-components/CreateActionWizardDialog";
import { BuildActionContextProvider } from "./context/BuildActionContext";

export interface BuildActionHomePageProps {

}

const BuildActionHomePage = (props: BuildActionHomePageProps) => {
    return(
        <BuildActionContextProvider>
            <ContextWrappedHomePage/>
        </BuildActionContextProvider>
    )
}

const ContextWrappedHomePage = (props: {preSelectedActionDefiniitonId?: string}) => { 
    const history = useHistory()
    const [showWizard, setShowWizard] = React.useState(true)
    const location = useLocation()

    const applicationId = location.search ? new URLSearchParams(location.search).get("applicationId")
                            : ApplicationID.DEFAULT_APPLICATION


    return (
        <Box>
            <CreateActionWizardDialog
                applicationId={applicationId}
                onSuccessfulCreation={(createdActionDefinition: ActionDefinition) => {
                    if(!!createdActionDefinition?.Id) {
                        history.push(`/application/edit-action/${createdActionDefinition?.Id!}`)
                    }
                }}
                onCancelCreation={() => {
                    history.push(`/application`)
                }}
                showWizard={showWizard}
                onWizardClose={() => setShowWizard(false)}
            />
        </Box>
    )
}

export default BuildActionHomePage;
