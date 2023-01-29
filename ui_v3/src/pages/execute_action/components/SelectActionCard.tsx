import { Box, IconButton, TextField, Typography } from "@mui/material"
import { ActionInstance } from "../../../generated/entities/Entities"
import { SelectedActionCard, SelectedActionNameTextField } from "../styled_components/SelectedActionContainerManBox"
import selectGrid from "../../../../src/images/select_icon.png"
import useSelectActionCard from "../hooks/useSelectActionCard"
import Close from "@mui/icons-material/Close"
import CloseIcon from "../../../../src/images/delete_workflow_action.png"

export interface SelectedActionCardProps {
    handlers: {
        onActionClick: (actionIndex: number) => void,
        onNameChange: (newName: string, actionIndex: number) => void,
        onActionDelete: (actionIndex: number) => void
    },
    actionDetails: ActionInstance,
    actionIndex: number,
    selectedActionIndex?: number
}

const SelectActionCard = (props: SelectedActionCardProps) => {

    const {actionDetails, actionIndex, selectedActionIndex} = props

    const {
        handleActionClick, 
        handleNameChange,
        handleActionDelete
    } = useSelectActionCard(props)

    const getInputProps = {
        fontFamily: "'Segoe UI'",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "17px",
        lineHeight: "20px",
        color: "#050505"
    }

    return (
        <SelectedActionCard selected={actionIndex === selectedActionIndex} sx={{width: '100%', p: 2}}>
            
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', p: 1, gap: 2}}>
                <IconButton onClick={handleActionClick}>
                    <img src={selectGrid} style={{cursor: 'pointer'}} alt="select" ></img>
                </IconButton>
                <TextField
                    value={actionDetails.Name}  
                    variant="standard" 
                    fullWidth 
                    onChange={handleNameChange}
                    InputProps={{
                        sx: {
                            ...getInputProps
                        },
                        disableUnderline: true
                    }
                }/>
                <Box sx={{width: '100%', display: 'flex', height: '100%', justifyContent: 'flex-end', alignItems: 'flex-start'}}>
                    <IconButton onClick={handleActionDelete}>
                        <img src={CloseIcon} />
                    </IconButton>
                </Box>
            </Box>
        </SelectedActionCard>
    )
}

export default SelectActionCard