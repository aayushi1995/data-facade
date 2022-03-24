import React from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {makeStyles} from "@mui/styles";
import {Route, Switch, useHistory, useRouteMatch, withRouter} from "react-router-dom";
import {Link as RouterLink, useLocation} from 'react-router-dom';
import {Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Tooltip} from '@mui/material'

const useStyles = makeStyles(() => ({
    dialogPaper: {
        minWidth: 500
    }
}));

const RunActionDialog = (props) => {
    const [isDiaglogOpen, setIsDialogOpen] = React.useState(false)
    const classes = useStyles()
    const handleClick = () => {
        console.log(props)
        setIsDialogOpen(true)
    }
    const handleDialogClose = () => {
        setIsDialogOpen(false)
    }

    return (
        <Grid>
            <Dialog open={isDiaglogOpen} onClose={handleDialogClose}></Dialog>
            <IconButton
                to={{pathname: "/run-action", state: {actionDefinitionId: props?.actionDefinitionId, actionType: props?.actionType}}}
                component={RouterLink}
                color="primary"
                aria-label="Run action"
            >
                <PlayArrowIcon/>
            </IconButton>
        </Grid>
    )
}

export default RunActionDialog