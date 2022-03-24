import React from "react";
import {Button} from '@mui/material'
import {useAuth0} from "@auth0/auth0-react";
import { makeStyles } from '@mui/styles'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {LOGIN_STATE_KEY, LOGIN_STATE_PROGRESS_VALUE} from "../EULA";

const useStyles = makeStyles(() => ({

    button: {
        height: 50,
        width: 200,
        alignContent: 'center',
        alignItems: 'center',
        display: 'flex',
        backgroundColor: 'orange',
        color: 'white',
        border: 'orange',
        borderRadius: 0,
        fontSize: 18,
        letterSpacing: 0.3,
        '&:hover': {
            color: 'orange',
            border: '1px solid orange'
        }
    }
}));

const LoginButton = () => {

    const classes = useStyles()
    const {loginWithRedirect} = useAuth0();
    return (
        <Button
            onClick={() => {
                localStorage.setItem(LOGIN_STATE_KEY, LOGIN_STATE_PROGRESS_VALUE)
                loginWithRedirect()
            }}
            variant="outlined"
            className={classes.button}
            endIcon={<LockOpenIcon/>}
        >
            Log In
        </Button>

    )
}

export default LoginButton