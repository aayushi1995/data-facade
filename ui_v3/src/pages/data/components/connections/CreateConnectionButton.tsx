import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { Route, useHistory } from "react-router-dom";
import { DATA_CONNECTIONS_ROUTE } from "../../../../common/components/route_consts/data/DataRoutesConfig";
import { ConnectionDialogContent } from "./ConnectionDialogContent";
import { CHOOSE_CONNECTOR_ROUTE } from "./DataRoutesConstants";

export function CreateConnectionButton() {
    const history = useHistory();
    const dialogState = true;
    const handleDialogOpen = () => {
        history.push(CHOOSE_CONNECTOR_ROUTE)
    }
    const handleDialogClose = () =>{
        history.push(DATA_CONNECTIONS_ROUTE);
    }
    return <>
            <Route path={CHOOSE_CONNECTOR_ROUTE}>
                <Dialog sx={{backgroundBlendMode: "soft-light, normal",}} onClose={handleDialogClose} open={dialogState} fullWidth={true} maxWidth="xl">
                    <DialogTitle id="simple-dialog-title">
                        <Grid container>
                            <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <IconButton aria-label="close" onClick={handleDialogClose}>
                                    <CloseIcon/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        <ConnectionDialogContent handleDialogClose={handleDialogClose}/>
                    </DialogContent>
                </Dialog>
            </Route>
        </>;
}