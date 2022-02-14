import {Grid} from "@material-ui/core";
import Logo from "../../../images/Monochrome.svg";
import React from "react";

export function DataFacadeLogo() {
    return <Grid item style={{padding: "0.5rem", height: "100%"}}>
        <img src={Logo} style={{maxWidth: "100%", height: "100%", color: "white"}} alt="Data Facade Logo"/>
    </Grid>;
}