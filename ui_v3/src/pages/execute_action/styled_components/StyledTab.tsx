import { Tab, TabProps, Tabs, TabsProps } from "@mui/material";
import { styled } from "@mui/styles";


export const ExecuteActionStyledTab = styled(Tab)<TabProps>(({theme}) => ({
    textTransform: 'none',
    fontFamily: "SF Pro Text",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "24px",
    color: '#253858',
    '& .Mui-selected': {
        color: '#162EE7'
    },
    '& .Mui-focusVisible': {
        backgroundColor: 'rgba(214, 226, 251, 0.5)'
    },
    '&:hover': {
        color: '#40a9ff',
        opacity: 1,
    },
}))

export const ExecuteActionStyledTabs = styled(Tabs)<TabsProps>(({theme}) => ({
    '& .MuiTabs-indicator': {
        background: 'rgba(214, 226, 251, 0.5)'
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: '#635ee7',
    },
}))