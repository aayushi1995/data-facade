import { DataGrid } from '@mui/x-data-grid';
import { Typography } from "@mui/material";
import { CustomToolbar } from './CustomToolbar';


const QueryData = (props) => {
    const columnData = props?.props[0]?.schema
    let rowData = props.props[0]?.data
    let column = []
    let rows = []
    if (columnData !== undefined && rowData !== undefined) {
        for (let i = 0; i < columnData.length; i++) {
            column.push({
                    field: columnData[i].name,
                    headerName: columnData[i].name,
                    width: 300
                })
        for (let i = 0; i < rowData.length; i++) {
            rowData[i].id = i
            rows.push(rowData)
        }

    }}
    return (
        (columnData !== undefined && rowData !== undefined) ? (
            <DataGrid autoHeight columns={column} rows={rowData}
            components={{
                Toolbar: CustomToolbar([])
            }}
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
            initialState={{
                pagination: {
                    pageSize: 50
                }
            }}
            headerHeight={70}
            sx={{
                "& .MuiDataGrid-columnHeaders": { background: "#E8E8E8"}
            }}
            ></DataGrid>) :
            //TODO: if output is table then only show table, else show chart
            (<Typography>
                An error occurred, check dev logs for more details and contact support.
            </Typography>)
    )

}

export default QueryData