import { styled, Typography, TypographyProps } from "@mui/material";
import { ActionHeaderActionDescriptionLabelStyle, ActionHeaderActionVisibilityStyle, ActionHeaderLanguageTextStyle } from "../../../style/ActionHeaderStyles";


export const ActionHeaderActionDescriptionLabelTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    ...ActionHeaderActionDescriptionLabelStyle
}))

export const ActionHeaderActionVisibilityTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    ...ActionHeaderActionVisibilityStyle
}))

export const ActionHeaderLanguageTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    ...ActionHeaderLanguageTextStyle
}))

