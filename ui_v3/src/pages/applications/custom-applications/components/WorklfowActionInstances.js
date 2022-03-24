import React from 'react'
import {Route, Switch, useRouteMatch, withRouter} from 'react-router-dom';
import { PageHeader } from '../../../../common/components/header/PageHeader';
import dataManager, { useRetreiveData } from '../../../../data_manager/data_manager';
import {Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from '@mui/material'
import { Card, Box } from "@mui/material";
import { TableWrapper } from '../../../../common/components/TableWrapper';
import { ActionExecutionSection } from './ActionExecutionSection';
import { WorkflowList } from './WorkflowList';
import NoData from '../../../../common/components/NoData';
import { WorkflowMeta } from "./WorkflowMeta";
import LoadingIndicator from '../../../../common/components/LoadingIndicator';
import { useMutation } from 'react-query';
import { func } from 'prop-types';
import { List, ListItemButton , ListItem } from '@mui/material';


const WorkflowActionInstances = (props) => {
    const config = props?.actionInstances


    return (
        <List>
            {
                config?.map(actionInstanceWithParameters => {
                    <ListItem>
                        {actionInstanceWithParameters.model.DisplayName}
                    </ListItem>
                })
            }
        </List>
    )

}

export default WorkflowActionInstances