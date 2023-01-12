import React from "react";
import {Button} from '@mui/material'
import {useAuth0} from "@auth0/auth0-react";
import { makeStyles } from '@mui/styles'
import {LOGIN_STATE_KEY, LOGIN_STATE_PROGRESS_VALUE} from "../EULA";
import COLORS from "../../../assets/theme.color";
import { ArrowForwardIosOutlined } from "@mui/icons-material";

const useStyles = makeStyles(() => ({

    button: {
        height: 50,
        width: 140,
        backgroundColor: `${COLORS.PRIMARY}!important`,
        color: `${COLORS.WHITE}!important`,
        borderRadius: '8px!important',
        fontSize: 18,
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
            endIcon={<ArrowForwardIosOutlined/>}
        >
            Log In
        </Button>

    )
}

export default LoginButton