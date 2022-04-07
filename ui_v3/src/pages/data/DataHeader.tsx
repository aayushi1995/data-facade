import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE } from "../../common/components/header/data/DataRoutesConfig";
import { CreateConnectionButton } from "./components/connections/CreateConnectionButton";

const DataHeader = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center"}}>
            <CreateConnectionButton/>
            <Button variant="ModuleHeaderButton2" to={DATA_CONNECTIONS_UPLOAD_PREVIEW_ROUTE} component={RouterLink}
                    title="Upload File"
                    endIcon={<AddIcon sx={{fontSize: "small", backgroundColor: "secondary"}}/>}
            >
                Upload File
            </Button>
        </Box>
    )
}

export default DataHeader;