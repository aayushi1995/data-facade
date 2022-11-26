import { styled, Typography, TypographyProps } from "@mui/material";
import { ActionParameterConfiguratorHeaderStyle, ActiveParmaeterConfiguratorLabelStyle } from "../../../style/ActiveParameterConfiguratorStyles";


export const ActiveParameterConfiguratorLabelTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    ...ActiveParmaeterConfiguratorLabelStyle
}))

export const ActiveParameterConfiguratorHeaderTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    ...ActionParameterConfiguratorHeaderStyle
}))