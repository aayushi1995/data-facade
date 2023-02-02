import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@mui/material"
import { useContext } from "react"
import { useHistory } from "react-router"
import CloseIcon from "../../../../../src/assets/images/close.svg"
import { APPLICATION_CREATION_WIZARD_ROUTE } from "../../../../common/components/route_consts/data/ApplicationRoutesConfig"
import { RouteContext } from "../../../../layout/TabRenderer"
import BuildWebApp from "./business/BuildWebApp"



const BuildWebAppHomePage = () => {

    const history = useHistory()

    const routes: any = useContext(RouteContext);

    const handleDialogClose = () => {
        if (routes.length > 0) {
            const lastItem: any = routes[routes.length - 1]
            history.push(lastItem['path'])
        }
        else {
            history.push(APPLICATION_CREATION_WIZARD_ROUTE)
        }

    }

    return (
        <Dialog open={true} fullWidth maxWidth="md">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'center', backgroundColor: "ActionConfigDialogBgColor.main" }}>
                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                    >
                        Create Web App
                    </Typography>
                </Grid>
                <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                    <IconButton onClick={handleDialogClose}>
                        <img src={CloseIcon} alt="close" />
                    </IconButton>
                </Grid>
            </DialogTitle>
            <DialogContent sx={{ height: '400px', width: '100%', overflow: 'scroll' }}>
                <Box sx={{ height: '100%', width: '100%' }}>
                    <BuildWebApp />
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default BuildWebAppHomePage