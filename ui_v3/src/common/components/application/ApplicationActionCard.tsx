import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import ExecuteImage from "../../../../src/images/Execute.png";
import OptionIcon from "../../../../src/images/Options.png";
import { lightShadows } from "../../../css/theme/shadows";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import { ActionDetailsForApplication } from "../../../generated/interfaces/Interfaces";
import labels from "../../../labels/labels";
import NumberStat from "../NumberStat";
import TagHandler from "../tag-handler/TagHandler";
import ConfirmationDialog from "../ConfirmationDialog";
import useCopyAndSaveDefinition from "../workflow/create/hooks/useCopyAndSaveDefinition";
import useDeleteAction from "./hooks/useDeleteActions";
import pythonLogo from "../../../../src/images/python.svg"
import DeleteIcon from '@mui/icons-material/Delete'
import sqlLogo from "../../../../src/images/SQL.svg"

interface ApplicationActionCardProps {
    isWorkflow?: boolean
    action: ActionDetailsForApplication,
    handleDeleteAction?: (idToDelete: string, applicationId: string) => void
}

const ApplicationActionCard = (props: ApplicationActionCardProps) => {
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
    const open = Boolean(menuAnchor)
    const history = useHistory()
    const queryClient = useQueryClient()
    const copyAndSaveDefinition = useCopyAndSaveDefinition({mutationName: "CopyActionDefinition"})
    const deleteActionDefintion = useDeleteAction({mutationName: "DeleteApplicationActionDefinition"})
    const handleExecute = () => {
        if(props.isWorkflow === true) {
            history.push(`/application/execute-workflow/${props.action.model?.Id || "idNotFound"}`)
        } else {
            history.push(`/application/execute-action/${props.action.model?.Id || "id"}`)
        }
    }

    const [dialogOpen, setDialogOpen] = React.useState(false)
    const handleDialogClose = () => setDialogOpen(false)
    const handleDialogOpen = () => setDialogOpen(true)

    const promptDeleteApplication = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation() 
        handleDialogOpen()
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        setMenuAnchor(event.currentTarget)
        
    }

    const handleCopy = () => {
        copyAndSaveDefinition.mutate(
            ({actionDefinitionId: props.action.model?.Id!}), {
                onSuccess: (data) => {
                    if(props.action.model?.ActionType === ActionDefinitionActionType.WORKFLOW){
                        history.push(`/application/edit-workflow/${data?.[0]?.Id}`)
                    } else {
                        history.push(`/application/edit-action/${data?.[0]?.Id}`)
                    }
                }
            }
        )
    }

    const handleDelete = () => {
        deleteActionDefintion.mutate(
            {idsToDelete: [props.action.model?.Id!]}, {
                onSuccess: (data) => {
                    props.handleDeleteAction?.(props.action.model?.Id!, props.action.model?.ApplicationId || "1")
                }
        })
        handleDialogClose();
    }

    const edit = () => {
        if(!props.isWorkflow){
            history.push(`/application/edit-action/${props.action.model?.Id || "idNotFound"}`)
        } else {
            history.push(`/application/edit-workflow/${props.action.model?.Id || "Id"}`)
        }
    }

    const background = !props.isWorkflow ? 'ActionCardBgColor2.main' : 'ActionCardBgColor.main'
    return (
        <Box sx={{minheight: '127px', marginLeft: 2, marginRight: 2, marginBottom: 1}}>
            <ConfirmationDialog
                messageToDisplay={`Application ${props.action.model?.DisplayName} will be deleted permanently. Proceed with deletion ?`}
                acceptString={'Delete'}
                declineString={'Cancel'}
                dialogOpen={dialogOpen}
                onDialogClose={handleDialogClose}
                onAccept={handleDelete}
                onDecline={handleDialogClose}
            />
            <Card sx={{backgroundColor: background, boxShadow: lightShadows[27], borderRadius: '10.2px', Width: '100%', height:'120px'}}>
                <Box sx={{display: 'flex'}}>
                    <Box sx={{flex: 4, width: '100%',height:'100%'}}>
                        <Box sx={{height:'100%',display: 'flex', flexDirection: 'column',alignItems: 'flex-start', gap: 2, p: 1, height:'120px',overflow:'scroll'}}>
                            <Typography variant="actionCardHeader">
                                {props.action.model?.DisplayName || "Name"}
                            </Typography>
                            <Typography sx={{wordWrap: 'break-word', fontFamily: 'SF Pro Display', fontStyle: 'normal', fontWeight: 'normal', fontSize: '12px', lineHeight: '133.4%'}}> 
                                {props.action.model?.Description || "Description"}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{margin: "0px 4px 0px 4px", display: "flex", alignItems: "center"}}>
                        <Divider orientation="vertical" sx={{height: "100%"}}/>
                    </Box>
                    <Box sx={{flex: 3, display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                        {props.isWorkflow ? (
                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Box mb={3}>
                                    <Typography variant="heroMeta" sx={{lineHeight: '266%', textTransform: 'uppercase'}}>
                                        Details
                                    </Typography>
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2}}>
                                    <NumberStat {...{value: props.action.stagesOrParameters || 0, label: "Stages"}}/>
                                    <NumberStat {...{value: props.action.numberOfWorkflowActions || 0, label: "Actions"}}/>
                                    <NumberStat {...{value: props.action.numberOfRuns || 0, label: "Runs"}}/>
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2}}>
                                    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                                        <img width='35px' height="35px" src={sqlLogo} alt="pythonLogo" />
                                        <Typography variant="heroMeta">
                                            Language
                                        </Typography>
                                    </Box>    
                                    <NumberStat {...{value: props.action.stagesOrParameters || 0, label: "Parameters"}}/>
                                    <NumberStat {...{value: props.action.numberOfRuns || 0, label: "Runs"}}/>
                                </Box>
                                <Box sx={{display: 'flex', flexDirection: 'column'}}></Box>
                            </Box>
                        )}
                        {props.isWorkflow ? (
                            <></>
                        ) : (
                            <Box sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column', mt: 1}}>
                                <Box sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2}}>
                                    <Typography 
                                    variant="actionCardHeader"
                                    sx={{
                                    fontWeight: 'normal', 
                                    fontSize: '12px', 
                                    lineHeight: '166%'}}>
                                        Output Type: 
                                    </Typography>
                                    <Typography sx={{
                                        fontFamily: 'SF Pro Display',
                                        fontStyle: 'normal',
                                        fontSize: '12px',
                                        lineHeight: '133.4%',
                                        color: 'ActionDefinationHeroTextColor1.main'
                                    }}>
                                        {props.action.model?.PresentationFormat || ""}
                                    </Typography>
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2}}>
                                    <Typography 
                                        variant="actionCardHeader"
                                        sx={{
                                        fontWeight: 'normal', 
                                        fontSize: '12px', 
                                        lineHeight: '166%'}}>
                                            Average Run Time: 
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: 'SF Pro Display',
                                            fontStyle: 'normal',
                                            fontSize: '12px',
                                            lineHeight: '133.4%',
                                            color: 'ActionDefinationHeroTextColor1.main'
                                        }}>
                                            {(props.action.averageRunTime || 0)/1000 } sec
                                        </Typography>
                                </Box>
                            </Box>
                        )}
                        
                    </Box>
                    <Box sx={{margin: "0px 4px 0px 4px", display: "flex", alignItems: "center"}}>
                        <Divider orientation="vertical" sx={{height: "200%"}}/>
                    </Box>
                    <Box sx={{flex: 3, display: 'flex', width: '100%'}}>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', width: '100%',height:'120px',overflow:'scroll'}}>
                            <Typography
                                sx={{fontFamily: 'SF Pro Text', fontStyle: 'normal', fontSize: '14px', lineHeight: '266%', textTransform: 'uppercase'}}>
                                    TAGS
                             </Typography>
                            <Box p={1} sx={{overflowY: 'auto', maxHeight: '72px', width: '100%'}}>
                                <TagHandler entityType="ActionDefinition" entityId={props.action?.model?.Id || "ID"} allowAdd={false} allowDelete={true} tagFilter={{ Scope: labels.entities.ActionDefinition }} inputFieldLocation="TOP"/>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{margin: "0px 4px 0px 4px", display: "flex", alignItems: "center"}}>
                        <Divider orientation="vertical" sx={{height: "200%"}}/>
                    </Box>
                    <Box sx={{flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                        <Typography sx={{fontFamily: 'SF Pro Text', fontStyle: 'normal', fontSize: '14px', lineHeight: '266%', textTransform: 'uppercase'}}>
                            Data Sources
                        </Typography>
                    </Box>
                    <Box sx={{margin: "0px 4px 0px 4px", display: "flex", alignItems: "center"}}>
                        <Divider orientation="vertical" sx={{height: "200%"}}/>
                    </Box>
                    <Box sx={{flex: 2, width: '100%'}}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1, width: '100%', height: '100%'}}>
                            <Typography sx={{fontFamily: 'SF Pro Text', fontStyle: 'normal', fontSize: '14px', lineHeight: '266%', textTransform: 'uppercase', flex: 1}}>
                                EXECUTE
                            </Typography>
                            <IconButton sx={{flex: 2, height: '50%'}} onClick={handleExecute}>
                                <img src={ExecuteImage} style={{width: '50px', height: '50px'}} alt="Execute"/>
                            </IconButton>
                        </Box>
                    </Box>
                    <Box sx={{margin: "0px 4px 0px 4px", display: "flex", alignItems: "center"}}>
                        <Divider orientation="vertical" sx={{height: "100%"}}/>
                    </Box>
                    <Box sx={{flex: 1, width: '100%', display: 'flex', flexDirection: 'column', maxHeight: '100%', overflowY: 'auto'}}>
                        {/* <IconButton>
                            <img src={FavouriteIcon} alt="favoutite"/>
                        </IconButton> */}
                        <Tooltip arrow title="Edit">
                            <IconButton onClick={edit}>
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow title="Duplicate">
                            <IconButton onClick={handleCopy}>
                                <ContentCopyIcon/>
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={handleMenuOpen}>
                            <img src={OptionIcon} alt="Options"/>
                        </IconButton>
                        <Menu
                            anchorEl={menuAnchor} 
                            open={open} 
                            onClose={() => {setMenuAnchor(null)}}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                                }}
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                        }}>
                            <MenuItem onClick={handleDialogOpen} value={0}><DeleteIcon /> Delete </MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </Card>
        </Box>
    )
}

export default ApplicationActionCard