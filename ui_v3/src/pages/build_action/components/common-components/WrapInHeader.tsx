import { Box, Card, Divider, Typography } from "@mui/material";

export interface WrapInHeaderProps {
    header?: string,
    children?: React.ReactNode
}

const WrapInHeader = (props: WrapInHeaderProps) => {
    return (
        <Card sx={{
            filter: "drop-shadow(0px -4px 8px rgba(0, 0, 0, 0.1)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))"
        }}>
            <Box sx={{ display: "flex", flexDirection: "column"}}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="wrapInHeader">
                        {props.header||""}
                    </Typography>
                </Box>
                <Divider orientation="horizontal"/>
                <Box sx={{ p: 2 }}>
                    {props.children}
                </Box>
            </Box>
        </Card>
    )
}

export default WrapInHeader;