import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Box, CssBaseline, Grid, ThemeProvider } from "@mui/material";
import React, { Suspense } from "react";
import { ReactQueryDevtools } from 'react-query/devtools';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { ModuleContent } from "./common/components/main_module/ModuleContent";
import { isNonProductionEnv } from './common/config/config';

import ErrorBoundary from "./common/components/ErrorBoundry";
import GoogleRedirect from "./common/components/google/GoogleRedirect";
import LoadingIndicator from './common/components/LoadingIndicator';
import Layout from "./layout";
import { EULA } from "./pages/home/EULA";
import { useAppInternal } from "./UseAppInternal";
import AppContext from "./utils/AppContext";
import history from "./utils/history";
import { DataProvider } from "./utils/DataContextProvider";

//optimized routes
const ModuleContextStateProvider = React.lazy(() => import("./common/components/main_module/context/ModuleContext"));
const DevTestPage = React.lazy(() => import('./pages/dev_test_page/DevTestPage'));
const SlackRedirect = React.lazy(() => import("./pages/dev_test_page/SlackRedirect"));
const Home = React.lazy(() => import('./pages/home/Home'));
const NotRegistered = React.lazy(() => import('./pages/home/NotRegistered'));
const OrgUpdateInProgress = React.lazy(() => import("./pages/home/OrgUpdateInProgress"));


export const AppInternal = (props: { classes: any; userEmail: any; dummyData: any; dummyDataPending: any; activeLink: any; setActiveLink: any; isLoading: any; user: any }) => {
    const {
        classes,
        userEmail,
        dummyData,
        dummyDataPending,
        isLoading,
        user
    } = props;
    React.useEffect(() => {
        if (user && user.name)
            localStorage.setItem('user', JSON.stringify(user))
    }, [user])
    if (isLoading || dummyDataPending === 1) {
        return (
            <LoadingIndicator />
        )
    } else if (user === undefined) {
        return (
            <Switch>
                <Suspense fallback={<div>Loading...</div>}>
                    <Route path="/" component={Home} />
                </Suspense>
            </Switch>
        )
    } else {
        if (!userEmail) {
            return (
                <LoadingIndicator />
            )
        } else if (dummyData?.status == 426) {
            return (
                <Switch>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Route path="/" component={OrgUpdateInProgress} />
                    </Suspense>
                </Switch>
            )
        } else if (dummyData?.status >= 400) {
            return (
                <Switch>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Route path="/" component={NotRegistered} />
                    </Suspense>
                </Switch>
            )
        } else {
            // document.body.style.zoom = "85%"; // our product looks better in 85% zoom out state .....#### temporary soln #####
            return (
                <Layout>
                    <Suspense fallback={<div>Loading...</div>}>
                        <ModuleContextStateProvider>
                            <Box sx={{ p: 2 }}>
                                <ModuleContent.Header />
                                <ModuleContent.MainContent />
                                <div className={classes.mainContainer}>
                                    <Grid container>
                                        <Grid item xs={12}>

                                            {isNonProductionEnv() && <EULA user={user} />}
                                            <Switch>
                                                <Route path="/slackredirect" component={SlackRedirect} />
                                                <Route path="/googleredirect" component={GoogleRedirect} />
                                                <Route path='/testPage' component={DevTestPage} />
                                                <Redirect exact from="/tableBrowser" to="/" />
                                            </Switch>

                                        </Grid>
                                    </Grid>
                                </div>
                            </Box>
                        </ModuleContextStateProvider>
                    </Suspense>
                </Layout>
            )
        }
    }
}

type ApplicationType = (props: any) => ReactJSXElement | null;

const noop: ApplicationType = (restProps) => null;
const App = ({ children = noop }) => {
    const {
        theme,
        userSettings,
        ...restProps
    } = useAppInternal();
    return <ThemeProvider theme={theme}>
        {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
        <CssBaseline />
        <AppContext.Provider value={userSettings}>
            <DataProvider>
                <Router history={history}>
                    <ErrorBoundary>
                        {children(restProps)}
                    </ErrorBoundary>
                </Router>
            </DataProvider>
        </AppContext.Provider>
    </ThemeProvider>
}
export default App
