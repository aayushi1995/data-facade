import { DataGrid } from '@material-ui/data-grid';
import { Typography } from "@material-ui/core";
import { CustomToolbar } from './CustomToolbar';


const QueryData = (props) => {
    const columnData = props?.props[0]?.schema
    console.log(props)
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
    console.log(columnData, column)
    return (
        (columnData !== undefined && rowData !== undefined) ? (
            <DataGrid autoHeight columns={column} rows={rowData}
            components={{
                Toolbar: CustomToolbar([])
            }}
            ></DataGrid>) :
            //TODO: if output is table then only show table, else show chart
            (<Typography>
                An error occurred, check dev logs for more details and contact support.
            </Typography>)
    )

}

export default QueryData