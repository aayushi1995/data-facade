import { Box, Dialog, DialogContent } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import BuildActionForm from "./components/BuildActionForm";
import BuildActionWizard from "./components/BuildActionWizard";
import { BuildActionContextProvider, SetBuildActionContext } from "./context/BuildActionContext";

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
    const setActionContext = React.useContext(SetBuildActionContext)
    const [showWizard, setShowWizard] = React.useState(true)
    const location = useLocation()
    console.log(location.state)
    React.useEffect(() => {
        setActionContext({
            type: "SetMode",
            payload: {
                mode: "CREATE"
            }
        })

        setActionContext({
            type: "SetSourceApplicationId",
            payload: {
                newApplicationId: location.state as string|undefined
            }
        })
    }, [])

    const handleClose = () => {
        setShowWizard(false)
    }
    
    
    return (
        <Box>
            <Dialog open={showWizard} onClose={handleClose} fullWidth maxWidth="xl">
                <DialogContent sx={{minHeight: "800px"}}>
                    <BuildActionWizard/>
                </DialogContent>
            </Dialog>
            <BuildActionForm/>
        </Box>
    )
}

export default BuildActionHomePage;