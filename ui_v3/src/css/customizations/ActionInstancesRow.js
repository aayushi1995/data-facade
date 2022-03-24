import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({

    box_root: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 40,
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
    instance: {
        marginLeft: 10,
        marginRight: 10,
        display: 'flex'
    },
    rendered_template: {
        color: '#616161'
    },
    collapse_in: {
        paddingTop: 10,
        paddingBottom: 10
    },
    action_instance: {
        marginTop: 20,
        marginBottom: 20,
        color: 'dodgerblue'
    },
    action_parameter: {
        marginTop: 20,
        marginBottom: 20,
        color: 'green'
    },
    mutation_result: {
        marginLeft: 10,
        marginTop: 20
    },
    execute_button: {
        backgroundColor: 'green',
        color: 'white'
    },
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '80vh',
        minWidth: 1000
    }


}));

export default useStyles;
