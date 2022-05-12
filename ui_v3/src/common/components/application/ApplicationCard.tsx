import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PeopleIcon from '@mui/icons-material/People'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import ShareIcon from '@mui/icons-material/Share'
import { Box, Card, IconButton, SpeedDial, SpeedDialAction, Tooltip, Typography } from "@mui/material"
import React from "react"
import { generatePath, useHistory, useRouteMatch } from "react-router-dom"
import DataFacadeLogo from "../../../../src/images/DataFacadeLogo.png"
import PackageLogo from "../../../../src/images/package.svg"
import UsageStatus from "../../../common/components/UsageStatus"
import { lightShadows } from '../../../css/theme/shadows'
import { ApplicationCardViewResponse } from "../../../generated/interfaces/Interfaces"
import ConfirmationDialog from "../ConfirmationDialog"
import { APPLICATION_DETAIL_ROUTE_ROUTE } from "../header/data/ApplicationRoutesConfig"
import useDeleteApplication from "./hooks/useDeleteApplicatin"


interface ApplicationCardProps {
    application: ApplicationCardViewResponse
}
const ApplicationCard = (props: ApplicationCardProps) => {
    const {application} = props
    const history = useHistory()
    const match = useRouteMatch()
    const [disableCardActions, setDisableCardActions] = React.useState(false)
    const deleteApplicationMutation = useDeleteApplication({
        mutationOptions: {
            onMutate: () => setDisableCardActions(true),
            onSettled: () => setDisableCardActions(false)
        }
    })
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const handleDialogClose = () => setDialogOpen(false)
    const handleDialogOpen = () => setDialogOpen(true)

    const [moreOptionsSpeedDialState, setMoreOptionsSpeedDialState] = React.useState({ isOpen: false })
    const handleMoreOptionsSpeedDialClose = () => setMoreOptionsSpeedDialState(oldState => ({ ...oldState, isOpen: false }))
    const handleMoreOptionsSpeedDialOpen = () => setMoreOptionsSpeedDialState(oldState => ({ ...oldState, isOpen: true }))
    const handleMoreOptionsSpeedDialToggle = () => setMoreOptionsSpeedDialState(oldState => ({ ...oldState, isOpen: !oldState.isOpen }))


    const formInfoString = () => {
        return `${(application.NumberOfFlows || "0")} Flows  |  ${(application.NumberOfActions||"0")} Actions | ${(application.NumberOfDashboards||"0")} Dashboards`
    }

    const formCreatedByString = () => {
        return `${application.ApplicationCreatedBy||"No Author"}`
    }

    const formCreatedOnString = () => {
        const createdOnTimestamp = application.ApplicationCreatedOn||Date.now()

        return `Created On ${new Date(createdOnTimestamp).toDateString()}`
    }

    const onApplicationSelect = () => {
        history.push(generatePath(APPLICATION_DETAIL_ROUTE_ROUTE, { applicationId: props.application.ApplicationId}))
    }

    const toggleMoreOptionsSpeedDial = (event: React.SyntheticEvent<{}, Event>) => {
        event.stopPropagation()
        handleMoreOptionsSpeedDialToggle()
    }

    const promptDeleteApplication = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation() 
        handleMoreOptionsSpeedDialClose()
        handleDialogOpen()
    }

    const deleteApplication = () => {
        handleDialogClose()
        deleteApplicationMutation.mutate([props.application.ApplicationId])
    }

    const onFavorite = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
    }

    const onShare = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
    }

    return (
        <>
            <ConfirmationDialog
                messageToDisplay={`Application ${props.application.ApplicationName} will be deleted permanently. Proceed with deletion ?`}
                dialogOpen={dialogOpen}
                onDialogClose={handleDialogClose}
                onAccept={deleteApplication}
                onDecline={handleDialogClose}
            />
            <Box>
                <Card onClick={onApplicationSelect} sx={{
                    width: "350px", 
                    borderRadius: 2, 
                    p: 2, 
                    boxSizing: "content-box",
                    background: disableCardActions ? "F3F3F3" : "#A4CAF0",
                    border: "0.439891px solid #FFFFFF",
                    boxShadow: "0px 17.5956px 26.3934px rgba(54, 48, 116, 0.3)",
                    cursor: 'pointer'
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
                                    textTransform: "uppercase"
                                }}>
                                    {application.ApplicationName}
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
                                    {application.ApplicationDescription}
                                </Typography>
                            </Box>
                            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", flexGrow: 1, mr: 3}}>
                                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 1}}>
                                    <Box>
                                        <Typography sx={{
                                            fontFamily: "SF Pro Display",
                                            fontStyle: "normal",
                                            fontWeight: 600,
                                            fontSize: "12px",
                                            lineHeight: "133.4%",
                                            color: "#5B5B5B"
                                        }}>
                                            {formInfoString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{display: "flex", flexDirection: "column"}}>
                                        <Box sx={{display: "flex", flexDirection: "row", width: "100%", gap: 1, alignContent: "center"}}>
                                            <Box sx={{
                                                display: "flex", 
                                                alignContent: "center", 
                                                width: "30px",
                                                height: "30px",
                                                background: "#A4CAF0",
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
                                                }}>{application.NumberOfUsers||"-"}</Typography>
                                            </Box>
                                            <Box sx={{display: "flex", alignContent: "center"}}>
                                                <UsageStatus status={application.Status||"NA"}/>
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
                                            background: "#A4CAF0",
                                            boxShadow: lightShadows[32],
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                        <IconButton sx={{
                                                height: "42px",
                                                width: "42px",
                                                background: "#A4CAF0",
                                                boxShadow: "1px 1px 1px rgba(0, 0, 0, 0.25), -1px -1px 1px #C8EEFF"
                                            }}>
                                                <img src={PackageLogo} alt="Package"/>
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{display: "flex", flexDirection:"column", gap: 2, mt: "4%", mb: "4%"}}>
                            <Box>
                                <Tooltip title="Add to Favorites">
                                    <IconButton sx={{
                                        height: "42px",
                                        width: "42px",
                                        background: "#A4CAF0",
                                        boxShadow: lightShadows[32],
                                        "&:hover": {
                                            background: "#0AA1DD",
                                            color: "#FFFFFF"
                                        }
                                    }} onClick={onFavorite}>
                                        <FavoriteIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box>
                                <Tooltip title="More Options">
                                    <SpeedDial
                                        ariaLabel={props.application.ApplicationId||""}
                                        direction="down"
                                        sx={{ 
                                            height: "42px", 
                                            width: "42px",
                                        }}
                                        FabProps={{
                                            sx: {
                                                minHeight: "42px", 
                                                width: "42px",
                                                background: "#A4CAF0",
                                                boxShadow: lightShadows[32],
                                                "&:hover": {
                                                    background: "#0AA1DD"
                                                }
                                            }
                                        }}  
                                        open={moreOptionsSpeedDialState.isOpen}
                                        onClick = {toggleMoreOptionsSpeedDial}
                                        icon={<PlaylistAddIcon/>}
                                    >
                                        <SpeedDialAction
                                            key="Delete"
                                            icon={
                                                <DeleteIcon />
                                            }
                                            tooltipTitle="Delete"
                                            onClick={promptDeleteApplication}
                                            sx={{
                                                height: "42px",
                                                width: "42px",
                                                background: "#F4F4F4"
                                            }}
                                        />
                                    </SpeedDial>
                                </Tooltip>
                            </Box>
                            <Box>
                                <Tooltip title="Share">
                                    <IconButton sx={{
                                        height: "42px",
                                        width: "42px",
                                        background: "#A4CAF0",
                                        boxShadow: lightShadows[32],
                                        "&:hover": {
                                            background: "#0AA1DD",
                                            color: "#FFFFFF"
                                        }
                                    }} onClick={onShare}>
                                        <ShareIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                </Card> 
            </Box>
        </>
    )
}

export default ApplicationCard