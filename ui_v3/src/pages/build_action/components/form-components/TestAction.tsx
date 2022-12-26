import React from "react"
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext"
import { Box, IconButton } from "@mui/material"
import ExecuteActionNew from "../../../execute_action/components/ExecuteAction"
import { ExecuteActionContextProvider } from "../../../execute_action/context/ExecuteActionContext"
import { ActionExecutionDetails } from "../../../apps/components/ActionExecutionHomePage"
import DoubleLeftIcon from './../../../../../src/images/Group 691.svg';


const TestAction = () => {
    const [executionId, setExecutionId] = React.useState<string | undefined>()
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const onExecutionCreated = (actionExecutionId: string) => {
        setExecutionId(actionExecutionId)
    }

    const handleTestCollapse = () => {
        setBuildActionContext({
            type: 'SetTestMode',
            payload: false
        })
    }

    return (
        <Box>
            <IconButton sx={{transform: 'rotate(180deg)'}} onClick={handleTestCollapse}>
                <img src={DoubleLeftIcon} alt="collapse"/>
            </IconButton>
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