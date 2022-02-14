import React from 'react'
import {Grid} from '@material-ui/core'
import NoDataIcon from './../../images/no_data_icon.png'


const NoData = (props) => {

    return (
        <Grid container style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center'
        }}>
            <Grid item xs={12} style={{display: 'flex', marginTop: 60, marginBottom: 20, justifyContent: 'center'}}>
                <img src={NoDataIcon} height={48} width={48} alt="No Data Icon"/>
            </Grid>
            <Grid item>
                No data found.
            </Grid>
        </Grid>
    )

}

export default NoData