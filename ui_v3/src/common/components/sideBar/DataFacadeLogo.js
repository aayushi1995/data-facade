import {Box} from "@mui/material";
import { ReactComponent as Logo } from "../../../images/DF_icon.svg";
import React from "react";

export function DataFacadeLogo() {
    return <Box sx={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Logo width="auto" height="100%"/>
    </Box>;
}