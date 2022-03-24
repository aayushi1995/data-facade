import React from 'react'
import {Link, useRouteMatch} from 'react-router-dom'

import { makeStyles } from '@mui/styles'
import {Box, Divider, Grid, IconButton} from '@mui/material'
import TableChartIcon from '@mui/icons-material/TableChart'

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

const Row = (props) => {

    console.log(props)
    const [click, setClick] = React.useState(false)


    const classes = useStyles();
    let match = useRouteMatch();


    return (

        <Box border={1} className={classes.box_root}>
            <Grid container spacing={0} className={classes.grid_root}>
                <Grid item xs={1} style={{display: 'flex'}}>
                    <Divider orientation="vertical" flexItem style={{marginLeft: 5, marginRight: 5}}/>
                    <IconButton disabled style={{color: '#42a5f5'}}>
                        <TableChartIcon/>
                    </IconButton>
                </Grid>
                <Grid item xs={10} style={{fontSize: 20, paddingLeft: 10, paddingRight: 10}}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4} style={{display: 'flex', fontSize: 18, alignItems: 'center'}}>
                            {props.data.TableUniqueName}
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Grid container spacing={0} style={{
                                display: 'flex',
                                paddingLeft: 10,
                                paddingRight: 10,
                                color: '#616161',
                                alignItems: 'center'
                            }}>
                                <Grid item xs={3} style={{display: 'flex', fontSize: 16, justifyContent: 'flex-end'}}>
                                    <Link to={`${match.url}/${props.data.TableUniqueName}`} className={classes.link}
                                          onClick={() => {
                                              setClick(click)
                                          }}> Show Details </Link>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>


    )
}

export default Row;