import { Box, Button, Divider, Typography } from "@mui/material";
import { ActionDefinitionSelectorResponse } from "../../../generated/interfaces/Interfaces";
import AddIcon from '@mui/icons-material/Add';
export type ActionDefinitionSelectorRowProps = {
    data: ActionDefinitionSelectorResponse,
    onSelect: () => void
}

function ActionDefinitionSelectorRow(props: ActionDefinitionSelectorRowProps) {
    return (
        <Box sx={{
            display:'flex', 
            flexDirection:'row',
            margin:'auto',
            width:'90%',
            boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5),  4px 6px 16px rgba(163, 177, 198, 0.5)',
            borderRadius:'16px',
            px:2,
            py:1,
            my:1}}>
            <Box sx={{display:'flex', flexDirection:'column'}}>
                <Typography sx={{fontSize:'1.2rem', fontWeight:600}}>{props?.data?.ActionDisplayName}</Typography>
                <Box sx={{display:'flex',flexDirection:'row',gap:1}}>
                    <Typography sx={{fontSize:'0.9rem'}}>Output Type : <b>{props?.data?.ActionOutputType}</b></Typography> <Divider orientation="vertical"/>
                    <Typography sx={{fontSize:'0.9rem'}}>Parameters : <b>{props?.data?.ActionParameterCount}</b></Typography><Divider orientation="vertical"/>
                    <Typography sx={{fontSize:'0.9rem'}}>Run : <b>{props?.data?.ActionRuns}</b></Typography>
                </Box>

            </Box>
            <Box sx={{ml:'auto'}}>
                <Button variant="outlined" size='small' sx={{boxShadow: 'inset -4px -6px 16px #b6fab6, inset 4px 6px 16px #f8fcbb'}} color='success' onClick={props?.onSelect}><AddIcon color='success'/></Button>
            </Box>
        </Box>
    )
}

export default ActionDefinitionSelectorRow;