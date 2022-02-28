import {Button, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import {Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, TextField} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export function CreateConnectionButton() {
    const [dialogState, setDialogState] = React.useState({isDialogOpen: false});
    const [searchText, setSearchText] = React.useState<string>('');
    const connectors = [{

    }];
    const handleDialogClose = () => {
        setDialogState(oldState => {
                return {
                    ...oldState,
                    isDialogOpen: false
                }
            }
        )
    }

    const handleDialogOpen = () => {
            setDialogState(oldState => {
                    return {
                        ...oldState,
                        isDialogOpen: true
                    }
                }
            )
    }
    return <>
        <Button variant="contained"
                   endIcon={<AddIcon sx={{fontSize: "small", backgroundColor: "secondary"}}/>}
                   title="Create Connection"
                   onClick={handleDialogOpen}
    >
        Create Connection
    </Button>
        <Dialog onClose={handleDialogClose} open={dialogState.isDialogOpen} fullWidth={true}>
            <DialogTitle id="simple-dialog-title">
                <Grid container>
                    <Grid item xs={9}>
                        <Box mx={1} py={0}>
                            Data - Choose Connector
                        </Box>
                    </Grid>
                    <Grid item xs={3} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <IconButton aria-label="close" onClick={handleDialogClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <TextField
                    id="search connector"
                    multiline
                    rows={2}
                    value={searchText}
                    onChange={(e)=>setSearchText(e.target.value)}
                    variant="outlined"
                    fullWidth
                    placeholder="Search Connector"
                />
                <Box sx={{fontSize: "xs"}}><Typography>Available Connectors</Typography></Box>
                <Grid container>
                    {connectors.map((connector, i) =><Grid item>{connector} {i}</Grid>)}
                </Grid>
            </DialogContent>
        </Dialog>
    </>;
}