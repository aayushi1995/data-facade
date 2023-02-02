import { Box } from "@mui/material";
import { useContext, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { SetModuleContextState } from "../../common/components/main_module/context/ModuleContext";
import { DATA_ALL_TABLES_ROUTE, DATA_CERTIFIED_ROUTE, DATA_CONNECTIONS_ROUTE, DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE, DATA_CONNECTIONS_UPLOAD_ROUTE, DATA_ROUTE, DATA_SCRATCH_PAD, DATA_SUB_TABS, DATA_TABLE_VIEW, findTab } from "../../common/components/route_consts/data/DataRoutesConfig";
import TablePropertiesCertificationStatus from "../../enums/TablePropertiesCertificationStatus";
import { CreateConnectionButton } from "./components/connections/CreateConnectionButton";
import { CHOOSE_CONNECTOR_ROUTE } from "./components/connections/DataRoutesConstants";
import ScratchPadLandingPage from "./components/ScratchPad/ScratchPadLandingPage";
import ConfiguredDataSource from "./configurations/components/ConfiguredDataSource";
import { DataLandingPage } from "./landing/DataLandingPage";
import AllTableView from "./table_browser/components/AllTableView";
import TableDetails from "./table_details/TableDetails";
import UploadTablePage from "./upload_table/UploadTablePage";

const DataContent = () => {
    const setModuleContext = useContext(SetModuleContextState)

    return (
        <Box>
        <Switch>
            <Redirect exact from={DATA_CONNECTIONS_UPLOAD_ROUTE} to={DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE}/>
            <Route exact path={DATA_ROUTE} component={DataLandingPage}/>
            <Route path={DATA_SCRATCH_PAD} component={ScratchPadLandingPage}/>
            <Route path={DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE} component={UploadTablePage}/>
            <Route path={DATA_CONNECTIONS_ROUTE} component={ConfiguredDataSource}/>
            <Route path={DATA_TABLE_VIEW} component={TableDetails}/>
            <Route path={DATA_ALL_TABLES_ROUTE}>
                <AllTables/>
            </Route>
            <Route path={DATA_CERTIFIED_ROUTE}>
                <CertifiedTables/>
            </Route>
            <Route path={CHOOSE_CONNECTOR_ROUTE}>    
                <CreateConnectionButton/>
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