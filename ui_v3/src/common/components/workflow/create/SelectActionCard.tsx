
import AddIcon from '@mui/icons-material/Add';
import { Box, Card, Icon, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { ActionParameterInstance } from '../../../../generated/entities/Entities';
import { ActionParameterDefinitionWithTags } from '../../../../generated/interfaces/Interfaces';
import labels from '../../../../labels/labels';
import { safelyParseJSON } from '../../../../pages/execute_action/util';
import TagHandler from '../../tag-handler/TagHandler';
import DataCleansingIcon from "./../../../../images/Group 1545.svg";
import { ActionParameterAdditionalConfig } from './ParameterInput';
import { ActionDefinitionToAdd } from './SelectAction/SelectAction';

export interface SelectActionCardProps {
    actionId: string,
    actionName: string,
    actionDescription: string,
    groupName?: string,
    defaultTemplateId: string,
    showTags?: boolean,
    actionGroup?: string,
    parameters?: ActionParameterDefinitionWithTags[]
    onAddAction: (actionDefinitionDetail: ActionDefinitionToAdd) => void
}


const SelectActionCard = (props: SelectActionCardProps) => {
    const theme = useTheme();
    const handleAdd = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation() 
        const newAction: ActionDefinitionToAdd = {
            Id: props.actionId,
            DisplayName: props.actionName,
            DefaultTemplateId: props.defaultTemplateId,
            ActionGroup: props.actionGroup,
            Parameters: props.parameters?.map(parameter => {
                const defaultParameterInstance = safelyParseJSON(parameter?.model?.DefaultParameterValue) as ActionParameterInstance
                const config = safelyParseJSON(parameter?.model?.Config) as ActionParameterAdditionalConfig
                return {
                    ActionParameterDefinitionId: parameter.model?.Id!,
                    userInputRequired: defaultParameterInstance?.ParameterValue===undefined ? "Yes" : "No",
                    ParameterName: parameter.model?.ParameterName,
                    ...defaultParameterInstance,
                    SourceExecutionId: undefined,
                    Tag: parameter?.model?.Tag,
                    Datatype: parameter?.model?.Datatype,
                    OptionSetValue: parameter?.model?.OptionSetValues,
                    Id: parameter?.model?.Id,
                    DisplayName: parameter?.model?.DisplayName
                }
            }),
            ParameterAdditionalConfigs: props.parameters?.reduce((oldConfigs: Object, parameter: ActionParameterDefinitionWithTags) => {
                const defaultParameterInstance = safelyParseJSON(parameter?.model?.DefaultParameterValue) as ActionParameterInstance
                const config = safelyParseJSON(parameter?.model?.Config) as ActionParameterAdditionalConfig
                if(config!==undefined){
                    const newConfigs = {
                        ...oldConfigs, 
                        [parameter?.model?.Id || "NA"]: config
                    }
                    return newConfigs
                } else {
                    return oldConfigs
                }
            }, {})
        }
        props.onAddAction(newAction)
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
                            <Box sx={{display: "flex",width:'140px',overflowX:'scroll' ,flexDirection: "column"}}>
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