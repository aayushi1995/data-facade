import { Box } from "@mui/material";
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
        <Box>
            <Box>

            </Box>
            <Box>
                <VirtualTagHandler {...virtualTagHandlerProps}/>
            </Box>
        </Box>
    )
}

export default ActionTag;