import { Box, Button } from "@mui/material"
import React from "react"
import { Route, Switch, useRouteMatch, RouteComponentProps, useHistory } from "react-router-dom"
import { useGetWorkflowDetails } from "../../../common/components/workflow/execute/hooks/useGetWorkflowInstaces"
import { ActionParameterInstance } from "../../../generated/entities/Entities"
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces"
import useActionDefinitionDetail from "../../build_action/hooks/useActionDefinitionDetail"
import { SetWorkflowContext, UpstreamAction, WorkflowActionDefinition, WorkflowContext, WorkflowContextProvider, WorkflowContextType } from "./WorkflowContext"
import WorkflowHeroInfo from "../../../common/components/workflow-editor/WorkflowHero"
import { StagesWithActions } from "../../../common/components/workflow/create/newStage/StagesWithActions"
import NoData from "../../../common/components/NoData"
import { AddingActionView } from "../../../common/components/workflow/create/addAction/AddingActionView"
import { WorkflowHeroWrapper } from "../../build_workflow/BuildWorkflowHomePage"
import { useUpdateWorkflow } from "../../../common/components/workflow/edit/hooks/useUpdateWorkflow"
import WorkflowTabs from "../../../common/components/workflow/create/WorkflowTabs"
import MakeWorkflowContextFromDetail from "../../../common/components/workflow/edit/hooks/MakeWorkflowContextFromDetails"
import ApplicationID from "../../../enums/ApplicationID"
import WorkflowSideDrawer from "../../../common/components/workflow/create/SelectAction/WorkflowSideDrawer"
import useCopyAndSaveDefinition from "../../../common/components/workflow/create/hooks/useCopyAndSaveDefinition"


interface MatchParams {
    workflowId: string
}

export interface WorkflowTemplateType {
    Id: string,
    DisplayName: string,
    DefaultActionTemplateId: string,
    ParameterValues: object,
    stageId: string,
    stageName: string
}

const EditWorkflow = ({match}: RouteComponentProps<MatchParams>) => {
    const [initalWorkflow, setInitaWorkflow] = React.useState<WorkflowContextType>()

    const duplicateFlow = useCopyAndSaveDefinition({mutationName: "CopyWorkflow"})
    const history = useHistory()
    const workflowId = match.params.workflowId
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const [isWorkflowFetched, setIsWorkflowFetched] = React.useState(false)
    const useWorkflowUpdate = useUpdateWorkflow("UpdateWorkflow", workflowContext)
    const useContinuosWorkflowUpdate = useUpdateWorkflow("ContinuosUpdate", workflowContext)

    const handleSuccess = (data: ActionDefinitionDetail[]) => {
        const workflowTemplate = data?.[0]?.ActionTemplatesWithParameters?.[0]?.model
        const workflowParameters = data?.[0]?.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions?.map(apd => apd?.model || {}) || []
        const workflowDefinition = data?.[0]?.ActionDefinition?.model
        const workflowContextObject = MakeWorkflowContextFromDetail({
            workflowDefinition: workflowDefinition || {},
            workflowParameters: workflowParameters,
            workflowTemplateModel: workflowTemplate || {}
        })
        setIsWorkflowFetched(true)
        setWorkflowContext({type: 'SET_ENTIRE_CONTEXT', payload: workflowContextObject})
        setInitaWorkflow(workflowContextObject)
    }

    const [workflowDetails, error, isLoading] = useGetWorkflowDetails(workflowId, {enabled: !isWorkflowFetched, onSuccess: handleSuccess})
    
    const handleReset = () => {
        setWorkflowContext({type: 'SET_ENTIRE_CONTEXT', payload: initalWorkflow!})
    }
    
    const handleUpdate = () => {
        useWorkflowUpdate.mutate({
            workflowId: workflowId
        },{
            onSuccess: () => {
                console.log("UPDATED")
                history.push(`/application/${workflowContext.ApplicationId || ApplicationID.DEFAULT_APPLICATION}`)
            }
        })
    }

    React.useEffect(() => {
        console.log("SAVING")
        useContinuosWorkflowUpdate.mutate({workflowId: workflowId})
    }, [workflowContext])

    const handleRun = () => {
        history.push(`/application/execute-workflow/${workflowId}`)
    }

    const handleDuplicate = () => {
        duplicateFlow.mutate(
            {actionDefinitionId: workflowId}, {
                onSuccess: (data) => {
                    setIsWorkflowFetched(false)
                    history.push(`/application/edit-workflow/${data?.[0]?.Id}`)
                }
            }
        )
    }

    if(isWorkflowFetched && !useWorkflowUpdate.isLoading) {
        return (
            <Box sx={{display: 'flex', gap: 1, flexDirection: 'row', width: '100%', height: '100%', overflowY: 'clip'}}>
                <Box sx={{maxHeight: '100%', py: 2}}>
                <WorkflowSideDrawer/>
                </Box>
                <Box sx={{display: 'flex', width: '100%', height: '100%', flexDirection: 'column', gap: 3, justifyContent: 'center', px: 2, py: 1}}>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <WorkflowHeroWrapper handleSave={handleUpdate} handleRun={handleRun} showButton={true}/>
                    </Box>
                    <Box sx={{flex: 4, height: '100%', width: '100%'}}>
                        {workflowContext.currentSelectedStage ? (
                            <AddingActionView/>
                        ) : (
                            <WorkflowTabs/>
                        )}
                    </Box> 
                    <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}} mb={3}>
                        <Button variant="contained" color="primary" onClick={handleReset}>Reset Changes</Button>
                        <Button variant="contained" color="primary" onClick={handleDuplicate}>Duplicate</Button>
                    </Box>
                </Box>
            </Box>
            
        )
    } else if(error){
        return <NoData/>
    } else {
        return <>Loading...</>
    }
}

const EditWorkflowHomePage = () => {

    const match = useRouteMatch()
    return (
        <Switch>
            <WorkflowContextProvider>
                <Route path={`${match.path}/:workflowId`} component={EditWorkflow}/>
            </WorkflowContextProvider>
        </Switch>
    )
}

export default EditWorkflowHomePage
