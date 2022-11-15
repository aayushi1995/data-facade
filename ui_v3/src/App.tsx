import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { Box, CssBaseline, Grid, ThemeProvider } from "@mui/material"
import { ReactQueryDevtools } from 'react-query/devtools'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import ErrorBoundary from "./common/components/ErrorBoundry"
import DashboardNavbar from "./common/components/header/DashboardNavbar"
import { ModuleSwitcher } from "./common/components/header/ModuleSwitcher"
import LoadingIndicator from './common/components/LoadingIndicator'
import ModuleContextStateProvider from "./common/components/ModuleContext"
import { isNonProductionEnv } from './common/config/config'
import DevTestPage from './pages/dev_test_page/DevTestPage'
import { EULA } from "./pages/home/EULA"
import Home from './pages/home/Home'
import NotRegistered from './pages/home/NotRegistered'
import OrgUpdateInProgress from "./pages/home/OrgUpdateInProgress"
import { SearchQueryProvider } from './pages/table_browser/TableBrowser'
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
        } else if (dummyData?.status == 426) {
            return (
                <Switch>
                    <Route path="/" component={OrgUpdateInProgress}/>
                </Switch>
            )
        } else if (dummyData?.status >= 400) {
            return (
                <Switch>
                    <Route path="/" component={NotRegistered}/>
                </Switch>
            )
        }  else {

            return (
                <Grid container style={{justifyContent: "flex-start"}}>
                    <Box sx={{position: 'relative', display: 'flex', flex: 1, width: "100%"}}>
                        <DashboardNavbar/>
                        <Box sx={{position: 'relative', top: '64px', display: 'flex', flex: 1, width: "100%"}}>
                            <Grid container>
                                <Grid item xs={12 }>
                                    <ModuleContextStateProvider>
                                        <ModuleSwitcher/>
                                    </ModuleContextStateProvider>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <div className={classes.mainContainer}>
                        <Grid container>
                            <Grid item xs={12}>
                                {isNonProductionEnv() && <EULA/>}
                                <Switch>
                                    <Route path='/testPage' component={DevTestPage}/>
                                    <Route path='/users' component={Users}/>
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
