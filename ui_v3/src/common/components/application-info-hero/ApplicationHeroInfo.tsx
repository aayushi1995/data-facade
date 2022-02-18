import React from 'react';
import {Box, IconButton, Link, Avatar, AvatarGroup, Button, Typography, Divider, Card} from "@material-ui/core"
import UserAvatar from '../../types/UserAvatar';
import NumberStat, { NumberStatProp } from '../NumberStat';
import UsageStatus from './../UsageStatus';
import ProviderAvatar from '../../types/ProviderAvatar';

export interface ApplicationHeroInfoProps {
    applicationName: string,
    status: string,
    createdBy: UserAvatar,
    lastUpdatedTimestamp: Date,
    numberStats: Array<NumberStatProp>,
    usedBy: Array<UserAvatar>,
    providers: Array<ProviderAvatar>,
    onCardClick: (event: React.MouseEvent<HTMLDivElement>) => void
}

const ApplicationHeroInfo = (props: ApplicationHeroInfoProps) => {

    const formTimestampHumanReadable = (date: Date) => {
        return `${date.toDateString()}`
    }
    console.log(props)
    return (
        <Card
            onClick={props.onCardClick}
            sx={{
                backgroundColor: 'background.paper',
            '&:hover': {
                backgroundColor: 'background.default'
            },
            borderRadius: 4,
            p:1
            }}
            variant={'outlined'}
        >

            <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                <Box className="header">
                    <Box className="name">
                        <Typography variant="h6" sx={{
                            fontFamily: "SF Pro Display",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: "36px",
                            lineHeight: "116.7%"
                        }}>
                            {props.applicationName}
                        </Typography>
                    </Box>
                    <Box className="meta">
                        <Typography variant="body1" sx={{
                            fontFamily: "SF Pro Text",
                            fontStyle: "normal",
                            fontWeight: "normal",
                            fontSize: "12px",
                            lineHeight: "143%",
                            letterSpacing: "0.15px",
                            color: "rgba(66, 82, 110, 0.86)"
                        }}>
                            <span>Created By <b>{props.createdBy.name}</b></span>
                            <span> | </span>
                            <span>Last updated on {formTimestampHumanReadable(props.lastUpdatedTimestamp)}</span>
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
                            {props.usedBy.map(user => <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={user.name} src={user.url}/>)}
                        </AvatarGroup>
                    </Box>
                </Box>
                <Box className="status-and-providers" sx={{display: "flex", flexDirection: "row", alignItems: "center", gap: 1}}>
                    <Box className="status">
                        <UsageStatus status={props.status}/>
                    </Box>
                    <Box className="provider">
                        <AvatarGroup max={9}>
                            {props.providers.map(provider => <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={provider.name} src={provider.url}/>)}
                        </AvatarGroup>
                    </Box>
                </Box>
                <Box sx={{display: "flex", justifyContent: "flex-start", overflowX: "auto", gap: 3}}className="stats">
                    {props.numberStats.map((numberStat) => 
                        <Box>
                            <NumberStat {...numberStat}/>
                        </Box>
                    )}
                </Box>
            </Box>
        
        </Card>
    )
}

export default ApplicationHeroInfo;