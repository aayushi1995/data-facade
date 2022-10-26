import { DataGrid, GridCallbackDetails, GridColDef, GridRowParams, MuiEvent } from "@mui/x-data-grid"
import React from "react"
import { useHistory } from "react-router"
import { INSIGHTS_ROUTE } from "../../common/components/header/data/RoutesConfig"
import LoadingWrapper from "../../common/components/LoadingWrapper"
import { DashboardDetails } from "../../generated/interfaces/Interfaces"
import useGetDashboardDetails from "./hooks/useGetDashboardDetails"

const columns: GridColDef[] = [
    {
        field: 'Name',
        headerName: 'Dashboard Name',
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'CreatedBy',
        headerName: 'Created By',
        flex: 1,
        minWidth: 200
    },
    {
        field: 'CreatedOn',
        headerName: 'Created On',
        flex: 1,
        minWidth: 200
    },
    {
        field: 'NumberOfCharts',
        headerName: 'Number Of Charts',
        flex: 1,
        minWidth: 200
    }
] 

const AllDashboardView = () => {

    const history = useHistory()
    const [dashboardDetails, isLoading, error] = useGetDashboardDetails({filter: {}})

    const formRows = (data: DashboardDetails[]) => {
        return data.map(dashboard => {
            return {
                'Name': dashboard.model?.Name,
                'CreatedBy': dashboard.model?.CreatedBy,
                'CreatedOn': (new Date(dashboard.model?.CreatedOn || 0).toDateString()),
                'NumberOfCharts': dashboard.numberOfCharts,
                'id': dashboard.model?.Id || 'id'
            }
        })
    }

    const handleRowClick = (params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => {
        history.push(`${INSIGHTS_ROUTE}/dashboard/${params.id}`)
    }

    return (
        <LoadingWrapper
            isLoading={isLoading}
            data={dashboardDetails}
            error={error}
        >
            <DataGrid
                columns={columns}
                rows={formRows(dashboardDetails)}
                onRowClick={handleRowClick}
                sx={{
                    "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},
                    backgroundColor: 'ActionCardBgColor.main',
                    backgroundBlendMode: "soft-light, normal",
                    border: "2px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
                    borderRadius: "15px",
                    height: '500px',
                    mx:6
                }}
                headerHeight={70}
                rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
                initialState={{
                    pagination: {
                        pageSize: 10
                    }
                }}
            />
        </LoadingWrapper>
    )
}

export default AllDashboardView