import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from "@mui/icons-material/Close"
import { Box, IconButton } from "@mui/material";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';

export type ActionParameterOperationsTopProps = {
    addParam: () => void,
    handleClose: () => void
}


function ActionParameterOperationsTop(props: ActionParameterOperationsTopProps) {
    const { addParam, handleClose } = props
    return (
        <Box sx={{ display: "flex", flexDirection: "row"}}>
            
            {/*
            DISABLING ALL AS IT WAS NON FUNCTIONAL 
            <Box>
                <IconButton onClick={addParam}>
                    <AddIcon color='warning'/>
                </IconButton>
            </Box>
            <Box>
                <IconButton>
                    <DeleteForeverOutlinedIcon color='error'/>
                </IconButton>
            </Box>
            <Box>
                <IconButton>
                    <TableViewOutlinedIcon color='info'/>
                </IconButton>
            </Box>
            <Box>
                <IconButton>
                    <FullscreenIcon color='action'/>
                </IconButton>
            </Box> */}
            <IconButton onClick={handleClose}>
                <CloseIcon color="action"/>
            </IconButton>
        </Box>
    )
}

export default ActionParameterOperationsTop;