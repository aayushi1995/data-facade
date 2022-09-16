import React from 'react';
import {Box, IconButton, Link, Avatar, AvatarGroup, Button, Divider, Card} from "@mui/material"
import UserAvatar from '../../types/UserAvatar';
import NumberStat, { NumberStatProp } from '../NumberStat';
import UsageStatus from './../UsageStatus';
import ProviderAvatar from '../../types/ProviderAvatar';
import { StringParameterInput } from '../workflow/create/ParameterInput';
import Typography from '@mui/material/Typography';


export interface ApplicationHeroInfoProps {
    applicationName: string,
    status: string,
    createdBy: UserAvatar,
    lastUpdatedTimestamp?: Date,
    numberStats: Array<NumberStatProp>,
    usedBy?: Array<UserAvatar>,
    providers?: Array<ProviderAvatar>,
    description?: string
    gitSyncStatus?: boolean,
    handleSyncWithGit?: () => void
}

const ApplicationHeroInfo = (props: ApplicationHeroInfoProps) => {

    const formTimestampHumanReadable = (date: Date) => {
        return `${date.toDateString()}`
    }

    return (
        <Box p={1} sx={{display: 'flex', maxHeight: '350px'}}>
            <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: '50%'}}>
                <Box className="header">
                    <Box className="name">
                        <Typography variant="heroHeader">
                            {props.applicationName}
                        </Typography>
                    </Box>
                    <Box className="meta">
                        <Typography variant="heroMeta">
                            <span>Created By <b>{props.createdBy.name}</b></span>
                            <span> | </span>
                            <span>Last updated on {formTimestampHumanReadable(props.lastUpdatedTimestamp || new Date())}</span>
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{display: "flex"}} className="related-users">
                    <Box className="created-by">
                        <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={props.createdBy.name} src={props.createdBy.url}/>
                    </Box>
                    <Box sx={{margin: "0px 4px 0px 4px", display: "flex", alignItems: "center"}}>
                        <Divider orientation="vertical" sx={{height: "75%"}}/>
                    </Box>
                    <Box className="used-by">
                        <AvatarGroup max={9}>
                            {props.usedBy?.map?.(user => <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={user.name} src={user.url}/>)}
                        </AvatarGroup>
                    </Box>
                </Box>
                <Box className="status-and-providers" sx={{display: "flex", flexDirection: "row", alignItems: "center", gap: 1}}>
                    <Box className="status">
                        <UsageStatus status={props.status}/>
                    </Box>
                    <Box className="provider">
                        <AvatarGroup max={9}>
                            {props.providers?.map?.(provider => <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={provider.name} src={provider.url}/>)}
                        </AvatarGroup>
                    </Box>
                </Box>
                <Box sx={{display: "flex", justifyContent: "flex-start", overflowX: "auto", gap: 3}}className="stats">
                    {props.numberStats.map((numberStat) => 
                        <Box>
                            <NumberStat {...numberStat}/>
                        </Box>
                    )}
                    {props.gitSyncStatus !== undefined ? (
                        <div>
                            {props.gitSyncStatus ? (
                                <Button variant="contained" sx={{
                                    backgroundColor: '#FFBDBD',
                                    maxHeight: '55px',
                                    wordWrap: 'break-word',
                                    ":hover": {
                                        backgroundColor: '#8C0000'
                                    }  
                                }}
                                    onClick={() => {props.handleSyncWithGit?.()}}
                                >
                                    Sync With GIT Repo
                                </Button>
                            ) : (
                                <Button variant="outlined" sx={{
                                    maxHeight: '55px',
                                    wordWrap: 'break-word'
                                }}>In Sync With Git Repo</Button>
                            )}
                        </div>
                    ) : (<></>)}
                </Box>
            </Box>
            <Box sx={{margin: "0px 4px 0px 4px", display: "flex", alignItems: "center"}}>
                <Divider orientation="vertical" sx={{height: "100%"}}/>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: '100%', marginLeft: 1}}>
                <Box className="created-by">
                    <Box sx={{display: 'flex', gap: 1, maxHeight: '45px', alignItems: 'center'}}>
                        <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={props.createdBy.name} src={props.createdBy.url}/>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>  
                            <Box>
                                <Typography sx={{fontFamily: 'SF Pro Text', fontWeight: 400, fontSize: '16px', lineHeight: '175%', letterSpacing: '0.15px'}}>
                                    Application Description
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex'}}>
                                <Box>
                                    <Typography sx={{fontSize: '14px'}}>By {props.createdBy.name}</Typography>
                                </Box>
                                
                                <Box sx={{margin: "0px 4px 0px 4px", display: "flex", alignItems: "center"}}>
                                    <Divider orientation="vertical" sx={{height: "100%"}}/>
                                </Box>
                                <Typography sx={{fontSize: '14px'}}>Updated 0 min ago</Typography>
                            </Box>

                        </Box>
                        
                    </Box>
                </Box>
                <Box sx={{overflowY: 'auto'}}>
                    <Typography variant="heroMeta" sx={{wordWrap: 'break-word',fontWeight: 400, fontSize: '14px'}}>
                        {props.description}
                    </Typography>
                </Box>
            </Box>
        
        </Box>
    )
}

export default ApplicationHeroInfo;