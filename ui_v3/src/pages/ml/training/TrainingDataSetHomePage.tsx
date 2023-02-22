import { Delete } from "@mui/icons-material"
import Add from "@mui/icons-material/Add"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Alert, Box, Dialog, DialogContent, IconButton, Snackbar } from "@mui/material"
import { DataGrid, DataGridProps, GridCellParams } from "@mui/x-data-grid"
import { CustomToolbar } from "../../../common/components/CustomToolbar"
import { ReactQueryWrapper } from "../../../common/components/error-boundary/ReactQueryWrapper"
import LoadingIndicator from "../../../common/components/LoadingIndicator"
import AddTrainingDataSetForm from "./components/AddTrainingDataSetForm"
import useTrainingDataSetHomePage from "./hooks/useTrainingDataSetHomePage"

export type AnswerTypes = "Action" | "SQL" | "Python"

export type TrainingDataRow = {
    id?: string,
    question?: string,
    answerType?: AnswerTypes,
    reference?: string,
    targetUser?: string[],
    parameterValues?: Record<string, string>,
    targetTables?: string[]
}

const TrainingDataSetHomePage = () => {

    const {
        trainingData, 
        addTrainingDialogState, 
        handleDialogStateChange, 
        fetchTrainingData, 
        onRecordAdded, 
        onDeleteTrainingRow, 
        handleRetrain,
        failureSnackbarState,
        successSnackbarState,
        handleSnackbarClose,
        handleRetrainMutation
    } = useTrainingDataSetHomePage()

    const dataGridProps: DataGridProps = {
        columns: [
            {
                field: "question",
                headerName: "Question",
                flex: 2,
                minWidth: 200
            },
            {
                field: "answerType",
                headerName: "Answer Type",
                flex: 1,
                minWidth: 100
            },
            {
                field: "reference",
                headerName: "Reference",
                flex: 2,
                minWidth: 200
            },
            {
                field: "targetUser",
                headerName: "Target Users",
                flex: 2,
                minWidth: 200
            },
            {
                field: "parameterValues",
                headerName: "Parameter Values",
                flex: 3,
                minWidth: 300
            },
            {
                field: "delete",
                headerName: "Delete",
                flex: 1,
                minWidth: 100,
                renderCell: (params: GridCellParams<any, TrainingDataRow, any>) => <IconButton onClick={() => onDeleteTrainingRow(params.row.id!)}><Delete /></IconButton>
            },
            // {
            //     field: "edit",
            //     headerName: "Edit",
            //     flex: 1,
            //     minWidth: 100,
            //     renderCell: (params: GridCellParams<any, TrainingData, any>) => <IconButton><Edit /></IconButton>
            // }
        ],
        rows: trainingData,
        components: {
            Toolbar: CustomToolbar([
                <IconButton onClick={handleDialogStateChange}>
                    <Add />
                </IconButton>,
                <IconButton>
                    <CloudUploadIcon onClick={handleRetrain}/>
                </IconButton>
            ])
        },
        autoHeight: true,
        pageSize: 10 
    }

    return (
        <ReactQueryWrapper {...fetchTrainingData}>
            {() => (
                <Box sx={{width: '100%', height: '100%'}}>
                    <Dialog maxWidth="xl" fullWidth open={addTrainingDialogState} onClose={handleDialogStateChange}>
                        <DialogContent>
                            <AddTrainingDataSetForm onRecordAdded={onRecordAdded}/>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={handleRetrainMutation.isLoading} maxWidth="md" fullWidth>
                        <LoadingIndicator />
                    </Dialog>
                    <DataGrid {...dataGridProps}/>
                    <Snackbar open={successSnackbarState} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                            Retrained Model
                        </Alert>
                    </Snackbar>
                    <Snackbar open={failureSnackbarState} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                            Something went wrong! Contact support
                        </Alert>
                    </Snackbar>
                </Box>
            )}
        </ReactQueryWrapper>
    )

    return <></>

}

export default TrainingDataSetHomePage