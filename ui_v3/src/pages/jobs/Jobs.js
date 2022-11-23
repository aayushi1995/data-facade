import React from 'react';
import {Divider, Grid, Tab, Tabs} from '@mui/material'
import {Route, Switch, useLocation, useRouteMatch, withRouter} from 'react-router-dom'
import {JobsFiltered} from './components/JobsFiltered'
import {PageHeader} from "../../common/components/header/PageHeader";
import { SetModuleContextState } from "../../common/components/ModuleContext";
import JobsRowJobDetail from "./components/JobsRowJobDetail";


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


const _Jobs = (props) => {
    const mytabstate = props?.location?.state?.tabIndex ?? 0
    const [tabState, setTabState] = React.useState(mytabstate)
    const location = useLocation();
    const searchValue = location?.state?.search || ""
    const filter = location?.state?.filter


    const match = useRouteMatch()

    const handleTabChange = (event, newValue) => {
        setTabState(newValue)
    }

    return (
        <React.Fragment>
            <Grid container spacing={2} style={{marginTop: 0, marginBottom: 0}}>
                <Grid item xs={12} style={{
                    marginBottom: 5
                }}>
                    <Tabs onChange={handleTabChange} variant="scrollable" value={tabState}>
                        <Tab label="All" {...a11yProps(0)} />
                        <Tab label="Completed" {...a11yProps(1)} />
                        <Tab label="Created" {...a11yProps(2)} />
                        <Tab label="Started" {...a11yProps(3)} />
                        <Tab label="Waiting for upstream" {...a11yProps(4)} />
                        <Tab label="Failed" {...a11yProps(5)} />
                        <Tab label="Running Workflow" {...a11yProps(6)} />
                    </Tabs>
                    <Divider/>
                </Grid>
                <Grid item xs={12}>
                    <TabPanel value={tabState} index={0}>
                        <JobsFiltered location={props.location} actionProperties={{
                            "filter": {

                            }
                        }}/>
                    </TabPanel>
                    <TabPanel value={tabState} index={1}>
                        <JobsFiltered actionProperties={{
                            "filter": {"Status": "Completed"}
                        }}/>
                    </TabPanel>
                    <TabPanel value={tabState} index={2}>
                        <JobsFiltered actionProperties={{
                            "filter": {"Status": "Created"}
                        }}/>
                    </TabPanel>
                    <TabPanel value={tabState} index={3}>
                        <JobsFiltered actionProperties={{
                            "filter": {"Status": "Started"}
                        }}/>
                    </TabPanel>
                    <TabPanel value={tabState} index={4}>
                        <JobsFiltered actionProperties={{
                            "filter": {"Status": "WaitingForUpstream"}
                        }}/>
                    </TabPanel>
                    <TabPanel value={tabState} index={5}>
                        <JobsFiltered actionProperties={{
                            "filter": {"Status": "Failed"}
                        }}/>
                    </TabPanel>
                    <TabPanel value={tabState} index={6}>
                        <JobsFiltered actionProperties={{
                            "filter": {"Status": "WorkflowRunning"}
                        }}/>
                    </TabPanel>
                </Grid>
            </Grid>
        </React.Fragment>
    )

}
const Jobs = withRouter(function JobsRoutes() {
    const setModuleContext = React.useContext(SetModuleContextState)

    React.useEffect(() => {
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: "Jobs and Logs",
                    SubTitle: "All Your jobs are listed here"
                }
            }
        })
    }, [])
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}/:actionExecutionId`} component={JobsRowJobDetail}/>
            <Route path="/application/jobs" component={_Jobs}/>
        </Switch>
    )
});

export default Jobs;
