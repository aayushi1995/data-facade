import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'
import {Grid, Tab, Tabs} from '@material-ui/core'
import Checks from './components/Checks'
import QuickStatsNewTemp from './components/QuickStatsNewTemp'
import {PageHeader} from "../../common/components/header/PageHeader";


const TabPanel = (props) => {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >

            {value === index && (
                <>{children}</>
            )}
        </div>
    );
}

const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ColumnDetailsView = () => {
    const [tabState, setTabState] = React.useState(0)
    const match = useRouteMatch()
    const handleTabChange = (event, newValue) => {
        setTabState(newValue)
    }

    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <Tabs onChange={handleTabChange} value={tabState}>
                        <Tab label="Quick stats" {...a11yProps(0)}/>
                        <Tab label="Checks" {...a11yProps(1)}/>
                    </Tabs>
                </Grid>
                <Grid item xs={12}>
                    <TabPanel value={tabState} index={0}>
                        <QuickStatsNewTemp columnUniqueName={match.params.columnUniqueName}/>
                    </TabPanel>
                    <TabPanel value={tabState} index={1}>
                        <Checks columnUniqueName={match.params.columnUniqueName}/>
                    </TabPanel>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

const ColumnDetails = (props) => {
    let match = useRouteMatch()
    return (
        <Switch>
            <Route path={`${match.path}`}><ColumnDetailsView/> </Route>
        </Switch>
    )
}

export default ColumnDetails