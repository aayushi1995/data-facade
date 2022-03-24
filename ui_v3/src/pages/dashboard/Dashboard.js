import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'
import {Grid, Snackbar} from '@mui/material'
import Row from './components/Row'
import LoadingIndicator from './../../common/components/LoadingIndicator'
import NoData from './../../common/components/NoData'
import {usePrefetchMultipleRetreiveData, useRetreiveData} from './../../data_manager/data_manager'
import './../../css/table_browser/TableBrowser.css'
import {actionInstanceFormDataNeeds} from "../../common/components/CreateActionInstanceFormNew";
import QuickStats from './components/QuickStats'
import {PageHeader} from "../../common/components/header/PageHeader";
import { Alert } from '../../common/components/Alert';

const filterOptionItems = [
    {
        "value": "Table Name",
        "display": "Table Name"
    },
    {
        "value": "Created By",
        "display": "Created By"
    }
]

const sortOptionItems = [
    {
        "value": "Ascending",
        "display": "Ascending"
    },
    {
        "value": "Descending",
        "display": "Descending"
    }
]
const filterOptionsMap = {

    "Table Name": "DisplayName",
    "Created By": "CreatedBy"
}


const TableView = () => {
    const [displayData, setDisplayData] = React.useState({tableDetailData: [], displayCount: 10})
    const [notificationState, setNotificationState] = React.useState({open: false})
    const {isLoading: tableDetailLoading, error: tableDetailError, data: tableDetailData, isFetched} = useRetreiveData(
        "TableProperties", {
            "filter": {}, "TableBrowser": true
        })

    usePrefetchMultipleRetreiveData(actionInstanceFormDataNeeds, !!isFetched);

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotificationState({open: false});
    };

    const match = useRouteMatch()


    React.useEffect(() => {
        setDisplayData(old => {
            return {
                ...old,
                tableDetailData: tableDetailData || []
            }
        })
    }, [tableDetailLoading])

    React.useEffect(() => {
        if (tableDetailData !== undefined) {
            const toScroll = document.getElementById('tableBrowser-container')
            toScroll.style.overflow = 'auto';
            toScroll.style.maxHeight = `${window.innerHeight - toScroll.offsetTop - 20}px`;
        }

    }, [tableDetailData])


    if (tableDetailLoading) {
        return (<LoadingIndicator/>)
    } else if (tableDetailError) {
        return (<NoData/>)
    } else {
        return (
            <React.Fragment>
                <Snackbar open={notificationState.open} autoHideDuration={4000} onClose={handleNotificationClose}>
                    <Alert onClose={handleNotificationClose} severity={notificationState.severity}>
                        {notificationState.message}
                    </Alert>
                </Snackbar>
                <PageHeader path={match.path} url={match.url}/>
                <div id="tableBrowser-container">
                    <Grid container spacing={0} style={{
                        minWidth: "1000px"
                    }}>
                        <Grid item xs={12}>
                            {(displayData.tableDetailData === 0) ? <NoData/> : (
                                displayData.tableDetailData.sort().map(row => (
                                    <Row
                                        data={row}
                                        key={row.TableId}
                                    />
                                )))}
                        </Grid>
                    </Grid>
                </div>

            </React.Fragment>
        )
    }
}

const TableDashboard = () => {

    const match = useRouteMatch()

    return (
        <Switch>
            <Route path={`${match.path}/:tableUniqueName`} component={QuickStats}/>
            <Route path="/dashboard" component={TableView}/>
        </Switch>
    )
}

export default TableDashboard
