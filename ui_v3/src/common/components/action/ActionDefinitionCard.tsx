import { Application } from "../../../generated/entities/Entities"
import { Grid, Card, Box, Typography, IconButton } from "@mui/material"
import appLogo from "../../../../src/images/Segmentation_application.png"
import DataFacadeLogo from "../../../../src/images/DataFacadeLogo.png"
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PeopleIcon from '@mui/icons-material/People';
import UsageStatus from "../UsageStatus"
import ShareIcon from '@mui/icons-material/Share';
import { useHistory, useRouteMatch } from "react-router-dom"
import { ActionDefinitionCardViewResponse } from "../../../generated/interfaces/Interfaces"
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import React from "react";
import { useCreateExecution } from "../application/hooks/useCreateExecution";
import labels from "../../../labels/labels";


export interface ActionDefinitionCardProps {
    actionDefinition: ActionDefinitionCardViewResponse
}

const ActionDefinitionCard = (props: ActionDefinitionCardProps) => {
    const {actionDefinition} = props
    const history = useHistory()
    const match = useRouteMatch()

    const formCreatedByString = () => {
        return `${actionDefinition.DefinitionCreatedBy||"No Author"}`
    }

    const formCreatedOnString = () => {
        const createdOnTimestamp = actionDefinition.DefinitionCreatedOn||Date.now()

        return `Created On ${new Date(createdOnTimestamp).toDateString()}`
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

    return (
        <Box>
            <Card sx={{
                width: "350px", 
                borderRadius: 2, 
                p: 2, 
                boxSizing: "content-box",
                background: "#F4F4F4",
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
                                            <UsageStatus status={actionDefinition.UsageStatus||"NA"}/>
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
                                        }} onClick={createActionInstance}>
                                            <PlayArrowIcon sx={{color: "white", width: '100%', height: '100%'}}/>
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
                                background: "#F4F4F4",
                                boxShadow: "-10px -10px 15px #FFFFFF, 10px 10px 15px rgba(0, 0, 0, 0.05)"
                            }}>
                                <FavoriteIcon sx={{color: 'rgba(150, 142, 241, 1)'}}/>
                            </IconButton>
                        </Box>
                        <Box>
                            <IconButton onClick={createActionInstance} sx={{
                                height: "42px",
                                width: "42px",
                                background: "#F4F4F4",
                                boxShadow: "-10px -10px 15px #FFFFFF, 10px 10px 15px rgba(0, 0, 0, 0.05)"
                            }}>
                                <PlaylistAddIcon/>
                            </IconButton>
                        </Box>
                        <Box>
                            <IconButton sx={{
                                height: "42px",
                                width: "42px",
                                background: "#F4F4F4",
                                boxShadow: "-10px -10px 15px #FFFFFF, 10px 10px 15px rgba(0, 0, 0, 0.05)"
                            }}>
                                <ShareIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Card>
            
        </Box>
    )
}

export default ActionDefinitionCard;