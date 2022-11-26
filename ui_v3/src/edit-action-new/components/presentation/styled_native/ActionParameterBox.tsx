import { Box, BoxProps, styled } from "@mui/material";
import { CardBoxStyle } from "../../../style/ActionParameterStyles";


export const ActionParameterCardBox = styled(Box)<BoxProps>(({ theme }) => ({
    ...CardBoxStyle
}))
