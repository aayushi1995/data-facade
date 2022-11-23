import React from 'react';
import {Grid} from '@mui/material'
import Search from './../../../common/components/Search'
import SelectOption from './../../../common/components/SelectOption'
import DataCleanActionsRow from './DataCleanActionsRow'
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import NoData from './../../../common/components/NoData'
import {useRetreiveData} from "../../../data_manager/data_manager";

const endPoint = require("./../../../common/config/config").FDSEndpoint


const filterOptionItems = [
    {
        "value": "Action Instance Id",
        "display": "Action Instance Id"
    },
    {
        "value": "Action Instance Name",
        "display": "Action Instance Name"
    },
    {
        "value": "Query Type",
        "display": "Query Type"
    }
]

const filterOptionsMap = {
    "Action Instance Id": "Id",
    "Action Instance Name": "Name",
    "Action Type": "ActionType"
}

export const useActionInstanceWithDetailQuery = (tableId) => useRetreiveData('ActionInstance', {
    "filter": {
        "ActionType": "CleanupStep",
        "TableId": tableId
    },
    "withDetail": true
}, {enabled: !!tableId});

const DataCleanActions = (props) => {
    console.log("props in data clean ", props)
    const searchString = (props.state !== undefined) ? props.state.search : ""
    const filterOptionId = (props.state !== undefined) ? props.state.filter : "Action Instance Name"
    const [searchQuery, setSearchQuery] = React.useState(searchString)
    const [filterOption, setFilterOption] = React.useState(filterOptionId)

    const {isLoading, error, data} = useActionInstanceWithDetailQuery(props.tableId);

    const searchQueryHandler = (event) => {
        setSearchQuery(event.target.value)
    }

    const filterOptionHandler = (event) => {
        setFilterOption(event.target.value)
    }

    const searchResults = (myData) => {
        if (myData.length === 0) return []
        const filterKey = filterOptionsMap[filterOption]
        console.log(myData.length)
        console.log(filterKey)
        //console.log("myfitler key ", myData[0]["ActionInstance"][filterKey])
        return myData.filter(elem => {
            switch (filterOption) {
                case "Query Type" :
                    return elem["ActionDefinition"][filterKey].toLowerCase().search(searchQuery.toLowerCase()) >= 0 || searchQuery === ""
                case "Action Instance Name" :
                    if (elem["ActionInstance"][filterKey] === undefined) return false
                    return elem["ActionInstance"][filterKey].toLowerCase().search(searchQuery.toLowerCase()) >= 0 || searchQuery === ""
                case "Action Instance Id" :
                    return elem["ActionInstance"][filterKey].toLowerCase().search(searchQuery.toLowerCase()) >= 0 || searchQuery === ""
                default :
                    return false

            }
        })
    }

    React.useEffect(() => {
        if (data !== undefined) {
            const toScroll = document.getElementById('DataCleanActions-container')
            toScroll.style.overflow = 'auto';
            toScroll.style.maxHeight = `${window.innerHeight - toScroll.offsetTop - 20}px`;
        }


    }, [data])

    if (isLoading) {
        return (<LoadingIndicator/>)
    } else if (error) {
        return (<NoData/>)
    } else {
        return (
            <React.Fragment>
                <Grid container spacing={0} style={{marginTop: 0, marginBottom: 0}}>
                    <Grid item xs={12} style={{marginLeft: 40, marginRight: 40}}>
                        <Grid container spacing={0}>
                            <Grid item xs={2} style={{marginRight: 40}}>
                                <SelectOption filterOptionHandler={filterOptionHandler} menuItems={filterOptionItems}/>
                            </Grid>
                            <Grid item xs={4}>
                                <Search searchQueryHandler={searchQueryHandler} searchValue={searchQuery}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <div id="DataCleanActions-container">
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            {
                                searchResults(data).map((row, index) => (
                                    <DataCleanActionsRow data={row} key={row.checkName}/>
                                ))
                            }
                        </Grid>
                    </Grid>
                </div>

            </React.Fragment>
        )
    }
}

export default DataCleanActions;