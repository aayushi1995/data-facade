import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Box, Button, Card, IconButton, Menu, MenuItem, SpeedDial, SpeedDialAction, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { generatePath, useHistory, useRouteMatch } from "react-router-dom";
import DataFacadeLogo from "../../../../src/images/DataFacadeLogo.png";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import ActionDefinitionPublishStatus from "../../../enums/ActionDefinitionPublishStatus";
import ActionDefinitionVisibility from "../../../enums/ActionDefinitionVisibility";
import { ActionDefinitionCardViewResponse } from "../../../generated/interfaces/Interfaces";
import { StyledTypographyApplicationName, StyledTypographyApplicationformCreatedOnString, StyledTypographyApplicationDescription, StyledButtonActionCard, StyledTypographyApplicationformInfoString } from '../application/compomentCssProperties';
import useDeleteAction from "../application/hooks/useDeleteActions";
import { APPLICATION_EDIT_ACTION_ROUTE_ROUTE } from '../header/data/ApplicationRoutesConfig';
import UsageStatus from "../UsageStatus";
import useCopyAndSaveDefinition from "../workflow/create/hooks/useCopyAndSaveDefinition";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ActionLogo from "../../../../src/images/action.svg"


export interface ActionDefinitionCardProps {
    actionDefinition: ActionDefinitionCardViewResponse
}

const ActionDefinitionCard = (props: ActionDefinitionCardProps) => {
    
    const [moreOptionsSpeedDialState, setMoreOptionsSpeedDialState] = React.useState({ isOpen: false })
    const [deletingState, setDeletingState] = React.useState<boolean>(false)
    const deleteAction = useDeleteAction({mutationName: "DeletePinnedAction", mutationOptions: {
        onMutate: () => setDeletingState(true)
    }})
    const queryClient = useQueryClient()
    const {actionDefinition} = props
    const history = useHistory()
    const saveAndCopyWorkflow = useCopyAndSaveDefinition({mutationName: "SaveAndCopyDefinition"})

    const formCreatedByString = () => {
        return `${actionDefinition.DefinitionCreatedBy||"No Author"}`
    }

    const formCreatedOnString = () => {
        const createdOnTimestamp = actionDefinition.DefinitionCreatedOn||Date.now()

        return `Created On ${new Date(createdOnTimestamp).toDateString()}`
    }

    

    const handleCopyAction = () => {
        saveAndCopyWorkflow.mutate({actionDefinitionId: props.actionDefinition.DefinitionId!}, 
            {
                onSuccess: (data) => {
                    if(props.actionDefinition.DefinitionActionType === ActionDefinitionActionType.WORKFLOW){
                        history.push(`/application/edit-workflow/${data?.[0]?.Id}`)
                    } else {
                        history.push(generatePath(APPLICATION_EDIT_ACTION_ROUTE_ROUTE, { ActionDefinitionId: data?.[0]?.Id }))
                    }
                }
            }    
        )
    }

    const createActionInstance = () => {
        if(props.actionDefinition.DefinitionActionType === ActionDefinitionActionType.WORKFLOW) {
            history.push({
                pathname: `/application/execute-workflow/${actionDefinition.DefinitionId}`
            })
        } else {
            history.push({
                pathname: `/application/execute-action/${actionDefinition.DefinitionId}`
            })
        }
    }

    const handleDelete = () => {
        deleteAction.mutate({idsToDelete: [props.actionDefinition.DefinitionId!]}, {
            onSuccess: () => {
                setDeletingState(false)
                queryClient.invalidateQueries(["ActionDefinition", "CardView", ActionDefinitionVisibility.CREATED_BY])
            }
        })
    }

    const handleEdit = () => {
        if(props.actionDefinition.DefinitionActionType === ActionDefinitionActionType.WORKFLOW) {
            history.push({
                pathname: `/application/edit-workflow/${actionDefinition.DefinitionId}`
            })
        } else {
            history.push({
                pathname: `/application/edit-action/${actionDefinition.DefinitionId}`
            })
        }
    }
    const [collapsedView, setCollapsedView] = useState(false)
    const actionReadyToUse = actionDefinition.DefinitionPublishStatus===ActionDefinitionPublishStatus.READY_TO_USE
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
    const open = Boolean(menuAnchor)
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        setMenuAnchor(event.currentTarget)

    }
    return (
        <Box>
            <Card >
                    <Box sx={{display: "flex", flexDirection: "column",  pt: 2}}>
                        <Box sx={{ display: 'flex' }}>
                        <ExpandMoreIcon onClick={() => setCollapsedView(!collapsedView)} sx={{ mr: 2, alignSelf: 'center', transform: `scale(1.5) rotate(${!collapsedView ? '270' : '0'}deg)`, ml: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                            <img width='25px' height='25px' src={ActionLogo} alt="" />
                        </Box>
                        <Box sx={{display:'flex',flexDirection:'column',pl:1}}>
                            <StyledTypographyApplicationName sx={{lineHeight:'266%',p:'5px'}}>
                            {actionDefinition.DefinitionName}
                            </StyledTypographyApplicationName >
                        </Box>    
                        <IconButton sx={{ ml: 'auto' }} onClick={handleMenuOpen}>
                            <MoreHorizIcon />
                        </IconButton>
                        <Menu
                            anchorEl={menuAnchor}
                            open={open}
                            onClose={() => { setMenuAnchor(null) }}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}>
                            <MenuItem sx={{ gap: 2 }} onClick={handleCopyAction}><ContentCopyIcon /> Duplicate</MenuItem>
                            <MenuItem sx={{ gap: 2 }} onClick={handleDelete}><DeleteIcon /> Delete</MenuItem>
                            <MenuItem sx={{ gap: 2 }} onClick={handleEdit}><EditIcon /> Edit</MenuItem>
                        </Menu>
                    </Box>
                    <Box sx={{ ml:6 ,my:1}}>
                        {collapsedView?
                        <StyledTypographyApplicationDescription>
                            {actionDefinition.DefinitionDescription}
                        </StyledTypographyApplicationDescription>
                        :<></>}
                    </Box>
                    <Box sx={{ p: 1, display: 'flex', backgroundColor: '#DDDDDD' }}>
                        <Box sx={{ml:5}}>
                            <StyledTypographyApplicationformCreatedOnString>
                                Created By : <b>{formCreatedByString()}  </b>
                            </StyledTypographyApplicationformCreatedOnString>
                            <StyledTypographyApplicationformCreatedOnString>
                              reated On : <b>{formCreatedOnString()}</b>
                            </StyledTypographyApplicationformCreatedOnString>
                        </Box>
                        <Button onClick={createActionInstance} disabled={!actionReadyToUse} variant='contained' color='info' sx={{ ml: 'auto', height: '30px', borderRadius: '5px', alignSelf: 'center'}}>
                            Run
                        </Button>
                    </Box>
                    <Box>
                        <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                            <StyledButtonActionCard  onClick={handleEdit} >
                                Edit
                            </StyledButtonActionCard >
                            <StyledButtonActionCard  onClick={handleDelete}>
                                Delete
                            </StyledButtonActionCard >
                        </Box>
                    </Box>
                        
                    </Box>
            </Card>
            
        </Box>
    )
}

export default ActionDefinitionCard;