import { Card, Divider, Grid, Box, Button, Dialog, DialogTitle, IconButton, DialogContent } from "@mui/material"
import LoadingIndicator from "../../../common/components/LoadingIndicator"
import ComponentTypes from "../../../enums/ComponentTypes"
import useWebAppEditHomePage from "../hooks/useGetWebAppEditHomePage"
import AddComponentCard from "./AddComponentCard"
import CloseIcon from "@mui/icons-material/Close"
import SelectFromAllActions from "../../../common/components/workflow/create/SelectFromAllActions"
import AddingAllActionView from "./AddingAllActionView"

interface ComponetsTrayProps{
    webAppId: string
}

const ComponentsTray = ({webAppId}: ComponetsTrayProps) => {

    const {onSave, saveWebAppMutation, onAddActionDialogStateChange, addActionDialogState, onActionAdd} = useWebAppEditHomePage({webAppId: webAppId})

    return (
        <>
            <Dialog open={addActionDialogState} onClose={onAddActionDialogStateChange} maxWidth="lg" fullWidth>
                {getDialogTitile(onAddActionDialogStateChange)}
                <DialogContent>
                    <AddingAllActionView  onAddAction={onActionAdd}/>
                </DialogContent>
            </Dialog>
            <Card sx={{height: '100%', width: '100%'}}>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                    <Grid container spacing={1}>
                        {Object.entries(ComponentTypes).map(([componentType, componentString]) => {
                            return (
                                <Grid item md={3} sm={3} xs={2 } >
                                    <AddComponentCard componentType={componentString} />
                                </Grid>
                            )
                        })}
                    </Grid>
                    <Divider orientation="horizontal" sx={{width: '100%'}}/>
                    <Button onClick={onAddActionDialogStateChange}>
                        Add Action
                    </Button>
                    {saveWebAppMutation.isLoading ? <LoadingIndicator/> : 
                        <Button onClick={onSave}>
                            Save
                        </Button>
                    }
                    
                </Box>
            </Card>
            
        </>
    )
}


export default ComponentsTray

export function getDialogTitile(onAddActionDialogStateChange: () => void) {
    return <DialogTitle>
        <Grid container>
            <Grid item xs={6}>
                Add Action To App
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={onAddActionDialogStateChange}>
                    <CloseIcon />
                </IconButton>
            </Grid>
        </Grid>
    </DialogTitle>
}
