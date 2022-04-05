import { Box, Typography } from "@mui/material";
import React from 'react';
import ActionDefinitionPublishStatus from '../../enums/ActionDefinitionPublishStatus';

export interface UsageStatusProp {
    status?: string
}

const UsageStatus = (props: UsageStatusProp) => {
    const getLabel = () => {
        return props.status || "NA"
    }

    const getColour = () => {
        switch(props.status) {
            case ActionDefinitionPublishStatus.DRAFT: return "#FFFF00"
            case ActionDefinitionPublishStatus.READY_TO_USE: return "#00FF00"
            default: return "#777777"
        }
    }

    return (
        <Box sx={{display: "flex", gap: 1, justifyContent: "center", alignItems: "center"}}>
            <Box sx={{width: 40, backgroundColor: getColour(), borderRadius: 5, height: 10}}></Box>
            <Box>
                <Typography sx={{
                    fontFamily: "SF Pro Text",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: "10.1078px",
                    lineHeight: "143%",
                    letterSpacing: "0.108298px"
                }}>
                    {getLabel()}
                </Typography>
            </Box>
        </Box>
    )
}

export default UsageStatus;