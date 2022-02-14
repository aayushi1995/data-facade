import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(() => ({
    particles: {
        height: '100vh'
    },
    welcome_header: {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        zIndex: 5,
        fontSize: 30,
        letterSpacing: 0.3,
        fontWeight: 400
    },
    sub_heading: {
        fontSize: 18,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        color: '#444444'
    },
    button_div: {
        display: 'block',
        justify: 'center'
    },
    login_button: {
        paddingTop: 20,
        paddingBottom: 20
    }
}));

export default useStyles