
import React from 'react'
import { Box, Card, Chip, IconButton, SvgIcon, Typography, useTheme} from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import { ReactComponent as DefaultIcon } from "./Icon.svg";
import { ActionDefinitionToAdd } from './SelectAction/SelectAction';

export interface SelectActionCardProps {
    actionId: string,
    actionName: string,
    actionDescription: string,
    onAddAction: (actionDefinitionDetail: ActionDefinitionToAdd) => void
}


const SelectActionCard = (props: SelectActionCardProps) => {
    const theme = useTheme();
    
    const handleAdd = () => {
        props.onAddAction({
            Id: props.actionId,
            DisplayName: props.actionName
        })
    }

    return(
        <Card
            sx={{
                backgroundColor: theme.palette.background.paper,
                '&:hover': {
                backgroundColor: theme.palette.background.default
                },
                borderRadius: 4,
                p: 2
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
                                {props.actionName}
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
                                {props.actionDescription}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row", gap: 1, flexWrap: "wrap"}}>
                        TAGS TO COME
                    </Box>
                </Box>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "50%"
                }}>
                    <IconButton sx={{p: "0px"}}>
                        <AddIcon sx={{height: "25px", width: "25px", color: theme.palette.primary.contrastText}} onClick={handleAdd}/>
                    </IconButton>
                </Box>
            </Box>
        </Card>
    )
}

export default SelectActionCard;