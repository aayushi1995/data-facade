import React from "react"
import { useHistory } from "react-router"
import { APPLICATION_ROUTE } from "../../../../common/components/route_consts/data/ApplicationRoutesConfig"
import { BuildActionContext } from "../../build_action_old/context/BuildActionContext"
import useFetchActionRuns from "./useFetchActionRuns"


const useShowActionHistory = () => {
    const buildActionContext = React.useContext(BuildActionContext)
    const fetchActionRuns = useFetchActionRuns({filter: {Id: buildActionContext.actionDefinitionWithTags.actionDefinition.Id}})
    const history = useHistory()


    const displayActionOutput = (executionId?: string, actionDefinitionId?: string, actionInstanceId?: string) => {
        if(!!executionId) {
            history.push(`${APPLICATION_ROUTE}/execute-action/${actionDefinitionId}?instanceId=${actionInstanceId}&executionId=${executionId}`)
        }
    }

    const displayWorkflowOutput = (executionId?: string, actionDefinitionId?: string, actionInstanceId?: string) => {
        if(!!executionId) {
            // const redirectUrl = generatePath(WORKFLOW_EXECUTION_ROUTE, { WorkflowExecutionId: executionId })
            const redirectUrl = `${APPLICATION_ROUTE}/execute-workflow/${actionDefinitionId}?flowInstance=${actionInstanceId}&flowExecution=${executionId}`
            history.push(redirectUrl)
        }
    }

    return {
        fetchActionRuns, displayActionOutput, displayWorkflowOutput
    }
}

export default useShowActionHistory