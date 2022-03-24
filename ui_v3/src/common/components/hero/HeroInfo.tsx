import React from 'react';
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"

export interface HeroInfoProps {
    header: string,
    description: string,
    author: string,
    lastUpdatedTimestamp: Date,
    buttons?: Array<React.ReactElement>,
    expanded: boolean,
    onAvatarClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
    onCardClick: (event: React.MouseEvent<HTMLDivElement>) => void
}

const HeroInfo = (props: HeroInfoProps) => {
    const formTimeDifferenceHumanReadable = (startDate: Date, endDate: Date = new Date()) => {
        const timeDiffInSeconds = endDate.getTime() - startDate.getTime()
        const secondsInAnMinute = 60
        const secondsInAnHour = secondsInAnMinute*60
        const secondsInADay = secondsInAnHour*24
        const secondsInAWeek = secondsInADay*7

        if (timeDiffInSeconds < secondsInAnMinute) {
            return "a moment ago"
        } else if(timeDiffInSeconds < secondsInAnHour) {
            return `${(timeDiffInSeconds/secondsInAnMinute).toFixed(0)} minute(s) ago`
        } else if(timeDiffInSeconds < secondsInADay) {
            return `${(timeDiffInSeconds/secondsInAnHour).toFixed(0)} hour(s) ago`
        } else if(timeDiffInSeconds < secondsInAWeek) {
            return `${(timeDiffInSeconds/secondsInADay).toFixed(0)} day(s) ago`
        } else {
            return `${(timeDiffInSeconds/secondsInAWeek).toFixed(0)} week(s) ago`
        }
    }

    return (
        <Card
            onClick={props.onCardClick}
            sx={{
                backgroundColor: 'background.paper',
            '&:hover': {
                backgroundColor: 'background.default'
            },
            borderRadius: 4
            }}
            variant={'outlined'}
        >
            <Box sx={{display: "flex", flexDirection: "row"}} className="master">
                <Box sx={{pl: 1, pt: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", flexGrow: 1}} className="data">
                    <Box sx={{display: "flex", flexDirection: "row"}} className="data-author">
                        <Box sx={{mr: 1, display: "flex", alignItems: "center", justifyContent: "center"}}className="data-author-avatar">
                            <Button sx={{m:0, p:0}} onClick={props.onAvatarClick}>
                                <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={props.author}>
                                        
                                </Avatar>
                            </Button>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-around"}} className="data-author-info">
                            <Box className="header">
                                <Typography variant="h6" sx={{fontSize: "16px"}}>{props.header}</Typography>
                            </Box>
                            <Box className="meta">
                                <Typography variant="body1" sx={{
                                    fontFamily: "SF Pro Text",
                                    fontStyle: "normal",
                                    fontWeight: "normal",
                                    fontSize: "14px",
                                    lineHeight: "143%",
                                    letterSpacing: "0.15px",
                                    color: "rgba(66, 82, 110, 0.86)"
                                }}>
                                    <span>By <b>{props.author}</b></span>
                                    <span> | </span>
                                    <span>Updated {formTimeDifferenceHumanReadable(props.lastUpdatedTimestamp)}</span>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ml: 3, mb: 2, mt: 1}} className="description">
                        <Typography variant="body1" sx={{
                            fontFamily: "SF Pro Text",
                            fontStyle: "normal",
                            fontWeight: "normal",
                            fontSize: "14px",
                            lineHeight: "143%",
                            letterSpacing: "0.15px",
                            color: "rgba(66, 82, 110, 0.86)"
                        }}>
                            {props.description}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-end", flexShrink: 1, flexGrow: 0, pt: 1, pb: 1}} className="buttons">
                    {props.buttons?.map((button) => <Box>{button}</Box>)}
                </Box>
            </Box>
        </Card>
    )
}

export default HeroInfo;