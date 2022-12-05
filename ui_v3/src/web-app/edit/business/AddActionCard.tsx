import { Box, Typography, IconButton, Dialog, DialogContent, TextField, Button } from "@mui/material";
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces";
import { StyledAddActionCard } from "../presentation/styled/StyledAddActionCard";
import AddIcon from '@mui/icons-material/Add';
import useAddActionCard from "../hooks/useAddActionCard";
import { getDialogTitile } from "./ComponentsTray";

const AddActionCard = ({actionDefinitionDetail, handleAdd}: {actionDefinitionDetail: ActionDefinitionDetail, handleAdd: (ActionDefinitionDetail: ActionDefinitionDetail, referenceName: string | undefined) => void}) => {

    const {onChangeDialogState, onReferenceNameChange, actionReferenceName, actionReferenceNameDialogState} = useAddActionCard()

    return (
        <>
        <Dialog maxWidth="md" fullWidth open={actionReferenceNameDialogState} onClose={onChangeDialogState}>
            {getDialogTitile(onChangeDialogState)}
            <DialogContent>
                <Box sx={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 2}}>
                    <TextField value={actionReferenceName} onChange={onReferenceNameChange} fullWidth label="Unique Action reference" />
                    <Button variant="contained" size="medium" onClick={() => handleAdd(actionDefinitionDetail, actionReferenceName)}>
                        Add
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
        <StyledAddActionCard variant="outlined">
            <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                <Box sx={{display: 'flex', flexDirection: 'column', flex: 2, width: '100%', gap: 2}}>
                    <Typography variant="actionCardHeader">
                        {actionDefinitionDetail.ActionDefinition?.model?.DisplayName}    
                    </Typography>
                    <Typography variant="actionCardSubHeader">
                        {actionDefinitionDetail.ActionDefinition?.model?.ActionGroup||"NA"}
                    </Typography>
                </Box> 
                <IconButton sx={{ display: "flex", alignItems: "center", justifyContent: "center"}} onClick={() => onChangeDialogState()}>
                    <AddIcon />
                </IconButton>
            </Box>
        </StyledAddActionCard>
        </>
    )
}



export default AddActionCard