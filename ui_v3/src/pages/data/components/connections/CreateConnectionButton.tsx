import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import React from "react";
import { Route, useHistory } from "react-router-dom";
import { DATA_CONNECTIONS_ROUTE } from "../../../../common/components/header/data/DataRoutesConfig";
import { ConnectionBreadCrumbs } from "./ConnectionBreadCrumbs";
import { ConnectionDialogContent } from "./ConnectionDialogContent";
import { CHOOSE_CONNECTOR_ROUTE, CHOOSE_CONNECTOR_SELECTED_ROUTE } from "./DataRoutesConstants";

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
            <Button variant="ModuleHeaderButton1"
                    endIcon={<AddIcon sx={{fontSize: "small", backgroundColor: "secondary"}}/>}
                    title="Create Connection"
                    onClick={handleDialogOpen}
            >
                Create Connection
            </Button>
            <Route path={CHOOSE_CONNECTOR_ROUTE}>
                <Dialog sx={{background:"linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #F8F8F8",backgroundBlendMode: "soft-light, normal",}} onClose={handleDialogClose} open={dialogState} fullWidth={true} maxWidth="xl">
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