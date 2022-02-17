import React from 'react';
import {Grid, Box, IconButton} from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";
import demoPic from './img/circle@2x.png'
import "./hero.css"

export interface HeroProps {
    header: string,
    description: string,
    author: string,
    lastUpdatedTimestamp: Date,
    buttons?: Array<React.ReactElement>,
    expanded: boolean,
    onAvatarClick: React.MouseEvent<HTMLButtonElement>
}

const Hero = (props: HeroProps) => {
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
        <Grid container className="toplevel">
            <Grid item xs={11} className="card">
                <Box>
                    <Box className="name">
                        <Box className="avatar">
                            <IconButton onClick={props.onAvatarClick}>
                                <img className="circle" src={demoPic}/>
                            </IconButton>              
                        </Box>
                        <Box className="name-1">
                            <Box>
                                <Box className="h6">{props.header}</Box>
                            </Box>
                            <Box className="typography-1">
                                <p className="body2">
                                    <span className="span sfprotext-regular-normal-fiord-14px">By </span>
                                    <span className="span1">{props.author}</span>
                                    <span className="span sfprotext-regular-normal-fiord-14px"> | Updated {formTimeDifferenceHumanReadable(props.lastUpdatedTimestamp)}</span>
                                </p>
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <p className="imputing-missing-val sfprotext-regular-normal-fiord-14px">
                            {props.description}
                        </p>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={1} className="buttons">
                <Grid container>
                    {props.buttons?.map(button => <Grid item xs={12}>{button}</Grid>)}
                </Grid>
            </Grid>
        </Grid>            
    )
}

export default Hero;
