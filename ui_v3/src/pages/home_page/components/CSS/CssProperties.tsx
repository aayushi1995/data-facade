import styled from "@emotion/styled"
import { Typography } from "@mui/material"
import { Box, BoxProps, TypographyProps } from "@mui/system"
import { NavLink, NavLinkProps } from "react-router-dom"

export function searchCSSproperty(){
    return{
        width: '100%', 
        backgroundColor: 'allTableTextfieldbgColor1.main',
        boxSizing: 'border-box', 
        boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5), inset 4px 6px 16px rgba(163, 177, 198, 0.5);',
        backgroundBlendMode: 'soft-light, normal', 
        borderRadius: '10px',
        py:2,
        mt:3,
        display: 'flex', 
        justifyContent: 'center', 
        minHeight: '50px'
    }
};

export const TypographyVh = styled(Typography)<TypographyProps>(({ theme}) => ({
    
    color:'#367BF5', 
    fontWeight:'700'
    
}))



export const TypographyVsh = styled(Typography)<TypographyProps>(({ theme}) => ({
    paddingLeft:'3vw', 
    paddingRight:'3vw',
    color:'#727D8B', 
    fontWeight:'400',
    fontSize:'0.9rem'
}))
export const HeadeCssOfCard = styled(Box)<BoxProps>(({theme}) => ({

    width:'100%',
    backgroundColor:'#A4CAF0',
    padding:'2vh',
    fontSize:'1.3rem',
    fontWeight:'700',
    borderRadius:'5px'

}));

export const NewItemLink = styled(NavLink)<NavLinkProps>(({theme}) =>({
    textDecoration: 'none' , 
    color:'#367BF5'
}));

export const TypographyForCommon = styled(Typography)<TypographyProps>(({theme}) =>({
    marginRight:'1vw', 
    color:'#2d2f30', 
    fontWeight:600,
    "&:hover":{
        color:'#069697'
    }
}));