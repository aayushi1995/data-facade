import React from "react";
import { Box, Card, CSSObject, Divider, Drawer, IconButton, InputAdornment, List, Tab, Tabs, TextField, Theme } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { TabPanel } from "../../../common/components/workflow/create/SelectAction/SelectAction";
import AllActions from "./form-components/AllActions";
import useActionDefinitionDetail from "../hooks/useActionDefinitionDetail";
import CollapsibleDrawer from "./form-components/CollapsibleDrawer"
import ArrowBackIosNewTwoToneIcon from '@mui/icons-material/ArrowBackIosNewTwoTone';
import ActionDetailForm from "./form-components/ActionDetailForm";
import { BuildActionContext, SetBuildActionContext } from "../context/BuildActionContext";
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces";
import DoubeLeftIcon from './../../../images/Group 691.svg'
import { useHistory } from "react-router-dom";

export interface BuildActionFormProps {
    preSelectedActionDefiniitonId?: string
}


const BuildActionForm = (props: BuildActionFormProps) => {
    const history = useHistory()
    const actionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    console.log(actionContext)
    const [sidePanelActiveTab, setSidePanelActiveTab] = React.useState(1)
    const [actionDefinitionNameSearchQuery, setActionDefinitionNameSearchQuery] = React.useState<string>("")
    const [selectedActionId, setSelectedActionId] = React.useState<string|undefined>()
    const [sideBarOpen, setSideBarOpen] = React.useState<boolean>(false)
    const {data, error, isLoading, refetch} = useActionDefinitionDetail({
        options: {
            onSuccess: (data: unknown) => {
                const actionDetail: ActionDefinitionDetail = (data as unknown[])[0] as ActionDefinitionDetail
                setBuildActionContext({
                    type: "LoadFromExisting",
                    payload: actionDetail
                })
            },
            onSettled: () => setBuildActionContext({type: "LoadingOver"}),
        },
        actionDefinitionId: selectedActionId
    })

    React.useEffect(() => {
        if(!!props.preSelectedActionDefiniitonId){
            setSelectedActionId(props.preSelectedActionDefiniitonId)
        }
    }, [props.preSelectedActionDefiniitonId])

    React.useEffect(() => {
        if(!!selectedActionId){
            setBuildActionContext({type: "Loading"})
            refetch() 
        }
    }, [selectedActionId])

    const handleActionSelection = (actionId: string|undefined) => {
        if(!!actionId) {
            if(actionContext.mode==="CREATE") {
                setSelectedActionId(actionId)
            } else if(actionContext.mode==="UPDATE") {
                history.push(`/application/edit-action/${actionId}`)
            }
        }
    }

    const toggleSidebar = () => setSideBarOpen(old => !old)

    return (
        <Box sx={{display: "flex", flexDirection: "row", width: "100%", pl: 1}} id="drawer-container">
            <CollapsibleDrawer
                open={sideBarOpen}
                openWidth="400px"
                closedWidth="50px"
                openDrawer={() => toggleSidebar()}
                minHeight="800px"
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
                                        <Tab label="All Actions" value={1} sx={{
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
    )
}

export default BuildActionForm;
