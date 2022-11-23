import { Box,  TextField, InputAdornment} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {searchCSSproperty } from './CSS/CssProperties'

export const SearchComponent = ()=>{
    return(
                        <Box>
                            <TextField variant="standard" 
                            
                            placeholder="Search Apps/Flows/Actions"
                            multiline={true}
                            sx={searchCSSproperty()}
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{marginLeft: 1}}/>
                                    </InputAdornment>
                                )
                            }}/>
                        </Box>
    )
}

export default SearchComponent;