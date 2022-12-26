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
import { getIconSxProperties, StyledApplicationCard, StyledTypographyApplicationDescription, StyledTypographyApplicationformCreatedByString, StyledTypographyApplicationformCreatedOnString, StyledTypographyApplicationformInfoString, StyledTypographyApplicationName } from './compomentCssProperties'
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
                <Box sx={{mx:'auto',px:5,width:'100%',display: "flex", flexDirection:"row", gap: 2,alignItems:'center',justifyContent:'center'}}>
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
    const InfoBoxStyle = {
        px:1,
        py:2,
        width:'40%', 
        display:'flex',
        flexDirection:'column' ,
        justifyContent:'center',
        borderRight:"0.439891px solid #FFFFFF"
    }

    const HeadingBoxStyle = {
        display: "flex", 
        flexDirection: "column" ,
        width:'40%',
        px:2, 
        borderRight:"0.439891px solid #FFFFFF"
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
            <StyledApplicationCard  onClick={onApplicationSelect} sx={{
                        backgroundColor: disableCardActions ? 'disableBackgroundColor.main' : 'cardBackgroundColor.main',
                        cursor: props.isInstalled ? 'pointer' : undefined
                }}>
                    <Box sx={{display: "flex", flexDirection: "row", height: "100%"}}>
                        <Box sx={{display:'flex',width:'10%', alignItems:'center',borderRight:"0.439891px solid #FFFFFF",justifyContent:'center'}}>    
                            <Box sx={{ display: 'flex', flexDirection: "column", alignItems: 'center'}}>
                                <Box sx={{ alignItems: 'center' }}>
                                    <img width='35px' height="35px" src={DataFacadeLogo} alt="Data Facade" />
                                </Box>
                                <StyledTypographyApplicationformCreatedByString>
                                    {formCreatedByString()}
                                </StyledTypographyApplicationformCreatedByString >
                            </Box>
                        </Box>
                        <Box sx={{...HeadingBoxStyle}}>
                            <Box>
                                <StyledTypographyApplicationName  >
                                    {application.ApplicationName}
                                </StyledTypographyApplicationName >
                            </Box>
                            <Box sx={{ width:'90%'}}>
                            <Tooltip placement='top' arrow title={application.ApplicationDescription || ""}>
                                <StyledTypographyApplicationDescription>
                                    <LinesEllipsis
                                        text={application.ApplicationDescription}
                                        maxLine='2'
                                        ellipsis=' ...'
                                        trimRight
                                        basedOn='letters'
                                    />
                                    {/* {application.ApplicationDescription} */}
                                </StyledTypographyApplicationDescription>
                            </Tooltip>      
                            </Box>
                        </Box>
                        <Box sx={{...InfoBoxStyle}}>
                            <StyledTypographyApplicationformInfoString>
                                            {formInfoString()}
                            </StyledTypographyApplicationformInfoString>
                            <StyledTypographyApplicationformCreatedOnString>
                                {formCreatedOnString()}
                            </StyledTypographyApplicationformCreatedOnString>
                        </Box>
                        <Box sx={{width:'20%',display:'flex',justifyContent:'center'}}>
                            {formActions()}
                        </Box>
                    </Box>
                </StyledApplicationCard >
            </Box>
        </>
    )
}

export default ApplicationCard
