import { Box } from "@mui/material"
import { DataGridProps, GridCellParams, GridValueGetterParams } from "@mui/x-data-grid"
import React from "react"
import { generatePath, useHistory } from "react-router"
import { useCreateExecution } from "../../common/components/application/hooks/useCreateExecution"
import { ACTION_EXECUTION_ROUTE, APPLICATION_ROUTE, WORKFLOW_EXECUTION_ROUTE } from "../../common/components/header/data/ApplicationRoutesConfig"
import { ActionRun } from "../../generated/interfaces/Interfaces"
import { BuildActionContext } from "../../pages/build_action/context/BuildActionContext"
import { TextCell, TimestampCell } from "../../pages/table_browser/components/AllTableView"
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