import { Grid } from '@mui/material'
import React, { useContext } from 'react'
import { useQuery } from 'react-query'
import AppContext from "../../../utils/AppContext"
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import Search from './../../../common/components/Search'
import SelectOption from './../../../common/components/SelectOption'
import QuickStatsRow from './QuickStatsRow'

const endPoint = require("../../../common/config/config").FDSEndpoint

const filterOptionItems = [
    {
        "value": "Profiling Instance Name",
        "display": "Profiling Instance Name"
    }
]

const filterOptionsMap = {

    "Profiling Instance Name": "Name"
}


const QuickStats = (props) => {
    const appcontext = useContext(AppContext);
    const [searchQuery, setSearchQuery] = React.useState("")
    const [filterOption, setFilterOption] = React.useState("Profiling Instance Name")

    const email = appcontext.userEmail
    const token = appcontext.token


    const quickStatsConfig = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "entityName": "ColumnProperties",
            "actionProperties": {
                "filter": {
                    "Id": props.columnId
                },
                "withProfilingActions": true
            }
        })
    }

    const {isLoading, error, data: quickStatsData} = useQuery(`FetchQuickStatsColumn${props.columnId}`, () =>
        fetch(endPoint + '/entity/getproxy?email=' + email, quickStatsConfig).then(res => res.json()))

    const searchQueryHandler = (event) => {
        setSearchQuery(event.target.value)
    }

    const filterOptionHandler = (event) => {
        setFilterOption(event.target.value)
    }

    const searchResults = (myData) => {
        const filterKey = filterOptionsMap[filterOption]
        return myData.filter(elem =>
            elem["ActionInstance"][filterKey].toLowerCase().search(searchQuery.toLowerCase()) >= 0 || searchQuery === ""
        )
    }

    if (isLoading) {
        return (<LoadingIndicator/>)
    } else if (error) {
        <div>Error</div>
    } else {
        quickStatsData[0].ProfilingActions.forEach((action) => {
            action.ActionExecution.sort((a, b) => a.ExecutionStartedOn - b.ExecutionStartedOn)
        })
        return (
            <>
                <Grid container spacing={0}>
                    <Grid item xs={2} style={{marginLeft: 40, marginRight: 40}}>
                        <SelectOption filterOptionHandler={filterOptionHandler} menuItems={filterOptionItems}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Search searchQueryHandler={searchQueryHandler}/>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {searchResults(quickStatsData[0].ProfilingActions).map((action, index) => (
                        <QuickStatsRow action={action}/>
                    ))}

                </Grid>
            </>
        )
    }
}

export default QuickStats