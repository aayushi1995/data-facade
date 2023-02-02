import { Route, Switch, useRouteMatch, withRouter } from 'react-router-dom';
import UploadTableDialogContent from "../../../common/components/UploadTableDialogContent";

export const UploadTablePage = withRouter(function CustomApplicationRoutes() {
    const match = useRouteMatch()
    return (
        <Switch>
            <Route path={`${match.path}`} component={UploadTableDialogContent}/>
        </Switch>
    )
});

export default UploadTablePage
