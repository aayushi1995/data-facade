import {TaskOutlined } from "@mui/icons-material"
import { List, ListItem, ListItemButton, Dialog, ListItemText, ListItemIcon } from "@mui/material"
import useAddedActionList from "../hooks/useAddedActionsList"
import ConfigureWebActionParameters from "./ConfigureParameters"



const AddedActionsList = () => {

    const { actions, handleActionClick, handleDialogClose, selectedAction } = useAddedActionList()

    return (
        <>
            <Dialog open={!!selectedAction} onClose={handleDialogClose} maxWidth="lg" fullWidth>
                {selectedAction ? <ConfigureWebActionParameters actionReference={selectedAction!.ActionReference} /> : <></>}
            </Dialog>
            <List>
                {actions.map(webAppAction => {
                    return (
                        <ListItemButton disableGutters onClick={() => handleActionClick(webAppAction)}>
                            <ListItemIcon><TaskOutlined /></ListItemIcon>
                            <ListItemText primary={webAppAction.ActionReference}/>
                        </ListItemButton>
                    )
                })}
            </List>
        </>
    )

}

export default AddedActionsList