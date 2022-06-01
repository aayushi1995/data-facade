
import AddIcon from '@mui/icons-material/Add';
import { Box, Card, Icon, IconButton, Typography, useTheme, Tooltip, Dialog, DialogTitle, DialogContent, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import React from 'react';
import { ActionParameterDefinitionWithTags } from '../../../../generated/interfaces/Interfaces';
import labels from '../../../../labels/labels';
import TagHandler from '../../tag-handler/TagHandler';
import DataCleansingIcon from "./../../../../images/Group 1545.svg";
import { ActionDefinitionToAdd } from './SelectAction/SelectAction';
import ConfigureActionParameters from './addAction/ConfigureActionParameters';
import { ConfigureParametersContextProvider } from '../context/ConfigureParametersContext';

export interface SelectActionCardProps {
    actionId: string,
    actionName: string,
    actionDescription: string,
    groupName?: string,
    defaultTemplateId: string,
    showTags?: boolean,
    actionGroup?: string,
    parameters?: ActionParameterDefinitionWithTags[]
    onAddAction: (actionDefinitionDetail: ActionDefinitionToAdd) => void,
}


const SelectActionCard = (props: SelectActionCardProps) => {
    const theme = useTheme();
    const handleAdd = () => {
        props.onAddAction({
            Id: props.actionId,
            DisplayName: props.actionName,
            DefaultTemplateId: props.defaultTemplateId,
            ActionGroup: props.actionGroup,
            Parameters: props.parameters?.map(parameter => ({
                ActionParameterDefinitionId: parameter.model?.Id!,
                userInputRequired: "Yes",
                ParameterName: parameter.model?.ParameterName
            }))
        })

    }

    return(
        <Box>
            
            <Tooltip title={props.actionDescription || "No Description"} placement="top">
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
                    <Box sx={{display: "flex", flexDirection: "row", gap: 2, alignItems: "flex-start", height: "100%"}}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
                            <Icon sx={{backgroundColor: theme.palette.primary.main, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", p: 2}}>
                                <img src={DataCleansingIcon} alt="NA"/>
                            </Icon>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flexGrow: 1}}>
                            <Box sx={{display: "flex", flexDirection: "column"}}>
                                <Box>
                                    <Typography variant="actionCardHeader">
                                        {props.actionName}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="actionCardSubHeader">
                                        {props.actionGroup||"NA"}
                                    </Typography>
                                </Box>
                            </Box>
                            {!!props.showTags &&
                                <Box sx={{display: "flex", flexDirection: "row", gap: 1, flexWrap: "wrap"}}>
                                    <TagHandler
                                        entityType={"ActionDefinition"}
                                        entityId={props.actionId}
                                        tagFilter={{ Scope: labels.entities.ActionDefinition }}
                                        allowAdd={false}
                                        allowDelete={true}
                                        inputFieldLocation="TOP"
                                    />
                                </Box>
                            }
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
                            <IconButton sx={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.palette.primary.main, borderRadius: "50%", height: "32px", width: "32px"}} onClick={handleAdd}>
                                <AddIcon sx={{ color: theme.palette.primary.contrastText }}/>
                            </IconButton>
                        </Box>
                    </Box>
                </Card>
            </Tooltip>
        </Box>
    )
}

export default SelectActionCard;