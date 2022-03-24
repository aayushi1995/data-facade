import { makeStyles } from '@mui/styles'

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
    config_icon: {
        height: 24,
        width: 24
    },
    divider: {
        marginLeft: 5,
        marginRight: 5
    },
    item_style: {
        fontSize: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    desc: {
        color: '#616161',
        fontSize: 16,
        alignItems: 'center',
        display: 'flex'
    },
    collapse_grid: {
        paddingTop: 20,
        paddingBottom: 20
    },
    new_instance: {
        marginLeft: 30,
        color: 'red',
        fontSize: 20,
        letterSpacing: 0.3
    },
    text_field: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        width: '100%'
    },
    create_button: {
        backgroundColor: 'green',
        margin: 0,
        color: '#ffffff',
        '&:hover': {
            color: '#ffffff',
            backgroundColor: 'green'
        }
    },
    loading_indicator: {
        marginLeft: 10,
        marginTop: 20,
        display: 'flex',
        alignItems: 'center'
    },
    success: {
        marginLeft: 10,
        marginTop: 20,
        display: 'flex',
        justifyItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'green',
        letterSpacing: 0.6
    },
    button_margin: {
        marginTop: 20,
        marginLeft: 5,
        marginRight: 5
    },
    check_circle: {
        color: 'green'
    }

}));

export default useStyles;
