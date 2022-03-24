import React from 'react'
import {CircularProgress, Grid} from '@mui/material'

const LoadingIndicator = (props) => {

    return (
        <Grid container spacing={0} style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
            <Grid item xs={12} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 0,
                marginBottom: 0
            }}>
                <CircularProgress/>
            </Grid>
        </Grid>
    )
}

export default LoadingIndicator