import AddIcon from '@mui/icons-material/Add';
import { Box, Typography } from "@mui/material";
import pythonLogo from "../../../../../../src/assets/images/PYTHON_COLOR_ICON 2.svg";
import sqlLogo from "../../../../../../src/assets/images/sqlCardNew.svg";
import { TamplateSelectorBox, TamplateSelectorDFlogoConatiner, TamplateSelectorText } from "../../style/CreateActionStyle";
import { TemplateSelectorParentBox } from "./styled_native/ActionMainBox";
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