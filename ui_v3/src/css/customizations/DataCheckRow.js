import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(() => ({

    box_root: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 40,
        borderColor: '#bdbdbd'

    },
    grid_root: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10
    },
    collapse: {
        color: '#616161',
        fontSize: 30
    },
    link: {
        color: '#616161',
        textDecoration: 'none'
    },
    divider: {
        marginLeft: 5,
        marginRight: 5
    },
    data_checks_icon: {
        width: 24,
        height: 24
    },
    c616161: {
        color: '#616161'
    },
    collapse_in: {
        paddingTop: 20,
        paddingBottom: 20
    },
    action_def: {
        marginTop: 20,
        marginBottom: 20,
        color: 'dodgerblue'
    },
    button: {
        backgroundColor: 'green',
        color: 'white',
        '&:hover': {
            backgroundColor: 'green',
            color: 'white'
        }
    },
    update_action_def: {
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 10,
        fontSize: 18,
        color: 'dodgerblue',
        letterSpacing: 0.3
    },
    param_def_det: {
        marginTop: 20,
        marginBottom: 20,
        color: 'green'
    },
    update_action_def: {
        marginTop: 20,
        marginBottom: 20
    },
    dialogPaper: {
        minHeight: '60vh',
        maxHeight: '70vh',
        minWidth: 1100
    }
}));

export default useStyles