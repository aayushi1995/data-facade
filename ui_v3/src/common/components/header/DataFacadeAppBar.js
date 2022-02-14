import React, {useContext} from 'react'
import {Button, Grid} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {SearchBar, SearchQueryContext} from "../../../pages/table_browser/TableBrowser";
import AppContext from "../../../utils/AppContext";
import {DataFacadeLogo} from "../sideBar/DataFacadeLogo";
import MenuItem from "@material-ui/core/MenuItem";
import Logout from "../../../pages/home/components/Logout";
import Menu from "@material-ui/core/Menu";
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

const DataFacadeAppBar = () => {


    // props.url   /a/b/c
    //props.path // /x/:y/:z

    const {setSearchQuery, appcontext} = useAppBarProps();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (<AppBar position="fixed" style={{height: 64}}>
            <Toolbar color="primary">
                <Grid container item xs={12} style={{height: "100%"}}>
                    <Grid item xs={1} style={{
                        display: "flex", alignItems: "center", justifyContent: "center", height: "100%"
                    }}>
                        <DataFacadeLogo/>
                    </Grid>
                    <Grid style={{
                        display: 'flex',
                        flexGrow: 2
                    }}>
                        <Grid item style={{
                            display: 'flex',
                            flexGrow: 2,
                            maxWidth: "700px"
                        }}>
                            <SearchBar searchQueryHandler={(event) => {
                                const value = event?.target?.value;
                                value && setSearchQuery(value);
                            }}/>
                        </Grid>
                    </Grid>
                    <Button
                        id="basic-button"
                        aria-controls="demo-positioned-menu"
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        variant="outlined"
                    >
                        <Grid style={{display: "flex", textTransform: "capitalize"}} justify="center"
                              alignItems="center"
                        >
                            {appcontext?.workspaceName}
                        </Grid>
                    </Button>
                    <Menu
                        id="basic-menu"
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}><Logout/></MenuItem>
                    </Menu>
                </Grid>
            </Toolbar>
        </AppBar>
    )

}

//export default DataFacadeAppBar

export default DashboardNavBar