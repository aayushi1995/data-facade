import styled from "@emotion/styled";
import { TextField, TextFieldProps } from "@mui/material";
import { Box, BoxProps } from "@mui/system";

export const CodeIconBox = styled(Box)<BoxProps>(({ theme }) => ({
    border:'1px solid black',
    borderRadius:'50%',
    width:'30px',
    height:'30px',
    margin:'auto'
}))

export const SearchBarTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    width: '100%',
    margin: 'auto',
    marginBottom: '8px',
    backgroundColor: '#EBF1FA',
    boxSizing: 'border-box',
    boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5), inset 4px 6px 16px rgba(163, 177, 198, 0.5)',
    backgroundBlendMode: 'soft-light, normal',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '50px'
}))
export const ActionSelectorContainer = {
    m: 'auto', 
    width: '40vw', 
    my: 4 
}
export const DefinationSelectorHeader = {
    textAlign:'center',
    fontSize:'1.2rem',
    py:1
}

export const ActionContainer = {
    px:1,
    py:0.5,
    height: '33vh',
    backgroundColor:'#EBF1FA',
    boxShadow:'0px 2px 2px rgba(54, 48, 116, 0.3)',
    borderRadius:'8px',
    mt:1
}
export const ActionCardForSelectContainer = {
    display: 'flex',
    flexDirection: 'row',
    margin: 'auto',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    px: 2,
    py: 1,
    my: 1
}
export const DFlogoConatiner = {
    display:'flex',
    float:'left',
    mt:1,
    pr:2
}
export const ActionSelectorNameTypo = {
    display:'flex', 
    flexDirection:'column'
}
export const AcTypo1 = {
    fontSize:'1rem', 
    fontWeight:400,
}
export const AcTypo2 = {
    fontSize:'0.8rem'
}
export const ACinfoContainer = {
    display:'flex',
    flexDirection:'row',
    gap:1
}
export const SelectActionButton = {
    backgroundColor:'#007DFA',
    borderRadius:'5px'
}