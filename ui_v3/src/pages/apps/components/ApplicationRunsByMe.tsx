import { Box } from "@mui/material"
import { DataGrid, DataGridProps, GridCellParams, GridValueGetterParams } from "@mui/x-data-grid"
import { Application } from "../../../generated/entities/Entities"
import { TextCell, TimestampCell } from "../../table_browser/components/AllTableView"
import useApplicationRunsByMe, { Run } from "./UseApplicationRunsByMe"

export type ApplicationRunsByMeProps = {
    application?: Application
}

const ApplicationRunsByMe = (props: ApplicationRunsByMeProps) => {
    const {application} = props
    const { runs, displayActionOutput, displayWorkflowOutput, reRunWorkflow, reRunAction, dialogOpen, closeDialog, selectedActionExecutionIdForDialog } = useApplicationRunsByMe({ application: application })
    
    const datagridProps: DataGridProps = {
        rows: runs,
        columns: [
            {
                field: "ActionDefinitionActionType",
                headerName: "Action Type",
                width: 100,
                renderCell: (params: GridCellParams<any, Run, any>) => <TextCell text={params.row.ActionDefinitionActionType}/>
            },
            {
                field: "ActionInstanceName",
                headerName: "Instance Name",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, Run, any>) => <TextCell text={params.row.ActionInstanceName}/>
            },
            {
                field: "ActionDefinitionName",
                headerName: "Definition Name",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, Run, any>) => <TextCell text={params.row.ActionDefinitionName}/>
            },
            {
                field: "ActionExecutionStatus",
                headerName: "Status",
                width: 100,
                renderCell: (params: GridCellParams<any, Run, any>) => <TextCell text={params.row.ActionExecutionStatus}/>
            },
            {
                field: "ActionExecutionStartedOn",
                headerName: "Started",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, Run, any>) => <TimestampCell timestamp={params.row.ActionExecutionStartedOn}/>,
                valueGetter: (params: GridValueGetterParams<any, Run>) => params?.row?.ActionExecutionStartedOn
            },
            {
                field: "Duration",
                headerName: "Duration",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, Run, any>) => <DurationCell start={params.row.ActionExecutionStartedOn} end={params?.row?.ActionExecutionCompletedOn}/>
            },
            {
                field: "ActionExecutionCompletedOn",
                headerName: "Completed",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, Run, any>) => <TimestampCell timestamp={params.row.ActionExecutionCompletedOn}/>,
                valueGetter: (params: GridValueGetterParams<any, Run>) => params?.row?.ActionExecutionCompletedOn
            },
            {
                field: "Result",
                headerName: "Result",
                width: 100,
                renderCell: (params: GridCellParams<any, Run, any>) => <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", cursor: "pointer", color: "#2155CD", "&:hover": { backgroundColor: "#E6E6E6", color: "#40DFEF" } }}><span style={{ width: "100%", textAlign: "center" }}>Show</span></Box>
            },
            {
                field: "Run Again",
                headerName: "Run Again",
                width: 100,
                renderCell: (params: GridCellParams<any, Run, any>) => <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", cursor: "pointer", color: "#2155CD", "&:hover": { backgroundColor: "#E6E6E6", color: "#40DFEF" } }}><span style={{ width: "100%", textAlign: "center" }}>Run</span></Box>
            },
        ],
        sx: {
            "& .MuiDataGrid-columnHeaders": { background: "#E8E8E8"}
        },
        autoHeight: true,
        headerHeight: 70,
        rowsPerPageOptions: [5, 10, 25, 50, 100, 200],
        hideFooterSelectedRowCount: true,
        disableColumnFilter: true,
        initialState: {
            pagination: {
                pageSize: 50
            }
        },
        onCellClick: (params: GridCellParams<unknown, Run, unknown>, event, details) => {
            if(params?.colDef?.field === "Run Again") {
                if(params?.row?.isWorkflow) {
                    reRunWorkflow(params?.row?.ActionInstanceId)                    
                } else {
                    reRunAction(params?.row?.ActionInstanceId)
                }
            } else if(params?.colDef?.field === "Result") {
                if(params?.row?.isWorkflow) {
                    displayWorkflowOutput(params?.row?.ActionExecutionId)
                } else {
                    displayActionOutput(params?.row?.ActionExecutionId)
                }
            }
        }
    }

    return (
        <Box>
            <Box>
                <DataGrid {...datagridProps}/>
            </Box>
        </Box>    
    )
}

const DurationCell = (props: { start?: number, end?: number}) => {
    const { start, end } = props
    let duration = "NA"
    if(!!start && !!end) {
        const durationInSecs = ((end - start) / 1000)
        duration = `${durationInSecs.toFixed(1)} s`
    }

    return <TextCell text={duration}/>
}

export default ApplicationRunsByMe