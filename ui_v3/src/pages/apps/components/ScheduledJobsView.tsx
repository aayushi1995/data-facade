import { DataGridProps, GridCellParams, DataGrid } from "@mui/x-data-grid"
import { Card, Typography, Box, Tooltip, IconButton } from "@mui/material"
import useGetScheduledActionInstances from "../../../common/components/application/hooks/useGetScheduledActionInstances"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import { ActionExecution, ProviderInstance } from "../../../generated/entities/Entities"
import { RecurringActionInstanceDetails } from "../../../generated/interfaces/Interfaces"
import { TextCell, TimestampCell } from "../../table_browser/components/AllTableView"
import React from "react"
import { ProviderIcon } from "../../data/components/connections/ConnectionDialogContent"
import EyeIcon from "../../../../src/images/eye.svg"
import EditIcon from "../../../../src/images/edit.svg"
import { generatePath, useHistory } from "react-router"
import { ACTION_EXECUTION_ROUTE, WORKFLOW_EXECUTION_ROUTE } from "../../../common/components/header/data/ApplicationRoutesConfig"
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType"
import Stack from '@mui/material/Stack';

interface ScheduledJobsViewProps {

}

type DataGridRow = RecurringActionInstanceDetails & {jobName?: string}

const ScheduledJobsView = (props: ScheduledJobsViewProps) => {

    const getScheduledActionInstanceQuery = useGetScheduledActionInstances({})
    const [searchQuery, setSearchQuery] = React.useState()

    const [rows, setRows] = React.useState<DataGridRow[]>([])

    React.useEffect(() => {
        if(!!getScheduledActionInstanceQuery.data) {
            setRows(getScheduledActionInstanceQuery.data)
        }
    },[getScheduledActionInstanceQuery.data])

    const dataGridProps: DataGridProps = {
        columns: [
            {
                field: "Status",
                headerName: "Status",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <JobStatusCell status={params.row?.Status || "NA"} />,
                flex: 1,
                minWidth: 100
            },
            {
                field: "jobName",
                headerName: "Job Name",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <TextCell text={params.row?.jobName} />,
                flex: 1,
                minWidth: 300
            },
            {
                field: "ProviderInstance",
                headerName: "Source",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <ProviderCell provider={params.row?.ProviderInstance} providerDefinitionName={params.row?.ProviderName}/>,
                flex: 1,
                minWidth: 200
            },
            {
                field: "HistoricalActionExecutions",
                headerName: "Details",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <DetailsCell historicalRuns={params.row?.HistoricalActionExecutions} failed={params.row?.NumberOfFailed} averageTime={params.row?.AverageRunTime}/>,
                flex: 1,
                minWidth: 200
            },
            {
                field: "StartTime",
                headerName: "Start Time",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <StartTimeCell startTime = {params.row?.StartTime} />,
                flex: 1,
                minWidth: 200
            },
            {
                field: "NextScheduledTime",
                headerName: "Time To next run",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <NextScheduledCell nextScheduledTime={params.row?.NextScheduledTime} />,
                flex: 1,
                minWidth: 200
            },
            {
                field: "Action",
                headerName: "Actions",
                renderCell: (params: GridCellParams<any, DataGridRow, any>) => <ActionButtonCells historicalRuns={params.row?.HistoricalActionExecutions} actionType={params.row?.ActionType}/>,
                flex: 1,
                minWidth: 100
            }
        ],
        rows: rows.map(row => ({...row, id: row.model?.Id, jobName: row.model?.Name})),
        autoHeight: true,
        sx: {
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},
            backgroundColor: 'ActionCardBgColor.main',
            backgroundBlendMode: "soft-light, normal",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
            borderRadius: "15px"
        },
        disableSelectionOnClick: true,
        headerHeight: 70,
        rowsPerPageOptions: [5, 10, 25, 50, 100, 200],
        hideFooterSelectedRowCount: true,
        filterModel: {
            items: [
                {
                    columnField: "jobName",
                    operatorValue: "contains",
                    value: searchQuery
                }
            ]
        },
        initialState: {
            pagination: {
                pageSize: 10
            }
        },
        rowHeight: 90
    }

    return ( 

        <ReactQueryWrapper 
            isLoading={getScheduledActionInstanceQuery.isLoading}
            error={getScheduledActionInstanceQuery.error}
            data={getScheduledActionInstanceQuery.data}
            children={() => (
                <DataGrid {...dataGridProps} components={{
                    NoRowsOverlay: () => (
                      <Stack height="100%" fontSize="18px" alignItems="center" justifyContent="center">
                         There is no running connection
                      </Stack>
                    ),
                    LoadingOverlay: () => (
                        <Stack height="100%" fontSize="18px" alignItems="center" justifyContent="center">
                            Table is Loading.....
                        </Stack>
                    )
                  }} />
            )}
        />
    )
}

export const JobStatusCell = (props: {status: string}) => {
    let background = 'statusCardBgColor1.main'
    switch (props.status) {
        case 'Error': {
            background = 'statusCardBgColor3.main'
            break;
        }
        case 'Failure': {
            background = 'rgba(255, 189, 189, 0.88)'
        }
    }

    return (
        <Card sx={{  width: "70px",
            height: "36px",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: background,
            border: "0.439891px solid #FFFFFF",
            boxShadow: "0px 5px 10px rgba(54, 48, 116, 0.3)",
            borderRadius: "26.3934px"}}>
            
                <Typography sx={{fontFamily: "'SF Pro Display'",
                    fontStyle: "normal",
                    fontWeight: 600,
                    fontSize: "11.5435px",
                    lineHeight: "160%",
                    letterSpacing: "0.0961957px",
                    color: "ActionDefinationHeroTextColor1.main"}}
                >    
                    {props.status}
                </Typography>
        </Card>
    )
}


