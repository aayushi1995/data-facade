import AddIcon from "@mui/icons-material/Add";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Grid, InputAdornment, TextField } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { APPLICATION_BUILD_ACTION_ROUTE_ROUTE } from "../header/data/ApplicationRoutesConfig";

export interface ApplicationHeaderProps {
    pageHeader: string
    subHeading: string,
    fromApplicationDetail?: boolean,
    searchQuery?: string,
    setSearchQuery?: (e: string) => void
    applicationId?: string
}

const ApplicationHeader = (props: ApplicationHeaderProps) => {
    const history = useHistory()

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setSearchQuery?.(e.target.value)
    }
    const SearchBarStyle = {
        width: '100%',
        border:'1px solid #AFAFAF',
        boxSizing: 'border-box',
        backgroundBlendMode: 'soft-light, normal',
        borderRadius: '5px',
        justifyContent: 'center',
        minHeight: '50px'
    }
    return (

        <Box>
            <Grid container spacing={4}>
                <Grid item xs={12} container>
                    <Grid item xs={8}>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2, minHeight: '80%'}}>
                            {props.fromApplicationDetail && (
                                <>
                                <Button sx={{flex: 1, borderRadius: '10px'}} variant="contained" to={{
                                    pathname: "/application/build-workflow",
                                    state: props?.applicationId || "Id"
                                }}
                                component={Link}
                                >
                                    Create Workflow <AddIcon sx={{marginLeft: 2}}/>
                                </Button>
                                <Button sx={{flex: 1, borderRadius: '10px'}} variant="contained" to={{
                                    pathname: APPLICATION_BUILD_ACTION_ROUTE_ROUTE,
                                    state: props?.applicationId || "Id"
                                }} 
                                component={Link}
                                >
                                    Create Action <AddIcon sx={{marginLeft: 2}}/>
                                </Button>
                                <Button sx={{flex: 1, borderRadius: '10px'}} variant="contained" disabled>
                                    Export Application
                                </Button>
                                </>
                            )}
                            
                        </Box>
                    </Grid>
                </Grid>
                {props.fromApplicationDetail ? (
                    <></>
                ) : (
                    <Grid item xs={12} sx={{pr:4}}>
                            <TextField variant="standard" 
                            value={props.searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search Apps/Flows/Actions"
                            multiline={true}
                            sx={{...SearchBarStyle,ml:1}}
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{marginLeft: 1}}/>
                                    </InputAdornment>
                                )
                            }}/>
                    </Grid>
                )} 
                
            </Grid>
        </Box>
    )
}

export default ApplicationHeader