import { Box, Card, Tab, Tabs, Typography } from "@mui/material"
import { DataGrid, DataGridProps, GridCellParams } from "@mui/x-data-grid";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import { ActionDetail } from "../../../common/components/workflow/create/ViewSelectedAction/hooks/UseViewAction";
import { ActionDependency } from "../../../generated/interfaces/Interfaces";
import Row from "../../../pages/column_details/components/Row";
import { TextCell, TimestampCell } from "../../../pages/table_browser/components/AllTableView";
import useShowActionDependencies from "../../hooks/useShowActionDependencies"
import { DataGridShowRelationshipBox } from "../presentation/styled_native/DataGridShowRelationshipBox";

interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string;
}

export function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
);
}


const ShowActionDependencies = () => {
    
    const {setTabState, tabState, isLoading, error, actionDependencies, getRows, handleCellClick} = useShowActionDependencies()

    const dataGridProps: DataGridProps = {
        rows: getRows().map(row => ({...row, id: row.Id})),
        columns: [
            {
                field: "ParentName",
                headerName: "Name",
                flex: 1,
                minWidth: 100,
                renderCell: (params: GridCellParams<any, ActionDependency, any>) => <TextCell text={params.row.ParentName}/>
            },
            {
                field: "CreatedOn",
                headerName: "Relationship Created On",
                flex: 1,
                minWidth: 100,
                renderCell: (params: GridCellParams<any, ActionDependency, any>) => <TimestampCell timestamp={params.row.CreatedOn}/>
            },
            {
                field: "Entity",
                headerName: "",
                width: 100,
                renderCell: (params: GridCellParams<any, ActionDependency, any>) => <DataGridShowRelationshipBox><span style={{ width: "100%", textAlign: "center" }}>Show</span></DataGridShowRelationshipBox>
            },
        ],
        sx: {
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},
            backgroundColor: 'ActionCardBgColor.main',
            backgroundBlendMode: "soft-light, normal",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
            borderRadius: "15px"
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
        onCellClick: handleCellClick
    }


    return (
        <Card>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, p: 1}}>
                <Tabs onChange={(event, value) => setTabState(value)} value={tabState}>
                    <Tab value={"Flows"} label="Flows"/>
                    <Tab value={"Dashboards"} label="Dashboards"/>
                </Tabs>
                <ReactQueryWrapper 
                    isLoading={isLoading}
                    error={error}
                    data={actionDependencies}
                >
                    {() => (
                        <Box>
                            <DataGrid {...dataGridProps}/>
                        </Box>
                    )}
                </ReactQueryWrapper>
            </Box>
        </Card>
    )
}

export default ShowActionDependencies