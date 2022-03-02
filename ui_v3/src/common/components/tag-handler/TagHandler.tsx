import { Autocomplete, Box, Button, Chip, TextField, createFilterOptions, Grid } from '@material-ui/core'
import React from 'react'
import TagScope from '../../../enums/TagScope'
import { Tag } from '../../../generated/entities/Entities'
import labels from '../../../labels/labels'
import useFetchTags from './hooks/useFetchTags'

export interface TagHandlerProps {
    entityType: string,
    entityId: string,
    tagFilter: Tag,
    allowAdd: boolean,
    allowDelete: boolean
}

const filter = createFilterOptions<string>()

const TagHandler = (props: TagHandlerProps) => {
    const [tagsSelectedForEntity, tagsNotSelectedButAvaialbleForEntity, isLoading, isMutating, error, addTag, createAndAddTag, deleteTag] = useFetchTags({
        entityType: props.entityType,
        entityId: props.entityId,
        tagFilter: props.tagFilter
    })
    
    if(isLoading) {
        return <>Loading...</>
    } else if(!!error) {
        return <>Error: {error}</>
    } else {
        return(
            <Grid container spacing={1} sx={{overflowY: 'auto'}}>
                {props.allowAdd && <Grid item xs={12} md={4} lg={2}>
                    <Autocomplete
                        options={tagsNotSelectedButAvaialbleForEntity}
                        filterSelectedOptions
                        fullWidth
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        disabled={(isLoading || isMutating ||(!!error))}
                        onChange={(event, value, reason, details) => {
                            if(!!value){
                                if(value?.includes("Create Tag: ")){
                                    createAndAddTag(value.substring(12))
                                } else {
                                    addTag(value)
                                }
                            }
                        }}
                        renderInput={(params) => <TextField {...params}/>}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            if (params.inputValue !== '') {
                                filtered.push(`Create Tag: ${params.inputValue}`);
                            }
                            return filtered;
                        }}
                    />
                </Grid>}
                <Grid item {...(props.allowAdd ? {xs:12, md:8, lg:10} : {xs:12})}> 
                    <Box sx={{display: "flex", flexDirection: "row", gap: 1, flexWrap: "wrap", alignItems: "center", height: "100%"}}>
                        {tagsSelectedForEntity.length > 0 ? 
                            tagsSelectedForEntity.map(tagName => 
                                <Box>
                                    <Chip variant="outlined" color="primary" size="small" 
                                        label={tagName} 
                                        onDelete={props.allowDelete ? (() => {deleteTag(tagName)}) : undefined}
                                        sx={{
                                            fontFamily: "SF Pro Text",
                                            fontStyle: "normal",
                                            fontWeight: "normal",
                                            fontSize: "13px",
                                            lineHeight: "24px",
                                            display: "flex",
                                            alignItems: "center",
                                            letterSpacing: "0.073125px",
                                            color: "#253858",
                                            pt: 2,
                                            pb: 2
                                        }}
                                    />
                                </Box>)
                            
                            :
                                <Box>
                                    <Chip variant="outlined" color="primary" size="small" 
                                        label={"No Tags"} 
                                        sx={{
                                            fontFamily: "SF Pro Text",
                                            fontStyle: "normal",
                                            fontWeight: "normal",
                                            fontSize: "13px",
                                            lineHeight: "24px",
                                            display: "flex",
                                            alignItems: "center",
                                            letterSpacing: "0.073125px",
                                            color: "#253858",
                                            pt: 2,
                                            pb: 2
                                        }}
                                    />
                                </Box>
                        }
                        
                    </Box>
                </Grid>
            </Grid>
        )
    }
}

export default TagHandler;