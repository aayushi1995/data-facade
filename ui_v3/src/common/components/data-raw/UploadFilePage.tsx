import { Redirect, Route, Switch } from "react-router-dom";
import {
    DATA_CONNECTIONS_UPLOAD_COLUMNS_ROUTE,
    DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE,
    DATA_CONNECTIONS_UPLOAD_ROUTE
} from "../route_consts/data/DataRoutesConfig";
import UploadTableDialogContent from "../UploadTableDialogContent";

export const UploadFilePage = () =>{
    return <Switch>
        <Redirect to={DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE} from={DATA_CONNECTIONS_UPLOAD_ROUTE}/>
        <Route path={DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE} component={UploadTableDialogContent}/>
        <Route path={DATA_CONNECTIONS_UPLOAD_COLUMNS_ROUTE} component={UploadTableDialogContent}/>
        <Route path={`${DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE}/:uploadedFile`} component={UploadTableDialogContent}/>
    </Switch>
}