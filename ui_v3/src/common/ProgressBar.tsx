import { Box, LinearProgress, Typography } from "@mui/material";

export interface ProgressBarProps {
    Progress?: number,
    Label ?: string
}

const ProgressBar = (props: ProgressBarProps) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2, p: 3, justifyContent: "center"}}>
            <Box>
                <LinearProgress variant="determinate" value={props.Progress} sx={{
                    height: "9px", 
                    background:
                    "linear-gradient(270deg, #01A67B 0.56%, rgba(29, 223, 201, 0.67) 99.44%)",
                    boxShadow: "0px 0.5px 1.085px rgba(14, 31, 53, 0.12)",
                    borderRadius: "3.94px"
                }}/>
            </Box>
            <Box>
                <Typography sx={{
                    fontFamily: "'SF Pro Text'",
                    fontStyle: "normal",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "157%",
                    letterSpacing: "0.1px",
                    color: "ActionDefinationHeroTextColor1.main",
                    textAlign: "center"
                }}>
                    {props.Label}
                </Typography>
            </Box>
        </Box>
    )
}

export default ProgressBar;