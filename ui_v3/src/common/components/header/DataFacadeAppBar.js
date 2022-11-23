import React, {useContext} from 'react'
import {Button, Grid} from '@mui/material'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {SearchBar, SearchQueryContext} from "../../../pages/table_browser/TableBrowser";
import AppContext from "../../../utils/AppContext";
import {DataFacadeLogo} from "../sideBar/DataFacadeLogo";
import MenuItem from "@mui/material/MenuItem";
import Logout from "../../../pages/home/components/Logout";
import Menu from "@mui/material/Menu";
import DashboardNavBar from "./DashboardNavbar";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";

export const customizationsSubRoutes = {
    "all-actions": {
        link: "all-actions", displayName: "All"
    },
    "quality-checks": {
        link: "quality-checks", displayName: "Quality Checks",
        ActionType: ActionDefinitionActionType.CHECK
    },
    "quick-stats": {
        link: "quick-stats", displayName: "Quick Stats",
        ActionType: ActionDefinitionActionType.PROFILING
    },
    "transform-and-clean": {
        link: "transform-and-clean", displayName: "Transform & Clean",
        ActionType: ActionDefinitionActionType.CLEANUP_STEP
    },
    "action-instances": {link: "action-instances", displayName: "Action Instances"},
}
export const customerSubRoutes = {
    "files": {
        link: "files", displayName: "Files"
    },
    "workflows": {link: "workflows", displayName: "Workflows"},
    "reports": {link: "reports", displayName: "Reports"},
    "Subsidiary": {link: "subsidiary", displayName: "Subsidiary"},
}
export const configurationsSubRoutes = {
    "create-data-source": {
        link: "create-data-source", displayName: "Create Data Source"
    }
}
// key-value pair to generate static breadcrumbs. How URL will be mapped to display text and link associated with it
const staticUrlMappedToBreadCrumb = {
    "tableBrowser": {
        displayName: "Data Sets",
        link: "tableBrowser"
    },
    "users": {
        displayName: "Users",
        link: "users"
    },
    "dashboard": {
        displayName: "Reports",
        link: "dashboard"
    },
    "configurations": {
        displayName: "Configurations",
        link: "configurations"
    },
    "qualityChecks": {
        displayName: "Quality Checks",
        link: "qualityChecks"
    },
    "quickStats": {
        displayName: "Quick Stats",
        link: "quickStats"
    },
    "customizations": {
        displayName: "Customizations",
        link: "customizations"
    },
    "jobs": {
        displayName: "Jobs",
        link: "jobs"
    },
    "alerts": {
        displayName: "Alerts",
        link: "alerts"
    },
    "tag": {
        displayName: "Tags",
        link: "tag"
    },
    "autobook": {
        displayName: "Autobook",
        link: "autobook/customers"
    },
    "customers": {
        displayName: "Customers",
        link: ""
    }

}

export const decodeURL = (url) => {

    const breadCrumbsToDisplay = []
    const display = []
    const links = []
    let urlSplit = url.split("/")
    urlSplit.shift()
    if (urlSplit.length === 0) return breadCrumbsToDisplay
    urlSplit.forEach((elem) => {

        const staticDynamicCrumb = staticUrlMappedToBreadCrumb[elem];
        if (staticDynamicCrumb) {
            display.push(staticDynamicCrumb?.displayName)
            links.push(staticUrlMappedToBreadCrumb?.[elem]?.link)
        } else {
            display.push(elem)
            links.push(elem)
        }
    })

    let currentURL = ""
    links.forEach((link, index) => {
        currentURL += ("/" + link)
        breadCrumbsToDisplay.push({"displayName": display[index], "url": currentURL})
    })

    return breadCrumbsToDisplay

}


export function useAppBarProps() {
    const [, setSearchQuery] = React.useContext(SearchQueryContext);
    const appcontext = useContext(AppContext);
    return {setSearchQuery, appcontext};
}