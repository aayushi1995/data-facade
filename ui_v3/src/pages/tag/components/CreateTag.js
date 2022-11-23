import React from 'react'
import {v4 as uuidv4} from 'uuid'

import {Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from '@mui/material'
import {makeStyles} from "@mui/styles";
import Autocomplete from '@mui/material/Autocomplete';

import {useMutation} from 'react-query'

import '../../../css/table_browser/TableBrowser.css'
import dataManagerInstance, {useRetreiveData} from '../../../data_manager/data_manager'
import HelpInfo from '../../../custom_enums/HelpInfo.js';
import AppendHelpInfo from '../../../common/components/AppendHelpInfo.js'
import TagScope from '../../../enums/TagScope';
import TagGroups from '../../../enums/TagGroups';
import labels from '../../../labels/labels';
import {userSettingsSingleton} from "../../../data_manager/userSettingsSingleton";


const useStyles = makeStyles(() => ({
    disabledButton: {
        background: "#classes"
    },
    otherActionDefinitionForm: {
        minWidth: 300
    }
}))


/*
    closeDialog(): Function to close the Dialog
*/

const CreateTag = (props) => {
    const classes = useStyles()

    // Fetches the list of available tags
    const {status: allTagStatus, data: allTagData, error: allTagError} = useRetreiveData(labels.entities.TAG,
        {
            filter: {}
        }
    )

    const createTagMutation = useMutation(
        "CreateTag",
        (config) => dataManagerInstance.getInstance.saveData(config.entityName, config.actionProperties),
        {
            onMutate: () => {
                setComponentState((oldState) => {
                    return {
                        ...oldState,
                        readOnly: true
                    }
                })
            }
        }
    )
    const tagGroup = (props.TagGroup === undefined) ? TagGroups.GENERIC : props.TagGroup

    // Hooks
    const [tagAttributes, setTagAttributes] = React.useState({
        Id: uuidv4(),
        Name: "",
        Scope: TagScope.TABLE,
        TagGroup: tagGroup,
        CreatedBy: userSettingsSingleton.userName
    })
    const [allTags, setAllTags] = React.useState([])
    const [componentState, setComponentState] = React.useState({readOnly: false})

    React.useEffect(() => {
        if (allTagData !== undefined) {
            setAllTags(allTagData)
        }
    }, [allTagData])

    const handleName = (event) => {
        const newValue = event.target.value
        setTagAttributes(oldAttributes => {
            return {
                ...oldAttributes,
                Name: newValue
            }
        })
    }

    const handleScope = (event) => {
        setTagAttributes(oldAttributes => {
            return {
                ...oldAttributes,
                Scope: event.target.value
            }
        })
    }

    const handleGroup = (event) => {
        setTagAttributes(oldAttributes => {
            return {
                ...oldAttributes,
                TagGroup: event.target.value
            }
        })
    }

    const handleTagDescription = (event) => {
        const newValue = event.target.value
        setTagAttributes(oldAttributes => {
            return {
                ...oldAttributes,
                Description: newValue
            }
        })
    }

    const createTag = () => {
        // console.log(tagAttributes)
        createTagMutation.mutate({
            entityName: labels.entities.TAG,
            actionProperties: {
                entityProperties: tagAttributes
            }
        }, {
            onSettled: () => {
                setComponentState((oldState) => {
                    return {
                        ...oldState,
                        readOnly: false
                    }
                })
            },
            onSuccess: () => {
                props.closeDialog()
            }
        })
    }

    const handleParentTag = {
        GET_TAG_MODEL_FROM_NAME: (tagName) => {
            return tagName === undefined ?
                {Name: ""}
                :
                allTags.filter(tag => tag.Name === tagName)[0]
        },
        GET_TAG_NAME_FROM_MODEL: (tagModel) => {
            return tagModel.Name
        },
        PARENT_TAG_CHANGE: (event, value, reason) => {
            const newParentTagModel = value
            console.log(newParentTagModel)
            setTagAttributes(oldAttributes => {
                return {
                    ...oldAttributes,
                    ParentTagName: handleParentTag.GET_TAG_NAME_FROM_MODEL(newParentTagModel)
                }
            })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid container item xs={12} spacing={1}>

                <Grid item xs={12}>
                    <AppendHelpInfo Info={HelpInfo.CREATE_TAG_FORM_NAME} proportion={4}>
                        <TextField
                            value={tagAttributes?.Name}
                            onChange={handleName}
                            variant="outlined"
                            label="Name"
                            fullWidth
                        />
                    </AppendHelpInfo>
                </Grid>

                <Grid item xs={12}>
                    <AppendHelpInfo Info={HelpInfo.CREATE_TAG_FORM_SCOPE} proportion={4}>
                        <FormControl variant="outlined" className={classes.otherActionDefinitionForm}>
                            <InputLabel>Scope</InputLabel>
                            <Select
                                value={tagAttributes?.Scope}
                                onChange={handleScope}
                                variant="outlined"
                                label="Scope"
                                fullWidth
                            >
                                {Object.values(TagScope).map((tagScope) => {
                                    return <MenuItem value={tagScope}>{tagScope}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </AppendHelpInfo>
                </Grid>

                {(props.TagGroup === undefined) ? (<Grid item xs={12}>
                    <AppendHelpInfo Info={HelpInfo.CREATE_TAG_FORM_GROUP} proportion={4}>
                        <FormControl variant="outlined" className={classes.otherActionDefinitionForm}>
                            <InputLabel>Group</InputLabel>
                            <Select
                                value={tagAttributes?.TagGroup}
                                onChange={handleGroup}
                                variant="outlined"
                                label="Group"
                                fullWidth
                            >
                                {Object.values(TagGroups).map((tagGroup) => {
                                    return <MenuItem value={tagGroup}>{tagGroup}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </AppendHelpInfo>
                </Grid>) : (<></>)}

                <Grid item xs={12}>
                    <AppendHelpInfo Info={HelpInfo.CREATE_TAG_FORM_DESCRIPTION} proportion={4}>
                        <Autocomplete
                            multiple={false}
                            options={allTags}
                            getOptionLabel={(tagModel) => tagModel.Name}
                            filterSelectedOptions
                            fullWidth
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            value={handleParentTag.GET_TAG_MODEL_FROM_NAME(tagAttributes?.ParentTagName)}
                            onChange={handleParentTag.PARENT_TAG_CHANGE}
                            groupBy={(tagModel) => (tagModel?.TagGroup) || "NA"}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label={"Parent Tag"}
                                    placeholder="Tags"
                                />
                            )}
                        />
                    </AppendHelpInfo>
                </Grid>

                <Grid item xs={12}>
                    <AppendHelpInfo Info={HelpInfo.CREATE_TAG_FORM_DESCRIPTION} proportion={4}>
                        <TextField
                            value={tagAttributes?.Description}
                            onChange={handleTagDescription}
                            variant="outlined"
                            label="Description"
                            fullWidth
                            multiline
                            rows={5}
                        />
                    </AppendHelpInfo>
                </Grid>

            </Grid>
            <Grid item xs={12}>
                <Button variant="contained"
                        component="label"
                        onClick={createTag}
                        classes={{
                            root: "select-all",
                            disabled: classes.disabledButton
                        }}
                >
                    Create
                </Button>
            </Grid>
        </Grid>
    )
}

export default CreateTag;