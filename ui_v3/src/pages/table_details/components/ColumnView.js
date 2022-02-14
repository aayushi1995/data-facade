import React from 'react'
import {Grid} from '@material-ui/core'
import SelectOption from './../../../common/components/SelectOption'
import Search from './../../../common/components/Search'
import ColumnViewRow from './ColumnViewRow'
import useStyles from '../../../css/table_details/ColumnView'


const filterOptionItems = [
    {
        "value": "Column Name",
        "display": "Column Name"
    },
    {
        "value": "Column Id",
        "display": "Column Id"
    },
    {
        "value": "Data type",
        "display": "Data type"
    }
]

const filterOptionsMap = {

    "Column Name": "UniqueName",
    "Column Id": "Id",
    "Data type": "Datatype"
}

const ColumnView = (props) => {

    const [searchQuery, setSearchQuery] = React.useState("")
    const [filterOption, setFilterOption] = React.useState("Column Name")
    const classes = useStyles();


    const searchQueryHandler = (event) => {
        setSearchQuery(event.target.value)
    }
    const filterOptionHandler = (event) => {
        setFilterOption(event.target.value)
    }
    const searchResults = (myData) => {
        const filterKey = filterOptionsMap[filterOption]
        return myData.filter(elem =>
            elem[filterKey].toLowerCase().search(searchQuery.toLowerCase()) >= 0 || searchQuery === ""
        )
    }

    React.useEffect(() => {

        const toScroll = document.getElementById('tableDetailsColumnView-container')
        toScroll.style.overflow = 'auto';
        toScroll.style.maxHeight = `${window.innerHeight - toScroll.offsetTop - 20}px`;


    }, [])


    return (
        <>

            <Grid container spacing={0}>
                <Grid item xs={2} className={classes.grid_root}>
                    <SelectOption filterOptionHandler={filterOptionHandler} menuItems={filterOptionItems}/>
                </Grid>
                <Grid item xs={4}>
                    <Search searchQueryHandler={searchQueryHandler}/>
                </Grid>
                <Grid item xs={1} container className={classes.button_container}>
                    {/*<Button variant="outlined" disableElevation className={classes.button}>
                            Clean
                        </Button>*/}
                </Grid>
            </Grid>
            <div id="tableDetailsColumnView-container">
                <Grid item xs={12}>
                    {searchResults(props.tableData.ColumnProperties).map((row, index) => (
                        <ColumnViewRow data={row} key={row.Id} tableName={props.tableData.TableProperties.UniqueName}
                                       providerId={props.tableData.ProviderInstance.Id}/>
                    ))}
                </Grid>
            </div>
        </>
    )
}

export default ColumnView