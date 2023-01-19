import { Box } from "@mui/material"
import React from "react"
import TestAction from "../../../../pages/build_action/components/form-components/TestAction"
import { BuildActionContext } from "../../../../pages/build_action/context/BuildActionContext"
import DeepDiveSideMenu from "../../business/DeepDiveSideMenu"
import ShowActionHistory from "../../business/ShowActionHistory"
import { CardBoxRoot } from "../styled_native/ActionMainBox"


const EditActionSideView = () => {

    const buildActionContext = React.useContext(BuildActionContext)

    return (
        <>
            { buildActionContext.testMode &&
                <CardBoxRoot sx={{width:'50%'}}>
                    <TestAction/>
                </CardBoxRoot>
            }
            { buildActionContext.sideSettingsOpen && 
                <Box sx={{ width: "40%"}}>
                    <DeepDiveSideMenu />
                </Box>
            }
            { buildActionContext.pastRunsOpen && 
                <Box sx={{ width: "50%"}}>
                    <ShowActionHistory />
                </Box>
            }   
        </>
    )
}

export default EditActionSideView