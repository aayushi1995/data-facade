import React from "react"
import { Route, RouteComponentProps, Switch, useHistory, useRouteMatch } from "react-router-dom"
import useGetWorkflowActionsForTable from "../../common/components/workflow/create/hooks/useGetWorkflowActionsForTable"
import { WorkflowStagesWithActions } from "../../generated/interfaces/Interfaces"
import { WorkflowContext, WorkflowContextProvider, SetWorkflowContext, WorkflowActionDefinition, WorkflowContextType } from "../applications/workflow/WorkflowContext"
import { v4  as uuidv4 } from "uuid"
import { Box, Button } from "@mui/material"
import { WorkflowHeroWrapper } from "./BuildWorkflowHomePage"
import { AddingActionView } from "../../common/components/workflow/create/addAction/AddingActionView"
import { StagesWithActions } from "../../common/components/workflow/create/newStage/StagesWithActions"
import WorkflowDetails from "../../common/components/workflow/create/addAction/WorkflowDetails"
import useSaveWorkflowMutation from "../../common/components/workflow/create/hooks/useSaveWorkflowMutation"
import NoData from "../../common/components/NoData"


const BuildTableWorkflow = ({match}: RouteComponentProps<{tableId: string}>) => {
    const tableId = match.params.tableId
    const history = useHistory()
    const [isWorkflowReady, setWorkflowReady] = React.useState<boolean>(false)
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const useSaveWorkflow = useSaveWorkflowMutation({mutationName: "Save Workflow"})
    const handleSuccess = (data: WorkflowStagesWithActions[]) => {
        if(data.length > 0) {
            const stages = data.map(stageWithActions => {
                const stageActions: WorkflowActionDefinition[] = stageWithActions.Actions?.map(action => {
                    return {
                        Id: action.Id || "id",
                        DisplayName: action.DisplayName || "display name",
                        Parameters: [],
                        DefaultActionTemplateId: action.DefaultActionTemplateId || "DefaultTemplateId",
                        ActionGroup: "Data Cleansing"
                    }
                }) || []
                return {
                    Name: stageWithActions.stageName || "stageName",
                    Actions: stageActions,
                    Id: uuidv4()
                }
            })
            const workflowContextObject: WorkflowContextType = {
                Name: "Tag based workflow",
                stages: stages,
                Description: "",
                WorkflowParameters: [],
                Author: "Data Facade",
                draggingAllowed: true
            }
            setWorkflowContext({type: 'SET_ENTIRE_CONTEXT', payload: workflowContextObject})
            setWorkflowReady(true)
        }
    }

    const handleSaveWorkflow = () => {
        useSaveWorkflow.mutate({workflowContext: workflowContext, definitionId: uuidv4()}, {
            onSuccess: () => history.goBack()
        })
    }

    const [workflowData, isLoading, errors] = useGetWorkflowActionsForTable(tableId, {enabled: !isWorkflowReady, handleSuccess: handleSuccess})
    // const 
    if(isWorkflowReady && !useSaveWorkflow.isLoading) {
        return (
            <>
            {workflowContext.Name === "" ? (
                <Box p={2} sx={{minHeight: '100%'}}>
                    <WorkflowDetails/>
                </Box>
            ) : (
                <Box sx={{display: 'flex', minWidth: '100%', minHeight: '100%', flexDirection: 'column', gap: 3, justifyContent: 'center'}}>
                    <Box sx={{display: 'flex', minWidth: '100%', flex: 1}}>
                            <WorkflowHeroWrapper/>
                    </Box>
                    <Box sx={{flex: 4, minHeight: '100%', minWidth: '100%'}}>
                        {workflowContext.currentSelectedStage ? (
                            <AddingActionView/>
                        ) : (
                            <StagesWithActions/>
                        )}
                    </Box> 
                    <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}} mb={3}>
                        <Button variant="contained" color="primary" onClick={handleSaveWorkflow}>Save Workflow</Button>
                    </Box>
                </Box>
            )}
            
            
            </>
        )
    } else if(isLoading || useSaveWorkflow.isLoading) {
        return <>Loading...</>
    } else if(errors){
        return <NoData/>
    }
    return <>Loading...</>
}

const BuildTableWorkflowHomePage = () => {
    const match = useRouteMatch()
    return (
        <Switch>
            <WorkflowContextProvider>
                <Route path={`${match.path}/:tableId`} component={BuildTableWorkflow}/>
            </WorkflowContextProvider>
        </Switch>
    )
}

export default BuildTableWorkflowHomePage