import { useContext, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { DATA_ALL_TABLES_ROUTE, DATA_CERTIFIED_ROUTE, DATA_CONNECTIONS_ROUTE, DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE, DATA_CONNECTIONS_UPLOAD_ROUTE, DATA_SUB_TABS, DATA_TABLE_VIEW, findTab } from "../../common/components/header/data/DataRoutesConfig";
import { SetModuleContextState } from "../../common/components/ModuleContext";
import TablePropertiesCertificationStatus from "../../enums/TablePropertiesCertificationStatus";
import ConfiguredDataSource from "../configurations/components/ConfiguredDataSource";
import AllTableView from "../table_browser/components/AllTableView";
import TableDetails from "../table_details/TableDetails";
import UploadTablePage from "../upload_table/UploadTablePage";
import { Box } from "@mui/material";
const DataContent = () => {
    const setModuleContext = useContext(SetModuleContextState)

    return (
        <Box>
            <Switch>
                <Redirect exact from={DATA_CONNECTIONS_UPLOAD_ROUTE} to={DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE}/>
                <Route path={DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE} component={UploadTablePage}/>
                <Route path={DATA_CONNECTIONS_ROUTE} component={ConfiguredDataSource}/>
                <Route path={DATA_TABLE_VIEW} component={TableDetails}/>
                <Route path={DATA_ALL_TABLES_ROUTE}>
                    <AllTables/>
                </Route>
                <Route path={DATA_CERTIFIED_ROUTE}>
                    <CertifiedTables/>
                </Route>
            </Switch>
        </Box>
    )
}

const AllTables = () => {
    const setModuleContext = useContext(SetModuleContextState)
    useEffect(() => {
        const tab = findTab(DATA_SUB_TABS, DATA_ALL_TABLES_ROUTE)
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: tab?.title,
                    SubTitle: tab?.subTitle
                }
            }
        })
    }, [])

    return <AllTableView/>
}

const CertifiedTables = () => {
    const setModuleContext = useContext(SetModuleContextState)
    useEffect(() => {
        const tab = findTab(DATA_SUB_TABS, DATA_CERTIFIED_ROUTE)
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: tab?.title,
                    SubTitle: tab?.subTitle
                }
            }
        })
    }, [])

    return <AllTableView tableFilter={{ CertificationStatus: TablePropertiesCertificationStatus.CERTIFIED }}/>
}

export default DataContent;