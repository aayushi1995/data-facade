import { Box, Button, Dialog, DialogContent } from "@mui/material"
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown'
import React from "react";

export interface ConfirmationDialogProps {
    mode?: "ERROR" | "INFO",
    messageHeader:string;
    messageToDisplay: string,
    acceptString:string,
    declineString:string,
    onAccept?: Function,
    onDecline?: Function,
    dialogOpen: boolean,
    onDialogClose?: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
}
 
const ConfirmationDialog = (props: ConfirmationDialogProps) => {
    const mode = props?.mode || "ERROR"
    const styling = stylings?.[mode]
    return (
        <Dialog open={props.dialogOpen} onClose={props.onDialogClose}fullWidth maxWidth="md" scroll="paper">
            <Box sx={{display: 'flex' , px:1,pt:1}}>    
                <Box sx={{display: 'flex', width:'45%'}}>
                    <Box sx={{ px: 2, display: "flex", alignItems: "center" }}>
                        {React.createElement(styling.icon, {color: styling.color})}
                    </Box>
                    <Box sx={{m:2, fontSize:"20px", fontWeight:'700'}}>
                        {props.messageHeader}
                    </Box>
                </Box>
                <Box sx={{textAlign:'right',width:'55%'}}>
                    <Button color={styling?.color} >
                        <CloseIcon onClick={() => props?.onDecline?.()}/>
                    </Button>
                </Box>
            </Box>
            <DialogContent sx={{mt:0,pt:0}}>
                <Box sx={{
                    fontSize:'17px',
                    ml:8,
                    pr:'30px'
                }}>
                    <ReactMarkdown>
                        {props.messageToDisplay}
                    </ReactMarkdown> 
                </Box>
                <Box sx={{display: 'flex', alignItems: 'end', justifyContent: 'end', mt:3,gap: 3}}>
                    <Button sx={{width:"150px", borderRadius:'7px'}} variant="outlined" color="primary" onClick={() => props?.onDecline?.()}>
                        {props.declineString}
                    </Button>
                    <Button sx={{width:"150px", borderRadius:'7px'}}  variant="contained" color={styling?.color} onClick={() => props?.onAccept?.()}>
                        {props.acceptString}
                    </Button>
                    
                </Box>
            </DialogContent>
        </Dialog>
    )
}

const stylings = {
    "ERROR": {
        icon: ErrorIcon,
        color: "error"
    },
    "INFO": {
        icon: LightbulbIcon,
        color: "primary"
    }
}

export default ConfirmationDialog