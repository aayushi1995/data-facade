import { Route, Switch } from "react-router-dom";
import { DATA_ALL_TABLES_ROUTE, DATA_CERTIFIED_ROUTE, DATA_CONNECTIONS_ROUTE, DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE, DATA_TABLE_VIEW } from "../../common/components/header/data/DataRoutesConfig";
import TablePropertiesCertificationStatus from "../../enums/TablePropertiesCertificationStatus";
import ConfiguredDataSource from "../configurations/components/ConfiguredDataSource";
import AllTableView from "../table_browser/components/AllTableView";
import TableDetails from "../table_details/TableDetails";
import UploadTablePage from "../upload_table/UploadTablePage";

const DataContent = () => {
    return (
        <Switch>
            <Route path={DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE} component={UploadTablePage}/>
            <Route path={DATA_CONNECTIONS_ROUTE} component={ConfiguredDataSource}/>
            <Route path={DATA_TABLE_VIEW} component={TableDetails}/>
            <Route path={DATA_ALL_TABLES_ROUTE}>
                <AllTableView tableFilter={{  }}/>
            </Route>
            <Route path={DATA_CERTIFIED_ROUTE}>
                <AllTableView tableFilter={{ CertificationStatus: TablePropertiesCertificationStatus.CERTIFIED }}/>
            </Route>
        </Switch>
    )
}

export default DataContent;