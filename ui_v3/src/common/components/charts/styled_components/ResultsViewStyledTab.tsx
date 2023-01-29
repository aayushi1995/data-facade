import { Tab } from "@mui/material";
import { withStyles } from '@mui/styles';

export const ActionExecutionResultTab = withStyles({
    root: {
        "&.MuiTab-root": {
            fontFamily: "'Segoe UI'",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "13px",
            lineHeight: "20px",
            color: '#65676B',
            textTransform: 'capitalize'
            
        }

    },
    
    selected: {
        "&.Mui-selected": {
            color: '#18AFFF!important',
        }
    }
})(Tab);