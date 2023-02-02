import { Box } from '@mui/material'
import React from 'react'
import useStyles from '../../../../css/table_details/ColumnView'
import ColumnInfoView from './ColumnInfoView'


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


    return (
        <>
            <Box>
                <ColumnInfoView TableId={props.TableId}/>
            </Box>
        </>
    )
}

export default ColumnView