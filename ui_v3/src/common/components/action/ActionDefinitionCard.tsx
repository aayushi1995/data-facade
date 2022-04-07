import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Box, Card, IconButton, SpeedDial, SpeedDialAction, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useQueryClient } from "react-query";
import { generatePath, useHistory, useRouteMatch } from "react-router-dom";
import DataFacadeLogo from "../../../../src/images/DataFacadeLogo.png";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import ActionDefinitionPublishStatus from "../../../enums/ActionDefinitionPublishStatus";
import ActionDefinitionVisibility from "../../../enums/ActionDefinitionVisibility";
import { ActionDefinitionCardViewResponse } from "../../../generated/interfaces/Interfaces";
import useDeleteAction from "../application/hooks/useDeleteActions";
import { APPLICATION_EDIT_ACTION_ROUTE_ROUTE } from '../header/data/ApplicationRoutesConfig';
import UsageStatus from "../UsageStatus";
import useCopyAndSaveDefinition from "../workflow/create/hooks/useCopyAndSaveDefinition";


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
    const match = useRouteMatch()
    const saveAndCopyWorkflow = useCopyAndSaveDefinition({mutationName: "SaveAndCopyDefinition"})

    const handleMoreOptionsSpeedDialToggle = () => setMoreOptionsSpeedDialState(oldState => ({ ...oldState, isOpen: !oldState.isOpen }))
    const formCreatedByString = () => {
        return `${actionDefinition.DefinitionCreatedBy||"No Author"}`
    }

    const formCreatedOnString = () => {
        const createdOnTimestamp = actionDefinition.DefinitionCreatedOn||Date.now()

        return `Created On ${new Date(createdOnTimestamp).toDateString()}`
    }

    const toggleMoreOptionsSpeedDial = (event: React.SyntheticEvent<{}, Event>) => {
        event.stopPropagation()
        handleMoreOptionsSpeedDialToggle()
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

    const actionReadyToUse = actionDefinition.DefinitionPublishStatus===ActionDefinitionPublishStatus.READY_TO_USE

    return (
        <Box>
            <Card sx={{
                width: "350px", 
                borderRadius: 2, 
                p: 2, 
                boxSizing: "content-box",
                background: !deletingState ? "#F4F4F4": "#A4CAF0",
                border: "0.439891px solid #FFFFFF",
                boxShadow: "0px 17.5956px 26.3934px rgba(54, 48, 116, 0.3)"
            }}>
                <Box sx={{display: "flex", flexDirection: "row", height: "100%"}}>
                    <Box sx={{display: "flex", flexDirection: "column", width: "100%", pt: 2}}>
                        <Box>
                            <Typography sx={{
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: 600,
                                fontSize: "12px",
                                lineHeight: "266%",
                                letterSpacing: "0.5px",
                                textTransform: "uppercase",
                                color: 'rgba(66, 82, 110, 0.86)'
                            }}>
                                {actionDefinition.DefinitionName}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{
                                fontFamily: "SF Pro Display",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: "11px",
                                lineHeight: "133.4%",
                                display: "flex",
                                alignItems: "center"
                            }}>
                                {actionDefinition.DefinitionDescription}
                            </Typography>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", flexGrow: 1, mr: 3}}>
                            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 1}}>
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Box sx={{display: "flex", flexDirection: "row", width: "100%", gap: 1, alignContent: "center"}}>
                                        <Box sx={{
                                            display: "flex", 
                                            alignContent: "center", 
                                            width: "30px",
                                            height: "30px",
                                            background: "#F4F4F4",
                                            boxShadow: "inset 8px 8px 8px rgba(0, 0, 0, 0.25), inset -8px -8px 8px #B8DBFF",
                                            borderRadius: "50%",
                                            p: "3px"
                                        }}>
                                            <img src={DataFacadeLogo} alt="Data Facade"/>
                                        </Box>
                                        <Box sx={{display: "flex", alignContent: "center"}}>
                                            <PeopleIcon/>
                                        </Box>
                                        <Box sx={{display: "flex", alignContent: "center"}}>
                                            <Typography sx={{
                                                fontFamily: "SF Pro Text",
                                                fontStyle: "normal",
                                                fontWeight: 500,
                                                fontSize: "12px",
                                                lineHeight: "14px",
                                                display: "flex",
                                                alignItems: "center",
                                                fontFeatureSettings: "'liga' off",
                                                color: "#AA9BBE"
                                            }}>{actionDefinition.NumberOfUsers||"-"}</Typography>
                                        </Box>
                                        <Box sx={{display: "flex", alignContent: "center"}}>
                                            <UsageStatus status={actionDefinition.DefinitionPublishStatus}/>
                                        </Box>
                                    </Box>
                                    <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
                                        <Box>
                                            <Typography sx={{
                                                fontFamily: "SF Pro Text",
                                                fontStyle: "normal",
                                                fontWeight: 500,
                                                fontSize: "10px",
                                                lineHeight: "157%",
                                                letterSpacing: "0.1px",
                                                color: "#253858"
                                            }}>
                                                {formCreatedByString()}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={{
                                                fontFamily: "SF Pro Text",
                                                fontStyle: "normal",
                                                fontWeight: "normal",
                                                fontSize: "9px",
                                                lineHeight: "166%",
                                                letterSpacing: "0.4px",
                                                color: "rgba(66, 82, 110, 0.86)"
                                            }}>
                                                {formCreatedOnString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{display: "flex", alignItems: "flex-end"}}>
                                <Tooltip title={actionReadyToUse ? "Run Action" : "Action Not Ready To Use"}>
                                    <Box sx={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        background: "#F4F4F4",
                                        boxShadow: "-10px -10px 15px #FFFFFF, 10px 10px 10px rgba(0, 0, 0, 0.05), inset 10px 10px 10px rgba(0, 0, 0, 0.05), inset -10px -10px 20px #FFFFFF",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        
                                        <IconButton sx={{
                                                height: "42px",
                                                width: "42px",
                                                background: "linear-gradient(159.16deg, #917CE4 26.46%, rgba(63, 45, 137, 0) 116.55%)",
                                                boxShadow: "inset 10px 10px 15px rgba(255, 255, 255, 0.2)",
                                                filter: "drop-shadow(0px 5px 10px rgba(55, 46, 152, 0.65))"
                                            }} onClick={createActionInstance} disabled={!actionReadyToUse}>
                                                <PlayArrowIcon sx={{color: "white", width: '100%', height: '100%'}}/>
                                        </IconButton>
                                    </Box>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", flexDirection:"column", gap: 2, mt: "4%", mb: "4%"}}>
                        <Box>
                            <SpeedDial
                                ariaLabel={props.actionDefinition.DefinitionId||""}
                                direction="down"
                                sx={{ 
                                    height: "42px", 
                                    width: "42px",
                                }}
                                FabProps={{
                                    sx: {
                                        minHeight: "42px", 
                                        width: "42px",
                                        background: "#F4F4F4",
                                        boxShadow: "-10px -10px 15px #FFFFFF, 10px 10px 15px rgba(0, 0, 0, 0.05)"
                                    }
                                }}  
                                open={moreOptionsSpeedDialState.isOpen}
                                onClick = {toggleMoreOptionsSpeedDial}
                                icon={<PlaylistAddIcon sx={{color: 'black'}}/>}
                            >
                                <SpeedDialAction
                                    key="Delete"
                                    icon={
                                        <DeleteIcon/>
                                    }
                                    tooltipTitle="Delete"
                                    onClick={handleDelete}
                                    sx={{
                                        height: "42px",
                                        width: "42px",
                                        background: "#F4F4F4"
                                    }}
                                />
                                
                            </SpeedDial>
                        </Box>
                        
                        <Box>
                            <IconButton sx={{
                                height: "42px",
                                width: "42px",
                                background: "#F4F4F4",
                                boxShadow: "-10px -10px 15px #FFFFFF, 10px 10px 15px rgba(0, 0, 0, 0.05)"
                            }}>
                                <EditIcon onClick={handleEdit}/>
                            </IconButton>
                        </Box>
                        {/* <Box>
                            <IconButton sx={{
                                height: "42px",
                                width: "42px",
                                background: "#F4F4F4",
                                boxShadow: "-10px -10px 15px #FFFFFF, 10px 10px 15px rgba(0, 0, 0, 0.05)"
                            }}>
                                <FavoriteIcon sx={{color: 'rgba(150, 142, 241, 1)'}}/>
                            </IconButton>
                        </Box> */}
                        <Tooltip title="Duplicate">
                            <IconButton>
                                <ContentCopyIcon onClick={handleCopyAction}/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Card>
            
        </Box>
    )
}

export default ActionDefinitionCard;