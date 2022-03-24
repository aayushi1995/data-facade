import React from 'react'
import { makeStyles } from '@mui/styles'
import {Box, Collapse, Divider, Grid, IconButton, Table, TableBody, TableCell, TableRow} from '@mui/material'
import {Brush, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

import {KeyboardArrowDown, KeyboardArrowRight} from '@mui/icons-material'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
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

const CheckPassed = () => {

    return (
        <>
            <CheckIcon style={{color: 'green'}}/>
            <span style={{alignItems: 'center', display: 'flex', marginLeft: 5, color: 'green'}}>
                Check run passed
            </span>
        </>
    )

}
const CheckFailed = () => {
    return (
        <>
            <CloseIcon style={{color: 'red'}}/>
            <span style={{alignItems: 'center', display: 'flex', marginLeft: 5, color: 'red'}}>
                Check run failed
            </span>
        </>
    )
}

const ChecksSingleValue = (props) => {
    return (
        <></>
    )
}

const MyDot = (props) => {
    const {cx, cy, value} = props;
    if (value === 1) {
        return (
            <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="green" viewBox="0 0 1024 1024">
                <path
                    d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z"/>
            </svg>
        )
    } else {
        return (
            <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="red" viewBox="0 0 1024 1024">
                <path
                    d="M517.12 53.248q95.232 0 179.2 36.352t145.92 98.304 98.304 145.92 36.352 179.2-36.352 179.2-98.304 145.92-145.92 98.304-179.2 36.352-179.2-36.352-145.92-98.304-98.304-145.92-36.352-179.2 36.352-179.2 98.304-145.92 145.92-98.304 179.2-36.352zM663.552 261.12q-15.36 0-28.16 6.656t-23.04 18.432-15.872 27.648-5.632 33.28q0 35.84 21.504 61.44t51.2 25.6 51.2-25.6 21.504-61.44q0-17.408-5.632-33.28t-15.872-27.648-23.04-18.432-28.16-6.656zM373.76 261.12q-29.696 0-50.688 25.088t-20.992 60.928 20.992 61.44 50.688 25.6 50.176-25.6 20.48-61.44-20.48-60.928-50.176-25.088zM520.192 602.112q-51.2 0-97.28 9.728t-82.944 27.648-62.464 41.472-35.84 51.2q-1.024 1.024-1.024 2.048-1.024 3.072-1.024 8.704t2.56 11.776 7.168 11.264 12.8 6.144q25.6-27.648 62.464-50.176 31.744-19.456 79.36-35.328t114.176-15.872q67.584 0 116.736 15.872t81.92 35.328q37.888 22.528 63.488 50.176 17.408-5.12 19.968-18.944t0.512-18.944-3.072-7.168-1.024-3.072q-26.624-55.296-100.352-88.576t-176.128-33.28z"/>
            </svg>
        );
    }
}

const ChecksTimeSeries = (props) => {

    const dataToDisplay = []
    props.data.ActionExecution.forEach((execution) => {
        dataToDisplay.push({
            "Timestamp": new Date(execution.ExecutionStartedOn * 1000).toDateString(),
            "Value": (JSON.parse(execution.Output).Value) ? 1 : 0
        })
    })
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
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
                <YAxis datakey="Value"/>
                <Tooltip/>
                <Legend verticalAlign="top" wrapperStyle={{lineHeight: '40px'}}/>
                <Line type="monotone" dataKey="Value" strokeWidth={0} dot={<MyDot/>}/>
                <Brush dataKey="Timestamp" height={30} stroke="#8884d8"/>
            </LineChart>
        </ResponsiveContainer>
    )

}

const ChecksRow = (props) => {

    const classes = useStyles();

    const [click, setClick] = React.useState(false)

    const handleSetClick = (event) => {
        setClick(event)
    }

    const executionState = JSON.parse(props.action.ActionExecution[props.action.ActionExecution.length - 1].Output).State

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
                        <img src={DataChecksIcon} style={{width: 24, height: 24}} alt="Data Check Icon"/>
                    </IconButton>
                </Grid>
                <Grid item xs={11} style={{fontSize: 20, paddingLeft: 10, paddingRight: 10}} onClick={() => {
                    handleSetClick(!click)
                }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={2} style={{display: 'flex', fontSize: 18, alignItems: 'center'}}>
                            {props.action.ActionInstance.Name}
                        </Grid>


                        <Grid item xs={12} sm={2}
                              style={{color: '#616161', fontSize: 16, alignItems: 'center', display: 'flex'}}>
                            {(executionState === "Ok") ? <CheckPassed/> : (<CheckFailed/>)}
                        </Grid>

                        <Grid item xs={2} sm={2}
                              style={{display: 'flex', fontSize: 16, alignItems: 'center', color: '#616161'}}>
                            Last run
                            on {new Date(props.action.ActionExecution[props.action.ActionExecution.length - 1].ExecutionStartedOn * 1000).toDateString()}
                        </Grid>

                        <Grid item xs={12} sm={3} style={{display: 'flex', alignItems: 'center'}}>
                            <Grid container spacing={0} style={{
                                display: 'flex',
                                paddingLeft: 10,
                                paddingRight: 10,
                                color: '#616161',
                                alignItems: 'center'
                            }}>

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
                                {(props.action.ActionExecution.length === 1) ? (
                                    <ChecksSingleValue data={props.action}/>
                                ) : (props.action.ActionExecution.length > 1) ? (
                                    <ChecksTimeSeries data={props.action}/>
                                ) : <></>}
                            </Grid>
                        </Grid>

                    </Collapse>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ChecksRow