import React from 'react'
import {createFilterOptions, Grid, TextField} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete';
import dataManagerInstance, {useRetreiveData} from './../../data_manager/data_manager'
import labels from '../../labels/labels';
import {v4 as uuidv4} from 'uuid'
import {useMutation} from 'react-query'
import TagMapCreatedBy from './../../enums/TagMapCreatedBy'
import TagGroups from './../../enums/TagGroups'

// props:
// RelatedEntityId
// RelatedEntityType
// scope
// setTags

const changeType = {
    ADD: "select-option",
    REMOVE: "remove-option",
    CLEAR: "clear"
}

const EditTags = (props) => {
    const tagScope = props.scope
    const [selectedTags, setSelectedTags] = React.useState([])
    const [availableTags, setAvailableTags] = React.useState([])
    const [dropDownState, setDropDownState] = React.useState({count: 0})

    const filter = createFilterOptions();

    // Mutation to Add TagMap entries
    const addTagMapMutation = useMutation((reqConfig) => {
            const config = dataManagerInstance.getInstance.saveData(
                labels.entities.TAG_MAP,
                {
                    "entityProperties": {
                        "RelatedEntityType": props.RelatedEntityType,
                        "RelatedEntityId": props.RelatedEntityId,
                        "CreatedBy": TagMapCreatedBy.USER
                    },
                    "multipleTags": true,
                    "tags": reqConfig.tags
                })
            let response = config.then(res => res.json())
            return response
        },
        {
            onMutate: () => {
                setDropDownState((oldState) => {
                    return {
                        ...oldState,
                        count: oldState.count + 1
                    }
                })
            }
        })

    // Mutation to Remove TagMap entries
    const deleteTagMapMutation = useMutation((reqConfig) => {
            const config = dataManagerInstance.getInstance.deleteData(
                labels.entities.TAG_MAP,
                {
                    "filter": {
                        "RelatedEntityType": props.RelatedEntityType,
                        "RelatedEntityId": props.RelatedEntityId,
                    },
                    "multipleTags": true,
                    "tags": reqConfig.tags
                })
            let response = config.then(res => res.json())
            return response
        },
        {
            onMutate: () => {
                setDropDownState((oldState) => {
                    return {
                        ...oldState,
                        count: oldState.count + 1
                    }
                })
            }
        })

    // Mutation to Create new Tag
    const createTagMutation = useMutation(
        "CreateTag",
        (config) => dataManagerInstance.getInstance.saveData(config.entityName, config.actionProperties),
        {
            onMutate: () => {
                setDropDownState((oldState) => {
                    return {
                        ...oldState,
                        count: oldState.count + 1
                    }
                })
            }
        }
    )

    // Updates list of Selected tags
    const onSelectedTagChange = (event, value, reason) => {
        const tagToCreate = value.filter(newTag => newTag.inputValue !== undefined)
        if (tagToCreate.length === 1) {
            const tagModel = {
                Id: uuidv4(),
                Name: tagToCreate[0].inputValue,
                Scope: tagScope,
                CreatedBy: TagMapCreatedBy.USER,
                TagGroups: TagGroups.GENERIC
            }
            const otherTags = value.filter(newTag => newTag.inputValue === undefined)
            createTagMutation.mutate(
                {entityName: labels.entities.TAG, actionProperties: {entityProperties: tagModel}},
                {
                    onSettled: () => {
                        console.log("OKOKOKO")
                        setDropDownState((oldState) => {
                            return {
                                ...oldState,
                                count: oldState.count - 1
                            }
                        })
                    },
                    onSuccess: () => {
                        addTagMapMutation.mutate({
                                "tags": [tagModel.Name]
                            },
                            {
                                onSettled: () => {
                                    setDropDownState((oldState) => {
                                        return {
                                            ...oldState,
                                            count: oldState.count - 1
                                        }
                                    })
                                },
                                onSuccess: () => {
                                    setSelectedTags(oldSelectedTags => {
                                        console.log([...oldSelectedTags, tagModel])
                                        return [...oldSelectedTags, tagModel]
                                    })
                                }
                            })
                    }
                }
            )
        } else {
            setSelectedTags(oldSelectedTags => {
                const newTags = value
                const tagsToAdd = newTags.filter(newTag => oldSelectedTags.every(oldTag => oldTag.Name !== newTag.Name))
                const tagsToRemove = oldSelectedTags.filter(oldTag => newTags.every(newTag => newTag.Name !== oldTag.Name))

                if (tagsToAdd.length > 0) {
                    addTagMapMutation.mutate({
                            "tags": tagsToAdd.map(tag => tag.Name)
                        },
                        {
                            onSettled: () => {
                                setDropDownState((oldState) => {
                                    return {
                                        ...oldState,
                                        count: oldState.count - 1
                                    }
                                })
                            }
                        })
                }
                if (tagsToRemove.length > 0) {
                    deleteTagMapMutation.mutate({
                            "tags": tagsToRemove.map(tag => tag.Name)
                        },
                        {
                            onSettled: () => {
                                setDropDownState((oldState) => {
                                    return {
                                        ...oldState,
                                        count: oldState.count - 1
                                    }
                                })
                            }
                        })
                }

                return newTags
            })
        }
    }

    // Fetches the list of Available Tags in given Scope
    const {data: availableTagData} = useRetreiveData(labels.entities.TAG,
        {
            "filter": {
                Scope: tagScope
            }
        }
    )

    // Fetches the list of Selected Tags for given entity
    const {data: selectedTagData} = useRetreiveData(labels.entities.TAG_MAP,
        {
            "filter": {
                RelatedEntityType: props.RelatedEntityType,
                RelatedEntityId: props.RelatedEntityId
            }
        }
    )

    // Updates Available Tags for given scope from backend
    React.useEffect(() => {
        if (availableTagData !== undefined) {
            setAvailableTags(availableTagData)
        }
    }, [JSON.stringify(availableTagData)])

    // Updates Selected Tags for given entity from backend
    React.useEffect(() => {
        if (selectedTagData !== undefined) {
            setSelectedTags(selectedTagData.map(tagMapEntry => {
                return {Name: tagMapEntry.TagName}
            }))
        }
    }, [JSON.stringify(selectedTagData)])

    // Sends updated tags to provided callback functions
    React.useEffect(() => {
        if (props.setTags !== undefined) {
            props.setTags(selectedTags)
        }
    }, [JSON.stringify(selectedTags)])

    return (
        <Grid container item xs={12}>
            <Grid item xs={12} style={{
                minHeight: props.fixedHeight || 120,
                maxHeight: props.fixedHeight || 120,
                overflow: "auto",
                paddingTop: 8
            }}>
                <Autocomplete
                    multiple
                    options={availableTags}
                    getOptionLabel={(option) => option.Name}
                    filterSelectedOptions
                    fullWidth
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    limitTags={-1}
                    value={selectedTags}
                    onChange={onSelectedTagChange}
                    disabled={dropDownState.count !== 0}
                    disableClearable={true}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label={props.label || "Selected Tags"}
                            placeholder="Type to Add"
                        />
                    )}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        // Suggest the creation of a new value
                        if (params.inputValue !== '') {
                            filtered.push({
                                inputValue: params.inputValue,
                                Name: `Create Tag: ${params.inputValue}`,
                            });
                        }

                        return filtered;
                    }}
                />
            </Grid>
        </Grid>
    )
}

export default EditTags;