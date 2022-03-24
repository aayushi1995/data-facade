import React from 'react'
import { makeStyles } from '@mui/styles'
import {Box, Collapse, Divider, Grid, IconButton} from '@mui/material'
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
import {useRouteMatch} from 'react-router-dom'
import DataChecksIcon from './../../images/data_check_icon.png'


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

const NullCountStat = (props) => {

    const [click, setClick] = React.useState(false)
    const [moreOpen, setMoreOpen] = React.useState(false)


    const classes = useStyles();
    let match = useRouteMatch();


    const handleSetClick = (event) => {
        setClick(event)
    }

    const handleSetMoreOpen = (event) => {
        setMoreOpen(event)
    }


    const data = props.data
    props.data.Runs.forEach((elem, index) => {
        data["Runs"][index].Name = new Date(elem.Timestamp * 1000).toDateString()
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
                        <img src={DataChecksIcon} style={{width: 24, height: 24}}/>
                    </IconButton>
                </Grid>
                <Grid item xs={11} style={{fontSize: 20, paddingLeft: 10, paddingRight: 10}} onClick={() => {
                    handleSetClick(!click)
                }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4} style={{display: 'flex', fontSize: 18, alignItems: 'center'}}>
                            {props.data.Name}
                        </Grid>
                        <Grid item xs={12} sm={3}
                              style={{color: '#616161', fontSize: 16, alignItems: 'center', display: 'flex'}}>
                            Last run
                            on {new Date(props.data.Runs[props.data.Runs.length - 1].Timestamp * 1000).toDateString()}
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
                                    <span style={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        marginLeft: 5,
                                        alignItems: 'center'
                                    }}></span>
                                </Grid>
                                <Grid item xs={6} style={{display: 'flex', fontSize: 16}}>
                                    <span style={{alignItems: 'center', display: 'flex', marginLeft: 5}}></span>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Collapse in={click} timeout="auto" unmountOnExit style={{paddingTop: 20, paddingBottom: 20}}>
                        <Grid item xs={12} style={{marginTop: 20, marginBottom: 20}}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={data.Runs}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="Name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend verticalAlign="top" wrapperStyle={{lineHeight: '40px'}}/>
                                    <ReferenceLine y={0} stroke="#000"/>
                                    <Brush dataKey="Name" height={30} stroke="#8884d8"/>
                                    <Bar dataKey="Count" fill="#82ca9d"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        </Box>
    )
}

export default NullCountStat