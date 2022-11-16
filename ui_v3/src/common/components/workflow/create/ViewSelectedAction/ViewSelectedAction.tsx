
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Card, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, Grid, IconButton, Switch, Tab, Tabs, Tooltip, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useQueryClient } from 'react-query';
import CloseIcon from "../../../../../../src/images/close.svg";
import { ActionParameterDefinition } from '../../../../../generated/entities/Entities';
import labels from '../../../../../labels/labels';
import { SetWorkflowContext } from '../../../../../pages/applications/workflow/WorkflowContext';
import EditActionForm from '../../../../../pages/build_action/components/BuildActionForm';
import { BuildActionContextProvider } from '../../../../../pages/build_action/context/BuildActionContext';
import { WrapInDialog } from '../../../../../pages/table_browser/components/AllTableView';
import CodeEditor from '../../../CodeEditor';
import { ConfigureParametersContextProvider } from '../../context/ConfigureParametersContext';
import ConfigureActionParameters from '../addAction/ConfigureActionParameters';
import ShowGlobalParameters from "../ShowGlobalParameters";
import ActionParameterDefinitionEditList from "./ActionParameterDefinitionEditList";
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
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const queryClient = useQueryClient()
    const [activeTab, setActiveTab] = React.useState(0)
    const [guideEnabled, setGuideEnabled] = React.useState(false)
    const [selectedParameterForEdit, setSelectedParameterForEdit] = React.useState<ActionParameterDefinition|undefined>()
    const [editActionDialog, setEditActionDialog] = React.useState(false)

    const {isLoading, error, data} = useViewAction({actionDefinitionId: props.actionDefinitionId, expectUniqueResult: true})

    const onParameterSelectForEdit = (actionParameter: ActionParameterDefinition) => setSelectedParameterForEdit(actionParameter)
    const deleteParametersWithIds = (actionParameterIds: string[]) => console.log("Deleting", actionParameterIds)
    const onCodeChange = (newCode: string) => console.log(newCode)

    const toggleGuideEnabled = () => {
        if(guideEnabled) {
            setGuideEnabled(false)
        } else {
            setWorkflowContext({
                type: 'SET_LATEST_ACTION_ADDED',
                payload: {
                    stageId: props.stageId,
                    actionId: props.actionDefinitionId,
                    actionIndex: props.actionDefinitionIndex
                }
            })
            setGuideEnabled(true)
        }
    }

    const handleTestAction = () => {
        setWorkflowContext({
            type: 'TEST_ACTION',
            payload: {
                ...props
            }
        })   
    }

    const handleEditAction = () => {
        setEditActionDialog(true)
    }

    const handleEditActionDialogClose = () => {
        queryClient.invalidateQueries([labels.entities.ActionDefinition, "All", {IsVisibleOnUI: true}])
        setEditActionDialog(false)
    }

    React.useEffect(() => {
        setSelectedParameterForEdit(undefined)
    }, [props.actionDefinitionId, props.actionDefinitionIndex, props.stageId])

    if(isLoading) {
        return <>Loading...</>
    } else if(!!error) {
        return <>{error}</>
    } else {
        const action = data as ActionDetail
        const defaultActionTemplate = action.ActionTemplatesWithParameters.find(template => template.model.Id === action.ActionDefinition.model.DefaultActionTemplateId)
        const firstActionTemplate = action.ActionTemplatesWithParameters[0]
        const selectedActionTemplate = defaultActionTemplate || firstActionTemplate
        const selectedActionTemplateModel = selectedActionTemplate?.model
        const selectedActionParams = selectedActionTemplate?.actionParameterDefinitions
        if(!selectedParameterForEdit && !!selectedActionParams) {
            setSelectedParameterForEdit(selectedActionParams?.[0]?.model)
        }
        return (
        <Box>
            <WrapInDialog showChild={false} dialogProps={{open: editActionDialog, label: "Edit Action", handleClose: handleEditActionDialogClose}}>
                <BuildActionContextProvider>                
                    <EditActionForm actionDefinitionId={props.actionDefinitionId}/>
                </BuildActionContextProvider>
            </WrapInDialog>
            <Dialog open={guideEnabled} fullWidth maxWidth="xl" >
                <DialogTitle sx={{display: 'flex', justifyContent: 'center',backgroundColor: "ActionConfigDialogBgColor.main", boxShadow: "inset 0px 15px 25px rgba(54, 48, 116, 0.3)"}}>
                    <Grid item xs={6} sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant="heroHeader" sx={{
                            fontFamily: "'SF Pro Text'",
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "18px",
                            lineHeight: "160%",
                            letterSpacing: "0.15px",
                            color: "ActionCardBgColor.main"}}
                        >
                            Action Configurator
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{display: 'flex', justifyContent: 'flex-end'}} onClick={toggleGuideEnabled}>
                        <IconButton aria-label="close" >
                            <img src={CloseIcon} alt="close"/>
                        </IconButton>
                    </Grid>
                    
                </DialogTitle>
                <DialogContent sx={{minHeight: '500px', mt: 2}}>
                    <ConfigureParametersContextProvider>
                        <ConfigureActionParameters handleDialogClose={toggleGuideEnabled}/>
                    </ConfigureParametersContextProvider>
                </DialogContent>
            </Dialog>
            <Box sx={{display: 'flex', gap: 3}}>
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
                    <Tab label="Global Parameters" value={2} sx={{
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
                <Box sx={{display: 'flex', justifyContent: 'flex-end', width: '70%', alignItems: 'center', gap: 2}}>
                    <Button onClick={handleTestAction}>
                        Test
                    </Button>
                    <Tooltip title="Edit Action">
                        <IconButton onClick={handleEditAction}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <FormGroup>
                        <FormControlLabel control={
                            <Switch 
                                checked={guideEnabled}
                                onClick={toggleGuideEnabled}
                            />} 
                            label="Guide Enabled" />
                    </FormGroup>
                </Box>
            </Box>
            
            <Box sx={{pt: 2}}>
            <TabPanel value={activeTab} index={2}>
                    <Box>
                        <ShowGlobalParameters/>
                    </Box>
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
                                <ActionParameterDefinitionEditList
                                    templateWithParams={selectedActionTemplate}
                                    stageId={props.stageId}
                                    actionIndex={props.actionDefinitionIndex}
                                />
                            </Box>
                        </Box>
                    </Card> 
                </TabPanel>
            </Box>
        </Box>
        )
    }
}


  


export default ViewSelectedAction;
