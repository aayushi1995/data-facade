import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, Dialog, DialogActions, DialogContent, IconButton, InputAdornment, Tab, Tabs, TextField } from "@mui/material";
import React from "react";
import { TabPanel } from "../../../common/components/workflow/create/SelectAction/SelectAction";
import { SetBuildActionContext } from "../context/BuildActionContext";
import DoubeLeftIcon from './../../../images/Group 691.svg';
import ActionDetailForm from "./form-components/ActionDetailForm";
import AllActions from "./form-components/AllActions";
import CollapsibleDrawer from "./form-components/CollapsibleDrawer";
import ShowActionInfo from "./form-components/ShowActionInfo";

export interface EditActionFormProps {
    actionDefinitionId?: string
}


const EditActionForm = (props: EditActionFormProps) => {
    const setActionContext = React.useContext(SetBuildActionContext)
    const [sidePanelActiveTab, setSidePanelActiveTab] = React.useState(1)
    const [actionDefinitionNameSearchQuery, setActionDefinitionNameSearchQuery] = React.useState<string>("")
    const [selectedActionId, setSelectedActionId] = React.useState<string|undefined>()
    const [sideBarOpen, setSideBarOpen] = React.useState<boolean>(false)
    const [showSelectedActionInfoDialog, setShowSelectedActionInfoDialog] = React.useState<boolean>(false)

    React.useEffect(() => {
        if(!!props.actionDefinitionId) {
            setActionContext({
                type: "SetActionDefinitionToLoadId",
                payload: {
                    actionDefinitionToLoadId: props.actionDefinitionId
                }
            })   
        }
    }, [props.actionDefinitionId])

    const handleActionSelection = (actionId: string|undefined) => {
        setSelectedActionId(actionId)
        setShowSelectedActionInfoDialog(true)
    }

    const toggleSidebar = () => setSideBarOpen(old => !old)

    return (
        <>
        <Dialog open={showSelectedActionInfoDialog} onClose={() => setShowSelectedActionInfoDialog(false)} fullWidth maxWidth="lg">
            <DialogActions>
                <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
                    <Box>
                        <IconButton onClick={() => setShowSelectedActionInfoDialog(false)}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                </Box>
            </DialogActions>
            <DialogContent sx={{ minHeight: "600px" }}>
                <ShowActionInfo actionId={selectedActionId}/>
            </DialogContent>
        </Dialog>
        <Box sx={{display: "flex", flexDirection: "row", width: "100%", pl: 1, height: '100%', pb: 5}}>
            <CollapsibleDrawer
                open={sideBarOpen}
                openWidth="400px"
                closedWidth="50px"
                openDrawer={() => toggleSidebar()}
            >
                <Card sx={{ 
                    p: 2,
                    boxShadow: '-3.88725px -5.83088px 15.549px rgba(255, 255, 255, 0.5), 3.88725px 5.83088px 15.549px rgba(163, 177, 198, 0.5)', 
                    height: '100%', 
                    maxWidth: '100%', 
                    overflowY: 'auto', 
                    borderRadius: '20px', 
                    background: '#F5F9FF'}}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                <Box>
                                    <Tabs value={sidePanelActiveTab} onChange={((event, newValue) => setSidePanelActiveTab(newValue))}>
                                        <Tab label="Groups" value={0} sx={{
                                                fontFamily: "SF Pro Text",
                                                fontStyle: "normal",
                                                fontWeight: 600,
                                                fontSize: "14px",
                                                lineHeight: "24px",
                                                display: "flex",
                                                alignItems: "center",
                                                textAlign: "center",
                                                opacity: 0.7
                                        }}/>
                                        <Tab label={"All Actions"} value={1} sx={{
                                                fontFamily: "SF Pro Text",
                                                fontStyle: "normal",
                                                fontWeight: 600,
                                                fontSize: "14px",
                                                lineHeight: "24px",
                                                display: "flex",
                                                alignItems: "center",
                                                textAlign: "center",
                                                opacity: 0.7
                                        }}/>
                                    </Tabs>
                                </Box>
                                <Box>
                                    <IconButton onClick={() => toggleSidebar()}>
                                        <img src={DoubeLeftIcon} alt="NA"/>
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box>
                                <TextField
                                    id="input-with-icon-textfield"
                                    placeholder="Search action..."
                                    value={actionDefinitionNameSearchQuery}
                                    onChange={(event) => {setActionDefinitionNameSearchQuery(event.target.value)}}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon/>
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: "15px" }
                                    }}
                                    sx={{
                                        width: "100%"
                                    }}
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                        <Box sx={{overflowY: "auto", maxHeight: "700px"}}>
                            <TabPanel value={sidePanelActiveTab} index={1}>
                                <AllActions selectedActionId={selectedActionId} onSelectAction={handleActionSelection} actionDefinitionNameSearchQuery={actionDefinitionNameSearchQuery}/>
                            </TabPanel>
                        </Box>
                    </Box>
                </Card>
            </CollapsibleDrawer>
            <Box sx={{flexGrow: 10, px: 2, minHeight: "100%"}}>
                <ActionDetailForm/>
            </Box>
        </Box>
    </>
    )
}

export default EditActionForm;
