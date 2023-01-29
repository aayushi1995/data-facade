import { Box, Divider, DividerProps, styled, BoxProps, Card, CardProps, TextField, TextFieldProps } from "@mui/material";
import { lightShadows } from "../../../css/theme/shadows";


export const SelectedActionContainerMainBox = styled(Box)<BoxProps>(({theme}) => ({
    border: "1px solid #66748A", 
    borderRadius: "8px"
}))

export const StyledDividerActionContainer = styled(Divider)<DividerProps>(({theme}) => ({
    width: '100%', border: "1px solid #66748A", borderRadius: "8px"
}))

export const SelectedActionCard = styled(Card)<CardProps & {selected: boolean}>(({theme, selected}) => ( selected ?{
    background: 'linear-gradient(317.7deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 105.18%), #FFFFFF;',
    boxShadow: lightShadows[28],
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxSizing: 'border-box',
    backgroundBlendMode: 'soft-light, normal'
} : {
    background: "#FFFFFF",
    boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1), 0px 0px 1px rgba(0, 0, 0, 0.25)",
    borderRadius: "8px",
}))

export const SelectedActionNameTextField = styled(TextField)<TextFieldProps>(({theme}) => ({
    InputProps: {
        sx: {
            fontFamily: "'Segoe UI'",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "13px",
            lineHeight: "20px",
            color: "#050505"
        },
        underline: false
    },
    
}))