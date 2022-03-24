import React from 'react'
import { makeStyles } from '@mui/styles'
import {
    Box,
    Collapse,
    Divider,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import {
    Bar,
    BarChart,
    Brush,
    CartesianGrid,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import {KeyboardArrowDown, KeyboardArrowRight} from '@mui/icons-material'
import {Link} from 'react-router-dom'
import DataChecksIcon from './../../../images/data_check_icon.png'


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
    }

}));


const QuickStatSingleValue = (props) => {

    if (props.data === undefined || props.data.length === 0 || (props.data.ActionExecution.filter((execution, index) => execution.Status !== 'Completed').length > 0)) {
        return <></>
    }

    const outputData = JSON.parse(props.data.ActionExecution[0].Output)
    return (
        <Grid container spacing={0} style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
            <Grid item style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                <Box position="relative" display="inline-flex">
                    <CircularProgress variant="determinate" value={100} size={200} style={{color: 'brown'}}
                                      thickness={2}/>
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="caption" component="div" color="textSecondary"
                                    style={{fontSize: 20, color: 'brown'}}>
                            <center>Distinct Count<br/>{outputData.Value}</center>
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )

}

const QuickStatTimeSeries = (props) => {

    const dataToDisplay = []
    if (props.data === undefined) return (<></>)

    props.data.ActionExecution.forEach((execution) => {
        if (execution.Status === 'Completed') {
            dataToDisplay.push({
                "Timestamp": new Date(execution.ExecutionStartedOn * 1000).toDateString(),
                "Value": JSON.parse(execution.Output).Value
            })
        }
    })
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                height={300}
                data={dataToDisplay}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="Timestamp"/>
                <YAxis/>
                <Tooltip/>
                <Legend verticalAlign="top" wrapperStyle={{lineHeight: '40px'}}/>
                <ReferenceLine y={0} stroke="#000"/>
                <Brush dataKey="Timestamp" height={30} stroke="#8884d8"/>
                <Bar dataKey="Value" fill="#82ca9d"/>
            </BarChart>
        </ResponsiveContainer>
    )
}

const QuickStatsRow = (props) => {

    const [click, setClick] = React.useState(false)

    const classes = useStyles();

    const handleSetClick = (event) => {
        setClick(event)
    }

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
                            {props.action.ActionInstance.Name}
                        </Grid>
                        <Grid item xs={12} sm={3}
                              style={{color: '#616161', fontSize: 16, alignItems: 'center', display: 'flex'}}>
                            Last run
                            on {new Date(props.action.ActionExecution[props.action.ActionExecution.length - 1].ExecutionStartedOn * 1000).toDateString()}
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
                                    <span style={{alignItems: 'center', display: 'flex', marginLeft: 5}}></span>
                                </Grid>
                                <Grid item xs={6} style={{display: 'flex', fontSize: 16}}>
                                    <Link to={{
                                        pathname: '/jobs',
                                        state: {
                                            "from": 'quick_stats_table_level',
                                            "search": props.action.ActionInstance.Id,
                                            "filter": "Action Instance Id"

                                        }
                                    }}
                                          className={classes.link}
                                    >
                                        <span style={{alignItems: 'center', display: 'flex', marginLeft: 5}}>Show all executions</span>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Collapse in={click} timeout="auto" unmountOnExit style={{paddingTop: 20, paddingBottom: 20}}>
                        <Grid container spacing={0}>
                            <Grid item xs={4} style={{marginTop: 20, marginBottom: 20}}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Query</TableCell>
                                            <TableCell>{props.action.ActionInstance.RenderedTemplate}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Recurring</TableCell>
                                            <TableCell>{(props.action.ActionInstance.IsRecurring) ? "Yes" : "No"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                            <Grid item xs={4} style={{marginTop: 20, marginBottom: 20}}>
                                {(props.action.ActionDefinition.PresentationFormat === 'single_value' && props.action.ActionExecution.length === 1) ? (
                                    <QuickStatSingleValue data={props.action}/>
                                ) : (props.action.ActionDefinition.PresentationFormat === 'single_value' && props.action.ActionExecution.length > 1) ? (
                                    <QuickStatTimeSeries data={props.action}/>
                                ) : <></>}
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        </Box>
    )
}

export default QuickStatsRow