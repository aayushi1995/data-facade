import { Dialog, DialogTitle, DialogContent, Typography, Box, TextField, } from "@mui/material"
import { Button } from "@mui/material"
import React from "react"
import { useHistory } from "react-router"
import { Dashboard } from "../../../../generated/entities/Entities"
import LoadingIndicator from "../../LoadingIndicator"
import useCreateDashboard from "./hooks/useCreateDashboard"

export interface ExportAsDashboardProps {
    executionId: string,
    definitionName: string,
    buttonEle?: JSX.Element
}


const ExportAsDashboard = (props: ExportAsDashboardProps) => {
    const history = useHistory()
    const [dashboardDialog, setDashboardDialog] = React.useState(false)
    const [dashboardName, setDashboardName] = React.useState(props.definitionName)
    const [saving, setSaving] = React.useState(false)
    const saveDashboardMutation = useCreateDashboard(
        {
            mutationName: "SaveDashboardForExecution",
            mutationOptions: {
                onMutate: () => setSaving(true),
                onSettled: () => setSaving(false),
                onSuccess: (data: Dashboard[]) => {
                    history.push(`/insights/dashboard/${data?.[0]?.Id}`)
                } 
            }
        }
    )

    const handleDialogOpen = () => {
        setDashboardDialog(true)
    }

    const handleDialogClose = () => {
        setDashboardDialog(false)
    }

    const handleDashboardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDashboardName(e.target.value)
    }

    const handleDashboardSave = () => {
        saveDashboardMutation.mutate({executionId: props.executionId, dashboardName: dashboardName, flowId: props.executionId})
    }

    return (
        <React.Fragment>
            <Dialog open={dashboardDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="heroMeta" sx={{ fontSize: '20px' }}>
                        Export As Dashboard
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', p: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <TextField fullWidth label="Dashboard Name" value={dashboardName} onChange={handleDashboardNameChange} error={dashboardName === ""}/>
                        </Box>
                    </Box>
                    {saving ? (
                        <LoadingIndicator/>
                    ) : (
                        <Button variant="contained" sx={{ borderRadius: '64px' }} disabled={dashboardName === ""} onClick={handleDashboardSave}>
                            Export
                        </Button>
                    )}
                    
                </DialogContent>
            </Dialog>
            <Box onClick={handleDialogOpen}>
                {props.buttonEle ? props.buttonEle :
                    <Button variant="outlined" color='success' sx={{ borderRadius: "5px" }} fullWidth>
                        Export As Dashboard
                    </Button> }
            </Box>
            
        </React.Fragment>
    )
}

export default ExportAsDashboard
