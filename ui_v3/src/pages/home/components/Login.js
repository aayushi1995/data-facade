import {Button} from '@mui/material'
import { makeStyles } from '@mui/styles'
import COLORS from "../../../assets/theme.color";
import { ArrowForwardIosOutlined } from "@mui/icons-material";
import useLogin from "../../../hooks/useLogin";


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
    const { handleLogin } = useLogin()
    return (
        <Button
            onClick={handleLogin}
            variant="outlined"
            className={classes.button}
            endIcon={<ArrowForwardIosOutlined/>}
        >
            Log In
        </Button>

    )
}

export default LoginButton