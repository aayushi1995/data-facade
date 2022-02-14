import React from 'react'
import {v4 as uuidv4} from 'uuid'
import {useMutation} from 'react-query'
import {createFilterOptions, Grid, TextField,} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import dataManagerInstance, {useRetreiveData} from './../../data_manager/data_manager'
import labels from '../../labels/labels';
import TagMapCreatedBy from '../../enums/TagMapCreatedBy'
import TagGroups from './../../enums/TagGroups'


/*
readOnly
setTags
maxHeight
selectedTags
label
tagOptionFilter
tagOptionGroupBy
tagSelectionMode
createPrompt
allowNewTagCreation
onCreateNewSetProperties
*/

const TAG_SELECTION_MODE = {
    SINGLE: "single",
    MULTIPLE: "multiple"
}

const SelectTags = (props) => {
    const generatePrompt = props.generatePrompt|| ((newTagName) => `Create Tag: ${newTagName}`)
    const allowNewTagCreation = props.allowNewTagCreation!==undefined?props.allowNewTagCreation:true

    const tagOptionFilter = props.tagOptionFilter||{}
    const tagOptionGroupBy = props.tagOptionGroupBy || undefined
    const tagSelectionMode = props.tagSelectionMode || "multiple"
    const onCreateNewSetProperties = props.onCreateNewSetProperties || {}

    const filter = createFilterOptions();

    const [availableTags, setAvailableTags] = React.useState([])
    const [dropDownState, setDropDownState] = React.useState({})

    React.useEffect(() => {
        if (props.readOnly !== undefined) {
            setDropDownState(oldState => {
                return {...oldState, readOnly: props.readOnly}
            })
        } else {
            setDropDownState(oldState => {
                return {...oldState, readOnly: false}
            })
        }
    }, [props.readOnly])

    const createTagMutation = useMutation(
        "CreateTag",
        (config) => dataManagerInstance.getInstance.saveData(config.entityName, config.actionProperties),
        {
            onMutate: () => {
                setDropDownState((oldState) => {
                    return {
                        ...oldState,
                        readOnly: true
                    }
                })
            }
        }
    )

    // Updates list of Selected tags
    const onSelectedTagChange = (event, value, reason) => {
        if (value) {
            if (tagSelectionMode === TAG_SELECTION_MODE.SINGLE) {
                if (value.inputValue != undefined) {
                    const tagModel = {
                        Id: uuidv4(),
                        Name: value.inputValue,
                        Scope: tagOptionFilter?.Scope,
                        CreatedBy: TagMapCreatedBy.USER,
                        TagGroup: TagGroups.GENERIC,
                        ...tagOptionFilter,
                        ...onCreateNewSetProperties
                    }
                    createTagMutation.mutate(
                        {entityName: labels.entities.TAG, actionProperties: {entityProperties: tagModel}},
                        {
                            onSettled: () => {
                                setDropDownState((oldState) => {
                                    return {
                                        ...oldState,
                                        readOnly: false
                                    }
                                })
                            },
                            onSuccess: (data, variable, context) => {
                                setAvailableTags(oldAvailableTags => {
                                    return [...oldAvailableTags, data[0]]
                                })
                                props.setTags(data[0])
                            }
                        }
                    )
                } else {
                    props.setTags(value)
                }
            } else if (tagSelectionMode === TAG_SELECTION_MODE.MULTIPLE) {
                const tagToCreate = value.filter(newTag => newTag.inputValue !== undefined)
                if (tagToCreate.length === 1) {
                    const tagModel = {
                        Id: uuidv4(),
                        Name: tagToCreate[0].inputValue,
                        Scope: tagOptionFilter?.Scope,
                        CreatedBy: TagMapCreatedBy.USER,
                        TagGroup: TagGroups.GENERIC,
                        ...tagOptionFilter,
                        ...onCreateNewSetProperties
                    }
                    const otherTags = value.filter(newTag => newTag.inputValue === undefined)
                    createTagMutation.mutate(
                        {entityName: labels.entities.TAG, actionProperties: {entityProperties: tagModel}},
                        {
                            onSettled: () => {
                                setDropDownState((oldState) => {
                                    return {
                                        ...oldState,
                                        readOnly: false
                                    }
                                })
                            },
                            onSuccess: (data, variable, context) => {
                                props.setTags([...otherTags, data[0]])
                            }
                        }
                    )
                } else {
                    props.setTags(value)
                }
            } else {
            }
        }
    }

    // Fetches the list of Available Tags in given Scope
    const {data} = useRetreiveData(labels.entities.TAG,
        {
            "filter": tagOptionFilter
        }
    )

    // Updates Available Tags for given scope from backend
    React.useEffect(() => {
        if (data !== undefined) {
            setAvailableTags(data)
        }
    }, [JSON.stringify(data)])

    return (
        <Grid container item xs={12}>
            <Grid item xs={12} style={{maxHeight: props.maxHeight || 120, overflow: "auto", paddingTop: 8}}>
                <Autocomplete
                    multiple={tagSelectionMode === TAG_SELECTION_MODE.MULTIPLE}
                    options={availableTags}
                    getOptionLabel={(option) => option.Name}
                    filterSelectedOptions
                    fullWidth
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    disabled={dropDownState.readOnly}
                    limitTags={dropDownState.readOnly ? -1 : 1}
                    value={props.selectedTags}
                    onChange={onSelectedTagChange}
                    groupBy={tagOptionGroupBy}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label={props.label || "Selected Tags"}
                            placeholder="Tags"
                        />
                    )}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        console.log(allowNewTagCreation)
                        // Suggest the creation of a new value
                        if (params.inputValue !== '' && allowNewTagCreation) {
                            filtered.push({
                                inputValue: params.inputValue,
                                Name: generatePrompt(params.inputValue)
                            });
                        }
                        return filtered;
                    }}
                />
            </Grid>
        </Grid>
    )
}


export default SelectTags;