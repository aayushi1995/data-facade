import React from 'react';
import {Dialog, Divider, Grid, Tab, Tabs} from '@mui/material'
import { makeStyles } from '@mui/styles';
import {Redirect, Route, Switch, useHistory, useRouteMatch, withRouter} from 'react-router-dom'
import ActionInstances from './components/ActionInstances'
import AllActions from "./components/AllActions";
import {PageHeader} from "../../common/components/header/PageHeader";
import {useCustomizationToolBarButtonsBehaviour} from "./UseCustomizationToolBarButtons";
import * as PropTypes from "prop-types";
import {customizationsSubRoutes} from "../../common/components/header/DataFacadeAppBar";
import {CreateActionPage} from "./CreateActionPage";
import {RunActionPage} from "./RunActionPage";

const locationParam = ':customizationsFilter';


const useStyles = makeStyles(() => ({
    dialogPaper: {
        minHeight: '60vh',
        maxHeight: '70vh',
        minWidth: 1100
    },
}));


const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const customizationURLSlugObjects = Object.values(customizationsSubRoutes);

function CustomisationTabPanels(props) {
    const value = props.value;
    return <Grid item xs={12} sx={{mt: 3}}>
        {value === customizationURLSlugObjects[4].link ? <ActionInstances/> : <AllActions/>}
    </Grid>;
}

CustomisationTabPanels.propTypes = {
    value: PropTypes.any,
    location: PropTypes.any
};

CreateActionPage.propTypes = {onClick: PropTypes.func};

RunActionPage.propTypes = {onClick: PropTypes.func};
const CustomizationsInternal = () => {
    const match = useRouteMatch()
    const classes = useStyles()
    const history = useHistory();
    const {
        dialogState,
        createActionInstanceDialog,
        handleDialogClose,
        handleCreateActionInstanceClose
    } = useCustomizationToolBarButtonsBehaviour();
    const value = match.params.customizationsFilter;

    const onClickHandler = (index) => () => history.replace(`${match.path.replace(locationParam, customizationURLSlugObjects[index].link)}`);
    return (
        <React.Fragment>
            <Grid container spacing={0} style={{marginTop: 0, marginBottom: 0}}>
                <Grid item xs={12}>
                    <PageHeader/>
                </Grid>
                <Grid item style={{marginBottom: 5}}>
                    <Tabs
                        variant="scrollable"
                        value={customizationURLSlugObjects.findIndex(v => v.link === value)}
                    >
                        <Tab label="All"
                             onClick={onClickHandler(0)}
                             {...a11yProps(0)}
                        />
                        <Tab label="Quality Checks"
                             onClick={onClickHandler(1)}
                             {...a11yProps(1)}
                        />
                        <Tab label="Quick Stats"
                             onClick={onClickHandler(2)}
                             {...a11yProps(2)} />
                        {/* <Tab label="Transform & Clean"
                             onClick={onClickHandler(3)}
                             {...a11yProps(3)} /> */}
                        <Tab label="Action Instances" {...a11yProps(4)}
                             onClick={onClickHandler(4)}
                        />
                    </Tabs>
                    <Divider/>
                </Grid>
                <Switch>
                    <CustomisationTabPanels value={value}/>
                </Switch>
            </Grid>
            <Dialog onClose={handleDialogClose} open={dialogState} fullWidth classes={{paper: classes.dialogPaper}}
                    scroll="paper">
                <CreateActionPage onClick={handleDialogClose}/>
            </Dialog>
            <Dialog onClose={handleCreateActionInstanceClose} open={createActionInstanceDialog} fullWidth
                    classes={{paper: classes.dialogPaper}} scroll="paper">
                <RunActionPage onClick={handleCreateActionInstanceClose}/>
            </Dialog>

        </React.Fragment>
    )
}

const Customizations = withRouter(function CustomizationsRoutes() {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}/${locationParam}`} component={CustomizationsInternal}/>
            <Redirect to={`${match.path}/${customizationURLSlugObjects[0].link}`} component={CustomizationsInternal}/>
        </Switch>
    )
});
export default Customizations;
