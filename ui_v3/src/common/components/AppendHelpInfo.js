import React from 'react'
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import {makeStyles} from '@mui/styles'
import {Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, TextField, Tooltip} from '@mui/material'


const useStyles = makeStyles(() => ({
    filedetailgrid: {
        background: "#CBF1F5"
    },
    dialog: {
        background: "#E3FDFD"
    },
    columnSchemaDefault: {
        background: "#CBF1F5"
    },
    formControl: {
        minWidth: 120,
    },
    selectEmpty: {},
    disabledButton: {
        background: "#classes"
    }
}))

const AppendHelpInfo = (props) => {
    const classes = useStyles();
    const [dialogState, setDialogState] = React.useState({isDialogOpen: false})

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
        if (!(props?.Info?.PRIMARY_DISABLED || false)) {
            setDialogState(oldState => {
                    return {
                        ...oldState,
                        isDialogOpen: true
                    }
                }
            )
        }
    }

    return (
        <>
            <Dialog onClose={handleDialogClose} open={dialogState.isDialogOpen} fullWidth={true}>
                <DialogTitle id="simple-dialog-title">
                    <Grid container>
                        <Grid item xs={9}>
                            <Box mx={1} py={0}>
                                More Info
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
                        id="outlined-multiline-static"
                        multiline
                        rows={2}
                        value={props.Info?.PRIMARY || ""}
                        variant="outlined"
                        InputProps={{readOnly: true}}
                        fullWidth
                        rowsMax="20"
                        nowrap
                    />
                </DialogContent>
            </Dialog>
            <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center">
                <Grid item xs={12 - (props.proportion || 3)}>
                    {props.children}
                </Grid>
                <Grid item xs={(props.proportion || 3)} justify="flex-start">
                    <Tooltip title={props.Info?.SECONDARY || ""}>
                        <IconButton edge="end" aria-label="Help" onClick={handleDialogOpen}>
                            <InfoIcon style={{width: 25, height: 25}}/>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </>
    )
}

export default AppendHelpInfo;