import React from 'react'
import {Grid} from '@mui/material'
import {useRouteMatch} from 'react-router-dom'
import Search from './Search'
import SelectOption from './SelectOption'
import './../../css/common.css'


const SearchFilter = (props) => {

    const match = useRouteMatch()
    return (
        <>
            <Grid xs={12} className="search_filter">
                <Grid container spacing={0}>
                    <Grid xs={2} className="select_option_margin">
                        <SelectOption filterOptionHandler={props.filterOptionHandler} menuItems={props.menuItems}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Search searchQueryHandler={props.searchQueryHandler}/>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default SearchFilter;