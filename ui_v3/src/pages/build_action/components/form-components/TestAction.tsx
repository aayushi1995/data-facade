import React from "react"
import { BuildActionContext } from "../../context/BuildActionContext"
import { Box } from "@mui/material"
import ExecuteActionNew from "../../../execute_action/components/ExecuteAction"
import { ExecuteActionContextProvider } from "../../../execute_action/context/ExecuteActionContext"
import { ActionExecutionDetails } from "../../../apps/components/ActionExecutionHomePage"


const TestAction = () => {
    const [executionId, setExecutionId] = React.useState<string | undefined>()
    const buildActionContext = React.useContext(BuildActionContext)
    const onExecutionCreated = (actionExecutionId: string) => {
        setExecutionId(actionExecutionId)
    }

    return (
        <Box>
            {!!executionId ? (
                <ExecuteActionContextProvider>
                    <ActionExecutionDetails actionExecutionId={executionId} showDescription={false} fromTestAction={true} onExecutionCreate={onExecutionCreated}/>
                </ExecuteActionContextProvider>
            ) : (
                <ExecuteActionContextProvider>
                    <ExecuteActionNew showOnlyParameters={true} fromTestRun={true} actionDefinitionId={buildActionContext.lastSavedActionDefinition?.Id || "id"} showActionDescription={false} redirectToExecution={false} onExecutionCreate={onExecutionCreated}/>
                </ExecuteActionContextProvider>
            )}
        </Box>
    )
}


export default TestAction