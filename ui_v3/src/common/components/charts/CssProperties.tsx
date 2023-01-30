export const collapseSummaryBox = {
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    alignItems: 'center'
}
export const collapseSummaryTypo = {
    fontFamily: "'SF Pro Text'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "157%",
    letterSpacing: "0.1px",
    color: "#353535"
}
export const tabStyle = {
    fontFamily: "'SF Pro Text'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "15px",
    letterSpacing: "0.124808px",
    textAlign:'left',
    mr:2,
    color: '#65676B',
    
    '& .Mui-selected': {
        color: '#3EB9FF',
        backgroundColor:'#ad6f0a',
    },
    '&:hover': {
        color: '#40a9ff',
        opacity: 1,
    },
}
export const tabsStyle = {
    ml:-2,
    '& .MuiTabs-indicator': {
        background: 'rgba(0,0,0,0)'
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: '#635ee7',
    },
}

export const PostTaskBTNContainer = {
    display: 'flex', 
    flexDirection: 'row', 
    ml: 'auto', 
    gap: 1,
    mr:2 
}
export const TabHeaderContainer = {
    display: 'flex', 
    alignItems: 'center'
}
export const ActionExecutionOutputContainer = {
    display: 'flex', 
    flexDirection: 'column', 
    gap: 2 
}