
import React from 'react'
import { Box, Card, Chip, IconButton, InputAdornment, SvgIcon, TextField, Typography, useTheme} from '@material-ui/core';
import {Tabs, Tab} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { ReactComponent as DefaultIcon } from "../Icon.svg";
import GroupDropDown from '../GroupDropDown';
import { ActionParameterDefinition, ActionTemplate } from '../../../../../generated/entities/Entities';
import ActionParameterDefinitionList from './ActionParameterDefinitionList/ActionParameterDefinitionList';
import EditActionParameterDefinition from './EditActionParameterDefinition/EditActionParameterDefinition';
import CodeEditor from '../../../code-editor/CodeEditor';

export interface ViewSelectedActionProps {
    actionParameterDefinitions: ActionParameterDefinition[]
    actionTemplate: ActionTemplate
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
);
}


const ViewSelectedAction = (props: ViewSelectedActionProps) => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = React.useState(0)
    const [selectedParameterForEdit, setSelectedParameterForEdit] = React.useState<ActionParameterDefinition|undefined>()

    const onParameterSelectForEdit = (actionParameter: ActionParameterDefinition) => setSelectedParameterForEdit(actionParameter)
    const deleteParametersWithIds = (actionParameterIds: string[]) => console.log("Deleting", actionParameterIds)
    const onCodeChange = (newCode: string) => console.log(newCode)

    console.log(theme)
    return(
            <Box>
                <Box>
                    <Tabs value={activeTab} onChange={((event, newValue) => setActiveTab(newValue))}>
                        <Tab label="Parameters" value={0} sx={{
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
                        <Tab label="Code" value={1} sx={{
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
                <Box sx={{pt: 2}}>
                    <TabPanel value={activeTab} index={0}>
                        <Box>
                            <Box>
                                <EditActionParameterDefinition parameterDefinition={selectedParameterForEdit} template={props.actionTemplate}/>
                            </Box>
                            <Box>
                                <ActionParameterDefinitionList parameters={props.actionParameterDefinitions} onParameterSelectForEdit={onParameterSelectForEdit} deleteParametersWithIds={deleteParametersWithIds}/>
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <Box>
                            <CodeEditor
                                code={props.actionTemplate.Text}
                                language={props.actionTemplate.Language}
                                readOnly={false}
                                onCodeChange={onCodeChange}
                            />
                        </Box>
                    </TabPanel>
                </Box>
            </Box>
    )
}


  


export default ViewSelectedAction;