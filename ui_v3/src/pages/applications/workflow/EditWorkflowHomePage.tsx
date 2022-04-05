import { Box, Button } from "@mui/material"
import React from "react"
import { Route, RouteComponentProps, Switch, useHistory, useRouteMatch } from "react-router-dom"
import NoData from "../../../common/components/NoData"
import { AddingActionView } from "../../../common/components/workflow/create/addAction/AddingActionView"
import useCopyAndSaveDefinition from "../../../common/components/workflow/create/hooks/useCopyAndSaveDefinition"
import WorkflowSideDrawer from "../../../common/components/workflow/create/SelectAction/WorkflowSideDrawer"
import WorkflowTabs from "../../../common/components/workflow/create/WorkflowTabs"
import MakeWorkflowContextFromDetail from "../../../common/components/workflow/edit/hooks/MakeWorkflowContextFromDetails"
import { useUpdateWorkflow } from "../../../common/components/workflow/edit/hooks/useUpdateWorkflow"
import { useGetWorkflowDetails } from "../../../common/components/workflow/execute/hooks/useGetWorkflowInstaces"
import ApplicationID from "../../../enums/ApplicationID"
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces"
import { ActionDefinitionHeroActionContextWrapper } from "../../build_action/components/shared-components/ActionDefinitionHero"
import { BuildActionContext, BuildActionContextProvider, SetBuildActionContext } from "../../build_action/context/BuildActionContext"
import { SetWorkflowContext, WorkflowContext, WorkflowContextProvider, WorkflowContextType } from "./WorkflowContext"


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
    const [initialWorkflow, setInitialWorkflow] = React.useState<WorkflowContextType|undefined>()

    const duplicateFlow = useCopyAndSaveDefinition({mutationName: "CopyWorkflow"})
    const history = useHistory()
    const workflowId = match.params.workflowId
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const actionContext = React.useContext(BuildActionContext)
    const setActionContext = React.useContext(SetBuildActionContext)
    const [isWorkflowFetched, setIsWorkflowFetched] = React.useState(false)
    // TODO: Check with Shishir if things to be sent to backend should be sent at time of .mutate() call or reference should be passed right at time of mutation declaration.
    const useWorkflowUpdate = useUpdateWorkflow("UpdateWorkflow", workflowContext, actionContext)
    const useContinuosWorkflowUpdate = useUpdateWorkflow("ContinuosUpdate", workflowContext, actionContext)

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
        handleSetContexts(workflowContextObject)
        setInitialWorkflow(workflowContextObject)
    }

    const [workflowDetails, error, isLoading] = useGetWorkflowDetails(workflowId, {enabled: !isWorkflowFetched, onSuccess: handleSuccess})
    
    const handleSetContexts = (workflowContextObject?: WorkflowContextType) => {
        if(!!workflowContextObject) {
            setWorkflowContext({type: 'SET_ENTIRE_CONTEXT', payload: workflowContextObject})
            setActionContext({type: "SetActionDefinition", payload: {
                newActionDefinition: {
                    UniqueName: workflowContextObject.Name,
                    DisplayName: workflowContextObject.Name,
                    Description: workflowContextObject.Description,
                    ActionGroup: workflowContextObject.ActionGroup,
                    PublishStatus: workflowContextObject.PublishStatus,
                    PinnedToDashboard: workflowContextObject.PinnedToDashboard,
                    ApplicationId: workflowContextObject.ApplicationId,
                    CreatedBy: workflowContextObject.Author,
                    CreatedOn: workflowContextObject.CreatedOn,
                    UpdatedOn: workflowContextObject.UpdatedOn
                }
            }})
        }
    }
    
    const handleUpdate = () => {
        useWorkflowUpdate.mutate({
            workflowId: workflowId
        },{
            onSuccess: () => {
                const applicationId = actionContext?.actionDefinitionWithTags?.actionDefinition?.ApplicationId
                if(!!applicationId){
                    console.log("UPDATED")
                    // history.push(`/application/${applicationId}`)
                } else {
                    console.log("Action Context Application Id field is empty")
                    history.push(`/application/${ApplicationID.DEFAULT_APPLICATION}`)
                }
            }
        })
    }

    // React.useEffect(() => {
    //     console.log("SAVING")
    //     useContinuosWorkflowUpdate.mutate({workflowId: workflowId})
    // }, [workflowContext])

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
                        <ActionDefinitionHeroActionContextWrapper/>
                    </Box>
                    <Box sx={{flex: 4, height: '100%', width: '100%'}}>
                        {workflowContext.currentSelectedStage ? (
                            <AddingActionView/>
                        ) : (
                            <WorkflowTabs
                                onDuplicate={handleDuplicate}
                                onRun={handleRun}
                                onSave={handleUpdate}
                            />
                        )}
                    </Box> 
                    <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}} mb={3}>
                        <Button variant="contained" color="primary" onClick={() => handleSetContexts(initialWorkflow)}>Reset Changes</Button>
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
            <BuildActionContextProvider>
                <WorkflowContextProvider>
                    <Route path={`${match.path}/:workflowId`} component={EditWorkflow}/>
                </WorkflowContextProvider>
            </BuildActionContextProvider>
        </Switch>
    )
}

export default EditWorkflowHomePage
