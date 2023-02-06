import { Box } from "@mui/material"
import Stack from '@mui/material/Stack'
import { DataGrid, DataGridProps, GridCellParams, GridValueGetterParams } from "@mui/x-data-grid"
import { generatePath, useHistory } from "react-router"
import { ReactQueryWrapper } from "../../../common/components/error-boundary/ReactQueryWrapper"
import { EXECUTE_INSTANCE_ROUTE } from "../../../common/components/route_consts/data/ApplicationRoutesConfig"
import { TableTheme } from "../../../css/theme/CentralCSSManager"
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType"
import { Application } from "../../../generated/entities/Entities"
import { TextCell, TimestampCell } from "../../data/table_browser/components/AllTableView"
import useApplicationRunsByMe, { Run } from "./UseApplicationRunsByMe"

export type ApplicationRunsByMeProps = {
    application?: Application,
    fetchAll?: boolean
}

const ApplicationRunsByMe = (props: ApplicationRunsByMeProps) => {
    const {application} = props
    const { fetchDataQuery, displayActionOutput, displayWorkflowOutput, reRunWorkflow, reRunAction } = useApplicationRunsByMe({ application: application, fetchAll: props.fetchAll })
    const history = useHistory()
    const StatusCell = (props:{sts:string})=>{
        const bgColor = props.sts=='Completed'?'#d0facf':'#facfd8'
        const textColor = props.sts=='Completed'?'#0bbf17':'#bf0b1a'
        return(
            <Box sx={{backgroundColor:bgColor,color:textColor,px:1,py:0.5,borderRadius:'16px'}}>
                {props.sts}
            </Box>
        )
    }
    const datagridProps: DataGridProps = {
        rows: fetchDataQuery?.data || [],
        columns: [
            {
                field: "ActionDefinitionActionType",
                headerName: "Type",
                width: 100,
                renderCell: (params: GridCellParams<any, Run, any>) => <TextCell text={params.row.ActionDefinitionActionType === ActionDefinitionActionType.WORKFLOW ? "Flow" : "Action"}/>
            },
            {
                field: "ActionInstanceName",
                headerName: "Instance Name",
                flex: 1,
                minWidth: 300,
                renderCell: (params: GridCellParams<any, Run, any>) => <TextCell text={params.row.ActionInstanceName}/>
            },
            // {
            //     field: "ActionDefinitionName",
            //     headerName: "Definition Name",
            //     flex: 1,
            //     minWidth: 300,
            //     renderCell: (params: GridCellParams<any, Run, any>) => <TextCell text={params.row.ActionDefinitionName}/>
            // },
            {
                field: "RunBy",
                headerName: "Run By",
                flex: 1,
                minWidth: 200,
                renderCell: (params: GridCellParams<any, Run, any>) => <TextCell text={params.row.RanBy} />
            },
            {
                field: "ActionExecutionStatus",
                headerName: "Status",
                width: 200,
                renderCell: (params: GridCellParams<any, Run, any>) => <StatusCell sts={params.row.ActionExecutionStatus || ""}/>
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
                width: 50,
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
        ],
        sx: {
            ...TableTheme()
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
        onCellClick: (params: GridCellParams<unknown, Run, unknown>, event, details) => {
            
            if(params?.colDef?.field === "Run Again") {
                if(params?.row?.isWorkflow) {
                    reRunWorkflow(params?.row?.ActionInstanceId)                    
                } else {
                    // history.push(generatePath(EXECUTE_INSTANCE_ROUTE, {actionInstanceId: params?.row?.ActionInstanceId}))
                    history.push(`/application/action-execution/${params?.row?.ActionInstanceId}?name=${params?.row?.ActionDefinitionName}`)
                    
                }
            } else if(params?.colDef?.field === "Result") {
                console.log('params?.row?.isWorkflow',params?.row?.isWorkflow)
                if(params?.row?.isWorkflow) {
                    displayWorkflowOutput(params?.row?.ActionExecutionId, params?.row?.ActionDefinitionId, params?.row?.ActionInstanceId, params?.row?.ActionDefinitionName)
                } else {
                    displayActionOutput(params?.row?.ActionExecutionId, params?.row?.ActionDefinitionId, params?.row?.ActionInstanceId , params?.row?.ActionDefinitionName)
                }
            }
        }
    }
    return (
        <Box>
            <Box>
            <ReactQueryWrapper
                    isLoading={fetchDataQuery?.isLoading}
                    error={fetchDataQuery.error}
                    data={fetchDataQuery.data}
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

export const DurationCell = (props: { start?: number, end?: number}) => {
    const { start, end } = props
    let duration = "NA"
    if(!!start && !!end) {
        const durationInSecs = ((end - start) / 1000)
        duration = `${durationInSecs.toFixed(1)} s`
    }

    return <TextCell text={duration}/>
}

export default ApplicationRunsByMe
