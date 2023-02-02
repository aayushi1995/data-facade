import { Settings } from "@mui/icons-material"
import { Box, IconButton, Tooltip } from "@mui/material"
import ConfigureIcon from "../../../../../../src/assets/images/configure.svg"
import PastRunsIcon from "../../../../../../src/assets/images/runs.svg"
import useActionSideMenuOptions from "../../hooks/useActionSideMenuOptions"


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