import { Box, Dialog, DialogContent } from "@mui/material";
import React from "react";
import BuildActionForm from "./components/BuildActionForm";
import BuildActionWizard from "./components/BuildActionWizard";
import { BuildActionContextProvider } from "./context/BuildActionContext";

export interface BuildActionHomePageProps {

}

const BuildActionHomePage = (props: BuildActionHomePageProps) => {
    const [showWizard, setShowWizard] = React.useState(true)
    const handleClose = () => {
        setShowWizard(false)
    }
    return(
        <BuildActionContextProvider>
            <Box>
                <Dialog open={showWizard} onClose={handleClose} fullWidth maxWidth="xl">
                    <DialogContent sx={{minHeight: "800px"}}>
                        <BuildActionWizard/>
                    </DialogContent>
                </Dialog>
                <BuildActionForm/>
            </Box>
        </BuildActionContextProvider>
    )
}

export default BuildActionHomePage;