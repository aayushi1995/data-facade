import { Box, Button, Dialog, DialogContent, IconButton,DialogTitle } from "@mui/material"
import errorLogo from "../../../src/images/error.svg"
import CloseIcon from '@mui/icons-material/Close';
import { AddBox } from "@mui/icons-material";

export interface ConfirmationDialogProps {
    messageHeader:string;
    messageToDisplay: string,
    acceptString:string,
    declineString:string,
    onAccept: Function,
    onDecline: Function,
    dialogOpen: boolean,
    onDialogClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
}
 
const ConfirmationDialog = (props: ConfirmationDialogProps) => {
    return (
        <Dialog open={props.dialogOpen} onClose={props.onDialogClose}fullWidth maxWidth="md" scroll="paper">
            
            <Box sx={{display: 'flex' , px:1,pt:1}}>    
                <Box sx={{display: 'flex', width:'45%'}}>
                    <Button color="error">
                        <img src={errorLogo}/>
                    </Button>
                    <Box sx={{m:2, fontSize:"20px", fontWeight:'700'}}>
                        {props.messageHeader}
                    </Box>
                </Box>
                <Box sx={{textAlign:'right',width:'55%'}}>
                    <Button color="error" >
                        <CloseIcon onClick={props.onDecline}/>
                    </Button>
                </Box>
            </Box>
            <DialogContent sx={{mt:0,pt:0}}>
                <Box sx={{
                    fontSize:'17px',
                    ml:8,
                    pr:'30px'
                }}>
                    {props.messageToDisplay}
                </Box>
                <Box sx={{display: 'flex', alignItems: 'end', justifyContent: 'end', mt:3,gap: 3}}>
                    <Button sx={{width:"150px", borderRadius:'7px'}} variant="outlined" color="primary" onClick={() => props.onDecline()}>
                        {props.declineString}
                    </Button>
                    <Button sx={{width:"150px", borderRadius:'7px'}}  variant="contained" color="error" onClick={() => props.onAccept()}>
                        {props.acceptString}
                    </Button>
                    
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmationDialog