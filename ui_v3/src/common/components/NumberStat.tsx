import React from 'react';
import { Grid, Box } from "@material-ui/core";
import Typography from '@mui/material/Typography';

export interface NumberStatProp {
    value: number,
    label: string
}

const NumberStat = (props: NumberStatProp) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Box>
                <Typography sx={{
                    fontFamily: "SF Pro Display",
                    fontStyle: "normal",
                    fontWeight: 600,
                    fontSize: "24px",
                    lineHeight: "133.4%"
                }}>
                    {props.value}
                </Typography>
            </Box>
            <Box>
            <Typography sx={{
                fontFamily: "SF Pro Text",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "12px",
                lineHeight: "166%"
            }}>
                    {props.label}
                </Typography>
            </Box>
        </Box>
    )
}

export default NumberStat;