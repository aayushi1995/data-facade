import { Box, Typography, Grid } from "@mui/material"
import WebAppBody from "../../business/WebAppBody"
import WebAppHeader from "../../business/WebAppHeader"

const HeaderAndBody = () => {

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: 3}}>
            <Typography>
                Header
            </Typography>
            <WebAppHeader />
            <Typography>
                Body
            </Typography>
            <WebAppBody />
        </Box>
    )
}


export default HeaderAndBody