import { Route, Switch, useRouteMatch, withRouter } from 'react-router-dom';
import CustomApplications from './components/CustomApplications';

export const CustomApplicationsHomePage = withRouter(function CustomApplicationRoutes() {
    const match = useRouteMatch()
    return (
        <Switch>
            <Route path={`${match.path}`} component={CustomApplications}/>
        </Switch>
    )
});

export default CustomApplicationsHomePage