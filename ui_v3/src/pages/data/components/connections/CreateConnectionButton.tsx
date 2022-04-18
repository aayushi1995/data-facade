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
                <Dialog onClose={handleDialogClose} open={dialogState} fullWidth={true} maxWidth="lg">
                    <DialogTitle id="simple-dialog-title">
                        <Grid container>
                            <Grid item xs={9}>
                                <Box mx={1} py={0}>
                                    <Route exact path={CHOOSE_CONNECTOR_ROUTE}>
                                        <ConnectionBreadCrumbs/>
                                    </Route>
                                    <Route exact path={CHOOSE_CONNECTOR_SELECTED_ROUTE}>
                                        <ConnectionBreadCrumbs/>
                                    </Route>
                                </Box>
                            </Grid>
                            <Grid item xs={3} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <IconButton aria-label="close" onClick={handleDialogClose}>
                                    <CloseIcon/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent sx={{ minHeight: "400px"}}>
                        <ConnectionDialogContent handleDialogClose={handleDialogClose}/>
                    </DialogContent>
                </Dialog>
            </Route>
        </>;
}