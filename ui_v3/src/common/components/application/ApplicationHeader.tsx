import { Box, Grid, Typography, Button, TextField, InputAdornment } from "@mui/material"
import AddIcon from "@material-ui/icons/Add"
import SearchIcon from '@mui/icons-material/Search';
import { useHistory, Link } from "react-router-dom";
import UploadApplicationButton from "../UploadApplicationButton";
import PreBuiltApplications from "./PreBuiltApplications";

interface ApplicationHeaderProps {
    pageHeader: string
    subHeading: string,
    fromApplicationDetail?: boolean,
    searchQuery?: string,
    setSearchQuery?: (e: string) => void
    applicationId?: string,
    handleDialogOpen?: () => void
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
                            <Typography variant="heroHeader" sx={{flex: 1}}>
                                Application
                            </Typography>
                            <Typography variant="heroMeta" sx={{flex: 1}}>
                                Create, Manage Applications from here
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2, minHeight: '80%'}}>
                            {props.fromApplicationDetail ? (
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
                                    pathname: "/application/build-action",
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
                            ) : (
                                <>
                                <Button sx={{flex: 1, borderRadius: '10px', bgcolor: 'black'}} variant="contained" onClick={() => props.handleDialogOpen?.()}>
                                    APP Builder <AddIcon sx={{marginLeft: 2}}/></Button>
                                <UploadApplicationButton/>
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
                                background: '#E0E5EC',
                                boxSizing: 'border-box', 
                                boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5), inset 4px 6px 16px rgba(163, 177, 198, 0.5);',
                                backgroundBlendMode: 'soft-light, normal', 
                                borderRadius: '26px',
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