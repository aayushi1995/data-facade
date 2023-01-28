import { styled } from "@mui/styles";
import { Box, BoxProps } from "@mui/system";
import AppBackground from '../../../../assets/images/app_background.png'


export const WebAppCanvasBox = styled(Box)<BoxProps>(({ theme }) => ({
    marginBottom: 2,
    overflow: 'scroll',
    backgroundImage:`url(${AppBackground})`,
    minHeight:'50vh',
    backgroundRepeat: 'space',
    backgroundRepeatY: "repeat",
    opacity: '0.7'
}))