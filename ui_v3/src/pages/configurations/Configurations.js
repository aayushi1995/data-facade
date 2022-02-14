import React from 'react'
import {Route, Switch, useRouteMatch, withRouter} from 'react-router-dom'
import CreateDataSource from './components/CreateDataSource'
import ConfiguredDataSource from './components/ConfiguredDataSource'


const Configurations = withRouter(function ConfigurationsRoutes() {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`/configurations/create-data-source`}>
                <CreateDataSource/>
            </Route>
            <Route path={'/configurations'} component={ConfiguredDataSource}/>
        </Switch>
    )
});
export default Configurations;