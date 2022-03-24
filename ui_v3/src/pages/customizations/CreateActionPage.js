import {Box, Grid} from "@mui/material";
import CreateActionDefinition from "./components/CreateActionDefinition";
import React from "react";
import {PageHeader} from "../../common/components/header/PageHeader";

export function CreateActionPage() {
    return <Grid container item xs={12} style={{display: "flex", justifyContent: "flex-start"}} padding={1}>
            <PageHeader pageHeading="Create New Action"/>
        <Grid item xs={12}>
            <Box mx={2} my={1}>
                <CreateActionDefinition />
            </Box>
        </Grid>
    </Grid>;
}
