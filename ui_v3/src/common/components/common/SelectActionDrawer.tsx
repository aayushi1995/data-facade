import {Card, Box, Tabs, Tab, IconButton, InputAdornment, TextField} from "@mui/material"
import { TabPanel } from "../../../common/components/workflow/create/SelectAction/SelectAction";
import DoubeLeftIcon from './../../../images/Group 691.svg'
import React from "react"
import SearchIcon from '@mui/icons-material/Search';
import AllActions from "../../../pages/build_action/components/form-components/AllActions";


interface SelectActionDrawerProps {
    setDialogState: (event: {open: boolean}) => void,
    mainTabLabel?: string
    handleOnIdSelect?: (id: string) => void,
    selectedActionId?: string
}

const SelectActionDrawer = (props: SelectActionDrawerProps) => {

    const [sidePanelActiveTab, setSidePanelActiveTab] = React.useState(1)
    const [actionDefinitionNameSearchQuery, setActionDefinitionNameSearchQuery] = React.useState<string>("")

    const handleSelectAction = (actionId?: string) => {
        props.handleOnIdSelect?.(actionId || "NA")
    }

    return (
        <Card sx={{ 
            p: 2,
            boxShadow: '-3.88725px -5.83088px 15.549px rgba(255, 255, 255, 0.5), 3.88725px 5.83088px 15.549px rgba(163, 177, 198, 0.5)', 
            height: '100%', 
            maxWidth: '100%', 
            overflowY: 'auto', 
            borderRadius: '20px', 
            backgroundColor: 'ActionDefinationHeroCardBgColor.main'}}
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
                                <Tab label={props.mainTabLabel || "All Actions"} value={1} sx={{
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
                            <IconButton onClick={() => props.setDialogState({open: false})}>
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

                        <AllActions onSelectAction={handleSelectAction} actionDefinitionNameSearchQuery={actionDefinitionNameSearchQuery} filter={{ActionType: "Workflow"}}/>
                    </TabPanel>
                </Box>
            </Box>
        </Card>
    )
}

export default SelectActionDrawer