import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(() => ({

    box_root: {
        marginTop: 10,
        marginBottom: 10,
        borderColor: '#bdbdbd'

    },
    grid_root: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15
    },
    collapse: {
        color: '#616161',
        fontSize: 30
    },
    link: {
        color: '#616161',
        textDecoration: 'none'
    },
    show_details: {
        display: 'flex',
        fontSize: 16,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    content: {
        color: '#616161',
        fontSize: 16,
        alignItems: 'center',
        display: 'flex'
    },
    button: {
        outline: "none",
        textDecoration: "none",
        textTransform: 'none',
        color: 'green',
        fontWeight: 400
    },
    select: {
        marginTop: 10,
        marginBottom: 10
    },
    submit: {
        background: 'green',
        color: 'white',
        marginTop: 10
    },
    check_circle: {
        color: 'green'
    },
    column_icon: {
        height: 24,
        width: 24
    }

}));

export default useStyles