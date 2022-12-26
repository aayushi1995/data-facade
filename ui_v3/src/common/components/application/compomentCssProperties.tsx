import styled from '@emotion/styled';
import { Card, CardProps, IconButton, IconButtonProps, Typography, TypographyProps } from '@mui/material';
import { lightShadows } from '../../../css/theme/shadows';

export function getIconSxProperties() {
    return {
        height: "100%",
        width: "100%",
        backgroundColor: "cardIconButtonBackgroundColor.main",
        boxShadow: lightShadows[32],
        "&:hover": {
            backgroundColor: "cardIconBtn1HoverBgColor.main",
            color: "cardIconBtn1HoverColor.main"
        }
    };
}


export const StyledCardIcon = styled(IconButton)<IconButtonProps>(({ theme}) => ({
    height: "100%",
    width: "100%",
    backgroundColor: "cardIconButtonBackgroundColor.main",
    boxShadow: lightShadows[32],
    "&:hover": {
        backgroundColor: "cardIconBtn1HoverBgColor.main",
            color: "cardIconBtn1HoverColor.main"
        }
}))

export const StyledApplicationCard = styled(Card)<CardProps>(({theme})=>({
    width: "100%", 
    height: "130px",
    borderRadius: '10px', 
    paddingLeft: '8px',
    paddingRight:'8px',
    paddingTop:'0px',
    paddingBottom:'0px', 
    boxSizing: "content-box",
    border: "0.439891px solid #FFFFFF",
    boxShadow: "0px 8.5956px 10.3934px rgba(54, 48, 116, 0.3)",
}))

export const StyledTypographyApplicationName = styled(Typography)<TypographyProps>(({theme})=>({
    fontFamily: "SF Pro Text",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "18px",
    color: 'cardHeaderColor.main',
    lineHeight: "266%",
    letterSpacing: "0.5px",
    textTransform: "uppercase"
}))

export const StyledTypographyApplicationDescription = styled(Typography)<TypographyProps>(({theme})=>({
    fontFamily: "SF Pro Display",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    color: 'cardTextColor.main',
    lineHeight: "133.4%",
    display: "flex",
}))

export const StyledTypographyApplicationformInfoString = styled(Typography)<TypographyProps>(({theme})=>({
    fontFamily: "SF Pro Display",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "16px",
    color: 'cardInfoColor.main',
    textAlign: 'center'
}))

export const StyledTypographyApplicationformCreatedOnString = styled(Typography)<TypographyProps>(({theme})=>({
    fontFamily: "SF Pro Text",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "13px",
    textAlign: 'center',
    marginTop: '8px',
    lineHeight: "166%",
    letterSpacing: "0.4px",
    color: "cardInfoFormatCreatedOnString.main"
}))

export const StyledTypographyApplicationformCreatedByString = styled(Typography)<TypographyProps>(({theme})=>({
    fontFamily: "SF Pro Text",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "10px",
    lineHeight: "157%",
    letterSpacing: "0.1px",
    color: "cardInfoFormCreatedByStringColor.main"
}))