import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles(() => ({

    box_root: {
        marginTop: 10,
        marginBottom: 10,
        borderColor: '#bdbdbd',
        borderRadius: 10

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
        paddingTop: 20,
        paddingBottom: 20
    },
    link: {
        color: '#616161',
        textDecoration: 'none'
    },
    rotate: {
        animation: '$rotation 2s linear',
    },
    "@keyframes rotation": {
        "0%": {
            transform: 'rotate(45deg)'
        },
        "100%": {
            transform: 'rotate(360deg)'
        }
    },
    queued_task: {
        display: 'flex',
        fontSize: 18,
        alignItems: 'center'
    },
    started_execution: {
        color: '#616161'
    },
    cursor_pointer: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
    }
}));

export default useStyles;