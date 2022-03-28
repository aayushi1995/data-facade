import React from 'react'
import {Route, Switch, useRouteMatch, withRouter} from 'react-router-dom'
import {IconButton, Snackbar, Tooltip} from '@mui/material'
import DataSetsTable from './components/DataSetsTable'
import Search from './../../common/components/Search'
import TableDetails from '../table_details/TableDetails'
import LoadingIndicator from './../../common/components/LoadingIndicator'
import {useMutation, useQueryClient} from 'react-query'
import NoData from './../../common/components/NoData'
import dataManagerInstance, {usePrefetchMultipleRetreiveData, useRetreiveData} from './../../data_manager/data_manager'
import './../../css/table_browser/TableBrowser.css'
import {actionInstanceFormDataNeeds} from "../../common/components/CreateActionInstanceFormNew";
import labels from './../../labels/labels';
import * as PropTypes from "prop-types";
import SyncIcon from "@mui/icons-material/Sync";
import DeleteIcon from "@mui/icons-material/Delete";
import {PageHeader} from "../../common/components/header/PageHeader";
import { Alert } from '../../common/components/Alert';
import {DATA_RAW_ROUTE} from "../../common/components/header/data/DataRoutesConfig";

const filterOptionsMap = {

    "Table Name": "DisplayName",
    "Created By": "CreatedBy"
}


export function SearchBar(props) {
    return <Search searchQueryHandler={props.searchQueryHandler}/>;
}

SearchBar.propTypes = {
    searchQueryHandler: PropTypes.func
};
export const SearchQueryContext = React.createContext(["", (_) => {
}]);
export const SearchQueryProvider = ({children}) => {
    const search = React.useState("");
    return <SearchQueryContext.Provider value={search}>{children}</SearchQueryContext.Provider>
}
const tableBrowserKeyArgs = [
    "TableProperties", {
        "filter": {}, "TableBrowser": true
    }];
