import styled from '@emotion/styled';
import { Button, ButtonProps, Card, CardProps, IconButton, IconButtonProps, Typography, TypographyProps } from '@mui/material';
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
    borderRadius: '5px', 
    paddingTop:'10px',
    paddingBottom:'0px', 
    boxSizing: "content-box",
}))

export const StyledTypographyApplicationName = styled(Typography)<TypographyProps>(({theme})=>({
    fontFamily: "SF Pro Text",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "0.8rem",
    color: 'cardHeaderColor.main',
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    justifyContent:'center',
}))

export const StyledTypographyPackageHeader = styled(Typography)<TypographyProps>(({theme})=>({
    fontFamily: "Work Sans",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "1.2rem",
    color: '#687A92',
    justifyContent:'center',
}))

export const StyledTypographyApplicationDescription = styled(Typography)<TypographyProps>(({theme})=>({
    fontFamily: "SF Pro Display",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "0.8rem",
    color: 'cardTextColor.main',
    lineHeight: "133.4%",
    display: "flex",
    paddingBottom:'15px'
}))

export const StyledTypographyApplicationformInfoString = styled(Typography)<TypographyProps>(({theme})=>({
    fontFamily: "SF Pro Display",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "0.8rem",
    color: 'cardInfoColor.main',
}))

export const StyledTypographyApplicationformCreatedOnString = styled(Typography)<TypographyProps>(({theme})=>({
    fontFamily: "SF Pro Text",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "0.8rem",
    lineHeight: "166%",
    letterSpacing: "0.4px",
    color: "cardInfoFormatCreatedOnString.main"
}))

export const StyledTypographyApplicationformCreatedByString = styled(Typography)<TypographyProps>(({theme})=>({
    fontFamily: "SF Pro Text",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "0.8rem",
    lineHeight: "157%",
    letterSpacing: "0.1px",
    color: "cardInfoFormCreatedByStringColor.main"
}))

export const StyledButtonPackageHeader = styled(Button)<ButtonProps>(({theme})=>({
    borderRadius:'5px',
    height:'30px',
    alignSelf:'center',
    color:'#979797'
}))
export const StyledButtonActionCard = styled(Button)<ButtonProps>(({theme})=>({
    color:'#545453'
}))

export const InfoBoxStyle = {
    px:1,
    py:2,
    display:'flex',
    flexDirection:'row' ,
    backgroundColor:"#F0F2F5",
    justifyContent: "space-between"
}

export const ButtonBoxStyle = {
    display: "flex",
    flexDirection: "row",
    gap: 2
}

export const HeadingBoxStyle = {
    display: "flex", 
    flexDirection: "column" ,
}

export const viewButton = {
    ml:'auto',
    height:'30px',
    borderRadius:'5px',
    alignSelf:'center'
}