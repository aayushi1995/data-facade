import { Box, Button, Divider, Typography } from "@mui/material";
import { ActionDefinitionSelectorResponse } from "../../../generated/interfaces/Interfaces";
import AddIcon from '@mui/icons-material/Add';
import DFicon from "../../../images/DF_icon.svg"
import { ACinfoContainer, ActionCardForSelectContainer, ActionSelectorNameTypo, AcTypo1, AcTypo2, DFlogoConatiner, SelectActionButton } from "./styled_native/ActionAddCodeIconBox";
export type ActionDefinitionSelectorRowProps = {
    data: ActionDefinitionSelectorResponse,
    onSelect: () => void
}

function ActionDefinitionSelectorRow(props: ActionDefinitionSelectorRowProps) {
    return (
        <Box sx={{...ActionCardForSelectContainer}}>
            <Box sx={{...DFlogoConatiner}}><img width='45px' height='45px' src={DFicon} alt="" /></Box>    
            <Box sx={{...ActionSelectorNameTypo}}>
                <Typography sx={{...AcTypo1}}>{props?.data?.ActionDisplayName}</Typography>
                <Box sx={{...ACinfoContainer}}>
                    <Typography sx={{...AcTypo2}}>Output Type : <b>{props?.data?.ActionOutputType}</b></Typography> <Divider orientation="vertical"/>
                    <Typography sx={{...AcTypo2}}>Parameters : <b>{props?.data?.ActionParameterCount}</b></Typography><Divider orientation="vertical"/>
                    <Typography sx={{...AcTypo2}}>Run : <b>{props?.data?.ActionRuns}</b></Typography>
                </Box>

            </Box>
            <Box sx={{ml:'auto',my:'auto'}}>
                <Button variant="contained" size='small' sx={{...SelectActionButton}} color='info' onClick={props?.onSelect}><AddIcon sx={{color:'#fff'}}/></Button>
            </Box>
        </Box>
    )
}

export default ActionDefinitionSelectorRow;