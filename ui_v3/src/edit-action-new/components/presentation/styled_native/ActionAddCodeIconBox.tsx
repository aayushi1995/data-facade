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
    width: '90%',
    margin: 'auto',
    marginBottom: '8px',
    backgroundColor: 'allTableTextfieldbgColor1.main',
    boxSizing: 'border-box',
    boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5), inset 4px 6px 16px rgba(163, 177, 198, 0.5);',
    backgroundBlendMode: 'soft-light, normal',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '50px'
}))