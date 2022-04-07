import { Route, Switch } from "react-router-dom";
import { DATA_CONNECTIONS_ROUTE, DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE, DATA_RAW_ROUTE } from "../../common/components/header/data/DataRoutesConfig";
import ConfiguredDataSource from "../configurations/components/ConfiguredDataSource";
import { TableBrowser } from "../table_browser/TableBrowser";
import UploadTablePage from "../upload_table/UploadTablePage";

const DataContent = () => {
    return (
        <Switch>
            <Route path={DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE} component={UploadTablePage}/>
            <Route path={DATA_CONNECTIONS_ROUTE} component={ConfiguredDataSource}/>
            <Route path={DATA_RAW_ROUTE} component={TableBrowser}/>
        </Switch>
    )
}

export default DataContent;