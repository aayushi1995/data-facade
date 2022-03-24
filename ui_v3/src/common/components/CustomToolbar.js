import {
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton
} from "@mui/x-data-grid";
import {Grid} from "@mui/material";
import React from "react";

export const CustomToolbar = (children) => () => {
    return (
        <GridToolbarContainer>
            <Grid container justifyContent={"space-between"}>
                <Grid item>
                    <GridToolbarColumnsButton/>
                    <GridToolbarFilterButton/>
                    <GridToolbarDensitySelector/>
                    <GridToolbarExport/>
                </Grid>
                <Grid item>
                    {children ? children : null}
                </Grid>
            </Grid>
        </GridToolbarContainer>
    );
}