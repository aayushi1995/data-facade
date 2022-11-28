import { Grid , Box, Link, Typography, ListItem, List} from "@mui/material";
import React from "react";
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { generatePath, useHistory } from "react-router"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {HeadeCssOfCard} from './CSS/CssProperties'
import useApplicationRunsByMe, { Run } from '../../../../src/pages/apps/components/UseApplicationRunsByMe'
import { Application } from '../../../../src/generated/entities/Entities'
import { TimestampCell } from "../../table_browser/components/AllTableView";
import { RecentLink } from "./RecentLink";
import BottomCardheader from "./BottomCardHeader";


export type ApplicationRunsByMeProps = {
    application?: Application,
    fetchAll?: boolean
}



export const Recents = (props: ApplicationRunsByMeProps)=>{ 

    const {application} = props
    const { fetchDataQuery, displayActionOutput, displayWorkflowOutput, reRunWorkflow, reRunAction } = useApplicationRunsByMe({ application: application, fetchAll: props.fetchAll })
    const history = useHistory()
    const rows = fetchDataQuery?.data || []
    const rows5 =rows.slice(0, 5);
    const listitems =()=>{
        
        return rows5.map(row =>
            <RecentLink to={`./application/${row.isWorkflow?'edit-workflow':'edit-action'}/${row?.ActionDefinitionId}`} name={row?.ActionInstanceName || ""} date={row?.ActionExecutionCompletedOn || 1}/>
        )
    }

    return(
        <Box>
            <BottomCardheader DisplayName="Recents"/>
            <Box>
                <List>
                    {listitems()}
                </List>
            </Box>
        </Box>
    )
}

export default Recents;