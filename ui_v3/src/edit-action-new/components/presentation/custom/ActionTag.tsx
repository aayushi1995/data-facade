import { Box, Typography } from "@mui/material";
import VirtualTagHandler, { VirtualTagHandlerProps } from "../../../../common/components/tag-handler/VirtualTagHandler";
import { Tag } from "../../../../generated/entities/Entities";

export type ActionTagProps = {
    selectedTags?: Tag[],
    onSelectedTagsChange?: (newTags?: Tag[]) => void
}

function ActionTag(props: ActionTagProps) {
    const { selectedTags, onSelectedTagsChange } = props
    const virtualTagHandlerProps: VirtualTagHandlerProps = {
        selectedTags: (selectedTags || []),
        tagFilter: {},
        allowAdd: true,
        allowDelete: true,
        onSelectedTagsChange,
        inputFieldLocation: "BOTTOM"
    }
    
    return (
        <Box sx={{py:1}}>
            <Box sx={{py:1,borderBottom:'3px solid #e3e3e3',px:3}}>
                <Typography sx={{fontSize:'1.2rem',fontWeight:600}}>
                    Action Tags
                </Typography>
            </Box>
            <Box sx={{pr:5,pl:2,mt:1,py:2}}>
                <VirtualTagHandler {...virtualTagHandlerProps}/>
            </Box>
        </Box>
    )
}

export default ActionTag;