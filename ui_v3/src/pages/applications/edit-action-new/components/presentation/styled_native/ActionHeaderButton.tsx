import styled from "@emotion/styled";
import { Button, ButtonProps } from "@mui/material";
import { ActionRunButtonStyle, ActionSaveButtonStyle, ActionTestButtonStyle } from "../../../style/ActionHeaderStyles";


export const TestButton = styled(Button)<ButtonProps>(({ theme }) => ({
    ...ActionTestButtonStyle
}))

export const SaveButton = styled(Button)<ButtonProps>(({theme})=>({
    ...ActionSaveButtonStyle
}))

export const RunButton = styled(Button)<ButtonProps>(({theme})=>({
    ...ActionRunButtonStyle
}))