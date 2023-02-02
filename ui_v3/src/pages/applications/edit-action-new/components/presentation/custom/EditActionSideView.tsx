import { Box } from "@mui/material"
import React from "react"
import TestAction from "../../../../build_action_old/components/form-components/TestAction"
import { BuildActionContext } from "../../../../build_action_old/context/BuildActionContext"
import DeepDiveSideMenu from "../../business/DeepDiveSideMenu"
import ShowActionDependencies from "../../business/ShowActionDependencies"
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
                <Box sx={{ width: "50%"}}>
                    <DeepDiveSideMenu />
                </Box>
            }
            { buildActionContext.pastRunsOpen && 
                <Box sx={{ width: "50%"}}>
                    <ShowActionHistory />
                </Box>
            }  
            {
                buildActionContext.showDependencies && 
                 <Box sx={{ width: '50%' }}>
                    <ShowActionDependencies />
                 </Box> 
            }
        </>
    )
}

export default EditActionSideView