export const ProviderCell = (props: {provider?: ProviderInstance, providerDefinitionName?: string}) => {
    return (
        <Box sx={{display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ProviderIcon providerUniqueName={props.providerDefinitionName} height={60}/>
            <TextCell text={props.provider?.Name} />
        </Box>
    )
}

export const StartTimeCell = (props: {startTime?: number}) => {
    return <TimestampCell timestamp={props.startTime} />
}

export const NextScheduledCell = (props: {nextScheduledTime?: number}) => {
    const [currentSeconds, setCurrentSeconds] = React.useState(new Date(Date.now()).getTime())
    const reduceTime = () => {
        setCurrentSeconds(new Date(Date.now()).getTime())
    }
    const getTimeRemaining = () => {
        const currentSeconds = (new Date(Date.now())).getTime()
        const remainingSeconds = (Math.max(0, props.nextScheduledTime! - currentSeconds))/1000

        const h = Math.floor(remainingSeconds / 3600).toString().padStart(2,'0')
        const m = Math.floor(remainingSeconds % 3600 / 60).toString().padStart(2,'0')
        const s = Math.floor(remainingSeconds % 60).toString().padStart(2,'0');

        return h + ':' + m + ':' + s;
    }

    React.useEffect(() => {
        setInterval(reduceTime, 1000)
    }, [])
    return (
        <TextCell text={getTimeRemaining()}/>
    )
}

export const ActionButtonCells = (props: {historicalRuns?: ActionExecution[], actionType?: string}) => {

    const completedActionExecutions = props.historicalRuns?.filter(ae => !!ae.ExecutionCompletedOn)
    const history = useHistory()
    const handleViewLatest = () => {
        const latestExecution = props.historicalRuns?.[0]
        if(!!latestExecution) {
            if(props.actionType === ActionDefinitionActionType.WORKFLOW) {
                history.push(generatePath(WORKFLOW_EXECUTION_ROUTE, {WorkflowExecutionId: latestExecution.Id!}))
            } else {
                history.push(generatePath(ACTION_EXECUTION_ROUTE, {ActionExecutionId: latestExecution.Id!}))
            }
            
        }
    }
    return (
        <Box sx={{display: 'flex', gap: 2}}>
            <Card sx={{
                borderRadius: '100%',
                backgroundColor: "ActionCardBgColor.main",
                width: '40px',
                height: '40px',
                boxShadow:
                  "-5px -5px 7.5px #FFFFFF, 5px 5px 5px rgba(0, 0, 0, 0.05), inset 5px 5px 5px rgba(0, 0, 0, 0.05), inset -5px -5px 10px #FFFFFF"
            }}>
                <IconButton onClick={handleViewLatest}>
                    <img src={EyeIcon} alt="view" style={{transform: 'scale(1.5)'}}/>
                </IconButton>
            </Card>
            <Card sx={{
                borderRadius: '100%',
                backgroundColor: "ActionCardBgColor.main",
                width: '40px',
                height: '40px',
                boxShadow:
                  "-5px -5px 7.5px #FFFFFF, 5px 5px 5px rgba(0, 0, 0, 0.05), inset 5px 5px 5px rgba(0, 0, 0, 0.05), inset -5px -5px 10px #FFFFFF"
            }}>
                <IconButton>
                    <img src={EditIcon} alt="view" />
                </IconButton>
            </Card>
        </Box>
    )
}

export const DetailsCell = (props: {historicalRuns?: ActionExecution[], failed?: number, averageTime?: number}) => {
    const completedActionExecutions = props.historicalRuns?.filter(ae => !!ae.ExecutionCompletedOn)
    let maxTime = -1;
    const chartData = completedActionExecutions?.map(ae => {
        const time = (ae.ExecutionCompletedOn! - ae.ExecutionStartedOn!)/1000.0
        const color = ae.Status === 'Completed' ? 'linear-gradient(180deg, #0E42D2 0%, #6AA1FF 100%)' : 'linear-gradient(180deg, #FF7D94 0%, #FFB9C5 100%);'
        if(time !== 0) {
            maxTime = Math.max(maxTime, time)
        }
        return {
            value: time,
            itemStyle: {
                background: color
            }
        }
    }) || []
    const MAX_HEIGHT = 45.0

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', justifyContent: 'center', minWidth: '100%'}}>
            <Box className="chartBox" sx={{maxHeight: '50px', display: 'flex', gap: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                {chartData.map(data => {
                    return (
                        <Tooltip title={`Run Time: ${data.value}s`}>
                            <Card sx={{height: `${data.value*MAX_HEIGHT/maxTime}px`, background: data.itemStyle.background, width: '7px', borderRadius: '0px'}}/>
                        </Tooltip>
                    )
                })}
            </Box>
            <Box>
                <Typography sx={{
                    fontFamily: "'SF Pro Display'",
                    fontStyle: "normal",
                    fontWeight: 600,
                    fontSize: "14px",
                    lineHeight: "116.7%"
                }}>
                    <span>Avg Time: <b>{Math.floor((props.averageTime || 0)/1000)}s</b> | Failed: <b>{props.failed}</b></span>
                </Typography>
            </Box>
        </Box>
    )
}

export default ScheduledJobsView