import { Button, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material"
import React from "react"
import ParameterDefinitionsConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane"
import LoadingIndicator from "../../../common/components/LoadingIndicator"
import { ActionParameterInstance } from "../../../generated/entities/Entities"
import ConfigureParameters from "../../execute_action/components/ConfigureParameters"
import { SetWorkflowContext, UpstreamAction, WorkflowContext } from "./WorkflowContext"


interface TestWorkflowActionDialogProps {
    handleTestAction?: () => void,
    isLoading?: boolean,
    saving?: boolean
}

const TestWorkflowActionDialog = (props: TestWorkflowActionDialogProps) => {
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const currentActionForTesting = workflowContext.currentActionForTesting

    const handleTestingDialogClose = () => {
        setWorkflowContext({
            type: 'TEST_ACTION',
            payload: {
                stageId: "",
                actionDefinitionId: "",
                actionDefinitionIndex: -1
            }
        })
    }

    const globalParameterIds: string[] = []
    currentActionForTesting?.Parameters?.forEach(parameter => {
        if(!!parameter.GlobalParameterId) {
            globalParameterIds.push(parameter.GlobalParameterId)
        }
    })
    const globalParametersToShow = workflowContext.WorkflowParameters.filter(parameter => globalParameterIds?.includes(parameter.Id || "id"))

    const getLatestExecutionId = (upstreamAction: UpstreamAction) => {
        const upstreamStage = workflowContext.stages.find(stage => stage.Id === upstreamAction.stageId)

        const referenceId = upstreamStage?.Actions?.[upstreamAction.actionIndex]?.ReferenceId
        return  workflowContext?.TestInstance?.actionDetails?.[referenceId || ""]?.LatestExecutionId
    }

    const formParameterInstances = () => {
        const parameterInstances = currentActionForTesting?.Parameters.map(actionParameter => {
            if(!!actionParameter.GlobalParameterId) {
                return {
                    ...(workflowContext?.TestInstance?.parameterDetails || {})[actionParameter.GlobalParameterId],
                    ActionParameterDefinitionId: actionParameter.GlobalParameterId
                }
            } else if(!!actionParameter.SourceExecutionId) {
                return {
                    SourceExecutionId: getLatestExecutionId(actionParameter.SourceExecutionId)
                } as ActionParameterInstance
            }
        }) || []
        return parameterInstances
    }

    const handleParameterInstancesChange = (newParameterInstances: ActionParameterInstance[]) => {
        var newGlobalParameterConfig = {}
        newParameterInstances.forEach(pi => {
            newGlobalParameterConfig = {
                ...newGlobalParameterConfig,
                [pi.ActionParameterDefinitionId!]: pi
            }
        })
        setWorkflowContext({
            type: 'SET_TEST_GLOBAL_PARAMETER_CONFIG',
            payload: {
                config: newGlobalParameterConfig
            }
        })

    }

    const handleTestAction = () => {
        props.handleTestAction?.()
    }

    return (
        <Dialog open={!!workflowContext.currentActionForTesting && !props.saving} onClose={handleTestingDialogClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                {workflowContext.currentActionForTesting?.DisplayName}
            </DialogTitle>
            <DialogContent>
                <Grid container direction="column">
                    <Grid item xs={8}>
                        <ParameterDefinitionsConfigPlane 
                            parameterDefinitions={globalParametersToShow}
                            parameterInstances={formParameterInstances()}
                            parameterAdditionalConfigs={[]}
                            handleChange={handleParameterInstancesChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        {props.isLoading ? (
                            <LoadingIndicator/>
                        ) : (
                            <Button onClick={handleTestAction}>
                                Test
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog> 
    )
}

export default TestWorkflowActionDialog