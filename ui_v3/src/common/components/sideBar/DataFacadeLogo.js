import { Box } from "@mui/material";
import { ReactComponent as Logo } from "../../../assets/images/DF_icon.svg";

export function DataFacadeLogo() {
    return <Box sx={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Logo width="auto" height="100%"/>
    </Box>;
}