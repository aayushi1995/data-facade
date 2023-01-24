import React from "react"
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext"
import { Box, Button, IconButton } from "@mui/material"
import ExecuteActionNew from "../../../execute_action/components/ExecuteAction"
import { ExecuteActionContextProvider } from "../../../execute_action/context/ExecuteActionContext"
import { ActionExecutionDetails } from "../../../apps/components/ActionExecutionHomePage"
import DoubleLeftIcon from './../../../../../src/images/Group 691.svg';


const TestAction = () => {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const onExecutionCreated = (actionExecutionId: string) => {
        setBuildActionContext({
            type: 'SetLatestExecutionId',
            payload: {
                executionId: actionExecutionId
            }
        })
    }

    const handleTestCollapse = () => {
        setBuildActionContext({
            type: 'SetTestMode',
            payload: false
        })
    }

    const handleActionInstanceCreate = (actionInstanceDetails: {Id?: string}) => {
        setBuildActionContext({
            type: "SetLatestInstanceId",
            payload: {
                latestInstanceId: actionInstanceDetails.Id
            }
        })
    }

    const handleRunAgain = () => {
        setBuildActionContext({
            type: "SetLatestExecutionId",
            payload: {
                executionId: undefined
            }
        })
    }

    return (
        <Box>
            <Box sx={{display: 'flex', gap: 2}}>
                <IconButton sx={{transform: 'rotate(180deg)'}} onClick={handleTestCollapse}>
                    <img src={DoubleLeftIcon} alt="collapse"/>
                </IconButton>
                <Button onClick={handleRunAgain}>
                    Run Again
                </Button>
            </Box>
            {!!buildActionContext.latestTestExecutionId ? (
                <ExecuteActionContextProvider>
                    <ActionExecutionDetails actionExecutionId={buildActionContext.latestTestExecutionId} showDescription={false} fromTestAction={true} onExecutionCreate={onExecutionCreated}/>
                </ExecuteActionContextProvider>
            ) : (
                <ExecuteActionContextProvider>
                    <ExecuteActionNew 
                    actionInstanceId={buildActionContext.latestTestInstanceId}
                    showOnlyParameters={true} fromTestRun={true} actionDefinitionId={buildActionContext.lastSavedActionDefinition?.Id || "id"} 
                    showActionDescription={false} redirectToExecution={false} onExecutionCreate={onExecutionCreated} onActionInstanceCreate={handleActionInstanceCreate}/>
                </ExecuteActionContextProvider>
            )}
        </Box>
    )
}


export default TestAction