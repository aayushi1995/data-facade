import { Box, Typography, IconButton, Dialog, DialogContent, TextField, Button, Card, CardHeader, DialogTitle } from "@mui/material";
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces";
import AddIcon from '@mui/icons-material/Add';
import useAddActionCard from "../hooks/useAddActionCard";
import { getDialogTitile } from "./ComponentsTray";

const AddActionCard = ({ actionDefinitionDetail, handleAdd }: { actionDefinitionDetail: ActionDefinitionDetail, handleAdd: (ActionDefinitionDetail: ActionDefinitionDetail, referenceName: string | undefined) => void }) => {

    const { onChangeDialogState, onReferenceNameChange, actionReferenceName, actionReferenceNameDialogState } = useAddActionCard()

    const renderTitle = (title: string | undefined) => <Typography style={{ fontSize: 14, fontWeight: 500 }}>{title}</Typography>

    return (
        <>
            <Dialog maxWidth="md" fullWidth open={actionReferenceNameDialogState} onClose={onChangeDialogState} title="Unique Action reference">
                <DialogTitle id="alert-dialog-title">
                    {"Unique Action reference"}
                </DialogTitle>

                <DialogContent>

                    <TextField value={actionReferenceName} onChange={onReferenceNameChange} fullWidth label="Unique Action reference" sx={{ mt: 2 }} />
                    <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => handleAdd(actionDefinitionDetail, actionReferenceName)}>
                        Add
                    </Button>

                </DialogContent>
            </Dialog>
            <Card>
                <CardHeader
                    action={
                        <IconButton aria-label="settings" onClick={() => onChangeDialogState()}>
                            <AddIcon />
                        </IconButton>
                    }
                    title={renderTitle(actionDefinitionDetail.ActionDefinition?.model?.DisplayName)}
                    subheader={actionDefinitionDetail.ActionDefinition?.model?.ActionGroup || "NA"}
                    subheaderTypographyProps={{ fontSize: 12 }}
                />

            </Card>
        </>
    )
}



export default AddActionCard