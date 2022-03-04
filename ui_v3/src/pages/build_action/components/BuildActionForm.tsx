import React from "react";
import { Box, InputAdornment, Tab, Tabs, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SelectFromAllActions from "../../../common/components/workflow/create/SelectFromAllActions";
import { TabPanel } from "../../../common/components/workflow/create/SelectAction/SelectAction";
import AllActions from "./form-components/AllActions";
import useActionDefinitionDetail from "../hooks/useActionDefinitionDetail";
import ActionDetailForm from "./form-components/ActionDetailForm";
import { SetBuildActionContext } from "../context/BuildActionContext";
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces";

export interface BuildActionFormProps {

}

const BuildActionForm = (props: BuildActionFormProps) => {
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const [sidePanelActiveTab, setSidePanelActiveTab] = React.useState(1)
    const [actionDefinitionNameSearchQuery, setActionDefinitionNameSearchQuery] = React.useState<string>("")
    const [selectedActionId, setSelectedActionId] = React.useState<string|undefined>()
    const {data, error, isLoading, refetch} = useActionDefinitionDetail({
        options: {
            onSuccess: (data: unknown) => {
                const actionDetail: ActionDefinitionDetail = (data as unknown[])[0] as ActionDefinitionDetail
                setBuildActionContext({
                    type: "LoadFromExisting",
                    payload: actionDetail
                })
            },
            onSettled: () => setBuildActionContext({type: "LoadingOver"})
        },
        actionDefinitionId: selectedActionId
    })
    console.log(error)
    React.useEffect(() => {
        if(!!selectedActionId){
            setBuildActionContext({type: "Loading"})
            refetch() 
        }
    }, [selectedActionId])

    return (
        <Box sx={{display: "flex", flexDirection: "row", width: "100%", maxHeight: "900px"}}>
            <Box sx={{display: "flex", flexDirection: "column", width: "300px"}}>
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
                        }}
                        sx={{
                            width: "100%"
                        }}
                        variant="outlined"
                    />
                </Box>
                <Box sx={{overflowY: "auto"}}>
                    <TabPanel value={sidePanelActiveTab} index={1}>
                        <AllActions selectedActionId={selectedActionId} onSelectAction={(actionId: string|undefined) => setSelectedActionId(actionId)} actionDefinitionNameSearchQuery={actionDefinitionNameSearchQuery}/>
                    </TabPanel>
                </Box>
            </Box>
            <Box sx={{flexGrow: 10, px: 2, minHeight: "100%"}}>
                <ActionDetailForm/>
            </Box>
        </Box>
    )
}

export default BuildActionForm;