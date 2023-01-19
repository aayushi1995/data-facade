import { Box, Stack } from "@mui/material"
import { DataGrid, DataGridProps, GridCellParams, GridValueGetterParams } from "@mui/x-data-grid"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import { ActionRun } from "../../../generated/interfaces/Interfaces"
import { DurationCell } from "../../../pages/apps/components/ApplicationRunsByMe"
import { TextCell, TimestampCell } from "../../../pages/table_browser/components/AllTableView"
import useShowActionHistory from "../../hooks/useShowActionHistory"


const ShowActionHistory = () => {

    const {fetchActionRuns, displayActionOutput, displayWorkflowOutput} = useShowActionHistory()

    const getSxProps = () => {
        return {
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},
            backgroundColor: 'ActionCardBgColor.main',
            backgroundBlendMode: "soft-light, normal",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
            borderRadius: "15px",
            minHeight: "100%"
        }
    }

    const datagridProps: DataGridProps = {
        rows: (fetchActionRuns?.data || []).map(row => ({...row, id: row.ActionExecutionId})),
        columns: [
            {
                field: "RunBy",
                headerName: "Run By",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, ActionRun, any>) => <TextCell text={params.row.RanBy} />
            },
            {
                field: "ActionExecutionStatus",
                headerName: "Status",
                width: 200,
                renderCell: (params: GridCellParams<any, ActionRun, any>) => <TextCell text={params.row.ActionExecutionStatus}/>
            },
            {
                field: "ActionExecutionStartedOn",
                headerName: "Started",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, ActionRun, any>) => <TimestampCell timestamp={params.row.ActionExecutionStartedOn}/>,
                valueGetter: (params: GridValueGetterParams<any, ActionRun>) => params?.row?.ActionExecutionStartedOn
            },
            {
                field: "Duration",
                headerName: "Duration",
                flex: 1,
                width: 50,
                renderCell: (params: GridCellParams<any, ActionRun, any>) => <DurationCell start={params.row.ActionExecutionStartedOn} end={params?.row?.ActionExecutionCompletedOn}/>
            },
            {
                field: "ActionExecutionCompletedOn",
                headerName: "Completed",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, ActionRun, any>) => <TimestampCell timestamp={params.row.ActionExecutionCompletedOn}/>,
                valueGetter: (params: GridValueGetterParams<any, ActionRun>) => params?.row?.ActionExecutionCompletedOn
            },
            {
                field: "Result",
                headerName: "Result",
                width: 100,
                renderCell: (params: GridCellParams<any, ActionRun, any>) => <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", cursor: "pointer", color: "#2155CD", "&:hover": { backgroundColor: "#E6E6E6", color: "#40DFEF" } }}><span style={{ width: "100%", textAlign: "center" }}>Show</span></Box>
            },
        ],
        sx: {
            ...getSxProps()
        },
        autoHeight: true,
        headerHeight: 70,
        rowsPerPageOptions: [5, 10, 25, 50, 100, 200],
        hideFooterSelectedRowCount: true,
        initialState: {
            pagination: {
                pageSize: 50
            }
        },
        onCellClick: (params: GridCellParams<unknown, ActionRun, unknown>, event, details) => {
            if(params?.colDef?.field === "Result") {
                if(params?.row?.isWorkflow) {
                    displayWorkflowOutput(params?.row?.ActionExecutionId, params?.row?.ActionDefinitionId, params?.row?.ActionInstanceId)
                } else {
                    displayActionOutput(params?.row?.ActionExecutionId, params?.row?.ActionDefinitionId, params?.row?.ActionInstanceId)
                }
            }
        }
    }

    return (
        <Box>
            <Box>
            <ReactQueryWrapper
                    {...fetchActionRuns}
                    children={() => 
                        <DataGrid {...datagridProps} components={{
                            NoRowsOverlay: () => (
                            <Stack height="100%" fontSize="18px" alignItems="center" justifyContent="center">
                                Nothing to show 
                            </Stack>
                            ),
                            LoadingOverlay: () => (
                                <Stack height="100%" fontSize="18px" alignItems="center" justifyContent="center">
                                    Table is Loading.....
                                </Stack>
                            )
                        }} />
                    }
                />
                
            </Box>
        </Box>    
    )
}

export default ShowActionHistory