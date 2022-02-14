import React from "react";
import {ActionsIcon} from "../../../images/actions_icon";
import {TableIcon} from "../../../images/table_icon";
import {DashboardsIcon} from "../../../images/dashboards_icon";
import {JobsIcon} from "../../../images/jobs_icon";
import {AlertsIcon} from "../../../images/alerts_icon";
import {UsersIcon} from "../../../images/users_icon";
import {isNonProductionEnv} from "../../config/config";
import {DataSourcesIcon} from "../../../images/data_sources_icon";
import AppsIcon from '@mui/icons-material/Apps';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export const icon_dimension = 24
const iconStyles = {height: icon_dimension, width: icon_dimension, verticalAlign: "bottom"};

export const configureItems = [{
    "linkTo": "/customizations",
    "icon": <ActionsIcon/>,
    "name": "Actions"
},
{
    "linkTo": "/users",
    "icon": <UsersIcon/>,
    "name": "Users"
},
{
    "linkTo": "/application",
    "icon": <DashboardsIcon/>,
    "name": "Apps"  
}];
isNonProductionEnv() && configureItems.push({
    "linkTo": "/configurations",
    "icon": <DataSourcesIcon/>,
    "name": "Data Sources"
});
export const manageItems = [
    {
        "linkTo": "/tableBrowser",
        "icon": <TableIcon/>,
        "name": "Data Sets"
    },
    {
        "linkTo": "/dashboard",
        "icon": <DashboardsIcon/>,
        "name": "Reports"
    },
    // {
    //     "linkTo" : "/qualityChecks",
    //     "icon" : <img src = {CheckIcon} style={{height:icon_height, width:icon_height}} alt="Quality checks icon"/>,
    //     "name" : "Data Checks"
    // },
    {
        "linkTo": "/jobs",
        "icon": <JobsIcon/>,
        "name": "Jobs"
    },
    {
        "linkTo": "/alerts",
        "icon": <AlertsIcon/>,
        "name": "Alerts"
    },
    {
        "linkTo": "/tag",
        "icon": <LocalOfferIcon
                     alt="Tags icon"/>,
        "name": "Tags"
    }
]


export const applicationItems = [
    {
        "linkTo": "/autobook/customers",
        "icon": <AppsIcon style={iconStyles}/>,
        "name": "AutoBook"
    },
    {
        "linkTo": "/custom-applications",
        "icon": <AppsIcon style={iconStyles}/>,
        "name": "Custom"
    }
]
export const menuItems = [
    {
        name: "Applications", subItems: applicationItems
    },
    {
        name: "Manage", subItems: manageItems
    },

    {
        name: "Configure", subItems: configureItems
    }
]

export const totalItems = [...manageItems, ...configureItems];