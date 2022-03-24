import React from 'react'
import {Box, Button, Dialog, Grid, IconButton, TextField} from '@mui/material'
import UpdateActionDefinition from './UpdateActionDefinition.js'
import CloseIcon from '@mui/icons-material/Close';
import useStyles from './../../../css/customizations/DataProfilingRow'
import labels from './../../../labels/labels'
import * as PropTypes from "prop-types";
import {useRetreiveData} from "../../../data_manager/data_manager";
import LoadingIndicator from "../../../common/components/LoadingIndicator";
import {useRouteMatch} from "react-router-dom";


export function AllActionsRowDetails({ActionType}) {
    const match = useRouteMatch();
    const Id = match.params.Id;
    const [dialogState, setDialogState] = React.useState(false)
    const classes = useStyles();
    const useFetchActionDefinitionQuery = () => useRetreiveData(labels.entities.ActionDefinition, {
        "filter": {
            Id,
            ActionType
        },
        "ActionDefinitionDetailGet": true
    })
    const {
        isLoading: isLoadingActionDefinition,
        error: actionDefinitionError,
        data: actionDefinitionData
    } = useFetchActionDefinitionQuery();

    const handleDialogOpen = () => {
        setDialogState(true)
    }
    const handleDialogClose = () => {
        setDialogState(false)
    }
    if (isLoadingActionDefinition) {
        return (<LoadingIndicator/>)
    } else if (actionDefinitionError) {
        return <div>Error</div>
    }
    const data = actionDefinitionData?.[0];
    return <>
        <Grid item xs={12} className={classes.param_def_det}>
            {labels.CustomizationDataProfilingRow.action_def_det}
        </Grid>
        <Grid container spacing={2}>
            <Grid item>
                <TextField defaultValue={data?.ActionDefinition?.model?.UniqueName} label="UniqueName"
                           variant="outlined" InputProps={{readOnly: "true"}}/>
            </Grid>
            <Grid item>
                <TextField defaultValue={data?.ActionDefinition?.model?.ActionTemplate} label="Action Template"
                           variant="outlined"/>
            </Grid>
            <Grid item>
                <TextField defaultValue={data?.ActionDefinition?.model?.OutputFormat} label="Output Format"
                           variant="outlined"/>
            </Grid>
            <Grid item>
                <TextField defaultValue={data?.ActionDefinition?.model?.PresentationFormat}
                           label="Presentation Format" variant="outlined"/>
            </Grid>
            <Grid item>
                <TextField defaultValue={data?.ActionDefinition?.model?.QueryLanguage} label="Template Type"
                           variant="outlined"/>
            </Grid>
            <Grid item>
                <TextField defaultValue={data?.ActionDefinition?.model?.ActionType} label="Action Type"
                           variant="outlined"/>
            </Grid>
        </Grid>
        <Grid item xs={12} className={classes.param_def_det}>
            {labels.CustomizationDataProfilingRow.param_def_det}
        </Grid>
        <Grid container spacing={0} className={classes.collapse_in}>
            <Grid item xs={2}>
                <Button variant="outlined" className={classes.button} onClick={handleDialogOpen}>
                    {labels.CustomizationDataProfilingRow.update_action_def}
                </Button>
            </Grid>
        </Grid>
        <Dialog onClose={handleDialogClose} open={dialogState} fullWidth classes={{paper: classes.dialogPaper}}
                scroll="paper">
            <Grid container item xs={12} style={{display: 'flex', justifyContent: 'flex-start'}} padding={1}>
                <Grid item xs={11} style={{fontSize: 18, color: 'dodgerblue', letterSpacing: 0.3}}>
                    <Box ml={3} mt={2}>
                        {labels.CustomizationDataChecksRow.update_action_def}
                    </Box>
                </Grid>
                <Grid item xs={1} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <IconButton aria-label="close" onClick={handleDialogClose}>
                        <CloseIcon/>
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Box mx={2} my={1}>
                        <UpdateActionDefinition onClose={handleDialogClose} data={data}/>
                    </Box>
                </Grid>
            </Grid>
        </Dialog>
    </>;
}

AllActionsRowDetails.propTypes = {
    classes: PropTypes.any,
    data: PropTypes.any,
    onClick: PropTypes.func
};

export default AllActionsRowDetails;