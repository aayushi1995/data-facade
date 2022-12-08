import { List, ListItem, ListItemButton, Dialog } from "@mui/material"
import useAddedActionList from "../hooks/useAddedActionsList"
import ConfigureWebActionParameters from "./ConfigureParameters"



const AddedActionsList = () => {

    const {actions, handleActionClick, handleDialogClose, selectedAction} = useAddedActionList()

    return (
        <>
        <Dialog open={!!selectedAction} onClose={handleDialogClose} maxWidth="lg" fullWidth>
            {selectedAction ? <ConfigureWebActionParameters action={selectedAction!} /> : <></>}
            
        </Dialog>
        <List>
            {actions.map(webAppAction => {
                return (
                    <ListItemButton onClick={() => handleActionClick(webAppAction)}>
                        {webAppAction.ActionReference}
                    </ListItemButton>
                )
            })}
        </List>
        </>
    )

}

export default AddedActionsList