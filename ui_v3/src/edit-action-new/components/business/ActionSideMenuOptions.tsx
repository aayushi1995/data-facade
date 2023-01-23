import { Settings } from "@mui/icons-material"
import { Box, IconButton, List, Tooltip } from "@mui/material"
import useActionSideMenuOptions from "../../hooks/useActionSideMenuOptions"
import { ActionSideMenuBox } from "../presentation/styled_native/ActionSideMenuBox"
import PastRunsIcon from "../../../../src/images/runs.svg"
import ConfigureIcon from "../../../../src/images/configure.svg"


const ActionSideMenuOptions = () => {

    const { handleOpenSettings, handleOpenPastRuns, handleOpenDependencies } = useActionSideMenuOptions()

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
            <Tooltip title="Deep Dive">
                <IconButton onClick={handleOpenSettings}>
                    <Settings />
                </IconButton>
            </Tooltip>
            <Tooltip title="Runs">
                <IconButton onClick={handleOpenPastRuns}>
                    <img src={PastRunsIcon} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Dependencies" >
                <IconButton onClick={handleOpenDependencies}>
                    <img src={ConfigureIcon} />
                </IconButton>
            </Tooltip>

        </Box>
    )
}

export default ActionSideMenuOptions