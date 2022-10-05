import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { Route, Switch, useHistory } from "react-router-dom";
import { APPLICATION_CREATION_WIZARD_ROUTE, WORKFLOW_EDIT_ROUTE, WORKFLOW_EXECUTION_ROUTE } from "../../common/components/header/data/ApplicationRoutesConfig";
import { APPLICATION_ROUTE } from "../../common/components/header/data/RoutesConfig";
import UploadApplicationButton from "../../common/components/UploadApplicationButton";

const ApplicationHeader = () => {
    const history = useHistory()

    const handleAppBuilder = () => {
        history.push(APPLICATION_CREATION_WIZARD_ROUTE)
    }

    const AppBuilderButton = <Button variant="ModuleHeaderButton1" onClick={() => handleAppBuilder()}>
                                APP Builder <AddIcon sx={{marginLeft: 2}}/>
                            </Button>
    
    return (
        <Switch>
            <Route path={WORKFLOW_EXECUTION_ROUTE}></Route>
            <Route path={WORKFLOW_EDIT_ROUTE}></Route>
            <Route path={APPLICATION_ROUTE}>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2,marginRight:'2%', alignItems: "center"}}>
                    {AppBuilderButton}
                    <UploadApplicationButton/>
                </Box>
            </Route>
        </Switch>
    )
}

export default ApplicationHeader;