import { Box, Typography, Grid } from "@mui/material"
import WebAppBody from "../../business/WebAppBody"
import WebAppHeader from "../../business/WebAppHeader"

interface HeaderAndBodyProps {
    webAppId: string
}

const HeaderAndBody = ({ webAppId }: HeaderAndBodyProps) => {

    const headingStyle = {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        color: '#253858'
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: 3 }}>
            <Typography style={headingStyle}>
                Header
            </Typography>
            <WebAppHeader webAppId={webAppId}/>
            <Typography style={headingStyle}>
                Body
            </Typography>
            <WebAppBody />
        </Box>
    )
}


export default HeaderAndBody