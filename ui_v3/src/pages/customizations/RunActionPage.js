import {Box, Grid} from "@material-ui/core";
import CreateActionInstanceForm from "../../common/components/CreateActionInstanceForm";
import React from "react";
import {PageHeader} from "../../common/components/header/PageHeader";
import { useHistory } from "react-router-dom";

export function RunActionPage(props) {
    let history = useHistory();
    return <Box style={{width: "100%"}}>
        <Grid container item xs={12} style={{display: "flex", justifyContent: "flex-start"}} padding={1}>
            <PageHeader pageHeading="Run Action"/>
            <Grid item xs={12}>
                <Box mx={1} style={{width: "100%"}}>
                    <CreateActionInstanceForm onCloseDialog={()=>{history.goBack()}} actionDefinitionId = {props?.location?.state?.actionDefinitionId} actionType = {props?.location?.state?.actionType}/>
                </Box>
            </Grid>
        </Grid>
    </Box>;
}
