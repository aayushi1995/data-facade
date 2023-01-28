import { Card, Divider, Grid, Box, Button, Dialog, DialogTitle, IconButton, DialogContent, Typography } from "@mui/material"
import LoadingIndicator from "../../../common/components/LoadingIndicator"
import ComponentTypes from "../../../enums/ComponentTypes"
import useWebAppEditHomePage from "../hooks/useGetWebAppEditHomePage"
import AddComponentCard from "./AddComponentCard"
import CloseIcon from "@mui/icons-material/Close"
import SelectFromAllActions from "../../../common/components/workflow/create/SelectFromAllActions"
import AddingAllActionView from "./AddingAllActionView"
import AddedActionsList from "./AddedActionsList"
import CommonComponentCard from "./component_cards/CommonComponentCard"

interface ComponetsTrayProps {
    webAppId: string
}

const cardStyle = {
    background: '#F5F9FF',
    boxShadow: "-2px -2px 2px #FAFBFF, 2px 2px 2px #A6ABBD",
    borderRadius: "5px",
    width: 500,
    padding: '10px'
}

const textStyle = {
    color: "#253858",
    fontSize: "11px",
    fontWeight:500
}

const ComponentsTray = ({ webAppId }: ComponetsTrayProps) => {

    const { onSave, saveWebAppMutation, onAddActionDialogStateChange, addActionDialogState, onActionAdd } = useWebAppEditHomePage({ webAppId: webAppId })

    return (
        <>
            <Dialog open={addActionDialogState} onClose={onAddActionDialogStateChange} maxWidth="lg" fullWidth>
                {getDialogTitile(onAddActionDialogStateChange)}
                <DialogContent>
                    <AddingAllActionView onAddAction={onActionAdd} />
                </DialogContent>
            </Dialog>
            <Card sx={cardStyle}>

                <Typography style={textStyle}>Commonly Used</Typography>
                <Divider sx={{mt:"5px"}}/>

                <Grid container spacing={2} sx={{mt: 1}}>
                    {Object.entries(ComponentTypes).map(([componentType, componentString]) =>

                        <Grid item md={3} sm={3} xs={12} >
                           <CommonComponentCard componentType={componentString}/>
                        </Grid>

                    )}


                </Grid>

                <Divider sx={{mt:2,borderBottomWidth:'medium',mb:2}}/>

                {Object.entries(ComponentTypes).map(([componentType, componentString]) =>

                    <Grid item md={3} sm={3} xs={2} >
                        <AddComponentCard componentType={componentString} />
                    </Grid>

                )}


                <Grid container spacing={2} sx={{mt:2}}>
                    <Grid item xs={6} md={6}>
                        <Button onClick={onAddActionDialogStateChange} sx={{borderRadius:'2px'}} fullWidth variant="contained">Add Action</Button>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Button onClick={onSave} sx={{borderRadius:'2px'}} disabled={saveWebAppMutation.isLoading} fullWidth variant="contained">{saveWebAppMutation.isLoading?'Saving...' : 'Save'}</Button>
                    </Grid>
                </Grid>
                <Divider sx={{mt:2,borderBottomWidth:'medium',mb:2}}/>

                <Typography  style={textStyle}>Added Actions</Typography>
                <AddedActionsList />
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
