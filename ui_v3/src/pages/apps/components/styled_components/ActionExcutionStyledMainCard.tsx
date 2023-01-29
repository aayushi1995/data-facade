import { Box, BoxProps, Button, ButtonProps, Card, CardProps, styled } from "@mui/material";



export const ActionExecutionStyledMainCard = styled(Card)<CardProps>(({theme}) => ({
    background: "#FFFFFF",
    boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1), 0px 0px 1px rgba(0, 0, 0, 0.25)"
}))

export const ActionExecutionSubHeaderMainBox = styled(Box)<BoxProps>(({theme}) => ({
    background: '#F0F2F5'
}))

export const ViewActionExecutionResultButton = styled(Button)<ButtonProps>(({theme}) => ({
    background: "#E4E6EB",
    border: "1px solid #3EB9FF",
    borderRadius: "6px",
    '&:hover': {
        backgroundColor: "E4E6EB",
    },
}))