
import { Box, Card, Icon, IconButton, Typography, useTheme } from '@mui/material';
import React from 'react';
import Eye from "./../../../../images/eye.svg";
import DataCleansingIcon from "./../../../../images/Group 1545.svg";


export interface ActionCardProps {
    actionId: string,
    actionName: string,
    actionDescription: string,
    selectedActionId?: string,
    onSelectAction: (actionDefinitionId: string|undefined) => void
}


const ActionCard = (props: ActionCardProps) => {
    const {actionId, actionName, actionDescription, selectedActionId, onSelectAction} = props
    const theme = useTheme();

    return(
        <Card
            sx={{
                backgroundColor: "ActionCardBgColor.main",
                boxShadow: "-10px -10px 15px #FFFFFF, 10px 10px 15px rgba(0, 0, 0, 0.05)",
                borderRadius: "10px",
                p: 1,
                height: "100%"
            }}    
        >
            <Box sx={{display: "flex", flexDirection: "row", gap: 2, alignItems: "flex-start", height: "100%"}}>
                <Box sx={{ height: "100%", display: "flex",  justifyContent: "center", alignItems: "center" }}>
                    <Icon sx={{backgroundColor: theme.palette.primary.main, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", p: 2}}>
                        <img src={DataCleansingIcon} alt="NA"/>
                    </Icon>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1, flexGrow: 1, overflowX: "hidden"}}>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <Box sx={{ maxHeight: "80px", overflowY: "auto"}}>
                            <Typography variant="actionCardHeader">
                                {actionName}
                            </Typography>
                        </Box>
                        <Box sx={{ maxHeight: "120px", overflowY: "auto"}}>
                            <Typography variant="actionCardSubHeader">
                                {actionDescription}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%"}}>
                    {/* <Radio checked={actionId===selectedActionId} onChange={(event) => onSelectAction(event.target.checked ? actionId : undefined)}/> */}
                    <IconButton onClick={(event) => onSelectAction(actionId)}>
                        <img src={Eye} style={{ transform: "scale(1.5)"}}/>
                    </IconButton>
                </Box>
            </Box>
        </Card>
    )
}

export default ActionCard;