import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleIcon from '@mui/icons-material/People';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ShareIcon from '@mui/icons-material/Share';
import { Box, Card, Dialog, DialogContent, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import DataFacadeLogo from "../../../../src/images/DataFacadeLogo.png";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import { ActionInstanceCardViewResponse } from "../../../generated/interfaces/Interfaces";
import ViewActionExecution from "../../../pages/view_action_execution/VIewActionExecution";
import { useCreateExecution } from "../application/hooks/useCreateExecution";
import LoadingIndicator from "../LoadingIndicator";
import UsageStatus from "../UsageStatus";


interface ActionInstanceCardProps {
    actionInstance: ActionInstanceCardViewResponse
}
const ActionInstanceCard = (props: ActionInstanceCardProps) => {
    const {actionInstance} = props
    const history = useHistory()
    const match = useRouteMatch()
    const [creatingExecution, setCreatingExecution] = React.useState(false)
    const [dialogState, setDialogState] = React.useState<{isOpen: boolean}>({isOpen: false})
    const actionExecutionMutationWorkflow = useCreateExecution({ 
        mutationOptions: {
            onSuccess: (data) => {
                const createdExecutionId = data[0].Id
                history.push({
                    pathname: `/application/workflow-execution/${createdExecutionId}`
                })
            },
            onMutate: () => setCreatingExecution(true),
            onSettled: () => setCreatingExecution(false)
        }
    })

    const actionExecutionMutation = useCreateExecution({
        mutationOptions: {
            onMutate: () => {
                setCreatingExecution(true)
                setDialogState({isOpen: true})
            }, 
            onSettled: () => {
                setCreatingExecution(false)
            }
        }
    })

    const formCreatedByString = () => {
        return `${actionInstance.DefinitionCreatedBy||"No Author"}`
    }

    const formCreatedOnString = () => {
        const createdOnTimestamp = actionInstance.DefinitionCreatedOn||Date.now()

        return `Created On ${new Date(createdOnTimestamp).toDateString()}`
    }

    const executeActionInstance = () => {
        if(actionInstance.DefinitionActionType === ActionDefinitionActionType.WORKFLOW){
            actionExecutionMutationWorkflow.mutate({actionInstanceId: actionInstance.InstanceId!})
        } else {
            // actionExecutionMutation.mutate({actionInstanceId: actionInstance.InstanceId!, options: {SynchronousActionExecution: true}})
            history.push(`/application/execute-instance/${props.actionInstance.InstanceId}`)
        }
    }

    const handleDialogClose = () => {
        setDialogState({isOpen: false})
    }

    return (
        <Box>
            <Card sx={{
                width: "350px", 
                borderRadius: 2, 
                p: 2, 
                boxSizing: "content-box",
                bgcolor: creatingExecution ? "cardIconBtn1HoverColor.main" : "lightBrown.main",
                border: "0.439891px solid #FFFFFF",
                boxShadow: "0px 17.5956px 26.3934px rgba(54, 48, 116, 0.3)"
            }}>
                <Dialog open={dialogState.isOpen} onClose={handleDialogClose} fullWidth maxWidth="xl">
                    <DialogContent>
                        {actionExecutionMutation.isLoading ? (
                            <Grid item xs={12}>
                                <LoadingIndicator/>
                            </Grid>
                        ) : (
                            <ViewActionExecution actionExecutionId={actionExecutionMutation.data?.[0]?.Id}/>
                        )}
                        
                    </DialogContent>
                </Dialog>
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
                                color: "white"
                            }}>
                                {actionInstance.InstanceName}
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
                                {actionInstance.DefinitionDescription}
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
                                            bgcolor: "lightBrown.main",
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
                                                color: "cardNumUserTextColor.main"
                                            }}>{actionInstance.NumberOfUsers||"-"}</Typography>
                                        </Box>
                                        <Box sx={{display: "flex", alignContent: "center"}}>
                                            <UsageStatus status={actionInstance.Status||"NA"}/>
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
                                                color: "white"
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
                                                color: "ActionCardBgColor.main"
                                            }}>
                                                {formCreatedOnString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{display: "flex", alignItems: "flex-end"}}>
                                <Box sx={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        bgcolor: "lightBrown.main",
                                        boxShadow: "inset 8px 8px 8px rgba(0, 0, 0, 0.25), inset -8px -8px 8px #C38B8B;",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                    <IconButton onClick={executeActionInstance} sx={{
                                            height: "42px",
                                            width: "42px",
                                            bgcolor: "lightBrown.main",
                                            boxShadow: "1px 1px 1px rgba(0, 0, 0, 0.25), -1px -1px 1px #C38B8B"
                                        }}>
                                            
                                        <PlayArrowIcon sx={{color: "white"}}/>
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", flexDirection:"column", gap: 2, mt: "4%", mb: "4%"}}>
                        <Box>
                            <IconButton sx={{
                                height: "42px",
                                width: "42px",
                                bgcolor: "lightBrown.main",
                                boxShadow: "-2px -4px 6px rgba(233, 242, 251, 0.5), 2px 4px 10px rgba(80, 153, 226, 0.5)"
                            }}>
                                <FavoriteIcon sx={{color: 'rgba(95, 48, 193, 1)'}}/>
                            </IconButton>
                        </Box>
                        <Box>
                            <IconButton sx={{
                                height: "42px",
                                width: "42px",
                                bgcolor: "lightBrown.main",
                                boxShadow: "-2px -4px 6px rgba(233, 242, 251, 0.5), 2px 4px 10px rgba(80, 153, 226, 0.5)"
                            }}>
                                <PlaylistAddIcon sx={{color: "white"}}/>
                            </IconButton>
                        </Box>
                        <Box>
                            <IconButton sx={{
                                height: "42px",
                                width: "42px",
                                bgcolor: "lightBrown.main",
                                boxShadow: "-2px -4px 6px rgba(233, 242, 251, 0.5), 2px 4px 10px rgba(80, 153, 226, 0.5)"
                            }}>
                                <ShareIcon sx={{color: "white"}}/>
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Card>
            
        </Box>
    )
}

export default ActionInstanceCard