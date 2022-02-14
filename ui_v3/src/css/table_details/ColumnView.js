import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(() => ({
    grid_root: {
        marginBottom: 10
    },
    button: {
        height: 40,
        backgroundColor: 'green',
        color: 'white',
        display: 'flex',
        marginRight: 10,
        marginLeft: 10
    },
    button_container: {
        alignItems: 'center'
    }

}));

export default useStyles;