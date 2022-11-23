import React from 'react'

import {Box, Button, Grid, TextField} from '@mui/material'
import {makeStyles} from "@mui/styles";

import {useMutation} from 'react-query'

import '../../../css/table_browser/TableBrowser.css'
import dataManagerInstance from '../../../data_manager/data_manager'


const useStyles = makeStyles(() => ({
    disabledButton: {
        background: "#classes"
    }
}))


/*
    TagName: Name of the Tag
    TagDescription: Initial Value of the Tag's Description
    handleCloseDialog(): Function to close the Dialog
    setNewDescription(tagName, tagDescription): Function to Upload State of Parent Component
*/

const UpdateTagDescription = (props) => {
    const classes = useStyles()

    // Hooks
    const [tagDescription, setTagDescription] = React.useState((props.TagDescription) || "")
    const [textFieldActive, setTextFieldActive] = React.useState(true)

    // This mutation is supposed to update the description of the Ta
    const updateTagDescriptionMutation = useMutation(
        "UpdateTagDescriptionMutation",
        (config) => dataManagerInstance.getInstance.patchData(config.entityName, config.actionProperties),
        {
            onMutate: () => {
                setTextFieldActive(false)
            }
        }
    )

    // Helper Functions
    // Responsible for triggering the mutation to update the description
    const updateTagDescription = () => {
        updateTagDescriptionMutation.mutate({
                entityName: "Tag",
                actionProperties: {
                    filter: {
                        Name: props.TagName
                    },
                    newProperties: {
                        Description: tagDescription
                    }
                }
            },
            {
                onSettled: () => setTextFieldActive(true),
                onSuccess: () => {
                    props.setNewDescription(props.TagName, tagDescription)
                    props.closeDialog()
                }
            })
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box style={{height: "100%", maxHeight: 150}}>
                    <TextField
                        value={tagDescription}
                        onChange={(event) => setTagDescription(event.target.value)}
                        variant="outlined"
                        label="Description"
                        disabled={!textFieldActive}
                        fullWidth
                        multiline
                        rows={5}
                    />
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained"
                        component="label"
                        onClick={updateTagDescription}
                        classes={{
                            root: "select-all",
                            disabled: classes.disabledButton
                        }}
                        disabled={!textFieldActive}>
                    Update
                </Button>
            </Grid>
        </Grid>
    )
}

export default UpdateTagDescription;