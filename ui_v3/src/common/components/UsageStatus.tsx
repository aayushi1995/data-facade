import React from 'react';
import {Grid, Box, IconButton, Link, Avatar, Button, Typography} from "@material-ui/core"

export interface UsageStatusProp {
    status: string
}

const UsageStatus = (props: UsageStatusProp) => {
    return (
        <Box sx={{display: "flex", gap: 1, justifyContent: "center", alignItems: "center"}}>
            <Box sx={{width: 40, backgroundColor: "rgba(76, 175, 80, 1)", borderRadius: 5, height: 10}}></Box>
            <Box>
                <Typography sx={{
                    fontFamily: "SF Pro Text",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "10.1078px",
                    lineHeight: "143%",
                    letterSpacing: "0.108298px",
                    color: "#253858"
                }}>
                    {props.status}
                </Typography>
            </Box>
        </Box>
    )
}

export default UsageStatus;