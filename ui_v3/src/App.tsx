import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { Box, CssBaseline, Grid, ThemeProvider } from "@mui/material"
import React from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import ErrorBoundary from "./common/components/ErrorBoundry"
import DashboardNavbar from "./common/components/header/DashboardNavbar"
import { ModuleSwitcher } from "./common/components/header/ModuleSwitcher"
import LoadingIndicator from './common/components/LoadingIndicator'
import { isNonProductionEnv } from './common/config/config'
import Alerts from './pages/alerts/Alerts'
import AutobookHomePage from './pages/applications/auto_book/AutobookHomePage'
import { RunWorkflowHomePage } from './pages/applications/custom-applications/components/RunWorkflowHomePage'
import CustomApplicationsHomePage from "./pages/applications/custom-applications/CustomApplicationsHomePage"
import WorkflowEditorPage from './pages/applications/custom-applications/WorkflowEditorPage'
import ViewWorkflowHomePage from './pages/applications/view-workflow/ViewWorkflowHomePage'
import Configurations from './pages/configurations/Configurations'
import { CreateActionPage } from "./pages/customizations/CreateActionPage"
import Customizations from './pages/customizations/Customizations'
import { RunActionPage } from "./pages/customizations/RunActionPage"
import DevTestPage from './pages/dev_test_page/DevTestPage'
import { EULA } from "./pages/home/EULA"
import Home from './pages/home/Home'
import NotRegistered from './pages/home/NotRegistered'
import { SearchQueryProvider, TableBrowser } from './pages/table_browser/TableBrowser'
import TagHomePage from './pages/tag/TagHomePage'
import { Users } from "./pages/users/Users"
import { useAppInternal } from "./UseAppInternal"
import AppContext from "./utils/AppContext"
import history from "./utils/history"

export const AppInternal = (props: { classes: any; userEmail: any; dummyData: any; dummyDataPending: any; activeLink: any; setActiveLink: any; isLoading: any; user: any }) => {
    const {
        classes,
        userEmail,
        dummyData,
        dummyDataPending,
        isLoading,
        user
    } = props;

    if (isLoading || dummyDataPending === 1) {
        return (
            <LoadingIndicator/>
        )
    } else if (user === undefined) {
        return (
            <Switch>
                <Route path="/" component={Home}/>
            </Switch>
        )
    } else {
        if (!userEmail) {
            return (
                <LoadingIndicator/>
            )
        } else if (dummyData?.status >= 400) {
            return (
                <Switch>
                    <Route path="/" component={NotRegistered}/>
                </Switch>
            )
        } else {

            return (
                <Grid container style={{justifyContent: "flex-start"}}>
                    <Box sx={{position: 'relative', display: 'flex', flex: 1, width: "100%"}}>
                        <DashboardNavbar/>
                        <Box sx={{position: 'relative', top: '64px', display: 'flex', flex: 1, width: "100%"}}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <ModuleSwitcher/>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <div className={classes.mainContainer}>
                        <Grid container>
                            <Grid item xs={12}>
                                {isNonProductionEnv() && <EULA/>}
                                <Switch>
                                    <Route path='/tableBrowser' component={TableBrowser}/>
                                    {/*<Route path='/qualityChecks' component={QualityChecks}></Route>*/}
                                    <Route path='/customizations' component={Customizations}/>
                                    {isNonProductionEnv() &&
                                    <Route path='/configurations' component={Configurations}/>}
                                    <Route path='/alerts' component={Alerts}/>
                                    <Route path='/testPage' component={DevTestPage}/>
                                    <Route path='/users' component={Users}/>
                                    <Route path='/tag' component={TagHomePage}/>
                                    <Route path='/dashboard' component={TableBrowser}/>
                                    <Route path='/create-action' component={CreateActionPage}/>
                                    <Route path='/run-action' component={RunActionPage}/>
                                    <Route path='/autobook/customers' component={AutobookHomePage}/>
                                    <Route path='/custom-applications' component={CustomApplicationsHomePage}/>
                                    <Route path='/workflow-editor' component={WorkflowEditorPage}/>
                                    <Route path='/run-workflow' component={RunWorkflowHomePage}/>
                                    <Route path='/view-workflow' component={ViewWorkflowHomePage}/>
                                    <Redirect exact from="/" to="/application"/>
                                </Switch>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            )
        }
    }
}

type ApplicationType = (props: any) => ReactJSXElement | null;

const noop: ApplicationType = (restProps) => null;
const App = ({children = noop}) => {
    const {
        theme,
        userSettings,
        ...restProps
    } = useAppInternal();
    return <ThemeProvider theme={theme}>
        {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false}/>}
        <CssBaseline/>
        <AppContext.Provider value={userSettings}>
            <Router history={history}>
                <SearchQueryProvider>
                    <ErrorBoundary>
                        {children(restProps)}
                    </ErrorBoundary>
                </SearchQueryProvider>
            </Router>
        </AppContext.Provider>
    </ThemeProvider>
}
export default App;
