import DeleteIcon from '@mui/icons-material/Delete'
import FavoriteIcon from '@mui/icons-material/Favorite'
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop'
import ShareIcon from '@mui/icons-material/Share'
import { Box, Card, IconButton, Tooltip, Typography } from "@mui/material"
import React from "react"
import LinesEllipsis from 'react-lines-ellipsis'
import { generatePath, useHistory, useRouteMatch } from "react-router-dom"
import DataFacadeLogo from "../../../../src/images/DataFacadeLogo.png"
import PackageLogo from "../../../../src/images/package.svg"
import { lightShadows } from '../../../css/theme/shadows'
import { ApplicationCardViewResponse } from "../../../generated/interfaces/Interfaces"
import ConfirmationDialog from "../ConfirmationDialog"
import { APPLICATION_DETAIL_ROUTE_ROUTE } from "../header/data/ApplicationRoutesConfig"
import { getIconSxProperties } from './compomentCssProperties'
import useDeleteApplication from "./hooks/useDeleteApplicatin"
import useInstallApplication from './hooks/useInstallApplication'


interface ApplicationCardProps {
    application: ApplicationCardViewResponse,
    isInstalled: boolean
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

    const installApplicationMutation = useInstallApplication({
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
        if(props.isInstalled) {
            return `${(application.NumberOfFlows || "0")} Flows  |  ${(application.NumberOfActions||"0")} Actions | ${(application.NumberOfDashboards||"0")} Dashboards`
        } else {
            return ""
        }
    }

    const formCreatedByString = () => {
        return `${application.ApplicationCreatedBy||"No Author"}`
    }

    const formCreatedOnString = () => {
        const createdOnTimestamp = application.ApplicationCreatedOn||Date.now()
        return `Created On ${new Date(createdOnTimestamp).toDateString()}`
    }

    const onApplicationInstall = () => {
        if(props.application.ApplicationName !== undefined) {
            installApplicationMutation.mutate({
                ArtifactLocation: props.application.ApplicationName
            })
        }
    }

    const onApplicationSelect = () => {
        if(props.isInstalled) {
            history.push(generatePath(APPLICATION_DETAIL_ROUTE_ROUTE, { applicationId: props.application.ApplicationId}))            
        }
    }

    const toggleMoreOptionsSpeedDial = (event: React.SyntheticEvent<{}, Event>) => {
        event.stopPropagation()
        handleMoreOptionsSpeedDialToggle()
    }

    const promptDeleteApplication = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
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

    const formActions = () => {
        if(props.isInstalled) {
            return (
                <Box sx={{mx:'auto',width:'35%',display: "flex", flexDirection:"row", gap: 2, mt: "4%", mb: "4%"}}>
                    <Box>
                        <Tooltip arrow placement='top' title="Add to Favorites">
                            <IconButton sx={getIconSxProperties()} onClick={onFavorite}>
                                <FavoriteIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>


                    <Box>
                        <Tooltip arrow placement='top' title="Share">
                            <IconButton sx={getIconSxProperties()} onClick={onShare}>
                                <ShareIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box>

                        <Tooltip arrow placement='top' title="Delete">
                            <IconButton sx={getIconSxProperties()} onClick={promptDeleteApplication}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                </Box>
                </Box>
            )
        } else {
            return (
                <Box sx={{mx:'auto',width:'12%',display: "flex", flexDirection:"row", gap: 2, mt: "4%", mb: "4%"}}>
                        <Tooltip arrow title="Install">
                            <IconButton sx={getIconSxProperties()} onClick={onApplicationInstall}>
                                <InstallDesktopIcon/>
                            </IconButton>
                        </Tooltip>
                </Box>
            )
        }
    }
    
    return (
        <>
            <ConfirmationDialog
                messageHeader={'Delete Package'}
                messageToDisplay={`Application ${props.application.ApplicationName} will be deleted permanently. Proceed with deletion ?`}
                acceptString={'Delete'}
                declineString={'Cancel'}
                dialogOpen={dialogOpen}
                onDialogClose={handleDialogClose}
                onAccept={deleteApplication}
                onDecline={handleDialogClose}
            />
            <Box>
            <Card onClick={onApplicationSelect} sx={{
                        width: "100%", 
                        height: "130px",
                        borderRadius: '10px', 
                        px: 2,
                        py:0, 
                        boxSizing: "content-box",
                        backgroundColor: disableCardActions ? 'disableBackgroundColor.main' : 'cardBackgroundColor.main',
                        border: "0.439891px solid #FFFFFF",
                        boxShadow: "0px 8.5956px 10.3934px rgba(54, 48, 116, 0.3)",
                        cursor: props.isInstalled ? 'pointer' : undefined
                }}>
                    <Box sx={{display: "flex", flexDirection: "row", height: "100%"}}>
                        
                    
                        <Box sx={{display: "flex", flexDirection: "column" ,width:'40%', borderRight:"0.439891px solid #FFFFFF"}}>
                            <Box>
                                <Typography sx={{
                                    fontFamily: "SF Pro Text",
                                    fontStyle: "normal",
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    color: 'cardHeaderColor.main',
                                    lineHeight: "266%",
                                    letterSpacing: "0.5px",
                                    textTransform: "uppercase"
                                }}>
                                    {application.ApplicationName}
                                </Typography>
                            </Box>
                            <Box sx={{my:'10px', width:'90%'}}>
                            <Tooltip placement='top' arrow title={application.ApplicationDescription || ""}>
                                <Typography sx={{
                                    fontFamily: "SF Pro Display",
                                    fontStyle: "normal",
                                    fontWeight: "normal",
                                    fontSize: "16px",
                                    color: 'cardTextColor.main',
                                    lineHeight: "133.4%",
                                    display: "flex",
                                }}>
                                    <LinesEllipsis
                                        text={application.ApplicationDescription}
                                        maxLine='2'
                                        ellipsis=' ...'
                                        trimRight
                                        basedOn='letters'
                                    />
                                    {/* {application.ApplicationDescription} */}
                                </Typography>
                            </Tooltip>      
                            </Box>
                        </Box>
                        <Box sx={{px:3,py:2,width:'25%', display:'flex',flexDirection:'column' , borderRight:"0.439891px solid #FFFFFF"}}>
                            <Typography sx={{
                                            fontFamily: "SF Pro Display",
                                            fontStyle: "normal",
                                            fontWeight: 600,
                                            fontSize: "16px",
                                            color: 'cardInfoColor.main',
                                            textAlign:'center'
                                        }}>
                                            {formInfoString()}
                                        </Typography>
                                        {/* <Box sx={{display: "flex", alignItems: "center" , mt:2, justifyContent:'center'}}>
                                                <UsageStatus status={application.Status||"NA"}/>
                                                { <Typography sx={{
                                                    fontFamily: "SF Pro Text",
                                                    fontStyle: "normal",
                                                    fontWeight: 500,
                                                    fontSize: "15px",
                                                    lineHeight: "14px",
                                                    mx:5,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    fontFeatureSettings: "'liga' off",
                                                    color: "cardNumUserTextColor.main"
                                                }}>{application.NumberOfUsers||"No User"}</Typography>}
                                            </Box> */}
                                            <Typography sx={{
                                                    fontFamily: "SF Pro Text",
                                                    fontStyle: "normal",
                                                    fontWeight: "normal",
                                                    fontSize: "13px",
                                                    textAlign:'center',
                                                    mt:2,
                                                    lineHeight: "166%",
                                                    letterSpacing: "0.4px",
                                                    color: "cardInfoFormatCreatedOnString.main"
                                                }}>
                                                    {formCreatedOnString()}
                                                </Typography>

                        </Box>
                        <Box sx={{width:'10%', alignItems:'center',borderRight:"0.439891px solid #FFFFFF",}}>    
                            <Box sx={{display: "flex", flexDirection: "column",alignItems:'center', justifyContent: "space-between",px:3,py:1,width:'100%', flexGrow: 1, mr: 3}}>
                                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", gap: 1}}>
                                    <Box sx={{display: "flex", flexDirection: "row"}}>
                                        <Box sx={{display: "flex", flexDirection: "row"}}>
                                            <Box sx={{display:'flex', flexDirection:"column", alignItems:'center'}}>
                                                <Box sx={{alignItems:'center'}}>
                                                    <img width='35px' height="35px" src={DataFacadeLogo} alt="Data Facade"/>
                                                </Box>
                                                <Typography sx={{
                                                    fontFamily: "SF Pro Text",
                                                    fontStyle: "normal",
                                                    fontWeight: 500,
                                                    fontSize: "10px",
                                                    lineHeight: "157%",
                                                    letterSpacing: "0.1px",
                                                    color: "cardInfoFormCreatedByStringColor.main"
                                                }}>
                                                    {formCreatedByString()}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                {props.isInstalled &&
                                    <Box sx={{display: "flex", alignItems: "flex-end",m:1}}>
                                        <Box sx={{
                                                width: "45px",
                                                height: "45px",
                                                borderRadius: "50%",
                                                //As the color of background is similar as card background color so we put here cardBackgroun Color
                                                backgroundColor: "cardBackgroundColor.main",
                                                boxShadow: lightShadows[32],
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                            <IconButton sx={{
                                                    height: "35px",
                                                    width: "35px",
                                                //As the color of background is similar as card background color so we put here cardBackgroun Color
                                                    background: "cardBackgroundColor.main",
                                                    boxShadow: "1px 1px 1px rgba(0, 0, 0, 0.25), -1px -1px 1px #C8EEFF"
                                                }}>
                                                    <img width="30px" height="30px" src={PackageLogo} alt="Package"/>
                                            </IconButton>
                                        </Box>
                                    </Box>
                                }
                            </Box>
                        </Box>
                        <Box sx={{p:2, alignItems:'center',width:'30%'}}>
                            {formActions()}
                        </Box>
                    </Box>
                </Card>
            </Box>
        </>
    )
}

export default ApplicationCard
