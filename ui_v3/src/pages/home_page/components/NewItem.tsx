import { Grid , Box, Link, Typography, ListItem, List} from "@mui/material";
import React from "react";
import BottomCardheader from "./BottomCardHeader";
import {HeadeCssOfCard, NewItemLink} from './CSS/CssProperties'

type newItems = {
    displayName : string,
    URL : string
}

export const NewItem = ()=>{

    const AllItems : newItems[]= [
        {displayName:"View our latest release notes",URL:"./"},
        {displayName:'Tips and Tricks',URL:'./'},
        {displayName:'Check our Blog for updates',URL:'./'},
        {displayName:'Webinars',URL:'./'},
        {displayName:'Youtube channel',URL:'./'},
        {displayName:'Community',URL:'./'},
    ]
    const returnLinks = ()=>{
        return AllItems.map(item=><NewItemLink to={item.URL}><ListItem>{item.displayName}</ListItem></NewItemLink>)
    }
    return(
        <Box>
            <BottomCardheader DisplayName="Whats new in the platform"/>
            <Box>
                <List>
                    {returnLinks()}
                </List>
            </Box>
        </Box>
    )
}

export default NewItem;