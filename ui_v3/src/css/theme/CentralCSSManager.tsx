
export const TableTheme = () => {
    return ({
        "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#c3d7f7",
            fontFamily: 'sans-serif',
            fontSize: '14px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#797a7a',
        },
        "& .MuiDataGrid-row": {
            border: '0px solid black !important',
        },
        backgroundColor: 'ActionCardBgColor.main',
        height: 900,
        overflow: 'scroll',
    }
    )
}

export const SearchBar = () => {
    return ({
        backgroundColor: '#fff',
        boxSizing: 'border-box',
        backgroundBlendMode: 'soft-light, normal',
        borderRadius: '6px',
        display: 'flex',
        border: '0.539683px solid rgba(0, 0, 0, 0.23)',
        justifyContent: 'center',
        minHeight: '5vh'
    })
}