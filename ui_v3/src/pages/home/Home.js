import React from "react";
import {Grid} from '@mui/material'
import {useAuth0} from "@auth0/auth0-react";
import LoginButton from "./components/Login"
import useHomeStyles from './../../css/home/Home'


const Home = () => {
    console.log("in home page")
    const classes = useHomeStyles();
    const {isAuthenticated} = useAuth0();
    const [index, setIndex] = React.useState(0);
    return (
        <>
            <Grid container spacing={0} className={classes.welcome_header}>
                <Grid xs={12} item container justifyContent="center" alignItems="center">
                    <div className={classes.button_div}>
                        Welcome to Data Facade<br/>
                        <center className={classes.login_button}>
                            <LoginButton/>
                        </center>
                    </div>
                </Grid>
            </Grid>
        </>
    )
}

export default Home


