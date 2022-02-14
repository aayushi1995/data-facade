import React from 'react'
import {Route, Switch, useRouteMatch, withRouter} from 'react-router-dom'
import SingleTagView from './components/SingleTagView';
import AllTagView from './components/AllTagView';


export const TagHomePage = withRouter(function TableBrowserRoutes() {
    const match = useRouteMatch()

    return (
        <Switch>
            <Route path={`${match.path}/:tagName/view/:linkedEntityName`} component={SingleTagView}/>
            <Route path="/tag" component={AllTagView}/>
        </Switch>
    )
});

export default TagHomePage;