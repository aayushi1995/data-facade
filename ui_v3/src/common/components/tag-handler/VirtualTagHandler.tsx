import { Grid, Autocomplete, Box, Chip, TextField, createFilterOptions } from "@mui/material";
import { Tag } from "../../../generated/entities/Entities";
import useCreateTag from "./hooks/createTag";
import useFetchAvailableTags from "./hooks/useFetchAvailableTags";

export interface VirtualTagHandlerProps {
    selectedTags: Tag[],
    onSelectedTagsChange?: (newTags: Tag[]) => void
    tagFilter: Tag,
    allowAdd: boolean,
    allowDelete: boolean,
    orientation: "VERTICAL" | "HORIZONTAL",
    direction: "REVERSE" | "DEFAULT"
}

const filter = createFilterOptions<Tag>()

const VirtualTagHandler = (props: VirtualTagHandlerProps) => {
    const {selectedTags, onSelectedTagsChange, tagFilter, allowAdd, allowDelete, orientation, direction} = props
    const {data, error, isLoading} = useFetchAvailableTags({tagFilter})
    const createTagMutation = useCreateTag({
        tagFilter: props.tagFilter,
        createTagMutationOptions: {
            onSuccess: (data, variables, context) => {
                if(!!data && data.length === 1) {
                    onSelectedTagsChange?.([...selectedTags, data[0]])
                } else {
                    console.log("Erroneous Response for Tag Creation", data, error, context)
                }
            }
        }
    })

    if(isLoading) {
        return <>Loading...</>
    } else if(!!error) {
        return <>Error: {error}</>
    } else {
        const selectedTagsId: string[] = selectedTags.map(tag => tag.Id!)
        const availableTagsForEntity = (data as Tag[]).filter(availableTag => !selectedTagsId.includes(availableTag.Id!))
        return(
            <Grid container spacing={5} direction={direction==="DEFAULT" ? "row" : "column-reverse"}>
                {props.allowAdd && <Grid item {...(orientation==="VERTICAL" ? {xs:12} : {xs:12, md:4, lg:3})}>
                    <Autocomplete
                        options={availableTagsForEntity}
                        getOptionLabel={tag => tag.Name!}
                        filterSelectedOptions
                        fullWidth
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        onChange={(event, value, reason, details) => {
                            if(!!value){
                                if(value?.Name?.includes("Create Tag: ")){
                                    createTagMutation.mutate({
                                        tagModel: {
                                            Name: value?.Name?.substring(12)
                                        }
                                    })
                                } else {
                                    onSelectedTagsChange?.([...selectedTags, value])
                                }
                            }
                        }}
                        filterOptions={(options, params) => {

                            const filtered = filter(options, params);
                            if (params.inputValue !== '') {
                                filtered.push({ Name: `Create Tag: ${params.inputValue}` });
                            }
                            return filtered;
                        }}
                        renderInput={(params) => <TextField {...params} label="Add Tag"/>}
                    />
                </Grid>}
                <Grid item {...(orientation==="VERTICAL" ? {xs:12} : {xs:12, md:8, lg:9})}> 
                    <Box sx={{display: "flex", flexDirection: "row", gap: 1, flexWrap: "wrap", alignItems: "center", height: "100%"}}>
                        {selectedTags.length > 0 ? 
                            selectedTags.map(tag => 
                                <Box>
                                    <Chip variant="outlined" color="primary" size="small" 
                                        label={tag.Name} 
                                        onDelete={props.allowDelete ? (() => {onSelectedTagsChange?.(selectedTags.filter(selectedTag => selectedTag.Id!==tag.Id))}) : undefined}
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

export default VirtualTagHandler