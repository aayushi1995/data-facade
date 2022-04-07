import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import { APPLICATION_CREATION_WIZARD_ROUTE } from "../../common/components/header/data/ApplicationRoutesConfig";
import UploadApplicationButton from "../../common/components/UploadApplicationButton";

const ApplicationHeader = () => {
    const history = useHistory()

    const handleAppBuilder = () => {
        history.push(APPLICATION_CREATION_WIZARD_ROUTE)
    }
    
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center"}}>
            <Button variant="ModuleHeaderButton1" onClick={() => handleAppBuilder()}>
                APP Builder <AddIcon sx={{marginLeft: 2}}/>
            </Button>
            <UploadApplicationButton/>
        </Box>
    )
}

export default ApplicationHeader;