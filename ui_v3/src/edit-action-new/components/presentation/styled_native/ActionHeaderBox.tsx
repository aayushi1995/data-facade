import { Box, BoxProps, styled } from "@mui/material";
import ActionPublishStatusColor from "../../../../custom_enums/ActionPublishStatusColor";
import { ActionHeaderCardActionAreaStyle, ActionHeaderCardInputAreaStyle, ActionHeaderCardStyle, ActionPublishStatusBoxStyle } from "../../../style/ActionHeaderStyles";


export const ActionHeaderCard = styled(Box)<BoxProps>(({ theme }) => ({
    ...ActionHeaderCardStyle
}))

// TODO: Sort error
export const ActionHeaderCardInputArea = styled(Box)<BoxProps>(({ theme }) => ({
    ...ActionHeaderCardInputAreaStyle
}))

export const ActionHeaderCardActionArea = styled(Box)<BoxProps>(({ theme }) => ({
    ...ActionHeaderCardActionAreaStyle
}))


interface ActionPublishStatusBoxProps extends BoxProps {
    publishStatus?: string;
}

export const ActionPublishStatusBox = styled(Box)<ActionPublishStatusBoxProps>(({ publishStatus, theme }) => ({
    ...ActionPublishStatusBoxStyle,
    background: ActionPublishStatusColor[publishStatus || "NA"] || "#000000"
}))

export const ActionHeaderAutocompleteBox = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex", 
    alignItems: "center", 
    width:'20%'
}))
