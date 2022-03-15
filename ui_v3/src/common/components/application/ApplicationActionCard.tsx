import React from "react"
import { Box, Card, Typography, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { ActionDetailsForApplication } from "../../../generated/interfaces/Interfaces";
import NumberStat from "../NumberStat";
import TagHandler from "../tag-handler/TagHandler";
import ExecuteImage from "../../../../src/images/Execute.png"
import ShareIcon from '@mui/icons-material/Share';
import FavouriteIcon from "../../../../src/images/Favourite.png"
import OptionIcon from "../../../../src/images/Options.png"
import { useHistory } from "react-router-dom";


interface ApplicationActionCardProps {
    isWorkflow?: boolean
    action: ActionDetailsForApplication
}

const ApplicationActionCard = (props: ApplicationActionCardProps) => {
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
    const open = Boolean(menuAnchor)
    const history = useHistory()
    const handleExecute = () => {
        if(props.isWorkflow === true) {
            history.push(`/application/execute-workflow/${props.action.model?.Id || "idNotFound"}`)
        } else {
            history.push(`/application/execute-action/${props.action.model?.Id || "id"}`)
        }
    }

    
    const openOptionsMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        if(props.isWorkflow) {
            setMenuAnchor(event.currentTarget)
        }
    }

    const handleMenuItemSelect = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setMenuAnchor(null)
        const menuItem: number = event.currentTarget.value
        if(menuItem === 0) {
            history.push(`/application/edit-workflow/${props.action.model?.Id || "Id"}`)
        }
    }

    const background = !props.isWorkflow ? '#EEEEFF' : '#F8F8F8'
    return (
        <Box sx={{height: '127px', marginLeft: 2, marginRight: 2, marginBottom: 1}}>
            <Card sx={{background: background, boxShadow: '-6.41304px -6.41304px 12.8261px #E3E6F0, 6.41304px 6.41304px 12.8261px 0.641304px #A6ABBD', borderRadius: '10.2px', minHeight: '100%', minWidth: '100%'}}>
                <Box sx={{display: 'flex', minHeight: '100%'}}>
                    <Box sx={{flex: 4, width: '100%', height: '100%'}}>
                        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 2, p: 1}}>
                            <Typography sx={{fontFamily: 'SF Pro Text', fontStyle: 'normal', fontSize: '14px', lineHeight: '266%', textTransform: 'uppercase'}}>
                                {props.action.model?.DisplayName || "Name"}
                            </Typography>
                            <Typography sx={{wordWrap: 'break-word', fontFamily: 'SF Pro Display', fontStyle: 'normal', fontWeight: 'normal', fontSize: '12px', lineHeight: '133.4%'}}> 
                                {props.action.model?.Description || "Description"}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{margin: "0px 4px 0px 4px", display: "flex", alignItems: "center"}}>
                        <Divider orientation="vertical" sx={{height: "200%"}}/>
                    </Box>
                    <Box sx={{flex: 3, display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                        {props.isWorkflow ? (
                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Box mb={3}>
                                    <Typography sx={{fontFamily: 'SF Pro Text', fontStyle: 'normal', fontSize: '14px', lineHeight: '266%', textTransform: 'uppercase'}}>
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
                                    sx={{fontFamily: 'SF Pro Text', 
                                    fontStyle: 'normal', 
                                    fontWeight: 'normal', 
                                    fontSize: '12px', 
                                    lineHeight: '166%', 
                                    color: 'rgba(66, 82, 110, 0.86)'}}>
                                        Output Type: 
                                    </Typography>
                                    <Typography sx={{
                                        fontFamily: 'SF Pro Display',
                                        fontStyle: 'normal',
                                        fontSize: '12px',
                                        lineHeight: '133.4%',
                                        color: '#253858'
                                    }}>
                                        {props.action.model?.PresentationFormat || ""}
                                    </Typography>
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2}}>
                                    <Typography 
                                        sx={{fontFamily: 'SF Pro Text', 
                                        fontStyle: 'normal', 
                                        fontWeight: 'normal', 
                                        fontSize: '12px', 
                                        lineHeight: '166%', 
                                        color: 'rgba(66, 82, 110, 0.86)'}}>
                                            Average Run Time: 
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: 'SF Pro Display',
                                            fontStyle: 'normal',
                                            fontSize: '12px',
                                            lineHeight: '133.4%',
                                            color: '#253858'
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
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', justifyContent: 'center', width: '100%'}}>
                            <Typography
                                sx={{fontFamily: 'SF Pro Text', fontStyle: 'normal', fontSize: '14px', lineHeight: '266%', textTransform: 'uppercase'}}>
                                    TAGS
                            </Typography>
                            <Box p={1} sx={{overflowY: 'auto', maxHeight: '72px', width: '100%'}}>
                                <TagHandler entityType="ActionDefinition" entityId={props.action?.model?.Id || "ID"} allowAdd={false} allowDelete={true} tagFilter={{}}/>
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
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, width: '100%', height: '100%'}}>
                            <Typography sx={{fontFamily: 'SF Pro Text', fontStyle: 'normal', fontSize: '14px', lineHeight: '266%', textTransform: 'uppercase', flex: 1}}>
                                EXECUTE
                            </Typography>
                            <IconButton sx={{flex: 3, height: '100%'}} onClick={handleExecute}>
                                <img src={ExecuteImage} style={{width: '100%', height: '100%'}} alt="Execute"/>
                            </IconButton>
                        </Box>
                    </Box>
                    <Box sx={{margin: "0px 4px 0px 4px", display: "flex", alignItems: "center"}}>
                        <Divider orientation="vertical" sx={{height: "200%"}}/>
                    </Box>
                    <Box sx={{flex: 1, width: '100%', display: 'flex', flexDirection: 'column', maxHeight: '100%', overflowY: 'auto'}}>
                        <IconButton>
                            <img src={FavouriteIcon} alt="favoutite"/>
                        </IconButton>
                        <IconButton>
                            <ShareIcon/>
                        </IconButton>
                        <IconButton onClick={openOptionsMenu}>
                            <img src={OptionIcon} alt="Options"/>
                        </IconButton>
                    </Box>
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
                          }}
                    >
                            <MenuItem onClick={handleMenuItemSelect} value={0}>Edit Flow</MenuItem>
                    </Menu>
                </Box>
            </Card>
        </Box>
    )
}

export default ApplicationActionCard