import { Box, IconButton, List, ListItemButton, Popover, Tooltip } from "@mui/material"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from "react";
import { ActionDefinition } from "../../generated/entities/Entities";
import { ReactQueryWrapper } from "../../common/components/ReactQueryWrapper";
import DeepDiveActionsList from "../../common/components/charts/DeepDiveActionsList";

interface DeepDiveActionButtonProps {
    ActionDefinition: ActionDefinition,
    onDeepDiveActionSelected?: (actionId: string) => void
}

const DeepDiveActionButton = (props: DeepDiveActionButtonProps) => {

    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
    const menuOpen = Boolean(menuAnchor)

    const handleActionsMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(e.currentTarget)
        console.log(e.currentTarget)
        e.stopPropagation()
    }

    const handlePopoverClose = () => {
        setMenuAnchor(null)
    }

    return (
        <Box>
            <Popover
                anchorEl={menuAnchor}
                open={menuOpen} onClose={handlePopoverClose} keepMounted
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                PaperProps={{
                    sx: {minWidth: 400, minHeight: 300}
                }}
            >
                <Box>
                     <DeepDiveActionsList actionDefinition={props.ActionDefinition} onDeepDiveActionSelected={props.onDeepDiveActionSelected}/>
                </Box>
            </Popover>
            <Tooltip title="Actions">
                <IconButton onClick={handleActionsMenuOpen}>
                    <MoreHorizIcon sx={{scale: '1.5'}}/>
                </IconButton>
            </Tooltip>
        </Box>
    )    

}

export default DeepDiveActionButton