const TableView = () => {
    const search = React.useContext(SearchQueryContext);
    const [searchQuery] = search;
    const [filterOption] = React.useState("Table Name")
    const [tablePropertiesSelected, setTablePropertiesSelected] = React.useState([])
    const [notificationState, setNotificationState] = React.useState({open: false})
    const {isLoading: tableDetailLoading, error: tableDetailError, data: tableDetailData, isFetched} = useRetreiveData(
        ...tableBrowserKeyArgs)
    usePrefetchMultipleRetreiveData(actionInstanceFormDataNeeds, !!isFetched);

    const deleteTablePropertiesMutation = useMutation((tablePropertiesIds) => {

        const deleteTable = dataManagerInstance
            .getInstance
            .deleteData("TableProperties",
                {
                    filter: {},
                    DeleteMultipleById: true,
                    Ids: tablePropertiesIds,
                    Soft: true
                })

        let response = deleteTable.then(res => res.json())
        return response
    })

    const resyncTablePropertiesMutation = useMutation((tablePropertiesIds) => {

        const resync = dataManagerInstance
            .getInstance
            .saveData("ActionExecution",
                {
                    entityProperties: {},
                    SyncColumns: true,
                    TableIds: tablePropertiesIds
                })

        let response = resync.then(res => res.json())
        return response

    })

    const toggleSelectTablePropertiesWithId = React.useCallback(
        tablePropertiesId => {
            setTablePropertiesSelected(old => {
                if (old.findIndex(elem => elem === tablePropertiesId) === -1) {
                    return [...old, tablePropertiesId]
                } else {
                    return old.filter(id => id !== tablePropertiesId)
                }
            })
        }, []
    )
    const queryClient = useQueryClient();
    const deleteSelectedEntities = () => {
        console.log("Deleting", tablePropertiesSelected)
        deleteTablePropertiesMutation.mutate(tablePropertiesSelected, {
            onSuccess: () => {
                queryClient.setQueryData(tableBrowserKeyArgs,
                    tableDetailData.filter(tableDetail => tablePropertiesSelected.findIndex(Id => Id === tableDetail.TableId) < 0));

                setTablePropertiesSelected(old => {
                    setNotificationState({open: true, severity: "success", message: `${old.length} Table(s) Deleted`});
                    return old.filter(id => id === undefined)
                })
                console.log("Deleted Successfully")
            },
            onError: () => {
                setNotificationState({
                    open: true,
                    severity: "error",
                    message: `${tablePropertiesSelected.length} Table(s) Deletetion Failed`
                });
            }
        })
    }

    const reSyncSelectedTables = () => {
        console.log("ReSyncing", tablePropertiesSelected)
        resyncTablePropertiesMutation.mutate(tablePropertiesSelected, {
            onSuccess: () => {
                setTablePropertiesSelected(old => {
                    setNotificationState({
                        open: true,
                        severity: "success",
                        message: `${old.length} Table(s) Sync started`
                    });
                    return old.filter(id => id === undefined)
                })
                console.log("ReSynced Successfully")
            },
            onError: () => {
                setNotificationState({
                    open: true,
                    severity: "error",
                    message: `${tablePropertiesSelected.length} Table(s) Sync Failed`
                });
            }
        })
    }

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationState({open: false});
    };

    const match = useRouteMatch()

    const searchResults = () => {
        const filteredData = tableDetailData?.filter(v => {
                return Object.values(v || {}).some((e) => {
                    return String(e).toLowerCase().includes(searchQuery)
                })
            }
        )
        const uniqueFilteredData = {}

        filteredData?.forEach(tableData => {
            tableData["id"] = (tableData?.TableId) || (tableData.TableUniqueName);
            if (tableData["TableUniqueName"] in uniqueFilteredData) {
                if ("TableId" in tableData) {
                    uniqueFilteredData[tableData["TableUniqueName"]] = tableData
                }
            } else {
                uniqueFilteredData[tableData["TableUniqueName"]] = tableData
            }
        })
        return Object.values(uniqueFilteredData);
    }


    const isDashboard = match.path.includes('dashboard');

    if (tableDetailLoading) {
        return (<LoadingIndicator/>)
    } else if (tableDetailError) {
        return (<NoData/>)
    } else {
        const rows = !tableDetailLoading && searchResults();
        return (
            <React.Fragment>
                <Snackbar open={notificationState.open} autoHideDuration={4000} onClose={handleNotificationClose}>
                    <Alert onClose={handleNotificationClose} severity={notificationState.severity}>
                        {notificationState.message}
                    </Alert>
                </Snackbar>
                <div id="tableBrowser-container">
                    {rows && <DataSetsTable
                        simplified={isDashboard}
                        rows={rows}
                        ToggleSelect={toggleSelectTablePropertiesWithId}
                        IsSelected={false}//{tablePropertiesSelected.findIndex(elem => elem === row.TableId) > -1}
                        toolBarButtons={!isDashboard ? [
                            <Tooltip title="Delete">
                                <IconButton
                                    onClick={deleteSelectedEntities}
                                    color="primary"
                                    aria-label="Delete"
                                    component="span"
                                >
                                    <DeleteIcon/>
                                </IconButton></Tooltip>,
                            <Tooltip title={labels.TableBrowserRow.sync}>
                                <IconButton
                                    onClick={reSyncSelectedTables}
                                    color="primary"
                                    aria-label={labels.TableBrowserRow.sync}
                                    component="span"
                                >
                                    <SyncIcon/>
                                </IconButton></Tooltip>
                        ] : []}
                    />}
                </div>
            </React.Fragment>
        )
    }
}

export const TableBrowser = withRouter(function TableBrowserRoutes() {
    const match = useRouteMatch();
    return (
        <>
            <Route exact path={match.path} component={TableView}/>
            <Route exact path={`${match.path}/:tableUniqueName`} component={TableDetails}/>
        </>
    )
});
