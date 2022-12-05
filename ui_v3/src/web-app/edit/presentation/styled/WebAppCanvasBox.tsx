import { styled } from "@mui/styles";
import { Box, BoxProps } from "@mui/system";


export const WebAppCanvasBox = styled(Box)<BoxProps>(({ theme }) => ({
    backgroundColor: 'lightgrey' ,
    marginBottom: 2,
    overflow: 'scroll'
}))