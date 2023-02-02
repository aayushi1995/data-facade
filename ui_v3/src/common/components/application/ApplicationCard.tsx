import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ShareIcon from '@mui/icons-material/Share'
import { Box, Button, IconButton, Menu, MenuItem, Tooltip } from "@mui/material"
import React, { useState } from "react"
import LinesEllipsis from 'react-lines-ellipsis'
import { generatePath, useHistory, useRouteMatch } from "react-router-dom"
import PackageLogo from "../../../../src/assets/images/package.svg"
import { ApplicationCardViewResponse } from "../../../generated/interfaces/Interfaces"
import ConfirmationDialog from "../ConfirmationDialog"
import { APPLICATION_BUILD_ACTION_ROUTE_ROUTE, APPLICATION_BUILD_FLOW_ROUTE_ROUTE, APPLICATION_DETAIL_ROUTE_ROUTE } from "../route_consts/data/ApplicationRoutesConfig"
import { ButtonBoxStyle, HeadingBoxStyle, InfoBoxStyle, StyledApplicationCard, StyledTypographyApplicationDescription, StyledTypographyApplicationformCreatedOnString, StyledTypographyApplicationformInfoString, StyledTypographyApplicationName, viewButton } from './compomentCssProperties'
import useDeleteApplication from "./hooks/useDeleteApplicatin"
import useInstallApplication from './hooks/useInstallApplication'

interface ApplicationCardProps {
    application: ApplicationCardViewResponse,
    isInstalled: boolean,
    isInstalledFromMarketplace?: boolean
}

const ApplicationCard = (props: ApplicationCardProps) => {
    const {application, isInstalled, isInstalledFromMarketplace} = props
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
        const createdby = application.ApplicationCreatedBy
        return `Created by ${createdby} | Last Updated On : ${new Date(createdOnTimestamp).toDateString()}`
    }

    const runs_downloadString = ()=>{

        const Runs = 1
        const Download = 20
        return `Runs: ${Runs} | Downloads: ${Download}`
    }

    const onApplicationInstall = () => {
        if(props.application.ApplicationName !== undefined) {
            installApplicationMutation.mutate({
                ArtifactLocation: props.application.ApplicationName
            })
        }
    }

    const onApplicationSelect = () => {
        if(isInstalled) {
            history.push(generatePath(APPLICATION_DETAIL_ROUTE_ROUTE, { applicationId: props.application.ApplicationId}))            
        }
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

    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
    const open = Boolean(menuAnchor)
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        setMenuAnchor(event.currentTarget)
        
    }

    const handleActionBuilder= () => {
        const ActionBuilderPath = generatePath(APPLICATION_BUILD_ACTION_ROUTE_ROUTE +"?applicationId=:AppId", {AppId: props.application.ApplicationId});
        window.open(ActionBuilderPath, "_self");
    }

    const handleFlowBuilder= () => {
        const flowBuilderPath = generatePath(APPLICATION_BUILD_FLOW_ROUTE_ROUTE+"?applicationId=:AppId", {AppId: props.application.ApplicationId});
        window.open(flowBuilderPath, "_self");
    }

    

    const [collapsedView , setCollapsedView] = useState(false)    
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
            <StyledApplicationCard onClick={() => onApplicationSelect} sx={{
                        backgroundColor: disableCardActions ? 'disableCardBackgroundColor.main' : 'cardBackgroundColor.main',
                        cursor: props.isInstalled ? 'pointer' : undefined
                }}>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <Box sx={{...HeadingBoxStyle}}>
                            <Box sx={{display:'flex',flexDirection:'row',}}>
                                    <ExpandMoreIcon onClick={()=> setCollapsedView(!collapsedView)} sx={{mr:2,alignSelf:'center',transform:`scale(1.5) rotate(${!collapsedView?'270':'0'}deg)`,ml:1}}/>
                                <Box sx={{display:'flex',justifyContent:'center', flexDirection:'column'}}>
                                    <img width='25px' height='25px' src={PackageLogo} alt="" />
                                </Box>
                                <StyledTypographyApplicationName sx={{lineHeight:'266%',p:'5px'}} >
                                    {application.ApplicationName}
                                </StyledTypographyApplicationName >
                                <IconButton sx={{ml:'auto',mr:3}} onClick={handleMenuOpen}>
                                    <MoreHorizIcon/>
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
                                            <MenuItem sx={{gap:2}} onClick={onShare}><ShareIcon/> Share</MenuItem>
                                            <MenuItem sx={{gap:2}} onClick={promptDeleteApplication}><DeleteIcon/> Delete</MenuItem>
                                        </Menu>
                            </Box>
                            <Box sx={{ml:6,display:collapsedView?'flex':'none',transform:'transition(2s)'}}>
                                <Tooltip placement='top' arrow title={application.ApplicationDescription || ""}>
                                    <StyledTypographyApplicationDescription>
                                        <LinesEllipsis
                                            text={application.ApplicationDescription}
                                            maxLine='5'
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
                            <Box sx={{display:'flex',flexDirection:'column',ml:5}}>
                                <StyledTypographyApplicationformCreatedOnString>
                                    {formCreatedOnString()}
                                </StyledTypographyApplicationformCreatedOnString>
                                <StyledTypographyApplicationformInfoString>
                                    {formInfoString()}
                                </StyledTypographyApplicationformInfoString>
                                <StyledTypographyApplicationformCreatedOnString>
                                    {runs_downloadString()}
                                </StyledTypographyApplicationformCreatedOnString>
                            </Box>
                            <Box sx={{...ButtonBoxStyle}}>
                                {isInstalled && !isInstalledFromMarketplace && <Button onClick={onApplicationSelect} disabled={disableCardActions} variant='contained' color='info' sx={{...viewButton}}>
                                    View
                                </Button>}
                                {!isInstalled && <Button onClick={onApplicationInstall} disabled={disableCardActions} variant='contained' color='info' sx={{...viewButton}}>
                                    Install
                                </Button>}
                                {isInstalled && isInstalledFromMarketplace && <Button onClick={onApplicationSelect} disabled={disableCardActions} variant='contained' color='info' sx={{...viewButton}}>
                                    Installed
                                </Button>}
                            </Box>
                        </Box>
                        <Box sx={{display:collapsedView?'flex':'none',justifyContent:'center',ml:'auto',gap:2,mr:4}}>
                            <Button size='small'  onClick={() => handleActionBuilder()}>
                            <AddIcon sx={{transform:'scale(0.7)'}}/>Action 
                            </Button>
                            <Button size='small'  onClick={() => handleFlowBuilder()}>
                            <AddIcon sx={{transform:'scale(0.7)'}}/>Flow 
                            </Button>
                        </Box>
                    </Box>
                </StyledApplicationCard >
            </Box>
        </>
    )
}

export default ApplicationCard
