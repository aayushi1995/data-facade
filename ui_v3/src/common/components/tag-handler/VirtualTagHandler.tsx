import { Grid, Autocomplete, Box, Chip, TextField } from "@mui/material";
import { Tag } from "../../../generated/entities/Entities";
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

const VirtualTagHandler = (props: VirtualTagHandlerProps) => {
    const {selectedTags, onSelectedTagsChange, tagFilter, allowAdd, allowDelete, orientation, direction} = props
    const {data, error, isLoading} = useFetchAvailableTags({tagFilter})

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
                                onSelectedTagsChange?.([...selectedTags, value])
                            }
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