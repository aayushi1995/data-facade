
import React from 'react'
import { Box, Card, Chip, IconButton, SvgIcon, Typography, useTheme} from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import { ReactComponent as DefaultIcon } from "./../../../../common/components/workflow/create/Icon.svg";
import { Radio } from '@mui/material';


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
                backgroundColor: theme.palette.background.paper,
                '&:hover': {
                backgroundColor: theme.palette.background.default
                },
                borderRadius: 1,
                p: 2,
                height: "100%"
            }}
            variant={'outlined'}    
        >
            <Box sx={{display: "flex", flexDirection: "row", gap: 2, alignItems: "flex-start"}}>
                <Box sx={{backgroundColor: theme.palette.primary.main, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <SvgIcon sx={{backgroundColor: theme.palette.primary.main, borderRadius: "50%"}}>
                        <DefaultIcon/>
                    </SvgIcon>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1, flexGrow: 1}}>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <Box>
                            <Typography variant="body1" sx={{
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: 500,
                                fontSize: "14px",
                                lineHeight: "157%",
                                letterSpacing: "0.1px",
                                color: "#253858"
                            }}>
                                {actionName}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1" sx={{
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: "12px",
                                lineHeight: "143%",
                                letterSpacing: "0.15px",
                                color: "rgba(66, 82, 110, 0.86)"
                            }}>
                                {actionDescription}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <Radio checked={actionId===selectedActionId} onChange={(event) => onSelectAction(event.target.checked ? actionId : undefined)}/>
                </Box>
            </Box>
        </Card>
    )
}

export default ActionCard;