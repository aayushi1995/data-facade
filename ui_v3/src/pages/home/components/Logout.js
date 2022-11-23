import React, {useContext} from "react";
import {useAuth0} from "@auth0/auth0-react";
import { makeStyles } from '@mui/styles'
import AppContext from "../../../utils/AppContext";
import {Button, Grid} from "@mui/material";

const useStyles = makeStyles(() => ({
    "button:hover": {
        textDecoration: 'underline',
        cursor: 'pointer'
    }
}));


const LogoutButton = () => {

    const classes = useStyles()
    const {logout} = useAuth0()
    const appcontext = useContext(AppContext);
    const handleLogout = () => {
        appcontext.setUserName(null);
        appcontext.setUserEmail(null);
        appcontext.setToken(null);
        logout()
    }

    return (
        <Button onClick={handleLogout}
                variant="outlined">
            Log Out
        </Button>
    )
}

export default LogoutButton