import { Box } from "@mui/material";
import { Story } from "@storybook/react";
import { WorkflowContextProvider } from "../../context/WorkflowContext";
import { AddActionToWorkflowStage, AddActionToWorkflowStageProps } from "./AddActionToWorkflowStage";

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