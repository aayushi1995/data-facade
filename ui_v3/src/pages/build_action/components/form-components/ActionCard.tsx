
import React from 'react'
import { Box, Card, Chip, IconButton, Icon, Typography, useTheme} from '@mui/material';
import DataCleansingIcon from "./../../../../images/Group 1545.svg"
import { Radio } from '@mui/material';


export interface ActionCardProps {
    actionId: string,
    actionName: string,
    actionDescription: string,
    selectedActionId?: string,
    onRadioToggle: (actionDefinitionId: string|undefined) => void
}


const ActionCard = (props: ActionCardProps) => {
    const {actionId, actionName, actionDescription, selectedActionId, onRadioToggle} = props
    const theme = useTheme();
    console.log(theme.palette.primary)
    return(
        <Card
            sx={{
                background: "#F8F8F8",
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
                    <Radio checked={actionId===selectedActionId} onChange={(event) => onRadioToggle(event.target.checked ? actionId : undefined)}/>
                </Box>
            </Box>
        </Card>
    )
}

export default ActionCard;