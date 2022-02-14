import React from 'react'
import {makeStyles} from '@material-ui/styles'
import {Box, Collapse, Divider, Grid, IconButton, MenuItem, Select, Table, TableCell, TableRow} from '@material-ui/core'
import {KeyboardArrowDown, KeyboardArrowRight} from '@material-ui/icons'
import DataChecksIcon from './../../../images/data_check_icon.png'
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import {Link} from 'react-router-dom'


const endPoint = require("./../../../common/config/config").FDSEndpoint

const useStyles = makeStyles(() => ({

    box_root: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 40,
        borderColor: '#bdbdbd'

    },
    grid_root: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15
    },
    collapse: {
        color: '#616161',
        fontSize: 30
    },
    link: {
        color: '#616161',
        textDecoration: 'none'
    },
    table: {
        minWidth: 300,
    },

}));


const Passed = () => {
    return (
        <div style={{display: 'flex'}}>
            <CheckIcon style={{color: 'green'}}/>
            <span style={{display: 'flex', alignItems: 'center', color: 'green'}}>Check passed</span>
        </div>

    )
}
const Failed = () => {

    return (
        <div style={{display: 'flex'}}>
            <ClearIcon style={{color: 'red'}}/>
            <span style={{display: 'flex', alignItems: 'center', color: 'red'}}>&nbsp;Check failed</span>
        </div>

    )
}

const ChecksRow = (props) => {

    console.log("in checks row ", props)
    const [click, setClick] = React.useState(false)
    const [runState, setRunState] = React.useState(10)
    const runs = []

    const classes = useStyles();

    const handleSetClick = (event) => {
        setClick(event)
    }
    const handleRuns = (event) => {

        setRunState(event.target.value)
    }

    const executions = props.instance.ActionExecutions
    const sortedExecutions = executions.sort((a, b) => {
        return (b.ExecutionStartedOn - a.ExecutionStartedOn)
    })

    sortedExecutions.forEach((execution) => {
        const timestamp = new Date(execution.ExecutionStartedOn).toUTCString()
        const output = JSON.parse(execution.Output)
        let res
        if (output.State === 'Ok' && output.Value) res = true
        else res = false
        runs.push({timestamp: timestamp, res: res, Id: execution.Id})
    })


    return (
        <Box border={1} className={classes.box_root}>
            <Grid container spacing={0} className={classes.grid_root}>
                <Grid item xs={1} style={{display: 'flex'}} onClick={() => {
                    handleSetClick(!click)
                }}>
                    <IconButton size="small" onClick={() => handleSetClick(!click)}>
                        {click ? <KeyboardArrowDown className={classes.collapse}/> :
                            <KeyboardArrowRight className={classes.collapse}/>}
                    </IconButton>
                    <Divider orientation="vertical" flexItem style={{marginLeft: 5, marginRight: 5}}/>
                    <IconButton disabled style={{color: 'black'}}>
                        <img src={DataChecksIcon} style={{width: 24, height: 24}} alt="Data Checks Icon"/>
                    </IconButton>
                </Grid>
                <Grid item xs={11} style={{fontSize: 20, paddingLeft: 10, paddingRight: 10}} onClick={() => {
                    handleSetClick(!click)
                }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4} style={{display: 'flex', fontSize: 18, alignItems: 'center'}}>
                            {props.instance.ActionInstance.DisplayName}
                        </Grid>
                        <Grid item xs={12} sm={3}
                              style={{color: '#616161', fontSize: 16, alignItems: 'center', display: 'flex'}}>
                            {props.instance.ActionInstance.RenderedTemplate}
                        </Grid>

                        <Grid item xs={12} sm={5} style={{display: 'flex', alignItems: 'center'}}>
                            <Grid container spacing={0} style={{
                                display: 'flex',
                                paddingLeft: 10,
                                paddingRight: 10,
                                color: '#616161',
                                alignItems: 'center'
                            }}>
                                <Grid item xs={6} style={{display: 'flex', fontSize: 16, alignItems: 'center'}}>
                                    <span style={{alignItems: 'center', display: 'flex', marginLeft: 5}}>rty</span>
                                </Grid>
                                <Grid item xs={6} style={{display: 'flex', fontSize: 16}}>
                                    <span style={{alignItems: 'center', display: 'flex', marginLeft: 5}}>hg</span>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={click} timeout="auto" unmountOnExit style={{paddingTop: 20, paddingBottom: 20}}>
                        <Grid container spacing={0} style={{display: 'flex'}}>
                            <Grid item xs={12} style={{justifyContent: 'flex-end', display: 'flex'}}>
                                <Select
                                    onChange={handleRuns}
                                    value={runState}
                                    variant="outlined"
                                    style={{width: 200}}

                                >
                                    <MenuItem value={10}>Latest 10 runs</MenuItem>
                                    <MenuItem value={50}>Latest 50 runs</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={0} style={{overflow: 'auto'}}>
                                    <Grid item xs={12}>
                                        <Table className={classes.table}>
                                            <TableRow>
                                                <TableCell style={{minWidth: 150}}></TableCell>
                                                {
                                                    runs.slice(0, Math.min(runs.length, runState)).map((run) => (
                                                        <TableCell style={{minWidth: 150}}>{run.timestamp}</TableCell>
                                                    ))
                                                }
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{minWidth: 150}}>Check Status</TableCell>
                                                {
                                                    runs.slice(0, Math.min(runs.length, runState)).map((run) => (
                                                        <Link to={{
                                                            pathname: '/jobs',
                                                            state: {
                                                                "search": run.Id,
                                                                "from": 'table_details_checks_row',
                                                                "filter": 'Action Execution Id'
                                                            }

                                                        }} className={classes.link}>
                                                            <TableCell style={{minWidth: 150}}>{(run.res) ? <Passed/> :
                                                                <Failed/>}</TableCell>
                                                        </Link>
                                                    ))
                                                }
                                            </TableRow>
                                        </Table>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        </Box>
    )

}
export default ChecksRow