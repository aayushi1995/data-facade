import React from 'react'
import {FormControl, InputAdornment, OutlinedInput} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.primary.contrastText,
    },
    notchedOutline: {
        border: 0,
        borderColor: "transparent"
    }
}));


const Search = (props) => {
    const mysearchValue = (props.searchValue !== undefined) ? props.searchValue : ''
    const [searchValue, setSearchValue] = React.useState(mysearchValue);
    const handleSearchValue = (event) => {
        setSearchValue(event.target.value)
    }
    const classes = useStyles()

    return (
        <FormControl fullWidth color="secondary">
            <OutlinedInput
                classes={{
                    notchedOutline: classes.notchedOutline,
                    root: classes.root
                }}
                color="secondary"
                id="outlined-adornment-amount"
                value={searchValue}
                onChange={(event) => {
                    handleSearchValue(event);
                    props.searchQueryHandler(event);
                }}
                startAdornment={<InputAdornment position="start"><SearchIcon/></InputAdornment>}
                placeholder="Search"
            />
        </FormControl>
    )
}

export default Search;