import { Box, Grid, Typography, Button, TextField, InputAdornment } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import SearchIcon from '@mui/icons-material/Search';
import { useHistory, Link } from "react-router-dom";
import PreBuiltApplications from "./PreBuiltApplications";

interface ApplicationHeaderProps {
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

    return (

        <Box p={1}>
            <Grid container spacing={4}>
                <Grid item xs={12} container>
                    <Grid item xs={8}>
                        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <Typography sx={{flex: 1, fontFamily: 'Rubik', fontSize: '33px', fontWeight: 500}}>
                                Application
                            </Typography>
                            <Typography sx={{flex: 1, fontFamily: 'Rubik', fontSize: '14px', fontStyle: 'normal'}}>
                                Create, Manage Applications from here
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2, minHeight: '80%'}}>
                            {props.fromApplicationDetail ? (
                                <>
                                <Button sx={{flex: 1, borderRadius: '10px'}} variant="contained" to={{
                                    pathname: "/build-workflow",
                                    state: props?.applicationId || "Id"
                                }}
                                component={Link}
                                >
                                    Create Workflow <AddIcon sx={{marginLeft: 2}}/>
                                </Button>
                                <Button sx={{flex: 1, borderRadius: '10px'}} variant="contained">
                                    Create Action <AddIcon sx={{marginLeft: 2}}/>
                                </Button>
                                <Button sx={{flex: 1, borderRadius: '10px'}} variant="contained">
                                    Export Application
                                </Button>
                                </>
                            ) : (
                                <>
                                <Button sx={{flex: 1, borderRadius: '10px'}} variant="contained">
                                    APP Builder <AddIcon sx={{marginLeft: 2}}/></Button>
                                <Button sx={{flex: 1, borderRadius: '10px'}} variant="contained">Import Application</Button>
                                </>
                            )}
                            
                        </Box>
                    </Grid>
                </Grid>
                {props.fromApplicationDetail ? (
                    <></>
                ) : (
                    <Grid item xs={12}>
                        <Box>
                            <TextField variant="standard" 
                            value={props.searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search Apps/Flows/Actions"
                            multiline={true}
                            sx={{width: '40%', 
                                background: 'linear-gradient(317.7deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 105.18%), #EBECF0',
                                boxSizing: 'border-box', 
                                boxShadow: 'inset -5px -5px 10px #FAFBFF, inset 5px 5px 10px #A6ABBD',
                                backgroundBlendMode: 'soft-light, normal', 
                                borderRadius: '10px', 
                                border: '1px solid rgba(255, 255, 255, 0.4)', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                minHeight: '50px'}}
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{marginLeft: 1}}/>
                                    </InputAdornment>
                                )
                            }}/>
                        </Box>
                    </Grid>
                )} 
                
            </Grid>
        </Box>
    )
}

export default ApplicationHeader