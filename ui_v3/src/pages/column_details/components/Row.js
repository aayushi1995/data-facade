import React from 'react'
import {Link, useRouteMatch} from 'react-router-dom'

import {makeStyles} from '@material-ui/styles'
import {Box, Collapse, Divider, Grid, IconButton, Table, TableBody, TableCell, TableRow} from '@material-ui/core'
import {Cell, Legend, Pie, PieChart, ResponsiveContainer} from 'recharts'
import {KeyboardArrowDown, KeyboardArrowRight, Tv} from '@material-ui/icons'
import ErrorIcon from '@material-ui/icons/Error'
import TableChartIcon from '@material-ui/icons/TableChart'
import BarChartIcon from '@material-ui/icons/BarChart'

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
        paddingTop: 15,
        paddingBottom: 15,
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
const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];


const Row = (props) => {


    const [click, setClick] = React.useState(false)
    const [moreOpen, setMoreOpen] = React.useState(false)


    const classes = useStyles();
    let match = useRouteMatch();

    const pieChartData = [
        {name: 'Failed', value: props.data.checks.failed},
        {name: "Passed", value: props.data.checks.passed}
    ]

    const handleSetClick = (event) => {
        setClick(event)
    }

    return (

        <Box border={1} className={classes.box_root}>
            <Grid container spacing={0} className={classes.grid_root} onClick={() => {
                handleSetClick(!click)
            }}>
                <Grid item xs={1} style={{display: 'flex'}}>
                    <IconButton size="small" onClick={() => handleSetClick(!click)}>
                        {click ? <KeyboardArrowDown className={classes.collapse}/> :
                            <KeyboardArrowRight className={classes.collapse}/>}
                    </IconButton>
                    <Divider orientation="vertical" flexItem style={{marginLeft: 5, marginRight: 5}}/>
                    <IconButton disabled style={{color: '#42a5f5'}}>
                        <TableChartIcon/>
                    </IconButton>
                </Grid>
                <Grid item xs={10} style={{fontSize: 20, paddingLeft: 10, paddingRight: 10}}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4} style={{display: 'flex', fontSize: 18, alignItems: 'center'}}>
                            {props.data.tableUniqueName}
                        </Grid>
                        <Grid item xs={12} sm={3}
                              style={{color: '#616161', fontSize: 16, alignItems: 'center', display: 'flex'}}>
                            Last Modified by {props.data.modifiedBy}
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Grid container spacing={0} style={{
                                display: 'flex',
                                paddingLeft: 10,
                                paddingRight: 10,
                                color: '#616161',
                                alignItems: 'center'
                            }}>
                                <Grid item xs={3} style={{display: 'flex', fontSize: 16}}>
                                    <Tv style={{color: '#388e3c'}}/>
                                    <span style={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        marginLeft: 5
                                    }}> {props.data.jobs} Jobs </span>
                                </Grid>
                                <Grid item xs={3} style={{display: 'flex', fontSize: 16}}>
                                    <ErrorIcon style={{color: '#d32f2f'}}/>
                                    <span style={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        marginLeft: 5
                                    }}>{props.data.errors} Errors</span>
                                </Grid>
                                <Grid item xs={3} style={{display: 'flex', fontSize: 16}}>
                                    <BarChartIcon style={{color: '#000000'}}/>
                                    <span style={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        marginLeft: 5
                                    }}>{`${props.data.checks.passed + props.data.checks.failed}`} Checks</span>
                                </Grid>
                                <Grid item xs={3} style={{display: 'flex', fontSize: 16, justifyContent: 'flex-end'}}>
                                    <Link to={`${match.url}/${props.data.tableUniqueName}`} className={classes.link}
                                          onClick={() => {
                                              setClick(click)
                                          }}> Show Details </Link>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Collapse in={click} timeout="auto" unmountOnExit style={{paddingTop: 20, paddingBottom: 20}}>
                        <Grid container spacing={2}>
                            <Grid item xs={4} style={{backgroundColor: 'red'}} style={{paddingLeft: 40}}>
                                <ResponsiveContainer minWidth={200} height={200}>
                                    <PieChart style={{display: 'flex', alignItems: 'center'}}>
                                        <Pie
                                            data={pieChartData}
                                            cx={100}
                                            cy={100}
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {
                                                pieChartData.map((entry, index) => <Cell key={`cell-${index}`}
                                                                                         fill={COLORS[index % COLORS.length]}/>)
                                            }
                                        </Pie>
                                        <Legend layout="vertical" verticalAlign="middle" align="left"/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </Grid>
                            <Grid item xs={8}>
                                <Grid container spacing={0}>
                                    <Grid item xs={5}>
                                        <Table>
                                            <TableBody>
                                                {
                                                    props.data.tableDetails.map((tableRow, index) => (
                                                        <TableRow key={`tableRow-${index}`}>
                                                            <TableCell>{tableRow.heading}</TableCell>
                                                            <TableCell>{tableRow.details}</TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
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

export default Row;