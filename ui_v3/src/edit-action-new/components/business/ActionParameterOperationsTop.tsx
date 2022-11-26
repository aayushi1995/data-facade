import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Box, IconButton } from "@mui/material";

export type ActionParameterOperationsTopProps = {
    addParam: () => void
}


function ActionParameterOperationsTop(props: ActionParameterOperationsTopProps) {
    const { addParam } = props
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2}}>
            <Box>
                <IconButton onClick={addParam}>
                    <AddIcon/>
                </IconButton>
            </Box>
            <Box>
                <IconButton>
                    <DeleteIcon/>
                </IconButton>
            </Box>
            <Box>
                <IconButton>
                    <FullscreenIcon/>
                </IconButton>
            </Box>
            <Box>
                <IconButton>
                    <FullscreenIcon/>
                </IconButton>
            </Box>
        </Box>
    )
}

export default ActionParameterOperationsTop;