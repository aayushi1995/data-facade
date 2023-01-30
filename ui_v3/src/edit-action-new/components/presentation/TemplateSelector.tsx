import { Box, Typography } from "@mui/material";
import { TemplateSelectorParentBox } from "./styled_native/ActionMainBox";
import pythonLogo from "../../../../src/images/PYTHON_COLOR_ICON 2.svg";
import sqlLogo from "../../../../src/images/sqlCardNew.svg"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import { TamplateSelectorBox, TamplateSelectorDFlogoConatiner, TamplateSelectorText } from "../../style/CreateActionStyle";
export type TemplateLanguageBoxProps = {
    name?: string,
    description?: string,
    onClick?: () => void
}

function TemplateSelector(props: TemplateLanguageBoxProps) {
    const { name, description, onClick } = props
    return (
        <TemplateSelectorParentBox sx={{...TamplateSelectorBox}} onClick={props?.onClick}>
            <Box sx={{...TamplateSelectorDFlogoConatiner}}>
              <img width={name=="SQL"?25:18} src={name=="SQL"?sqlLogo:pythonLogo} alt="" />  
            </Box>
            <AddIcon sx={{color:'#fff'}}/>
            <Box>
                <Typography sx={{...TamplateSelectorText}}>{name=="SQL"?"SQL Action":"Python Action"}</Typography>
            </Box>
        </TemplateSelectorParentBox>
    )
}

export default TemplateSelector;