import { Settings } from "@mui/icons-material"
import { IconButton, List, Tooltip } from "@mui/material"
import useActionSideMenuOptions from "../../hooks/useActionSideMenuOptions"
import { ActionSideMenuBox } from "../presentation/styled_native/ActionSideMenuBox"


const ActionSideMenuOptions = () => {

    const { handleOpenSettings } = useActionSideMenuOptions()

    return (
        <ActionSideMenuBox sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
            <Tooltip title="Settings">
                <IconButton onClick={handleOpenSettings}>
                    <Settings />
                </IconButton>
            </Tooltip>
        </ActionSideMenuBox>
    )
}

export default ActionSideMenuOptions