import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material"


export interface ConfirmationDialogProps {
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
        <Dialog open={props.dialogOpen} onClose={props.onDialogClose}fullWidth maxWidth="xs" scroll="paper">
            <DialogTitle sx={{display: 'flex', justifyContent: 'center'}}>
                {props.messageToDisplay}
            </DialogTitle>
            <DialogContent>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3}}>
                    <Button color="primary" onClick={() => props.onAccept()}>
                        {props.acceptString}
                    </Button>
                    <Button color="primary" onClick={() => props.onDecline()}>
                        {props.declineString}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmationDialog