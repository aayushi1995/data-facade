import React from "react";
import { Grid, Card } from "@material-ui/core";
import { Link } from "@material-ui/core";
import { Link as ReactRouter } from "react-router-dom";

export const WorkflowMeta = ({ tableMeta }) => {
    const FullSyncedOn = tableMeta?.Table?.FullSyncedOn;
    const tableDisplayName = tableMeta?.Table?.DisplayName;
    const tableUniqueName = tableMeta?.Table?.UniqueName;
    const Owner = tableMeta?.Table?.Owner;
    const CreatedBy = tableMeta?.Table?.CreatedBy;
    const WorkflowDisplayName = tableMeta?.Table?.WorkflowDisplayName;
    return tableMeta?.Table ? (
        <Card style={{ padding: 10 }}>
            <Grid item>
                {WorkflowDisplayName && <Grid container xs={12}>
                    <Grid item xs={6}>
                        Workflow
                    </Grid>
                    <Grid item xs={6}>
                        {WorkflowDisplayName}
                    </Grid>
                </Grid>}
                {tableUniqueName && <Grid container xs={12}>
                    <Grid item xs={6}>
                        Data Set
                    </Grid>
                    <Grid item xs={6}>
                        <Link component={ReactRouter} to={`/tableBrowser/${tableUniqueName}`}>{tableDisplayName}</Link>
                    </Grid>
                </Grid>}
                {Owner && <Grid container xs={12}>
                    <Grid item xs={6}>
                        Owner
                </Grid>
                    <Grid item xs={6}>
                        <Link href={`mailto:${Owner}?subject=Query related to workflow execution`}> {Owner}</Link>
                    </Grid>
                </Grid>}
                {CreatedBy && <Grid container xs={12}>
                    <Grid item xs={6}>
                        Created By
                </Grid>
                    <Grid item xs={6}>
                        <Link href={`mailto:${CreatedBy}?subject=Query related to workflow execution`}> {CreatedBy}</Link>
                    </Grid>
                </Grid>}
                {FullSyncedOn && <Grid container xs={12}>
                    <Grid item xs={6}>
                        Full Synced On
            </Grid>
                    <Grid item xs={6}>
                        {new Date(FullSyncedOn).toUTCString()}
                    </Grid>
                </Grid>}
            </Grid>
        </Card>) : null;
};
