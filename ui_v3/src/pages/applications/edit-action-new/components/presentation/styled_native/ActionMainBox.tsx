import { Box, BoxProps, styled } from "@mui/material";
import { ActionMainBoxStyle, CardBoxRootStyle, TemplateParentBoxStyle } from "../../../style/ActionMainStyles";


export const ActionMainBox = styled(Box)<BoxProps>(({ theme }) => ({
    ...ActionMainBoxStyle
}))

export const CardBoxRoot = styled(Box)<BoxProps>(({ theme }) => ({
    ...CardBoxRootStyle,
    padding: theme.spacing(1)
}))

export const TemplateSelectorParentBox = styled(Box)<BoxProps>(({ theme }) => ({
    ...TemplateParentBoxStyle
}))