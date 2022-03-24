import React from 'react'
import {Button, Checkbox, Divider, Grid} from '@mui/material'
import labels from './../../../labels/labels'

const CleanupStepRow = (props) => {
    const editInstance = () => {

    }

    return (
        <Grid container spacing={0} alignItems={"center"}>
            <Grid item xs={2} container>
                <Checkbox color={"primary"}

                          onChange={() => props.ToggleSelect(props.actionInstance.Id)}
                          checked={props.IsSelected}
                />
                <Divider orientation="vertical" flexItem className="divider"/>
            </Grid>
            <Grid item xs={8}>
                {props.actionInstance.DisplayName}
            </Grid>
            <Grid item xs={2}>
                <Button variant="outlined" disableElevation onClick={editInstance}>
                    {labels.CleanupStepRow.edit}
                </Button>
            </Grid>
        </Grid>
    )
}

function MemoizedCleanupStepRow(props) {
    return React.useMemo(() => {
        return <CleanupStepRow
            actionInstance={props.actionInstance}
            ToggleSelect={props.ToggleSelect}
            IsSelected={props.IsSelected}
        />
    }, [props.actionInstance, props.IsSelected, props.ToggleSelect])
}

export default MemoizedCleanupStepRow;