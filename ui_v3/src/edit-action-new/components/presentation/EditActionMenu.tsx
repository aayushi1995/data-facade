import { Drawer } from "@mui/material"
import ActionSideMenuOptions from "../business/ActionSideMenuOptions"
import { ActionSideMenuBox } from "./styled_native/ActionSideMenuBox"


const EditActionMenu = () => {

    return (
        <Drawer PaperProps={{
            sx: {
                    pt: 8,
                    width: 50,
                    display: "flex",
                    flexDirection: "row"
                }
            }}
            sx={{ 
                zIndex: 0,
                width: "60px"
            }}
            variant="permanent"
            open={true} anchor="right">
                <ActionSideMenuOptions />
        </Drawer>
    )

}

export default EditActionMenu