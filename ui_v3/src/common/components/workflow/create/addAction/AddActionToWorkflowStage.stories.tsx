import React from 'react'
import { AddActionToWorkflowStage, AddActionToWorkflowStageProps } from "./AddActionToWorkflowStage";
import { Story } from "@storybook/react";
import { Box } from "@mui/material";
import { SetWorkflowContext, WorkflowContext, WorkflowContextProvider } from "../../../../../pages/applications/workflow/WorkflowContext";

export default {
    title: "WORKFLOW/Create/AddActionToStage",
    component: AddActionToWorkflowStage
}

const Template: Story<AddActionToWorkflowStageProps> = (args) => {

    return (
        <Box sx={{height: '800px', width: '100%'}}>
            <WorkflowContextProvider>
                <AddActionToWorkflowStage {...args}/>
            </WorkflowContextProvider>
        </Box>
    )
}

export const DefaultView = Template.bind({})

DefaultView.args = {
    stageId: 'stage1'
}