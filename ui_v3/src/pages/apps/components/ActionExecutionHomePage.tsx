import { Box } from "@mui/material"
import React from "react"
import { useQueryClient } from "react-query"
import { useRouteMatch } from "react-router"
import ViewActionExecution from "../../view_action_execution/VIewActionExecution"

type MatchParams = {
    ActionExecutionId?: string
}

const ActionExecutionHomePage = () => {
    const match = useRouteMatch<MatchParams>()
    const queryClient = useQueryClient()
    const actionExecutionId = match.params?.ActionExecutionId

    return (
        <Box>
            <ViewActionExecution actionExecutionId={actionExecutionId}/>
        </Box>
    )
}

export default ActionExecutionHomePage