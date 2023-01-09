import React from 'react';
import { Route, Switch, useHistory } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Box, Avatar, AvatarGroup, Button, Divider, Tooltip, TextField } from "@mui/material"
import UserAvatar from '../../types/UserAvatar';
import NumberStat, { NumberStatProp } from '../NumberStat';
import ProviderAvatar from '../../types/ProviderAvatar';
import Typography from '@mui/material/Typography';
import { APPLICATION_BUILD_ACTION_ROUTE_ROUTE, APPLICATION_BUILD_FLOW_ROUTE_ROUTE } from '../header/data/ApplicationRoutesConfig';
import PackageLogo from "../../../../src/images/package.svg"
import ShareIcon from '@mui/icons-material/Share';
import { StyledButtonPackageHeader, StyledTypographyApplicationDescription, StyledTypographyApplicationformCreatedByString, StyledTypographyApplicationformCreatedOnString, StyledTypographyApplicationformInfoString, StyledTypographyApplicationName, StyledTypographyPackageHeader } from '../application/compomentCssProperties';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

type HeroComponentMode = "EDIT" | "READONLY"

export interface ApplicationHeroInfoProps {
    mode: HeroComponentMode,
    applicationName: string,
    id: string,
    status: string,
    createdBy: UserAvatar,
    lastUpdatedTimestamp?: Date,
    numberStats: Array<NumberStatProp>,
    usedBy?: Array<UserAvatar>,
    providers?: Array<ProviderAvatar>,
    description?: string
    gitSyncStatus?: boolean,
    onChangeHandlers?: {
        onNameChange?: (newName?: string) => void,
        onDescriptionChange?: (newDescription?: string) => void,
    }
    handleSyncWithGit?: (attatchNewProvider: boolean) => void
}

const ApplicationheroInfo = (props: ApplicationHeroInfoProps) => {
    const history = useHistory()

    const handleActionBuilder = () => {
        history.push(APPLICATION_BUILD_ACTION_ROUTE_ROUTE + "?applicationId=" + props.id, "_self");
    }

    const handleFlowBuilder = () => {
        history.push(APPLICATION_BUILD_FLOW_ROUTE_ROUTE + "?applicationId=" + props.id, "_self");
    }

    const formTimestampHumanReadable = (date: Date) => {
        return `${date.toDateString()}`
    }

    return (
        <Box p={1}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: '50%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        <img width='30px' height='30px' src={PackageLogo} alt="" />
                    </Box>
                    <StyledTypographyPackageHeader sx={{ lineHeight: '266%', p: '5px' }}>
                        {props.applicationName}
                    </StyledTypographyPackageHeader>
                    <Box sx={{ ml: 'auto', gap: 2, display: 'flex' }}>
                        <StyledButtonPackageHeader color='info' size='small' variant="outlined" onClick={() => handleActionBuilder()}>
                            <ShareIcon sx={{fontSize:'15px'}}/>
                        </StyledButtonPackageHeader>
                        <StyledButtonPackageHeader color='info' size='small' variant="outlined" onClick={() => handleActionBuilder()}>
                            Action <AddIcon sx={{ marginLeft: 1, fontSize:'15px' }} />
                        </StyledButtonPackageHeader>
                        <StyledButtonPackageHeader color='info' size='small' variant="outlined" onClick={() => handleFlowBuilder()}>
                            Flow <AddIcon sx={{ marginLeft: 1, fontSize:'15px' }} />
                        </StyledButtonPackageHeader>
                        {props.gitSyncStatus !== undefined ? (
                            <>
                                {props.gitSyncStatus ? (
                                    <StyledButtonPackageHeader size='small' variant="contained" sx={{
                                        backgroundColor: 'statusCardBgColor2.main',
                                        ":hover": {
                                            backgroundColor: '#8C0000'
                                        }
                                    }}
                                        onClick={() => { props.handleSyncWithGit?.(false) }}
                                    >
                                        Sync With GIT Repo
                                    </StyledButtonPackageHeader>
                                ) : (
                                    <Button size='small' variant="contained" sx={{
                                        wordWrap: 'break-word'
                                    }}>In Sync With Git Repo</Button>
                                )}
                            </>
                        ) : (
                            <StyledButtonPackageHeader size='small' variant="contained" sx={{
                                backgroundColor: 'statusCardBgColor2.main',
                                ":hover": {
                                    backgroundColor: '#8C0000'
                                }
                            }}
                                onClick={() => { props.handleSyncWithGit?.(true) }}
                            >
                                Sync With GIT Repo
                            </StyledButtonPackageHeader>
                        )}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, ml: 4 }}>
                    {props.numberStats.map((numberStat) =>
                        <StyledTypographyApplicationformCreatedOnString>
                            {numberStat.value + " " + numberStat.label+" |"}
                        </StyledTypographyApplicationformCreatedOnString>
                    )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', ml: 4 }}>
                    <Avatar sx={{ cursor: "pointer", height: 25, width: 25 }} alt={props.createdBy.name} src={props.createdBy.url} />
                    <StyledTypographyApplicationformInfoString>
                        {props.createdBy.name}
                    </StyledTypographyApplicationformInfoString>
                    <WatchLaterIcon sx={{ alignSelf: 'center', color: '#687A92',ml:2 }} />
                    <StyledTypographyApplicationformCreatedByString>
                        Last updated on <br />{formTimestampHumanReadable(props.lastUpdatedTimestamp || new Date())}
                    </StyledTypographyApplicationformCreatedByString>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1,ml:2,mt:3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box>
                        <StyledTypographyApplicationName>
                            Application Description
                        </StyledTypographyApplicationName>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box>
                            <Typography sx={{ fontSize: '14px' }}>By {props.createdBy.name + " | "} </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '14px' }}> Updated 0 min ago</Typography>
                    </Box>
                </Box>
                <Box sx={{ overflowY: 'auto',ml:2}}>
                    <StyledTypographyApplicationDescription>
                        {props.description}
                    </StyledTypographyApplicationDescription>
                </Box>
            </Box>

        </Box>
    )
}



export default ApplicationheroInfo;
