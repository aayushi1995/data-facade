import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({

    select_all: {
        color: "#ffffff",
        background: "#78c4d4"
    },
    grid_root: {
        marginLeft: 40,
        marginRight: 40
    },
    remove_all: {
        color: "#ffffff",
        background: "#78c4d4"
    },
    delete: {
        color: "#ffffff",
        background: "#ff7171"
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: '50%',
        backgroundColor: "white",
        border: '2px solid #000',
        boxShadow: "",
        padding: "40px",
        maxHeight: "400px",
        overflow: "scroll"
    },
}));

export default useStyles;
