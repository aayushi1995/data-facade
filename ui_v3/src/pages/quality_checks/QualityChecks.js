import React from 'react';
import {Grid} from '@mui/material'
import QualityChecksRow from './components/QualityChecksRow'
import {useRouteMatch} from 'react-router-dom'
import LoadingIndicator from './../../common/components/LoadingIndicator'
import NoData from './../../common/components/NoData'
import SearchFilter from './../../common/components/SearchFilter'
import {useRetreiveData} from './../../data_manager/data_manager'
import {PageHeader} from "../../common/components/header/PageHeader";

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
        "value": "Action Type",
        "display": "Action Type"
    }
]

const filterOptionsMap = {
    "Action Instance Id": "Id",
    "Action Instance Name": "Name",
    "Action Type": "ActionType"
}

const isDataEmpty = (data) => {
    if (data !== undefined && data.length > 0)
        return false
    else
        return true
}

const QualityChecks = (props) => {
    const match = useRouteMatch()

    const searchString = (props.fromJobs !== undefined) ? props.fromJobs.search : ""
    const filterOptionId = (props.fromJobs !== undefined) ? props.fromJobs.filter : "Action Instance Name"
    const [searchQuery, setSearchQuery] = React.useState(searchString)
    const [filterOption, setFilterOption] = React.useState(filterOptionId)


    const {isLoading, error, data} = useRetreiveData("ActionInstance", {"filter": {}, "withCheckDetail": true})

    const searchQueryHandler = (event) => {
        setSearchQuery(event.target.value)
    }

    const filterOptionHandler = (event) => {
        setFilterOption(event.target.value)
    }

    const searchResults = (myData) => {
        const filterKey = filterOptionsMap[filterOption]
        return myData.filter(elem => {
            switch (filterOption) {
                case "Action Type" :
                    return elem["ActionDefinition"][filterKey].toLowerCase().search(searchQuery.toLowerCase()) >= 0 || searchQuery === ""
                case "Action Instance Name" :
                    return elem["ActionInstance"][filterKey].toLowerCase().search(searchQuery.toLowerCase()) >= 0 || searchQuery === ""
                case "Action Instance Id" :
                    return elem["ActionInstance"][filterKey].toLowerCase().search(searchQuery.toLowerCase()) >= 0 || searchQuery === ""
                default:
                    return false
            }
        })
    }

    React.useEffect(() => {
        if (!isDataEmpty(data)) {
            const toScroll = document.getElementById('qualityChecks-container')
            toScroll.style.overflow = 'auto';
            toScroll.style.maxHeight = `${window.innerHeight - toScroll.offsetTop - 20}px`;
        }

    }, [data])


    if (isLoading) {
        return (<LoadingIndicator/>)
    } else if (error) {
        <NoData/>
    } else {
        return (
            <React.Fragment>
                <Grid item xs={12}>
                    <PageHeader/>
                </Grid>
                <SearchFilter
                    filterOptionHandler={filterOptionHandler}
                    menuItems={filterOptionItems}
                    searchQueryHandler={searchQueryHandler}/>
                <div id="qualityChecks-container">
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            {
                                searchResults(data).map((row, index) => (
                                    <QualityChecksRow data={row} key={row.checkName}/>
                                ))
                            }
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        )
    }
}

export default QualityChecks;