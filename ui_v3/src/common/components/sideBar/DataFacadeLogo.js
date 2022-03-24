import {Grid} from "@mui/material";
import Logo from "../../../images/DF_icon.svg";
import React from "react";

export function DataFacadeLogo() {
    return <Grid item style={{padding: "0.5rem", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
        <img src={Logo} style={{transform: 'scale(0.6)'}} alt="Data Facade Logo"/>
    </Grid>;
}