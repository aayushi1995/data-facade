import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ListItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { NavLink as RouterLink } from 'react-router-dom';
import { TimestampCell } from "../../data/table_browser/components/AllTableView";
export const RecentLink = (props:{name: string , date: number , to: string})=>{

    return(
        <>
        <RouterLink style={{textDecoration: 'none' , color:'#367BF5'}} to={props.to}>    
            <ListItem sx={{backgroundColor:'white',px:3,py:1,borderBottom:'1px solid gray'}}>
                <Box  sx={{display:'flex', flexDirection:'column',textDecoration:'none'}} >
                    <Typography variant="h6" >{props.name} </Typography>
                    <Typography sx={{color:'#2e2e2e'}} variant="subtitle2">Completed on <TimestampCell timestamp={props.date}/></Typography>
                </Box>
                <Box sx={{display:'flex',ml:'auto'}}>
                    <MoreVertIcon/>
                </Box>
            </ListItem>
    </RouterLink>
</>
    )
}