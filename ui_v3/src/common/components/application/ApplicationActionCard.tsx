import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button,  IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { generatePath, useHistory } from "react-router-dom";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import { ActionDetailsForApplication } from "../../../generated/interfaces/Interfaces";
import ConfirmationDialog from "../ConfirmationDialog";
import useCopyAndSaveDefinition from "../workflow/create/hooks/useCopyAndSaveDefinition";
import useDeleteAction from "./hooks/useDeleteActions";
import DeleteIcon from '@mui/icons-material/Delete'
import { APPLICATION_WEB_APP_EDIT_ROUTE } from '../header/data/ApplicationRoutesConfig';
import { StyledApplicationCard, StyledButtonActionCard, StyledTypographyApplicationDescription, StyledTypographyApplicationformCreatedOnString, StyledTypographyApplicationformInfoString, StyledTypographyApplicationName } from './compomentCssProperties';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FlowLogo from "../../../../src/images/flow.svg"
import ActionLogo from "../../../../src/images/action.svg"
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
    const copyAndSaveDefinition = useCopyAndSaveDefinition({ mutationName: "CopyActionDefinition" })
    const deleteActionDefintion = useDeleteAction({ mutationName: "DeleteApplicationActionDefinition" })
    const handleExecute = () => {
        if (props.isWorkflow === true) {
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
            ({ actionDefinitionId: props.action.model?.Id! }), {
            onSuccess: (data) => {
                if (props.action.model?.ActionType === ActionDefinitionActionType.WORKFLOW) {
                    history.push(`/application/edit-workflow/${data?.[0]?.Id}`)
                } else if (props.action.model?.ActionType === ActionDefinitionActionType.WEB_APP) {
                    history.push(generatePath(APPLICATION_WEB_APP_EDIT_ROUTE, { WebAppId: data?.[0]?.Id }))
                }
                else {
                    history.push(`/application/edit-action/${data?.[0]?.Id}`)
                }
            }
        }
        )
    }

    const handleDelete = () => {
        deleteActionDefintion.mutate(
            { idsToDelete: [props.action.model?.Id!] }, {
            onSuccess: (data) => {
                props.handleDeleteAction?.(props.action.model?.Id!, props.action.model?.ApplicationId || "1")
            }
        })
        handleDialogClose();
    }

    const edit = () => {
        if (!props.isWorkflow) {
            if (props.action.model?.ActionType === ActionDefinitionActionType.WEB_APP) {
                history.push(generatePath(APPLICATION_WEB_APP_EDIT_ROUTE, { WebAppId: props.action.model?.Id }))
            } else {
                history.push(`/application/edit-action/${props.action.model?.Id || "idNotFound"}?source=browser&name=${props.action.model?.DisplayName}`)
            }
        } else {
            history.push(`/application/edit-workflow/${props.action.model?.Id || "Id"}?source=browser&name=${props.action.model?.DisplayName}`)
        }
    }

    const infoTextStyle = {
        fontSize: '0.65rem'
    }

    const ApplicationInfoString = () => {
        const flowInfo = `${props.action.stagesOrParameters || 0} Stages  |  ${props.action.numberOfWorkflowActions || 0} Actions  |  ${props.action.numberOfRuns || 0} Runs`
        const actionInfo = `${props.action.stagesOrParameters || 0} Parameters  |  ${props.action.numberOfRuns || 0} Runs`
        return props.isWorkflow ?flowInfo:actionInfo
    }
    const [collapsedView, setCollapsedView] = useState(false)

    const background = !props.isWorkflow ? 'ActionCardBgColor2.main' : '#EEEEFF'
    return (
        <Box sx={{ minheight: '127px', marginLeft: 2, marginRight: 2, marginBottom: 1 }}>
            <ConfirmationDialog
                messageHeader={'Delete Application'}
                messageToDisplay={`Application ${props.action.model?.DisplayName} will be deleted permanently. Proceed with deletion ?`}
                acceptString={'Delete'}
                declineString={'Cancel'}
                dialogOpen={dialogOpen}
                onDialogClose={handleDialogClose}
                onAccept={handleDelete}
                onDecline={handleDialogClose}
            />
            <StyledApplicationCard sx={{ backgroundColor: props.isWorkflow?'#D6E2FB':'#C9E6FC'}}>
                <Box sx={{}}>
                    <Box sx={{ display: 'flex' }}>
                        <ExpandMoreIcon onClick={() => setCollapsedView(!collapsedView)} sx={{ mr: 2, alignSelf: 'center', transform: `scale(1.5) rotate(${!collapsedView ? '270' : '0'}deg)`, ml: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                            <img width='25px' height='25px' src={props.isWorkflow?FlowLogo:ActionLogo} alt="" />
                        </Box>
                        <Box sx={{display:'flex',flexDirection:'column',pl:1}}>
                            <StyledTypographyApplicationName >
                                {props.action.model?.DisplayName || "Name"}
                            </StyledTypographyApplicationName >
                            {props.isWorkflow ?
                            <StyledTypographyApplicationformCreatedOnString>
                                Output : <b>{props.action.model?.PresentationFormat || ""}</b> 
                            </StyledTypographyApplicationformCreatedOnString>:
                            <StyledTypographyApplicationformCreatedOnString>
                                Output : <b>{props.action.model?.PresentationFormat || ""}</b> 
                            </StyledTypographyApplicationformCreatedOnString>
                            }
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
                            <MenuItem sx={{ gap: 2 }} onClick={handleCopy}><ContentCopyIcon /> Duplicate</MenuItem>
                            <MenuItem sx={{ gap: 2 }} onClick={handleDialogOpen}><DeleteIcon /> Delete</MenuItem>
                            <MenuItem sx={{ gap: 2 }} onClick={edit}><EditIcon /> Edit</MenuItem>
                        </Menu>
                    </Box>
                    <Box sx={{ ml:6 ,my:1}}>
                        {collapsedView?
                        <StyledTypographyApplicationDescription>
                            {props.action.model?.Description || "Description"}
                        </StyledTypographyApplicationDescription>
                        :<></>}
                    </Box>


                    <Box sx={{ p: 1, display: 'flex', backgroundColor: '#F0F2F5' }}>
                        <Box sx={{ml:5}}>
                            <StyledTypographyApplicationformCreatedOnString>
                                Created By : <b>{props.action.model?.CreatedBy || ""} | </b>Created On : <b>{new Date(props.action.model?.CreatedOn || "").toDateString()}</b>
                            </StyledTypographyApplicationformCreatedOnString>
                            <StyledTypographyApplicationformInfoString>
                                {ApplicationInfoString()}
                            </StyledTypographyApplicationformInfoString>
                            <StyledTypographyApplicationformCreatedOnString>
                                Updated By : <b>{props.action.model?.UpdatedBy || "Creator"} | </b>Updated On : <b>{new Date(props.action.model?.UpdatedOn || props.action.model?.CreatedOn || "").toDateString()}</b>
                            </StyledTypographyApplicationformCreatedOnString>
                        </Box>
                        <Button onClick={handleExecute} variant='contained' color='info' sx={{ ml: 'auto', height: '30px', borderRadius: '5px', alignSelf: 'center'}}>
                            Run
                        </Button>
                    </Box>
                    <Box>
                        <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                            <StyledButtonActionCard  onClick={edit} >
                                Edit
                            </StyledButtonActionCard >
                            <StyledButtonActionCard  onClick={handleDialogOpen}>
                                Delete
                            </StyledButtonActionCard >
                        </Box>
                    </Box>

                </Box>
            </StyledApplicationCard>
        </Box>
    )
}

export default ApplicationActionCard