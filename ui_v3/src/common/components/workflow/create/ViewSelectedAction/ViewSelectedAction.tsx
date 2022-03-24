
import React from 'react'
import { Box, Card, Chip, IconButton, InputAdornment, SvgIcon, TextField, Typography, useTheme} from '@mui/material';
import {Tabs, Tab} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { ReactComponent as DefaultIcon } from "../Icon.svg";
import GroupDropDown from '../GroupDropDown';
import { ActionParameterDefinition, ActionTemplate } from '../../../../../generated/entities/Entities';
import ActionParameterDefinitionList from './ActionParameterDefinitionList/ActionParameterDefinitionList';
import EditActionParameterDefinition from './EditActionParameterDefinition/EditActionParameterDefinition';
import CodeEditor from '../../../CodeEditor';
import useViewAction, { ActionDetail } from './hooks/UseViewAction';

export interface ViewSelectedActionProps {
    actionDefinitionId: string
    stageId: string
    actionDefinitionIndex: number
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

    const {isLoading, error, data} = useViewAction({actionDefinitionId: props.actionDefinitionId, expectUniqueResult: true})

    const onParameterSelectForEdit = (actionParameter: ActionParameterDefinition) => setSelectedParameterForEdit(actionParameter)
    const deleteParametersWithIds = (actionParameterIds: string[]) => console.log("Deleting", actionParameterIds)
    const onCodeChange = (newCode: string) => console.log(newCode)

    React.useEffect(() => {
        setSelectedParameterForEdit(undefined)
    }, [props.actionDefinitionId, props.actionDefinitionIndex, props.stageId])

    if(isLoading) {
        return <>Loading...</>
    } else if(!!error) {
        return <>{error}</>
    } else {
        const action = data as ActionDetail
        const defaultActionTemplate = action.ActionTemplatesWithParameters.find(template => template.model.Id === action.ActionDefinition.DefaultActionTemplateId)
        const firstActionTemplate = action.ActionTemplatesWithParameters[0]
        const selectedActionTemplate = defaultActionTemplate || firstActionTemplate
        const selectedActionTemplateModel = selectedActionTemplate?.model
        return (
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
                    <Card
                        sx={{
                            borderRadius: 1,
                            p: 2,
                            height: "100%"
                        }}
                        variant={'outlined'}    
                    >
                        <Box sx={{display: "flex", flexDirection: "column", gap: 5}}>
                            <Box>
                                <EditActionParameterDefinition 
                                    parameter={selectedParameterForEdit}
                                    template={selectedActionTemplateModel}
                                    stageId={props.stageId}
                                    actionIndex={props.actionDefinitionIndex}
                                />
                            </Box>
                            <Box>
                                <ActionParameterDefinitionList templateWithParams={selectedActionTemplate} onParameterSelectForEdit={onParameterSelectForEdit} deleteParametersWithIds={deleteParametersWithIds}/>
                            </Box>
                        </Box>
                    </Card> 
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <Box>
                        <CodeEditor
                            code={selectedActionTemplateModel?.Text}
                            language={selectedActionTemplateModel?.Language}
                            readOnly={false}
                            onCodeChange={onCodeChange}
                        />
                    </Box>
                </TabPanel>
            </Box>
        </Box>
        )
    }
}


  


export default ViewSelectedAction;