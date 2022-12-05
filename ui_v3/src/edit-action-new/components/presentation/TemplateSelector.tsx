import { Box, Typography } from "@mui/material";
import { TemplateSelectorParentBox } from "./styled_native/ActionMainBox";
import pythonLogo from "../../../../src/images/python.svg";
import sqlLogo from "../../../../src/images/SQL.svg"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
export type TemplateLanguageBoxProps = {
    name?: string,
    description?: string,
    onClick?: () => void
}

function TemplateSelector(props: TemplateLanguageBoxProps) {
    const { name, description, onClick } = props
    return (
        <TemplateSelectorParentBox sx={{ display: "flex", flexDirection: "column", gap: 2 , alignItems: "center"}} onClick={props?.onClick}>
            <Box sx={{height:'80px',p:2}}>
              <img width='50px' src={name=="SQL"?sqlLogo:pythonLogo} alt="" />  
            </Box>
            <Box>
                <Typography sx={{color:"black",fontSize:'1.2rem',fontWeight:600}}>{name=="SQL"?"SQL Action":"Python cell"}</Typography>
            </Box>
            <Box>
                <Typography>{description}</Typography>
            </Box>
            <Box sx={{width:'100%',borderTop:'1px solid #d4d5d6',textAlign:'center',gap:2,display:'flex',flexDirection:'row',justifyContent:'center',py:1}}>
                <AddCircleOutlineIcon color='success' /> <Typography>Add</Typography>
            </Box>
        </TemplateSelectorParentBox>
    )
}

export default TemplateSelector;