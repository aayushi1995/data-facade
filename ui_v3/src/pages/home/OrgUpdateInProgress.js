import { Grid } from '@mui/material'
import useStyles from './../../css/home/Home'
import Logout from './components/Logout'

const OrgUpdateInProgress = () => {

    const classes = useStyles()

    return (
        <>
            <Grid container spacing={0} className={classes.welcome_header}>
                <Grid xs={12} item container justifyContent="center" alignItems="center">
                    <div className={classes.button_div}>
                        Your Org is undergoing an update. Please wait for a few minutes.<br/>
                        <center className={classes.login_button}>
                            Contact us on admin@data-facade.com if it takes too long
                        </center>
                        <center className={classes.login_button}>
                            <Logout/>
                        </center>

                    </div>
                </Grid>
            </Grid>
        </>
    )

}

export default OrgUpdateInProgress