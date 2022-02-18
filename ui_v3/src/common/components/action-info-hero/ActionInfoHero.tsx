import { Avatar, Box, Card, Divider, FormControl, InputLabel, MenuItem, TextField, Typography } from '@material-ui/core';
import { flexbox } from '@material-ui/system';
import React, { ChangeEvent } from 'react';
import UserAvatar from '../../types/UserAvatar';
import UsageStatus from './../UsageStatus';

export interface ActionInfoHeroProps {
    name: string,
    group: string,
    createdBy: UserAvatar,
    lastSyncTimestamp: Date,
    status: string,
    outputType: string,
    avgRuntimeInS: number,
    onCardClick: (event: React.MouseEvent<HTMLDivElement>) => void,
    handleActionGroupChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

const ActionInfoHero = (props: ActionInfoHeroProps) => {
    const formTimestampHumanReadable = (date: Date) => {
        return `${date.toDateString()}`
    }

    const formHumanReadableRuntime = (durationInS: number) => {
        const secondsInAnMinute = 60
        const secondsInAnHour = secondsInAnMinute*60
        const secondsInADay = secondsInAnHour*24
        const secondsInAWeek = secondsInADay*7

        if (durationInS < secondsInAnMinute) {
            return "< 1 Min"
        } else if(durationInS < secondsInAnHour) {
            return `${(durationInS/secondsInAnMinute).toFixed(1)} minutes`
        } else {
            return `${(durationInS/secondsInAnHour).toFixed(2)} hour(s)`
        }
    }

    return(
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
            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 0}} className="top">
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start"}} className="header">
                    <Box className="name">
                        <Typography sx={{
                            fontFamily: "SF Pro Display",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: "36px",
                            lineHeight: "116.7%",
                            color: "#253858"
                        }}>
                            {props.name}
                        </Typography>
                    </Box>
                    <Box className="meta">
                        <Typography sx={{
                              fontFamily: "SF Pro Text",
                              fontStyle: "normal",
                              fontWeight: "normal",
                              fontSize: "12px",
                              lineHeight: "143%",
                              letterSpacing: "0.0961957px",
                              color: "rgba(66, 82, 110, 0.86)"
                        }}>
                            <span>Created By</span>
                            <span><b>{props.createdBy.name}</b></span>
                            <span> | </span>
                            <span>Last Sync on</span>
                            <span>{formTimestampHumanReadable(props.lastSyncTimestamp)}</span>
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 2}} className="info">
                    <Box className="createdBy">
                        <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={props.createdBy.name} src={props.createdBy.url}/>
                    </Box>
                    <Box sx={{minHeight: "inherit"}}>
                        <Divider orientation="vertical" flexItem/>
                    </Box>
                    <Box className="status">
                        <UsageStatus status={props.status}/>
                    </Box>
                    <Box className="group">
                        <FormControl color="primary" variant="filled" sx={{ m: 1, minWidth: 300}}>
                            <InputLabel id="demo-multiple-checkbox-label">Add To Group</InputLabel>
                            <TextField
                                fullWidth
                                name="option"
                                onChange={props.handleActionGroupChange}
                                select
                                SelectProps={{ native: true }}
                                value={props.group}
                                variant="outlined"
                            >
                                <MenuItem>A</MenuItem>
                                <MenuItem>B</MenuItem>
                                <MenuItem>C</MenuItem>
                            </TextField>
                        </FormControl>

                    </Box>
                </Box>
                <Box  sx={{display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2}}  className="actionInfo">
                    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", gap: 1}} className="outputType">
                        <Typography sx={{
                              fontFamily: "SF Pro Text",
                              fontStyle: "normal",
                              fontWeight: "normal",
                              fontSize: "12px",
                              lineHeight: "166%",
                              letterSpacing: "0.4px",
                              color: "rgba(66, 82, 110, 0.86)",
                              transform: "matrix(1, 0, 0, 1, 0, 0)"
                        }}>
                            Output Type:
                        </Typography>
                        <Typography sx={{
                            fontFamily: "SF Pro Display",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: "12px",
                            lineHeight: "133.4%",
                            color: "#253858",
                            transform: "matrix(1, 0, 0, 1, 0, 0)"
                        }}>
                            {props.outputType}
                        </Typography>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", gap: 1}} className="avgRuntime">
                        <Typography sx={{
                              fontFamily: "SF Pro Text",
                              fontStyle: "normal",
                              fontWeight: "normal",
                              fontSize: "12px",
                              lineHeight: "166%",
                              letterSpacing: "0.4px",
                              color: "rgba(66, 82, 110, 0.86)",
                              transform: "matrix(1, 0, 0, 1, 0, 0)"
                        }}>
                            <span>Avg Runtime:  </span>
                        </Typography>
                        <Typography sx={{
                            fontFamily: "SF Pro Display",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: "12px",
                            lineHeight: "133.4%",
                            color: "#253858",
                            transform: "matrix(1, 0, 0, 1, 0, 0)"
                        }}>
                            <span><b>{formHumanReadableRuntime(props.avgRuntimeInS)}</b></span>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    )
}

export default ActionInfoHero;