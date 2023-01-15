
import { Box} from "@mui/material";
import { NavLink as RouterLink } from 'react-router-dom';
import {TypographyVh , TypographyVsh } from './CSS/CssProperties'

export const ItemCards = (props:{header: string,subHeader: string, imgURL: string, toLink: string})=>{

    return(
        
        <Box>
            <Box sx={{ width:'10vw',height:'20vh',mx:'auto'}}>
                <img width="100%" src={props.imgURL}/>
            </Box>
            <Box sx={{textAlign:'center'}}>
                <RouterLink to={props.toLink} style={{textDecoration:'none'}}><TypographyVh>{props.header}</TypographyVh></RouterLink>
                <TypographyVsh>{props.subHeader}</TypographyVsh>
            </Box>
        </Box>
    )
}

export default ItemCards;